import { NavBar, Footer, Button } from "@mwenaro/ui";
import { Mail, MapPin, Phone } from "lucide-react";

export const metadata = {
  title: "Contact | Mwenaro Hub",
  description: "Get in touch with the Mwenaro team.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar currentApp="hub" />

      <main className="flex-1">
        <section className="relative pt-48 pb-24 px-6 lg:pt-56 lg:pb-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background -z-10" />
          
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em] mb-8 ring-1 ring-primary/20 backdrop-blur-sm shadow-sm">
                Get In Touch
              </div>
              <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight mb-6 animate-reveal text-foreground">
                Let's Build Together
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-reveal [animation-delay:200ms] leading-relaxed">
                Whether you're looking to learn, hire, or build—we'd love to hear from you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
              {/* Contact Info */}
              <div className="space-y-12">
                <div className="bg-white dark:bg-zinc-950 p-8 rounded-[2.5rem] border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg">
                  <h2 className="text-2xl font-black mb-8 tracking-tight text-foreground">Contact Information</h2>
                  
                  <div className="space-y-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1 text-foreground">Email</h3>
                        <p className="text-zinc-500 dark:text-zinc-400">hello@mwenaro.co.ke</p>
                        <p className="text-zinc-500 dark:text-zinc-400">support@mwenaro.co.ke</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Phone className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1 text-foreground">Phone</h3>
                        <p className="text-zinc-500 dark:text-zinc-400">+254 (0) 700 000 000</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1 text-foreground">Office</h3>
                        <p className="text-zinc-500 dark:text-zinc-400">Nairobi, Kenya</p>
                        <p className="text-zinc-500 dark:text-zinc-400">Global Remote Team</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white dark:bg-zinc-950 p-8 lg:p-10 rounded-[2.5rem] border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg">
                <h2 className="text-2xl font-black mb-8 tracking-tight text-foreground">Send a Message</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">First Name</label>
                      <input type="text" className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Last Name</label>
                      <input type="text" className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium" placeholder="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Email Address</label>
                    <input type="email" className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium" placeholder="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Subject</label>
                    <select className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium appearance-none">
                      <option>General Inquiry</option>
                      <option>Academy Admissions</option>
                      <option>Hire Talent</option>
                      <option>Labs Project</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Message</label>
                    <textarea rows={4} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium resize-none" placeholder="How can we help you?"></textarea>
                  </div>
                  <Button type="button" size="lg" className="w-full rounded-xl py-4 font-bold text-lg shadow-lg shadow-primary/20">
                    Send Message
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
