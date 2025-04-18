export interface User {
  name: string;
  socketId: string;
  isOnline: boolean;
  ip: string;
}

export interface Message {
  sender: 'user' | 'admin';
  text: string;
  timestamp: string;
}

export interface ChatStore {
  users: { [userId: string]: User };
  messages: { [userId: string]: Message[] };
}