import { Server } from 'socket.io';
import { NextRequest } from 'next/server';
import type { Socket } from 'socket.io';

// Define types
interface User {
  name: string;
  socketId: string;
  isOnline: boolean;
}

interface Message {
  sender: 'user' | 'admin';
  text: string;
  timestamp: string;
}

interface ChatStore {
  users: { [ip: string]: User };
  messages: { [ip: string]: Message[] };
}

const chatStore: ChatStore = {
  users: {},
  messages: {},
};

let io: Server | null = null;

export async function GET(req: NextRequest) {
  try {
    if (!io) {
      io = new Server({
        // path: '/api/socket',
        cors: { 
          origin: '*', 
          // methods: ['GET', 'POST']
         },
      });

      io.on('connection', (socket: Socket) => {
        console.log('New connection:', socket.id);

        // Get IP
        const ip =
          req.headers.get('x-forwarded-for') ||
          socket.request.connection.remoteAddress ||
          socket.id;

        // User sends name
        socket.on('set-name', (name: string) => {
          console.log("....set -name called.......")
          if (!name || typeof name !== 'string') return;
          chatStore.users[ip] = {
            name: name.trim(),
            socketId: socket.id,
            isOnline: true,
          };
          chatStore.messages[ip] = chatStore.messages[ip] || [];
          socket.join(`user-${ip}`);
          console.log('User joined:', ip, name);

          io?.to('admin').emit('user-list', chatStore.users);
        });

        // User sends message
        socket.on('user-message', (text: string) => {
          if (!text || !chatStore.users[ip]) return;
          const message: Message = {
            sender: 'user',
            text: text.trim(),
            timestamp: new Date().toISOString(),
          };
          chatStore.messages[ip].push(message);
          console.log('User message:', ip, text);

          io?.to('admin').emit('message', { ip, message });
          socket.emit('message', message);
        });

        // Admin joins
        socket.on('admin-join', () => {
          socket.join('admin');
          for (const userIp in chatStore.users) {
            socket.join(`user-${userIp}`);
          }
          socket.emit('user-list', chatStore.users);
          socket.emit('all-messages', chatStore.messages);
          console.log('Admin joined');
        });

        // Admin sends message
        socket.on('admin-message', ({ userIp, text }: { userIp: string; text: string }) => {
          if (!text || !chatStore.users[userIp]) return;
          const message: Message = {
            sender: 'admin',
            text: text.trim(),
            timestamp: new Date().toISOString(),
          };
          chatStore.messages[userIp].push(message);
          console.log('Admin message to:', userIp, text);

          io?.to(`user-${userIp}`).emit('message', message);
          socket.to('admin').emit('message', { ip: userIp, message });
        });

        // Admin deletes messages
        socket.on('delete-messages', (userIp: string) => {
          if (chatStore.messages[userIp]) {
            chatStore.messages[userIp] = [];
            console.log('Deleted messages for:', userIp);

            io?.to('admin').emit('all-messages', chatStore.messages);

            if (!chatStore.users[userIp]?.isOnline) {
              delete chatStore.users[userIp];
              io?.to('admin').emit('user-list', chatStore.users);
            }
          }
        });

        // Handle disconnect
        socket.on('disconnect', () => {
          if (chatStore.users[ip]) {
            chatStore.users[ip].isOnline = false;
            console.log('User disconnected:', ip);
            io?.to('admin').emit('user-list', chatStore.users);
          }
        });
      });

      // Log memory usage
      setInterval(() => {
        const { heapUsed } = process.memoryUsage();
        console.log(`Memory used: ${(heapUsed / 1024 / 1024).toFixed(2)} MB`);
      }, 60000);

      console.log('Socket.IO server initialized');
    }

    return new Response('Socket.IO server running', { status: 200 });
  } catch (error) {
    console.error('Socket.IO error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Handle Socket.IO polling requests
  return GET(req);
}