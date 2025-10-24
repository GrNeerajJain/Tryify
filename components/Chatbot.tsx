
import React, { useState, useEffect, useRef } from 'react';
import { Chat } from '@google/genai';
import { XIcon, SendIcon, ChatBotIcon } from './icons';
import { Spinner } from './Spinner';
import { startChatSession } from '../services/geminiService';
import { ChatMessage } from '../types';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1.5">
        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
);


export const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && !chatRef.current) {
      chatRef.current = startChatSession();
      setMessages([
        {
          role: 'model',
          text: "Hello! I'm your AI assistant for Tryify. How can I help you with fashion tips or using the app today?",
        },
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        const scrollHeight = textareaRef.current.scrollHeight;
        textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [input]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      if (!chatRef.current) throw new Error("Chat session not initialized.");
      
      const result = await chatRef.current.sendMessageStream({ message: userMessage.text });
      
      let text = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of result) {
        text += chunk.text;
        setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = text;
            return newMessages;
        });
      }
      
    } catch (err) {
      console.error('Gemini API error:', err);
      const errorMessage = "Sorry, I'm having a little trouble right now. Please try again in a moment.";
      setError(errorMessage);
       setMessages((prev) => [...prev, { role: 'model', text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend(e as any);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-end sm:justify-end">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>

      {/* Chat Window */}
      <div className="relative w-full max-w-lg h-[80vh] sm:h-[500px] bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col m-0 sm:m-4 animate-scale-in">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-3">
             <div className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full p-2">
                <ChatBotIcon className="h-6 w-6" />
             </div>
             <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">AI Assistant</h2>
                <p className="text-xs text-green-500 flex items-center gap-1"><span className="h-2 w-2 bg-green-400 rounded-full"></span> Online</p>
             </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            aria-label="Close chat"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'model' && <div className="h-8 w-8 rounded-full bg-indigo-500 text-white flex items-center justify-center flex-shrink-0 text-lg font-bold">T</div>}
              <div
                className={`max-w-xs md:max-w-md break-words rounded-2xl px-4 py-2.5 ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-lg'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-2 justify-start">
               <div className="h-8 w-8 rounded-full bg-indigo-500 text-white flex items-center justify-center flex-shrink-0 text-lg font-bold">T</div>
               <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-lg px-4 py-3.5">
                    <TypingIndicator />
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              rows={1}
              className="flex-1 w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="h-12 w-12 flex-shrink-0 bg-indigo-600 text-white rounded-lg flex items-center justify-center hover:bg-indigo-700 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors"
              aria-label="Send message"
            >
              {isLoading ? <Spinner className="h-5 w-5"/> : <SendIcon className="h-6 w-6" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
