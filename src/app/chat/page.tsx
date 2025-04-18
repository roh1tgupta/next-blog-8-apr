'use client';

import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';
import { Message } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';
import Picker from 'emoji-picker-react';

export default function ChatPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [name, setName] = useState('');
  const [inputName, setInputName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [adminOnline, setAdminOnline] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('chat_user');
    if (storedUser) {
      const { name: storedName, userId: storedId } = JSON.parse(storedUser);
      if (storedName && storedId) {
        setName(storedName);
        setUserId(storedId);
      }
    }

    const newSocket: Socket = io();
    setSocket(newSocket);

    if (storedUser && name && userId) {
      fetch('https://api.ipify.org?format=json')
        .then((res) => res.json())
        .then((data) => {
          newSocket.emit('set-name', { name, userId, ip: data.ip });
        })
        .catch(() => {
          newSocket.emit('set-name', { name, userId, ip: 'unknown' });
        });
    }

    newSocket.on('stored-messages', (storedMessages: Message[]) => {
      setMessages(storedMessages);
    });

    newSocket.on('message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    newSocket.on('admin-status', (status: boolean) => {
      setAdminOnline(status);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [name, userId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSetName = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputName.trim()) {
      const trimmedName = inputName.trim();
      const storedUser = localStorage.getItem('chat_user');
      let newUserId: string;

      if (storedUser) {
        const { name: storedName, userId: storedId } = JSON.parse(storedUser);
        if (storedName === trimmedName) {
          newUserId = storedId;
        } else {
          newUserId = `${trimmedName}-${uuidv4()}`;
          localStorage.setItem('chat_user', JSON.stringify({ name: trimmedName, userId: newUserId }));
        }
      } else {
        newUserId = `${trimmedName}-${uuidv4()}`;
        localStorage.setItem('chat_user', JSON.stringify({ name: trimmedName, userId: newUserId }));
      }

      setName(trimmedName);
      setUserId(newUserId);
      fetch('https://api.ipify.org?format=json')
        .then((res) => res.json())
        .then((data) => {
          socket?.emit('set-name', { name: trimmedName, userId: newUserId, ip: data.ip });
        })
        .catch(() => {
          socket?.emit('set-name', { name: trimmedName, userId: newUserId, ip: 'unknown' });
        });
      setInputName('');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && socket && name && userId) {
      socket.emit('user-message', { userId, text: message.trim() });
      setMessage('');
      setShowEmojiPicker(false);
    }
  };

  const onEmojiClick = (emojiObject: { emoji: string }) => {
    setMessage((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const renderMessageText = (text: string) => {
    const emojiRegex = /[\p{Emoji_Presentation}\p{Emoji}\u200D\uFE0F]/gu;
    let lastIndex = 0;
    const elements: React.ReactNode[] = [];
    let match: RegExpExecArray | null;

    while ((match = emojiRegex.exec(text)) !== null) {
      const emoji = match[0];
      const index = match.index;
      if (index > lastIndex) {
        elements.push(text.slice(lastIndex, index));
      }
      elements.push(<span key={index} className="emoji">{emoji}</span>);
      lastIndex = index + emoji.length;
    }
    if (lastIndex < text.length) {
      elements.push(text.slice(lastIndex));
    }

    return elements.length > 0 ? elements : text;
  };

  return (
    <div className="flex flex-col min-h-screen w-full px-2 bg-gray-100">
      <style jsx>{`
        .emoji {
          font-size: 18px;
        }
      `}</style>
      <h1 className="text-2xl font-bold text-primary mt-4 mb-4">
        {name ? `Welcome ${name}` : 'Chat'}
      </h1>
      {!name ? (
        <form onSubmit={handleSetName} className="flex flex-col space-y-4 w-full">
          <div>
            <label className="block text-lg font-medium mb-2">Your Name</label>
            <input
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-accent text-white px-4 py-2 rounded hover:bg-opacity-90 w-full"
          >
            Join Chat
          </button>
        </form>
      ) : (
        <div className="flex flex-col flex-grow space-y-4 w-full">
          <p className="text-sm text-secondary flex items-center gap-2">
            {/* Admin is {adminOnline ? 'online' : 'offline'} */}
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                adminOnline ? 'bg-green-500' : 'bg-red-500'
              }`}
            ></span>
          </p>
          <div className="flex-grow overflow-y-auto border p-4 rounded bg-gray-50">
            {messages.map((msg: Message, idx: number) => (
              <div
                key={idx}
                className={`mb-2 ${
                  msg.sender === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <span
                  className={`inline-block p-2 rounded ${
                    msg.sender === 'user'
                      ? 'bg-accent text-white'
                      : 'bg-primary text-white'
                  }`}
                >
                  {renderMessageText(msg.text)}
                </span>
                <p className="text-xs text-gray-500">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
          <div className="relative">
            {showEmojiPicker && (
              <div ref={emojiPickerRef} className="absolute bottom-14 left-0 z-10 w-full">
                <Picker onEmojiClick={onEmojiClick} />
              </div>
            )}
            <form onSubmit={handleSendMessage} className="flex space-x-2 w-full">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2 border rounded pr-10"
                  placeholder="Type your message..."
                />
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  😊
                </button>
              </div>
              <button
                type="submit"
                className="bg-accent text-white px-4 py-2 rounded hover:bg-opacity-90"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}