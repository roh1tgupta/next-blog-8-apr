import { Server } from 'socket.io';
import { initializeSocket } from './src/app/socket-server';

const whitelistUrls = [
  process.env.APP_URL || '', // First URL
  'http://localhost:3000', // Example additional URL
];

const PORT = 10000;

console.log(whitelistUrls)
const io = new Server(PORT, {
  cors: {
    origin: whitelistUrls,
    methods: ['GET', 'POST'],
  },
});

initializeSocket(io)

console.log(`Socket.IO server running on port ${PORT}`);

setInterval(() => {
  const { heapUsed } = process.memoryUsage();
  console.log(`Memory used: ${(heapUsed / 1024 / 1024).toFixed(2)} MB`);
}, 60000);