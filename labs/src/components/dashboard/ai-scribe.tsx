'use client';

import { useState, useRef, useEffect } from 'react';
import { Card } from '@mwenaro/ui';
import { Send, Bot, User, Loader2, RefreshCw, X, MessageSquare, Sparkles } from 'lucide-react';
import { useAIContext } from '@/context/AIContext';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export function AIScribe() {
  const { contextData } = useAIContext();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hello! I'm **The Scribe**, your AI Writing Assistant. I can help you draft project requirements, refine proposals, or brainstorm technical roadmaps. How can I help you document your vision today?" }
  ]);
  const [input, setInput] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState('');
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
    
    // Add user message to UI
    const updatedMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(updatedMessages);
    setIsPending(true);

    try {
      const res = await fetch('/api/dashboard/scribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          history: messages,
          context: contextData // Pass current page context
        }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
      } else {
        setMessages([...updatedMessages, { role: 'model', content: data.reply }]);
      }
    } catch {
      setError('Failed to connect to scribe. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
      let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      if (formattedLine.trim().startsWith('- ')) {
        formattedLine = `<li class="ml-4 list-disc">${formattedLine.trim().substring(2)}</li>`;
        return <div key={i} dangerouslySetInnerHTML={{ __html: formattedLine }} />;
      }
      return <p key={i} className={line.trim() === '' ? 'h-3' : ''} dangerouslySetInnerHTML={{ __html: formattedLine }} />;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Chat Window */}
      {isOpen && (
        <Card className="flex flex-col w-[380px] h-[550px] shadow-2xl border-primary/20 bg-white dark:bg-zinc-900 overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-primary/5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                <Sparkles size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">The Scribe</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest leading-none">AI Writing Assistant</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
               <button 
                onClick={() => setMessages([messages[0]])}
                className="p-2 text-zinc-400 hover:text-foreground transition-colors"
                title="Reset conversation"
              >
                <RefreshCw size={14} />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-zinc-400 hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Context Banner */}
          {contextData && (
             <div className="px-4 py-2 bg-primary/10 border-b border-primary/10 text-[10px] text-primary font-bold flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                CONTEXT AWARE: READS CURRENT PAGE DATA
             </div>
          )}

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-700">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                    msg.role === 'user' 
                      ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400' 
                      : 'bg-primary/20 text-primary'
                  }`}>
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-tr-sm'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-foreground rounded-tl-sm'
                  }`}>
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="prose-sm dark:prose-invert">
                        {renderMarkdown(msg.content)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isPending && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={14} />
                  </div>
                  <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 rounded-tl-sm flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="mx-auto w-fit px-4 py-2 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200/50 dark:border-zinc-800/50">
            <div className="relative flex items-center">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask for writing help..."
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none max-h-32"
                rows={1}
                style={{ minHeight: '46px' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isPending}
                className="absolute right-2 bottom-2 p-2 rounded-lg text-white bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isOpen 
            ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rotate-90' 
            : 'bg-primary text-white hover:scale-110 hover:shadow-primary/30 active:scale-95'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
}
