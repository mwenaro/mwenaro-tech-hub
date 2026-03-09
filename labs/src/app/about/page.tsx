import { NavBar, Footer } from "@mwenaro/ui";

export const metadata = {
  title: "About | Mwenaro Labs",
  description: "Innovative software solutions and bespoke engineering for your enterprise.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar currentApp="labs" />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative pt-48 pb-24 px-6 text-center lg:pt-56 lg:pb-32 bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent -z-10" />
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em] mb-8 ring-1 ring-primary/20 backdrop-blur-sm shadow-sm">
            Mwenaro Labs
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight mb-8 animate-reveal max-w-4xl mx-auto text-foreground">
            Engineering the <span className="text-primary">Future</span> of Business
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-reveal [animation-delay:200ms] leading-relaxed">
            We are a premier software development studio dedicated to building scalable, robust, and intuitive digital products for fast-growing companies and enterprises.
          </p>
        </section>

        {/* CONTENT */}
        <section className="py-24 px-6 border-y border-zinc-200/50 dark:border-zinc-800/50">
          <div className="max-w-4xl mx-auto space-y-20">
            <div>
              <h2 className="text-3xl font-black mb-6 text-foreground tracking-tight">Our Approach</h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                We believe that great software is born from a deep understanding of business goals and user needs. At Mwenaro Labs, we don't just write code; we partner with you to solve complex business challenges through technology.
              </p>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Our agile methodology ensures transparency, adaptability, and continuous delivery of value from concept to deployment.
              </p>
            </div>
            
            <div>
              <h2 className="text-3xl font-black mb-6 text-foreground tracking-tight">Core Competencies</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold mb-3 text-foreground">Custom Architecture</h3>
                  <p className="text-zinc-500 dark:text-zinc-400">Designing highly scalable and resilient system architectures tailored to your specific performance and security requirements.</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold mb-3 text-foreground">Full-Stack Development</h3>
                  <p className="text-zinc-500 dark:text-zinc-400">End-to-end development of web and mobile applications using modern, proven technology stacks.</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold mb-3 text-foreground">Cloud Modernization</h3>
                  <p className="text-zinc-500 dark:text-zinc-400">Migrating legacy systems to the cloud and optimizing infrastructure for maximum efficiency and reduced costs.</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold mb-3 text-foreground">Product Strategy</h3>
                  <p className="text-zinc-500 dark:text-zinc-400">Collaborating on product discovery, user experience mapping, and defining clear technical roadmaps.</p>
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
