import { Message } from '@/types/chat';
import Picker from 'emoji-picker-react';
import { RefObject, useEffect, useRef } from 'react';

interface ChatUIProps {
  name: string;
  inputName: string;
  message: string;
  messages: Message[];
  adminOnline: boolean;
  showEmojiPicker: boolean;
  emojiPickerRef: RefObject<HTMLDivElement | null>;
  onSetName: (e: React.FormEvent) => void;
  onInputNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onEmojiClick: (emoji: string) => void;
  onToggleEmojiPicker: () => void;
}

export default function ChatUI({
  name,
  inputName,
  message,
  messages,
  adminOnline,
  showEmojiPicker,
  emojiPickerRef,
  onSetName,
  onInputNameChange,
  onMessageChange,
  onSendMessage,
  onEmojiClick,
  onToggleEmojiPicker,
}: ChatUIProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Focus input on mount
  useEffect(() => {
    if (!name && nameInputRef.current) {
      nameInputRef.current.focus();
    } else if (name && messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [name]);

  // Scroll to latest message when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [messages]);

  // Focus message input after sending a message
  const handleSendMessageWithFocus = (e: React.FormEvent) => {
    onSendMessage(e);
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
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
    <div className="flex flex-col min-h-screen w-full px-2 bg-gray-100 md:bg-white md:flex md:items-center md:justify-center">
      <style jsx>{`
        .emoji {
          font-size: 18px;
        }
      `}</style>
      <div className="flex flex-col w-full min-h-screen md:w-[700px] md:h-[600px] md:shadow-lg md:rounded-lg md:bg-gray-100">
        <h1 className="text-2xl font-bold text-primary mt-4 mb-4 px-4">
          {name ? `Welcome ${name}` : 'Chat'}
        </h1>
        {!name ? (
          <form onSubmit={onSetName} className="flex flex-col space-y-4 w-full px-4">
            <div>
              <label className="block text-lg font-medium mb-2">Your Name</label>
              <input
                type="text"
                value={inputName}
                onChange={onInputNameChange}
                className="w-full p-2 border rounded"
                required
                ref={nameInputRef}
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
          <div className="flex flex-col flex-grow w-full px-4 pb-4">
            <p className="text-sm text-secondary flex items-center gap-2 mb-4">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  adminOnline ? 'bg-green-500' : 'bg-red-500'
                }`}
              ></span>
            </p>
            <div className="flex-grow overflow-y-auto border p-4 rounded bg-gray-50 mb-4 content-end">
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
              <div ref={messagesEndRef} />
            </div>
            <div className="sticky bottom-0 bg-gray-100 pb-4">
              {showEmojiPicker && (
                <div ref={emojiPickerRef} className="absolute bottom-14 left-0 z-10 w-full">
                  <Picker onEmojiClick={(emojiObject) => onEmojiClick(emojiObject.emoji)} />
                </div>
              )}
              <form onSubmit={handleSendMessageWithFocus} className="flex space-x-2 w-full">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={message}
                    onChange={onMessageChange}
                    className="w-full p-2 border rounded pr-10"
                    placeholder="Type your message..."
                    ref={messageInputRef}
                  />
                  <button
                    type="button"
                    onClick={onToggleEmojiPicker}
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
    </div>
  );
}