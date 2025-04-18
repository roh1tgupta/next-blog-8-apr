import { Server } from 'socket.io';
import { initializeSocket } from './src/app/socket-server';

const whitelistUrls = [
  process.env.APP_URL || '', // First URL
  'http://localhost:3000', // Example additional URL
];

console.log(whitelistUrls)
const io = new Server(3001, {
  cors: {
    origin: whitelistUrls,
    methods: ['GET', 'POST'],
  },
});

initializeSocket(io)

console.log('Socket.IO server running on port 3001');

setInterval(() => {
  const { heapUsed } = process.memoryUsage();
  console.log(`Memory used: ${(heapUsed / 1024 / 1024).toFixed(2)} MB`);
}, 60000);