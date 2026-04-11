import { Metadata } from "next";
import { NavBar, Footer } from "@mwenaro/ui";
import { ForgeHero } from "@/components/forge/forge-hero";
import { PromptOptimizer } from "@/components/forge/prompt-optimizer";
import { TechStackVisualizer } from "@/components/forge/tech-stack-visualizer";
import { ComponentPreviewer } from "@/components/forge/component-previewer";
import { AIStrategist } from "@/components/forge/ai-strategist";

export const metadata: Metadata = {
  title: "The Forge | Mwenaro Labs",
  description:
    "Mwenaro Labs' experimental R&D playground. Explore interactive tools, AI-powered utilities, and live component showcases built by the Labs team.",
  alternates: { canonical: "/forge" },
};

export default function ForgePage() {
  return (
    <main className="min-h-screen bg-background selection:bg-primary/20">
      <NavBar currentApp="labs" ctaLabel="Start a Project" ctaHref="/contact" />

      <ForgeHero />

      {/* Experiments Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-20">
        {/* Experiment 1: AI Prompt Optimizer */}
        <div id="prompt-optimizer">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-4">
              🤖 Experiment 01 — AI
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
              Prompt Optimizer
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-3 text-lg max-w-2xl">
              Paste any AI prompt and instantly get a smarter, more effective version — powered by Gemini.
            </p>
          </div>
          <PromptOptimizer />
        </div>

        {/* Experiment 2: Tech Stack Visualizer */}
        <div id="stack-visualizer">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-500 text-xs font-black uppercase tracking-widest mb-4">
              🌐 Experiment 02 — Data
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
              Tech Stack Vitals
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-3 text-lg max-w-2xl">
              A live view of the technologies powering the Mwenaro ecosystem — versions, roles, and distribution.
            </p>
          </div>
          <TechStackVisualizer />
        </div>

        {/* Experiment 3: Component Previewer */}
        <div id="component-previewer">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-500 text-xs font-black uppercase tracking-widest mb-4">
              🎨 Experiment 03 — UI
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
              Design System Previewer
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-3 text-lg max-w-2xl">
              Explore the Mwenaro "Midnight & Gold" design system live — every token, component, and variant in one place.
            </p>
          </div>
          <ComponentPreviewer />
        </div>

        {/* Experiment 4: AI Strategist */}
        <div id="ai-strategist">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-xs font-black uppercase tracking-widest mb-4">
              💬 Experiment 04 — AI
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
              AI Project Strategist
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-3 text-lg max-w-2xl">
              Chat with our AI technical architect to map out the perfect tech stack and roadmap for your next digital product.
            </p>
          </div>
          <AIStrategist />
        </div>
      </section>

      <Footer />
    </main>
  );
}
