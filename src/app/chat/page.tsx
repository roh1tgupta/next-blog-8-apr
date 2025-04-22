'use client';

import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';
import { Message } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';
import ChatUI from './ChatUI';

// Helper function to parse device info from user agent
const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  const { downlink, rtt, effectiveType } = navigator.connection || {};
  const isMobile = /Mobi|Android|iPhone|iPad/.test(ua);
  let os = 'unknown';
  let model = 'unknown';

  if (/iPhone|iPad/.test(ua)) {
    os = 'iOS';
    model = /iPhone/.test(ua) ? 'iPhone' : 'iPad'; // iOS doesn't expose exact model
  } else if (/Android/.test(ua)) {
    os = 'Android';
    const match = ua.match(/Android.*?\s([A-Za-z0-9\-]+)(?:\s|$|;)/);
    model = match ? match[1] : 'Android Device'; // Extract model like SM-G960U
  } else if (isMobile) {
    os = 'other';
    model = 'Mobile Device';
  } else {
    os = '';
    model = 'web';
  }

  return { isMobile, deviceInfo: `${os}_${model}_${downlink}_${rtt}_${effectiveType}` };
};

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

    const newSocket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);
    setSocket(newSocket);

    if (storedUser && name && userId) {
      fetch('https://api.ipify.org?format=json')
        .then((res) => res.json())
        .then((data) => {
          const { isMobile, deviceInfo } = getDeviceInfo();
          const ipWithDevice = deviceInfo;
          console.log(ipWithDevice);
          newSocket.emit('set-name', { name, userId, ip: `${data.ip}_${ipWithDevice}` });
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
          const { isMobile, deviceInfo } = getDeviceInfo();
          const ipWithDevice = deviceInfo;
          console.log(ipWithDevice);
          socket?.emit('set-name', { name: trimmedName, userId: newUserId, ip: `${data.ip}_${ipWithDevice}` });
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

  const handleEmojiClick = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <ChatUI
      name={name}
      inputName={inputName}
      message={message}
      messages={messages}
      adminOnline={adminOnline}
      showEmojiPicker={showEmojiPicker}
      emojiPickerRef={emojiPickerRef}
      onSetName={handleSetName}
      onInputNameChange={(e) => setInputName(e.target.value)}
      onMessageChange={(e) => setMessage(e.target.value)}
      onSendMessage={handleSendMessage}
      onEmojiClick={handleEmojiClick}
      onToggleEmojiPicker={() => setShowEmojiPicker((prev) => !prev)}
    />
  );
}