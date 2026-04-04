import { NavBar, Footer } from "@mwenaro/ui";

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "About | Mwenaro - Building Africa's Tech Future",
  description: "Learn about Mwenaro's mission to drive tech innovation in Africa. We are a unified ecosystem empowering individuals and organizations through Academy, Talent, and Labs.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar currentApp="hub" />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative pt-48 pb-24 px-6 text-center lg:pt-56 lg:pb-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background -z-10" />
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em] mb-8 ring-1 ring-primary/20 backdrop-blur-sm shadow-sm">
            Our Story
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight mb-8 animate-reveal max-w-4xl mx-auto text-foreground">
            Building the <span className="text-primary">Next Generation</span> of Tech Leaders
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-reveal [animation-delay:200ms] leading-relaxed">
            Mwenaro is a unified ecosystem designed to empower individuals and organizations through top-tier technology education, talent scaling, and innovative tech solutions.
          </p>
        </section>

        {/* CONTENT */}
        <section className="py-24 px-6 bg-zinc-50 dark:bg-zinc-900/50 border-y border-zinc-100 dark:border-zinc-800/50">
          <div className="max-w-4xl mx-auto space-y-20">
            <div>
              <h2 className="text-3xl font-black mb-6 text-foreground tracking-tight">Our Mission</h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                We bridge the gap between ambition and high-level technical expertise. Through our three pillars—Academy, Talent, and Labs—we provide end-to-end solutions for aspiring engineers setting out to learn, growing businesses seeking world-class talent, and enterprises looking for bespoke engineering solutions.
              </p>
            </div>
            
            <div>
              <h2 className="text-3xl font-black mb-6 text-foreground tracking-tight">The Ecosystem</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-zinc-950 p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
                  <h3 className="text-xl font-bold mb-3 text-foreground">Academy</h3>
                  <p className="text-zinc-500 dark:text-zinc-400">Master modern tech stacks with our project-based curriculum.</p>
                </div>
                <div className="bg-white dark:bg-zinc-950 p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
                  <h3 className="text-xl font-bold mb-3 text-foreground">Talent</h3>
                  <p className="text-zinc-500 dark:text-zinc-400">Bringing pre-vetted, high-quality tech professionals to your team.</p>
                </div>
                <div className="bg-white dark:bg-zinc-950 p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
                  <h3 className="text-xl font-bold mb-3 text-foreground">Labs</h3>
                  <p className="text-zinc-500 dark:text-zinc-400">Custom software development accelerating your digital transformation.</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-black mb-6 text-foreground tracking-tight">Our Founder</h2>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-full md:w-1/3 aspect-square rounded-3xl bg-zinc-200 dark:bg-zinc-800 overflow-hidden relative shadow-inner flex items-center justify-center">
                  <span className="text-4xl">👨‍💻</span>
                </div>
                <div className="w-full md:w-2/3">
                  <h3 className="text-2xl font-bold mb-2 text-foreground">Mwero Abdalla</h3>
                  <p className="text-primary font-semibold mb-4 uppercase tracking-wider text-sm">Seasoned Fullstack Developer | Tech Educator | Mentor</p>
                  <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                    With extensive experience in building scalable applications and leading engineering teams, Mwero founded Mwenaro to create a clear pathway for tech enthusiasts to reach top-tier engineering levels.
                  </p>
                  <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    His vision emphasizes project-based learning, practical mentorship, and producing engineers who don't just write code, but build robust software solutions that solve real-world problems.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
