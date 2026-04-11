'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, X, MessageSquare, BotMessageSquare, Sparkles, Copy, Check, Info } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AcademyAIProps {
  name?: string;
  role?: 'tutor' | 'support' | 'advisor';
  initialMessage?: string;
  className?: string;
}

export function AcademyAI({ 
  name = 'Mwenaro Tutor', 
  role = 'tutor', 
  initialMessage = "Hello! I'm your Mwenaro Academy assistant. How can I help you today?",
  className = ""
}: AcademyAIProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: initialMessage }
  ]);
  const [input, setInput] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isPending, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isPending) return;

    const userMessage = input.trim();
    setInput('');
    setError('');
    
    const updatedMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(updatedMessages);
    setIsPending(true);

    try {
      const res = await fetch('/api/academy/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          history: messages,
          role,
          name
        }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
      } else {
        setMessages([...updatedMessages, { role: 'assistant', content: data.reply }]);
      }
    } catch {
      setError('Failed to connect to AI. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`fixed z-50 flex flex-col items-end transition-all duration-500 right-6 ${isOpen ? 'top-8 bottom-8' : 'bottom-6'} ${className}`}>
      {/* Chat Window */}
      {isOpen && (
        <div className="flex flex-col w-[400px] h-full shadow-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden animate-in slide-in-from-right-5 fade-in duration-300">
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                {role === 'tutor' ? <Sparkles size={16} /> : <Bot size={16} />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">{name}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest leading-none">
                    {role === 'tutor' ? 'Academic Tutor' : 'Support Assistant'}
                  </span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 text-zinc-400 hover:text-foreground transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* RAG Protection Banner */}
          <div className="flex-shrink-0 px-4 py-2 bg-blue-50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/20 text-[10px] text-blue-600 dark:text-blue-400 font-bold flex items-center gap-2 uppercase tracking-wide">
            <Info size={10} />
            Grounded in Mwenaro Academy Knowledge Base
          </div>

          {/* Chat Area */}
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            <div className="p-5 pb-20 space-y-6">
              <div className="h-2 flex-shrink-0" />
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                      msg.role === 'user' 
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600' 
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                    }`}>
                      {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed group relative shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-sm'
                        : 'bg-zinc-50 dark:bg-zinc-900 text-foreground rounded-tl-sm border dark:border-zinc-800'
                    }`}>
                      {msg.role === 'assistant' && (
                        <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">{name}</div>
                      )}
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      {msg.role === 'assistant' && (
                        <button
                          onClick={() => handleCopy(msg.content, i)}
                          className="absolute -bottom-6 right-0 p-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1 text-[8px] font-bold"
                        >
                          {copiedIndex === i ? <><Check size={8} className="text-green-500" /> Copied</> : <><Copy size={8} /> Copy</>}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isPending && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot size={14} />
                    </div>
                    <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 rounded-tl-sm border dark:border-zinc-800 flex flex-col gap-1">
                      <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">{name}</div>
                      <div className="flex items-center gap-1">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} className="h-4 flex-shrink-0" />
            </div>
          </div>

          {/* Input Area */}
          <div className="flex-shrink-0 p-4 bg-zinc-50 dark:bg-zinc-900/50 border-t dark:border-zinc-800">
            <div className="relative flex items-center">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="w-full bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none max-h-32"
                rows={1}
                style={{ minHeight: '46px' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isPending}
                className="absolute right-2 bottom-2 p-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <div className="flex-shrink-0">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
            isOpen 
              ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rotate-90' 
              : 'bg-blue-600 text-white hover:scale-110 hover:shadow-blue-500/30 active:scale-95'
          }`}
        >
          {isOpen ? <X size={24} /> : <BotMessageSquare size={24} />}
        </button>
      </div>
    </div>
  );
}
