
import React, { useState, useRef, useEffect } from 'react';
import SendIcon from './icons/SendIcon';
import { Message, MessageAuthor } from '../types';

const initialMessages: Message[] = [
  {
    author: MessageAuthor.RescueAI,
    text: "Welcome, Operator. I am RescueVisionAI. How may I assist you?",
  }
];

const ChatBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isAI = message.author === MessageAuthor.RescueAI;
  
  const baseClasses = "max-w-xs md:max-w-md lg:max-w-xs xl:max-w-md p-3 rounded-xl mb-2 break-words";
  const aiClasses = `self-start bg-cyan-900/30 backdrop-blur-md border border-cyan-400/30 text-cyan-100`;
  const operatorClasses = `self-end bg-gray-700 text-white`;

  return (
    <div className={`${baseClasses} ${isAI ? aiClasses : operatorClasses}`}>
      <p className="text-sm">{message.text}</p>
    </div>
  );
};

const ChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // --- REPLACEMENT for the handleSend function ---

const handleSend = async (e: React.FormEvent) => {
  e.preventDefault();
  const trimmedInput = input.trim();
  if (!trimmedInput) return;

  // Add user's message to the state immediately
  const userMessage: Message = { author: MessageAuthor.Operator, text: trimmedInput };
  setMessages(prev => [...prev, userMessage]);
  setInput(''); // Clear input field

  try {
    // Call our live RAG API
    const response = await fetch('http://127.0.0.1:5001/api/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: trimmedInput }),
    });

    if (!response.ok) {
      // If the server responds with an error, create an error message
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Format the AI's response by combining the retrieved chunks
    const aiResponseText = data.answer_chunks
      .map((chunk: { page_content: string }) => chunk.page_content)
      .join('\n\n---\n\n'); // Separate chunks with a line for readability

    const aiMessage: Message = { author: MessageAuthor.RescueAI, text: aiResponseText || "No relevant information found." };
    setMessages(prev => [...prev, aiMessage]);

  } catch (error) {
    console.error("Failed to fetch from RAG API:", error);
    // Create a user-friendly error message in the chat
    const errorMessage: Message = { author: MessageAuthor.RescueAI, text: "Sorry, I am having trouble connecting to my knowledge base. Please ensure the backend service is running." };
    setMessages(prev => [...prev, errorMessage]);
  }
};

  return (
    <div className="bg-gray-900/50 border border-cyan-400/30 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.1)] h-full flex flex-col">
      <h2 className="text-lg font-bold text-cyan-400 p-4 border-b border-cyan-400/30">
        Mission AI Assistant
      </h2>
      <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto flex flex-col space-y-2">
        {messages.map((msg, index) => (
          <ChatBubble key={index} message={msg} />
        ))}
      </div>
      <div className="p-4 border-t border-cyan-400/30">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about protocols or hazards..."
            className="w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
          />
          <button
            type="submit"
            className="p-2 bg-cyan-400 text-gray-900 rounded-full hover:bg-cyan-300 disabled:opacity-50 transition-colors"
            disabled={!input.trim()}
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;
