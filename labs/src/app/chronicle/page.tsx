import { Metadata } from "next";
import { NavBar, Footer } from "@mwenaro/ui";
import Link from "next/link";
import { chronicleEntries, ChronicleEntry } from "@mwenaro/content/chronicle-content";
import { ArrowRight, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Labs Chronicle | Mwenaro Labs",
  description:
    "The Mwenaro Labs engineering log. Real builds, real discoveries, and the technical decisions behind every product we ship.",
  alternates: { canonical: "/chronicle" },
};

const CATEGORY_STYLES: Record<string, string> = {
  Build: "bg-primary/10 text-primary border-primary/30",
  Discovery: "bg-cyan-500/10 text-cyan-500 border-cyan-500/30",
  Pattern: "bg-violet-500/10 text-violet-500 border-violet-500/30",
  Architecture: "bg-amber-500/10 text-amber-500 border-amber-500/30",
  AI: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
};

function EntryCard({ entry }: { entry: ChronicleEntry }) {
  const date = new Date(entry.date).toLocaleDateString("en-KE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Link
      href={`/chronicle/${entry.slug}`}
      className="group block p-6 lg:p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 hover:border-primary/30 dark:hover:border-primary/30 hover:shadow-[0_12px_40px_-10px_rgba(232,93,59,0.15)] transition-all duration-400 hover:-translate-y-1"
    >
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{entry.emoji}</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${CATEGORY_STYLES[entry.category] || "bg-zinc-100 text-zinc-600"}`}
          >
            {entry.category}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
          <Clock size={12} />
          {date}
        </div>
      </div>

      <h2 className="text-xl lg:text-2xl font-black tracking-tight text-foreground mb-2 group-hover:text-primary transition-colors">
        {entry.title}
      </h2>
      <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-5">
        {entry.summary}
      </p>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex flex-wrap gap-2">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[11px] font-mono"
            >
              #{tag}
            </span>
          ))}
        </div>
        <span className="flex items-center gap-1 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          Read <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}

export default function ChroniclePage() {
  const latest = chronicleEntries[0];
  const rest = chronicleEntries.slice(1);

  return (
    <main className="min-h-screen bg-background selection:bg-primary/20">
      <NavBar currentApp="labs" ctaLabel="Start a Project" ctaHref="/contact" />

      {/* Header */}
      <section className="pt-36 pb-20 px-6 bg-zinc-950 dark:bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white/50 text-xs font-black uppercase tracking-widest mb-6">
            📖 Engineering Log
          </span>
          <h1 className="text-6xl md:text-7xl font-black text-white tracking-tight leading-tight mb-6">
            Labs{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
              Chronicle
            </span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
            Real builds, real decisions, real learning. Every experiment, architecture choice, and discovery — documented as we go.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        {/* Latest — featured */}
        {latest && (
          <div className="mb-12">
            <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4">Latest Entry</p>
            <EntryCard entry={latest} />
          </div>
        )}

        {/* Rest */}
        {rest.length > 0 && (
          <div>
            <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4">Previous Entries</p>
            <div className="space-y-4">
              {rest.map((entry) => (
                <EntryCard key={entry.slug} entry={entry} />
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
