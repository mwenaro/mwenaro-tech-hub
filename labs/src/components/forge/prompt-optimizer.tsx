'use client';

import { useState, useTransition } from 'react';
import { Card } from '@mwenaro/ui';
import { Wand2, Sparkles, ChevronDown, Copy, Check, Loader2, Zap, Minimize2, Maximize2 } from 'lucide-react';

type Mode = 'refine' | 'expand' | 'simplify';

interface OptimizedResult {
  optimized: string;
  improvements: string[];
  score: number;
}

const MODES: { id: Mode; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'refine', label: 'Refine', icon: <Wand2 size={14} />, desc: 'Make it clearer and more specific' },
  { id: 'expand', label: 'Expand', icon: <Maximize2 size={14} />, desc: 'Add context and constraints' },
  { id: 'simplify', label: 'Simplify', icon: <Minimize2 size={14} />, desc: 'Strip to core intent' },
];

const EXAMPLES = [
  "Write a blog post about AI",
  "Create a Python function that sorts data",
  "Explain quantum computing to a 10-year-old",
];

export function PromptOptimizer() {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<Mode>('refine');
  const [result, setResult] = useState<OptimizedResult | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleOptimize = () => {
    if (!prompt.trim() || prompt.trim().length < 5) return;
    setError('');
    setResult(null);

    startTransition(async () => {
      try {
        const res = await fetch('/api/forge/prompt-optimizer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: prompt.trim(), mode }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Something went wrong.');
        } else {
          setResult(data);
        }
      } catch {
        setError('Failed to connect to AI service. Please try again.');
      }
    });
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.optimized);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scoreColor = (s: number) =>
    s >= 8 ? 'text-green-400' : s >= 5 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input */}
      <Card className="p-6 bg-white dark:bg-zinc-900 border-zinc-200/50 dark:border-zinc-800/50 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <Wand2 className="text-primary" size={18} />
          <span className="font-bold text-sm text-foreground">Your Prompt</span>
        </div>

        {/* Mode selector */}
        <div className="flex gap-2 flex-wrap">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 ${
                mode === m.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-foreground hover:border-zinc-400 dark:hover:border-zinc-500'
              }`}
            >
              {m.icon}
              {m.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-zinc-500">{MODES.find(m => m.id === mode)?.desc}</p>

        <textarea
          id="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Paste your AI prompt here..."
          rows={6}
          className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-3 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-zinc-400 transition-all"
        />

        {/* Example chips */}
        <div>
          <p className="text-xs text-zinc-500 mb-2 font-medium">Try an example:</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => setPrompt(ex)}
                className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/30 transition-all"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        <button
          id="optimize-btn"
          onClick={handleOptimize}
          disabled={isPending || !prompt.trim() || prompt.trim().length < 5}
          className="w-full h-12 rounded-xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 hover:shadow-[0_8px_20px_rgba(232,93,59,0.3)] transition-all duration-300 active:scale-95"
        >
          {isPending ? (
            <><Loader2 className="animate-spin" size={16} /> Optimizing...</>
          ) : (
            <><Sparkles size={16} /> Optimize Prompt</>
          )}
        </button>
      </Card>

      {/* Output */}
      <Card className="p-6 bg-white dark:bg-zinc-900 border-zinc-200/50 dark:border-zinc-800/50 min-h-[300px] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="text-cyan-500" size={18} />
            <span className="font-bold text-sm text-foreground">Optimized Result</span>
          </div>
          {result && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-500 hover:text-foreground transition-all hover:border-zinc-400"
            >
              {copied ? <><Check size={12} className="text-green-500" /> Copied</> : <><Copy size={12} /> Copy</>}
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {isPending && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-zinc-400">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <p className="text-sm">Gemini is thinking...</p>
          </div>
        )}

        {!isPending && !result && !error && (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-400">
            <Sparkles size={40} className="mb-3 opacity-20" />
            <p className="text-sm">Your optimized prompt will appear here</p>
          </div>
        )}

        {result && !isPending && (
          <div className="flex-1 flex flex-col gap-5">
            {/* Score */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Original Quality</span>
              <div className="flex items-center gap-1.5">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-4 rounded-full transition-all ${
                      i < result.score ? 'bg-primary' : 'bg-zinc-200 dark:bg-zinc-700'
                    }`}
                  />
                ))}
                <span className={`ml-1 text-sm font-black ${scoreColor(result.score)}`}>
                  {result.score}/10
                </span>
              </div>
            </div>

            {/* Optimized prompt */}
            <div className="flex-1 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-700/50 p-4">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{result.optimized}</p>
            </div>

            {/* Improvements */}
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">What Changed</p>
              <ul className="space-y-2">
                {result.improvements.map((imp, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-black flex-shrink-0">
                      {i + 1}
                    </span>
                    {imp}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
