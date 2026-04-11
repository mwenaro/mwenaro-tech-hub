'use client';

import { Card } from '@mwenaro/ui';

interface TechItem {
  name: string;
  version: string;
  role: string;
  category: string;
  color: string;
  bgColor: string;
}

const STACK: TechItem[] = [
  { name: 'Next.js', version: '16', role: 'Meta-Framework', category: 'Frontend', color: 'text-white', bgColor: 'bg-zinc-900' },
  { name: 'React', version: '19', role: 'UI Runtime', category: 'Frontend', color: 'text-cyan-400', bgColor: 'bg-cyan-900/30' },
  { name: 'Tailwind CSS', version: '4', role: 'Styling', category: 'Frontend', color: 'text-sky-400', bgColor: 'bg-sky-900/30' },
  { name: 'TypeScript', version: '5', role: 'Type Safety', category: 'Language', color: 'text-blue-400', bgColor: 'bg-blue-900/30' },
  { name: 'Supabase', version: 'v2', role: 'Primary Database', category: 'Backend', color: 'text-emerald-400', bgColor: 'bg-emerald-900/30' },
  { name: 'MongoDB', version: '7', role: 'Ops Database', category: 'Backend', color: 'text-green-400', bgColor: 'bg-green-900/30' },
  { name: 'Radix UI', version: '2', role: 'Primitives', category: 'Frontend', color: 'text-violet-400', bgColor: 'bg-violet-900/30' },
  { name: 'Lucide', version: '0.5', role: 'Icons', category: 'Frontend', color: 'text-pink-400', bgColor: 'bg-pink-900/30' },
  { name: 'Zod', version: '3', role: 'Validation', category: 'Backend', color: 'text-yellow-400', bgColor: 'bg-yellow-900/30' },
  { name: 'Gemini AI', version: '1.5-flash', role: 'AI Engine', category: 'AI', color: 'text-orange-400', bgColor: 'bg-orange-900/30' },
  { name: 'Nodemailer', version: '6', role: 'Email', category: 'Backend', color: 'text-red-400', bgColor: 'bg-red-900/30' },
  { name: 'Vercel', version: 'Edge', role: 'Hosting', category: 'Infrastructure', color: 'text-white', bgColor: 'bg-zinc-800' },
];

const CATEGORIES = ['all', 'Frontend', 'Backend', 'Language', 'AI', 'Infrastructure'];

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: 'border-cyan-500/40 text-cyan-400',
  Backend: 'border-emerald-500/40 text-emerald-400',
  Language: 'border-blue-500/40 text-blue-400',
  AI: 'border-orange-500/40 text-orange-400',
  Infrastructure: 'border-zinc-500/40 text-zinc-400',
};

export function TechStackVisualizer() {
  // Compute distribution data
  const categories = [...new Set(STACK.map(t => t.category))];
  const distribution = categories.map(cat => ({
    name: cat,
    count: STACK.filter(t => t.category === cat).length,
    pct: Math.round((STACK.filter(t => t.category === cat).length / STACK.length) * 100),
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Stack Grid */}
      <div className="lg:col-span-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {STACK.map((tech) => (
            <Card
              key={tech.name}
              className={`p-4 flex flex-col gap-2 ${tech.bgColor} border-transparent hover:-translate-y-1 transition-all duration-300 cursor-default`}
            >
              <div className="flex items-start justify-between">
                <span className={`text-[10px] font-black uppercase tracking-widest ${CATEGORY_COLORS[tech.category]?.split(' ')[1] || 'text-zinc-400'}`}>
                  {tech.category}
                </span>
                <span className="text-[10px] bg-white/10 rounded-full px-2 py-0.5 text-white/60 font-mono">
                  v{tech.version}
                </span>
              </div>
              <p className={`font-black text-base leading-tight ${tech.color}`}>{tech.name}</p>
              <p className="text-[11px] text-white/50">{tech.role}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Distribution Panel */}
      <div className="space-y-4">
        <Card className="p-6 bg-zinc-900 dark:bg-zinc-950 border-zinc-800 h-full flex flex-col gap-5">
          <div>
            <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-1">Ecosystem Stats</p>
            <p className="text-3xl font-black text-white">{STACK.length} <span className="text-zinc-500 text-lg font-normal">technologies</span></p>
          </div>

          <div className="space-y-3">
            {distribution.map((cat) => (
              <div key={cat.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-zinc-400 font-semibold">{cat.name}</span>
                  <span className="text-zinc-500 text-xs">{cat.count} packages</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-orange-400 transition-all duration-700"
                    style={{ width: `${cat.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-2 mt-auto pt-4 border-t border-zinc-800">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-zinc-500">Data reflects current monorepo state</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
