import { NavBar, Footer, Button } from "@mwenaro/ui";
import { Briefcase, Building2, UserCircle } from "lucide-react";

export const metadata = {
  title: "Contact | Mwenaro Talent",
  description: "Reach out to hire elite tech talent or join our talent network.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar currentApp="talent" />

      <main className="flex-1">
        <section className="relative pt-48 pb-24 px-6 lg:pt-56 lg:pb-32 bg-zinc-950 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-zinc-950 to-zinc-950 -z-10" />
          
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em] mb-8 ring-1 ring-primary/20 backdrop-blur-sm shadow-sm">
                Connect With Us
              </div>
              <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight mb-6 animate-reveal">
                Ready to <span className="text-primary">Scale</span>?
              </h1>
              <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto animate-reveal [animation-delay:200ms] leading-relaxed">
                Whether you're looking to hire top-tier developers or you're an engineer looking for your next big role, we're here to help.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
              {/* Inquiry Types */}
              <div className="space-y-8 animate-reveal [animation-delay:300ms]">
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl hover:border-primary/50 transition-colors group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold">For Companies</h3>
                  </div>
                  <p className="text-zinc-400 mb-6">Looking to accelerate your product development with vetted engineers?</p>
                  <a href="mailto:hire@mwenaro.co.ke" className="text-primary font-bold hover:underline">hire@mwenaro.co.ke</a>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl hover:border-primary/50 transition-colors group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                      <UserCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold">For Talent</h3>
                  </div>
                  <p className="text-zinc-400 mb-6">Are you a world-class developer ready for your next big challenge?</p>
                  <a href="mailto:apply@mwenaro.co.ke" className="text-primary font-bold hover:underline">apply@mwenaro.co.ke</a>
                </div>
                
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl hover:border-primary/50 transition-colors group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold">General Inquiries</h3>
                  </div>
                  <p className="text-zinc-400 mb-6">Have questions about our talent network or processes?</p>
                  <a href="mailto:talent@mwenaro.co.ke" className="text-primary font-bold hover:underline">talent@mwenaro.co.ke</a>
                </div>
              </div>

              {/* Inquiry Form */}
              <div className="bg-zinc-900 p-8 lg:p-10 rounded-[2.5rem] border border-zinc-800 shadow-xl animate-reveal [animation-delay:400ms]">
                <h2 className="text-2xl font-black mb-8 tracking-tight">Drop us a line</h2>
                <form className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-300">Name</label>
                    <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium" placeholder="Your Name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-300">Email</label>
                    <input type="email" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium" placeholder="you@company.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-300">I am a...</label>
                    <select className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium appearance-none">
                      <option>Company looking to hire</option>
                      <option>Developer looking for work</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-300">Message</label>
                    <textarea rows={4} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium resize-none" placeholder="Tell us about what you need..."></textarea>
                  </div>
                  <Button type="button" size="lg" className="w-full rounded-xl py-4 font-bold text-lg shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white">
                    Submit Request
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
