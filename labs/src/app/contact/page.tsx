import { NavBar, Footer, Button } from "@mwenaro/ui";
import { Code2, Rocket, MessagesSquare } from "lucide-react";

export const metadata = {
  title: "Contact | Mwenaro Labs",
  description: "Discuss your next big project with our engineering team.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar currentApp="labs" />

      <main className="flex-1">
        <section className="relative pt-48 pb-24 px-6 lg:pt-56 lg:pb-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background -z-10" />
          
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em] mb-8 ring-1 ring-primary/20 backdrop-blur-sm shadow-sm">
                Start a Project
              </div>
              <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight mb-6 animate-reveal text-foreground">
                Let's Build Something <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">Amazing</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-reveal [animation-delay:200ms] leading-relaxed">
                Tell us about your technical challenges or product ideas, and our team will get back to you with a plan.
              </p>
            </div>

            <div className="grid md:grid-cols-12 gap-12 lg:gap-20">
              
              {/* Info sidebar */}
              <div className="md:col-span-5 space-y-8 animate-reveal [animation-delay:300ms]">
                <div className="bg-white dark:bg-zinc-950 p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                  <Rocket className="w-10 h-10 text-primary mb-6" />
                  <h3 className="text-2xl font-bold mb-2 text-foreground">Project Discovery</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">Schedule a free 30-minute consultation to discuss your vision and technical requirements.</p>
                  <a href="mailto:labs@mwenaro.co.ke" className="text-primary font-bold hover:underline flex items-center gap-2">
                    labs@mwenaro.co.ke
                  </a>
                </div>

                <div className="bg-white dark:bg-zinc-950 p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                  <Code2 className="w-10 h-10 text-primary mb-6" />
                  <h3 className="text-2xl font-bold mb-2 text-foreground">Technical Audit</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">Need help scaling your current architecture? We offer comprehensive technical audits.</p>
                  <a href="mailto:audit@mwenaro.co.ke" className="text-primary font-bold hover:underline flex items-center gap-2">
                    audit@mwenaro.co.ke
                  </a>
                </div>
              </div>

              {/* Form */}
              <div className="md:col-span-7 bg-white dark:bg-zinc-950 p-8 lg:p-10 rounded-[2.5rem] border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl animate-reveal [animation-delay:400ms]">
                <div className="flex items-center gap-3 mb-8">
                  <MessagesSquare className="w-8 h-8 text-primary" />
                  <h2 className="text-2xl font-black tracking-tight text-foreground">Project Details</h2>
                </div>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">First Name</label>
                      <input type="text" className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium" placeholder="Jane" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Last Name</label>
                      <input type="text" className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium" placeholder="Smith" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Company / Organization</label>
                    <input type="text" className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium" placeholder="Acme Corp" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Work Email</label>
                    <input type="email" className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium" placeholder="jane@acme.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Project Budget Range</label>
                    <select className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium appearance-none">
                      <option>Under $10,000</option>
                      <option>$10,000 - $50,000</option>
                      <option>$50,000 - $100,000</option>
                      <option>Over $100,000</option>
                      <option>Not sure yet</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Project Description</label>
                    <textarea rows={5} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium resize-none" placeholder="Give us a brief overview of what you're trying to build..."></textarea>
                  </div>
                  
                  <Button type="button" size="lg" className="w-full rounded-xl py-4 font-bold text-lg shadow-lg shadow-primary/20 mt-4">
                    Send Inquiry
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
