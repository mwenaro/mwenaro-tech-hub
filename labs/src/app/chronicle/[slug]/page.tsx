import { Metadata } from "next";
import { NavBar, Footer } from "@mwenaro/ui";
import Link from "next/link";
import { notFound } from "next/navigation";
import { chronicleEntries } from "@mwenaro/content/chronicle-content";
import { ArrowLeft, Clock, Tag } from "lucide-react";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const entry = chronicleEntries.find((e) => e.slug === params.slug);
  if (!entry) return {};
  return {
    title: `${entry.title} | Labs Chronicle`,
    description: entry.summary,
    alternates: { canonical: `/chronicle/${entry.slug}` },
  };
}

export async function generateStaticParams() {
  return chronicleEntries.map((e) => ({ slug: e.slug }));
}

// Minimal markdown-to-HTML renderer (no external dep)
function renderMarkdown(md: string): string {
  return md
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-black mt-10 mb-3 text-foreground">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-8 mb-2 text-foreground">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-xs text-primary">$1</code>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-zinc-500 dark:text-zinc-400">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal text-zinc-500 dark:text-zinc-400">$2</li>')
    .replace(/\n\n/g, '</p><p class="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">')
    .replace(/^(?!<[h|l|p])(.+)$/gm, '<p class="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">$1</p>');
}

const CATEGORY_STYLES: Record<string, string> = {
  Build: "bg-primary/10 text-primary border-primary/30",
  Discovery: "bg-cyan-500/10 text-cyan-500 border-cyan-500/30",
  Pattern: "bg-violet-500/10 text-violet-500 border-violet-500/30",
  Architecture: "bg-amber-500/10 text-amber-500 border-amber-500/30",
  AI: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
};

export default function ChronicleEntryPage({ params }: Props) {
  const entry = chronicleEntries.find((e) => e.slug === params.slug);
  if (!entry) notFound();

  const date = new Date(entry.date).toLocaleDateString("en-KE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const htmlBody = renderMarkdown(entry.body);

  return (
    <main className="min-h-screen bg-background selection:bg-primary/20">
      <NavBar currentApp="labs" ctaLabel="Start a Project" ctaHref="/contact" />

      {/* Header */}
      <section className="pt-36 pb-14 px-6 bg-zinc-950 dark:bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <Link
            href="/chronicle"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white text-sm font-semibold mb-8 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Chronicle
          </Link>

          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className="text-4xl">{entry.emoji}</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${CATEGORY_STYLES[entry.category] || ""}`}
            >
              {entry.category}
            </span>
            <span className="flex items-center gap-1.5 text-zinc-500 text-xs">
              <Clock size={12} />
              {date}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            {entry.title}
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">{entry.summary}</p>
        </div>
      </section>

      {/* Body */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <article
            className="prose-labs"
            dangerouslySetInnerHTML={{ __html: htmlBody }}
          />

          {/* Tags */}
          <div className="mt-16 pt-8 border-t border-zinc-200/50 dark:border-zinc-800/50">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag size={14} className="text-zinc-400" />
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Back */}
          <div className="mt-8">
            <Link
              href="/chronicle"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-200 dark:border-zinc-700 text-sm font-bold text-zinc-500 hover:text-foreground hover:border-zinc-400 transition-all"
            >
              <ArrowLeft size={14} /> All Entries
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
