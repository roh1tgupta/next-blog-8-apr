'use client';

import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Message, ChatStore } from '@/types/chat';
import Picker from 'emoji-picker-react';
import { Socket } from 'socket.io-client';

export default function AdminChatClient() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [users, setUsers] = useState<ChatStore['users']>({});
  const [messages, setMessages] = useState<ChatStore['messages']>({});
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.emit('admin-join');

    newSocket.on('user-list', (userList: ChatStore['users']) => {
      setUsers(userList);
    });

    newSocket.on('all-messages', (allMessages: ChatStore['messages']) => {
      setMessages(allMessages);
    });

    newSocket.on('message', ({ userId, message }: { userId: string; message: Message }) => {
      setMessages((prev) => ({
        ...prev,
        [userId]: [...(prev[userId] || []), message],
      }));
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && selectedUserId && socket) {
      socket.emit('admin-message', { userId: selectedUserId, text: message });
      setMessage('');
      setShowEmojiPicker(false);
    }
  };

  const handleDeleteMessages = (userId: string) => {
    if (socket) {
      socket.emit('delete-messages', userId);
      setMessages((prev) => ({
        ...prev,
        [userId]: [],
      }));
    }
  };

  const onEmojiClick = (emojiObject: { emoji: string }) => {
    setMessage((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  // Function to wrap emojis in a span with emoji class
  const renderMessageText = (text: string) => {
    // Simple regex to match common Unicode emojis
    const emojiRegex = /[\p{Emoji_Presentation}\p{Emoji}\u200D\uFE0F]/gu;
    let lastIndex = 0;
    const elements: React.ReactNode[] = [];
    let match;

    while ((match = emojiRegex.exec(text)) !== null) {
      const emoji = match[0];
      const index = match.index;
      if (index > lastIndex) {
        elements.push(text.slice(lastIndex, index));
      }
      elements.push(<span key={index} className="text-3xl">{emoji}</span>);
      lastIndex = index + emoji.length;
    }
    if (lastIndex < text.length) {
      elements.push(text.slice(lastIndex));
    }

    return elements.length > 0 ? elements : text;
  };

  return (
    <div className="container mx-auto p-6 flex space-x-4 h-screen">
      <style jsx>{`
        .emoji {
          font-size: 18px;
        }
      `}</style>
      <div className="w-1/4 border-r pr-4">
        <h2 className="text-2xl font-bold text-primary mb-4">Users</h2>
        {Object.entries(users).length === 0 ? (
          <p className="text-secondary">No users yet</p>
        ) : (
          <ul className="space-y-2">
            {Object.entries(users).map(([userId, user]) => (
              <li
                key={userId}
                className={`p-2 rounded cursor-pointer ${
                  selectedUserId === userId ? 'bg-accent text-white' : 'hover:bg-gray-100'
                }`}
                onClick={() => setSelectedUserId(userId)}
              >
                <span>
                  {user.name} (IP: {user.ip})
                </span>
                <span
                  className={`ml-2 inline-block w-2 h-2 rounded-full ${
                    user.isOnline ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteMessages(userId);
                  }}
                  className="ml-2 text-sm text-red-500 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="w-3/4">
        <h2 className="text-2xl font-bold text-primary mb-4">
          {selectedUserId
            ? `Chat with ${users[selectedUserId]?.name || 'User'} (IP: ${users[selectedUserId]?.ip || 'unknown'})`
            : 'Select a User'}
        </h2>
        {selectedUserId ? (
          <div className="space-y-4">
            <div className="h-[calc(100vh-200px)] overflow-y-auto border p-4 rounded bg-gray-50">
              {(messages[selectedUserId] || []).map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-2 ${
                    msg.sender === 'admin' ? 'text-right' : 'text-left'
                  }`}
                >
                  <span
                    className={`inline-block p-2 rounded ${
                      msg.sender === 'admin'
                        ? 'bg-accent text-white'
                        : 'bg-primary text-white'
                    }`}
                  >
                    {renderMessageText(msg.text)}
                  </span>
                  <p className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                </div>
              ))}
            </div>
            <div className="relative">
              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  className="absolute bottom-14 left-0 z-10"
                >
                  <Picker onEmojiClick={onEmojiClick} />
                </div>
              )}
              <form onSubmit={handleSendMessage} className="flex space-x-2">
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
        ) : (
          <p className="text-secondary">Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
}