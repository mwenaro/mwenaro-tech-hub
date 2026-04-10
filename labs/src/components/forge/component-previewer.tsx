'use client';

import { useState } from 'react';
import { Card } from '@mwenaro/ui';

type TabType = 'buttons' | 'cards' | 'badges' | 'typography' | 'colors';

const TABS: { id: TabType; label: string }[] = [
  { id: 'buttons', label: 'Buttons' },
  { id: 'cards', label: 'Cards' },
  { id: 'badges', label: 'Badges' },
  { id: 'typography', label: 'Typography' },
  { id: 'colors', label: 'Colors' },
];

export function ComponentPreviewer() {
  const [activeTab, setActiveTab] = useState<TabType>('buttons');
  const [darkMode, setDarkMode] = useState(true);

  return (
    <Card className="overflow-hidden border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900">
      {/* Toolbar */}
      <div className="border-b border-zinc-200/50 dark:border-zinc-800/50 px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-1 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-zinc-500 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-500 hover:text-foreground transition-all"
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      {/* Preview area */}
      <div className={`p-8 min-h-[320px] transition-colors duration-300 ${darkMode ? 'bg-zinc-950' : 'bg-zinc-50'}`}>
        {activeTab === 'buttons' && (
          <div className="flex flex-wrap gap-4 items-center">
            <button className="px-6 h-11 rounded-full bg-primary text-white font-bold text-sm shadow-[0_4px_14px_rgba(232,93,59,0.35)] hover:shadow-[0_6px_20px_rgba(232,93,59,0.45)] hover:-translate-y-0.5 transition-all">
              Primary
            </button>
            <button className={`px-6 h-11 rounded-full font-bold text-sm border-2 border-primary text-primary hover:bg-primary/10 transition-all ${darkMode ? '' : ''}`}>
              Outline
            </button>
            <button className={`px-6 h-11 rounded-full font-bold text-sm transition-all ${darkMode ? 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700' : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'}`}>
              Ghost
            </button>
            <button className="px-6 h-11 rounded-full bg-zinc-900 text-white font-bold text-sm border border-zinc-700 hover:border-zinc-500 transition-all">
              Dark
            </button>
            <button className="px-6 h-11 rounded-full bg-primary text-white font-bold text-sm opacity-40 cursor-not-allowed" disabled>
              Disabled
            </button>
          </div>
        )}

        {activeTab === 'cards' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {['🚀 Feature Card', '🔥 Hot Card', '✨ Glow Card'].map((title, i) => (
              <div
                key={i}
                className={`p-5 rounded-2xl border transition-all hover:-translate-y-1 cursor-default ${
                  darkMode
                    ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-600'
                    : 'bg-white border-zinc-200 hover:border-zinc-400 shadow-sm'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-lg mb-3">
                  {title.split(' ')[0]}
                </div>
                <p className={`font-bold text-sm mb-1 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                  {title.slice(3)}
                </p>
                <p className="text-xs text-zinc-500">Midnight & Gold design system component.</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="flex flex-wrap gap-3 items-center">
            {[
              { label: 'Active', cls: 'bg-primary/15 text-primary border-primary/30' },
              { label: 'Success', cls: 'bg-green-500/15 text-green-400 border-green-500/30' },
              { label: 'Warning', cls: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
              { label: 'Error', cls: 'bg-red-500/15 text-red-400 border-red-500/30' },
              { label: 'Info', cls: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' },
              { label: 'Experimental', cls: 'bg-violet-500/15 text-violet-400 border-violet-500/30' },
              { label: 'Beta', cls: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30' },
            ].map((badge) => (
              <span
                key={badge.label}
                className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${badge.cls}`}
              >
                {badge.label}
              </span>
            ))}
          </div>
        )}

        {activeTab === 'typography' && (
          <div className={`space-y-4 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
            <p className="text-6xl font-black tracking-tight leading-none">Display</p>
            <p className="text-4xl font-black tracking-tight">Heading 1</p>
            <p className="text-2xl font-bold">Heading 2</p>
            <p className="text-xl font-semibold">Heading 3</p>
            <p className="text-base">Body — The quick brown fox jumps over the lazy dog.</p>
            <p className="text-sm text-zinc-500">Muted — Supporting text and descriptions use this style.</p>
            <p className="text-xs font-black uppercase tracking-widest text-primary">Label / Badge Text</p>
          </div>
        )}

        {activeTab === 'colors' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { name: 'Primary', cls: 'bg-[rgb(232,93,59)]' },
              { name: 'Zinc 950', cls: 'bg-zinc-950 border border-zinc-800' },
              { name: 'Zinc 900', cls: 'bg-zinc-900 border border-zinc-800' },
              { name: 'Zinc 800', cls: 'bg-zinc-800' },
              { name: 'Cyan 400', cls: 'bg-cyan-400' },
              { name: 'Violet 400', cls: 'bg-violet-400' },
              { name: 'Green 400', cls: 'bg-green-400' },
              { name: 'Yellow 400', cls: 'bg-yellow-400' },
              { name: 'Red 400', cls: 'bg-red-400' },
              { name: 'White', cls: 'bg-white border border-zinc-200' },
            ].map((color) => (
              <div key={color.name} className="space-y-2">
                <div className={`h-16 rounded-xl ${color.cls}`} />
                <p className="text-xs text-zinc-500 font-medium">{color.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer note */}
      <div className="border-t border-zinc-200/50 dark:border-zinc-800/50 px-6 py-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
        <span className="text-xs text-zinc-500">
          All components follow the <strong className="text-zinc-400">Midnight & Gold</strong> design system
        </span>
      </div>
    </Card>
  );
}
