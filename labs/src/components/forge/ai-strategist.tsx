'use client';

import { useState, useRef, useEffect } from 'react';
import { Card } from '@mwenaro/ui';
import { Send, Bot, User, Loader2, RefreshCw } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export function AIStrategist() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hello. I'm the Mwenaro Labs AI Strategist. Tell me a bit about the digital product or software you're looking to build, and I'll help you frame the technical architecture." }
  ]);
  const [input, setInput] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isPending]);

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
      // Send history (excluding the new user message) + new user message
      const res = await fetch('/api/forge/strategist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          history: messages 
        }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
      } else {
        setMessages([...updatedMessages, { role: 'model', content: data.reply }]);
      }
    } catch {
      setError('Failed to connect to AI service. Please try again.');
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

  // Minimal markdown render for the AI responses
  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Handle bold
      let formattedLine = line.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>');
      // Handle list items
      if (formattedLine.trim().startsWith('- ')) {
        formattedLine = `<li class="ml-4 list-disc">${formattedLine.trim().substring(2)}</li>`;
        return <div key={i} dangerouslySetInnerHTML={{ __html: formattedLine }} />;
      }
      return <p key={i} className={line.trim() === '' ? 'h-3' : ''} dangerouslySetInnerHTML={{ __html: formattedLine }} />;
    });
  };

  return (
    <Card className="flex flex-col h-[500px] border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50 dark:bg-zinc-950">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <Bot size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">AI Strategist</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">Llama 3.2 3B</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setMessages([messages[0]])}
          className="p-2 text-zinc-400 hover:text-foreground transition-colors"
          title="Reset conversation"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
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
                  : 'bg-zinc-100 dark:bg-zinc-800 text-foreground rounded-tl-sm prose-sm dark:prose-invert max-w-none'
              }`}>
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  renderMarkdown(msg.content)
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
          <div className="mx-auto w-fit px-4 py-2 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs border border-red-200 dark:border-red-800 mt-2">
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
            placeholder="Describe your project idea..."
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
  );
}
