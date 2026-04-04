import { NavBar, Footer } from "@mwenaro/ui";

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "About Us | Mwenaro Talent - Elite Tech Recruitment Africa",
  description: "Learn about Mwenaro Talent's mission to connect world-class tech professionals with innovative companies globally. We provide rigorous vetting and seamless scaling for your engineering teams.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar currentApp="talent" />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative pt-48 pb-24 px-6 text-center lg:pt-56 lg:pb-32 bg-zinc-950 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-zinc-950 to-zinc-950 -z-10" />
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em] mb-8 ring-1 ring-primary/20 backdrop-blur-sm shadow-sm">
            About Mwenaro Talent
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight mb-8 animate-reveal max-w-4xl mx-auto">
            Connecting <span className="text-primary">Brilliance</span> with Opportunity
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto animate-reveal [animation-delay:200ms] leading-relaxed">
            We source, vet, and match elite tech professionals with forward-thinking companies worldwide, seamless scaling your engineering capacity.
          </p>
        </section>

        {/* CONTENT */}
        <section className="py-24 px-6 bg-zinc-50 dark:bg-zinc-900/50 border-y border-zinc-100 dark:border-zinc-800/50">
          <div className="max-w-4xl mx-auto space-y-20">
            <div>
              <h2 className="text-3xl font-black mb-6 text-foreground tracking-tight">Our Philosophy</h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                Finding the right technical talent shouldn't be a gamble. At Mwenaro Talent, we believe in a rigorous, data-driven approach to technical hiring that goes beyond standard resumes.
              </p>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                By deeply understanding both the engineer's capabilities and the company's culture and technical needs, we ensure a perfect match that drives immediate impact and long-term retention.
              </p>
            </div>
            
            <div>
              <h2 className="text-3xl font-black mb-6 text-foreground tracking-tight">Why Choose Us?</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-zinc-950 p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
                  <h3 className="text-xl font-bold mb-3 text-foreground">Rigorous Vetting</h3>
                  <p className="text-zinc-500 dark:text-zinc-400">Our candidates go through comprehensive technical assessments and behavioral interviews led by senior engineers.</p>
                </div>
                <div className="bg-white dark:bg-zinc-950 p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
                  <h3 className="text-xl font-bold mb-3 text-foreground">Speed to Hire</h3>
                  <p className="text-zinc-500 dark:text-zinc-400">Access our pre-vetted pool of top-tier talent and reduce your time-to-hire from months to days.</p>
                </div>
                <div className="bg-white dark:bg-zinc-950 p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
                  <h3 className="text-xl font-bold mb-3 text-foreground">Global Reach</h3>
                  <p className="text-zinc-500 dark:text-zinc-400">Tap into a diverse, global talent pool unrestricted by geographical boundaries.</p>
                </div>
                <div className="bg-white dark:bg-zinc-950 p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
                  <h3 className="text-xl font-bold mb-3 text-foreground">Ongoing Support</h3>
                  <p className="text-zinc-500 dark:text-zinc-400">We don't just place candidates; we provide ongoing support to ensure smooth onboarding and continuous success.</p>
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
