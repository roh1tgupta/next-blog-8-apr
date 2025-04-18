import { Server, Socket } from 'socket.io';
import { ChatStore, Message } from '@/types/chat';

interface SocketWithRooms extends Socket {
  rooms: Set<string>;
}

export function initializeSocket(io: Server) {
  const chatStore: ChatStore = {
    users: {},
    messages: {},
  };
  let adminSocketId: string | null = null;

  io.on('connection', (socket: SocketWithRooms) => {
    console.log('New connection:', socket.id);

    socket.on(
      'set-name',
      ({ name, userId, ip }: { name: string; userId: string; ip: string }) => {
        if (!name || !userId || typeof name !== 'string' || typeof userId !== 'string') return;

        if (chatStore.users[userId]) {
          chatStore.users[userId].socketId = socket.id;
          chatStore.users[userId].isOnline = true;
          chatStore.users[userId].ip = ip || 'unknown';
          console.log('User reconnected:', userId, name, ip);
        } else {
          chatStore.users[userId] = {
            name: name.trim(),
            socketId: socket.id,
            isOnline: true,
            ip: ip || 'unknown',
          };
          chatStore.messages[userId] = chatStore.messages[userId] || [];
          console.log('User joined:', userId, name, ip);
        }

        socket.join(`user-${userId}`);
        io.to('admin').emit('user-list', chatStore.users);
        socket.emit('admin-status', !!adminSocketId);
        socket.emit('stored-messages', chatStore.messages[userId] || []);
      }
    );

    socket.on('user-message', ({ userId, text }: { userId: string; text: string }) => {
      if (!text || !userId || !chatStore.users[userId]) return;
      const message: Message = {
        sender: 'user',
        text: text.trim(),
        timestamp: new Date().toISOString(),
      };
      chatStore.messages[userId].push(message);
      console.log('User message:', userId, text);

      io.to(`user-${userId}`).emit('message', message);
      io.to('admin').emit('message', { userId, message });
    });

    socket.on('admin-join', () => {
      socket.join('admin');
      adminSocketId = socket.id;
      console.log('Admin joined:', socket.id);

      for (const userId in chatStore.users) {
        socket.join(`user-${userId}`);
        io.to(`user-${userId}`).emit('admin-status', true);
      }
      socket.emit('user-list', chatStore.users);
      socket.emit('all-messages', chatStore.messages);
    });

    socket.on('admin-message', ({ userId, text }: { userId: string; text: string }) => {
      if (!text || !userId || !chatStore.users[userId]) return;
      const message: Message = {
        sender: 'admin',
        text: text.trim(),
        timestamp: new Date().toISOString(),
      };
      chatStore.messages[userId].push(message);
      console.log('Admin message to:', userId, text);

      io.to(`user-${userId}`).emit('message', message);
      io.to('admin').emit('message', { userId, message });
    });

    socket.on('delete-messages', (userId: string) => {
      if (chatStore.messages[userId]) {
        chatStore.messages[userId] = [];
        console.log('Deleted messages for:', userId);

        io.to('admin').emit('all-messages', chatStore.messages);

        if (!chatStore.users[userId]?.isOnline) {
          console.log('Removing offline user:', userId);
          delete chatStore.users[userId];
          io.to('admin').emit('user-list', chatStore.users);
        }
      }
    });

    socket.on('disconnect', () => {
      for (const userId in chatStore.users) {
        if (chatStore.users[userId].socketId === socket.id) {
          chatStore.users[userId].isOnline = false;
          console.log('User disconnected:', userId);
          io.to('admin').emit('user-list', chatStore.users);
          break;
        }
      }
      if (socket.id === adminSocketId) {
        adminSocketId = null;
        console.log('Admin disconnected');
        for (const userId in chatStore.users) {
          io.to(`user-${userId}`).emit('admin-status', false);
        }
      }
    });
  });
}