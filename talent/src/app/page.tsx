// app/talent/page.tsx
import { NavBar, Footer, Button, Card } from "@mwenaro/ui";
import { Search, ArrowRight, MapPin, Star, Users, ExternalLink, Award } from "lucide-react";

const talents = [
  { name: "Isaac Mwero", role: "Software Engineer", skills: ["Next.js", "TypeScript", "Go", "PostgreSQL"], status: "Ready to Hire", location: "Nairobi, KE" },
  { name: "Jane Smith", role: "Frontend Architect", skills: ["React", "Tailwind", "Figma", "Redux"], status: "Project Ready", location: "Lagos, NG" },
  { name: "Alex Kamau", role: "Product Designer", skills: ["Figma", "Design Systems", "Prototyping"], status: "Available", location: "Kigali, RW" },
];

const stats = [
  { label: "Graduates Hired", val: "500+" },
  { label: "Partner Companies", val: "120+" },
  { label: "Vetting Accuracy", val: "99.2%" },
  { label: "Time to Hire", val: "14 Days" }
];

const statusColorMap: Record<string, string> = {
  "Ready to Hire": "bg-green-500/10 text-green-600 border-green-500/20",
  "Project Ready": "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "Available": "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar currentApp="talent" />

      {/* HERO */}
      <section className="relative pt-40 pb-32 px-6 text-center overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-card text-secondary text-xs font-black uppercase tracking-[0.2em] mb-6 shadow-xl border-secondary/10 animate-reveal">
            <Award size={16} className="text-primary" /> Verified Africa Tech Network
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-[1.1] animate-reveal">
            Connect with <span className="gradient-text">Elite</span> Tech Talent
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-reveal [animation-delay:200ms]">
            We showcase only the top 5% of African tech talent ready to contribute to your projects immediately.
          </p>
          <div className="flex flex-wrap justify-center gap-6 animate-reveal [animation-delay:400ms]">
            <Button size="lg" variant="secondary" className="rounded-full px-10 group">
              Search Talent <Search size={22} className="ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-10 border-foreground/10 text-foreground hover:bg-foreground hover:text-background">
              Partner with Us
            </Button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 bg-secondary text-white border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-16 md:gap-32 items-center">
          {stats.map(stat => (
            <div key={stat.label} className="text-center group">
              <div className="text-3xl font-black mb-1 group-hover:text-primary transition-colors">{stat.val}</div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-white/50">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TALENT SPOTLIGHT */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
            <h2 className="text-4xl md:text-5xl font-black">
              Spotlight: <span className="text-primary italic">Featured</span> Talent
            </h2>
            <Button variant="ghost" className="font-black group">
              View All Portfolios <ArrowRight size={22} className="ml-2 group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {talents.map((talent, i) => (
              <Card key={i} className="flex flex-col">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary to-secondary/80 border-4 border-white shadow-2xl flex items-center justify-center text-white text-3xl font-black">
                    {talent.name.charAt(0)}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${statusColorMap[talent.status]}`}>
                      {talent.status}
                    </span>
                    <div className="flex gap-1 text-orange-400">
                      {[...Array(5)].map((_, s) => <Star key={s} size={12} fill="currentColor" />)}
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-black mb-1">{talent.name}</h3>
                <p className="font-bold text-primary text-sm mb-4">{talent.role}</p>

                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mb-6 tracking-wide uppercase">
                  <MapPin size={14} className="text-secondary" /> {talent.location}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {talent.skills.map(skill => (
                    <span key={skill} className="text-[10px] font-black px-3 py-1.5 rounded-xl bg-white/50 border border-border shadow-sm">{skill}</span>
                  ))}
                </div>

                <Button variant="glass" className="w-full text-secondary hover:text-white hover:bg-secondary">
                  View Portfolio <ExternalLink size={16} className="ml-2" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto glass-card rounded-[3rem] p-16 md:p-20 text-center group border-primary/10">
          <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
            <Users size={40} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">
            Ready to Boost Your <span className="text-secondary font-black">Engineering</span> Team?
          </h2>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
            Access the most vetted junior developers in Africa. Join forward-thinking companies hiring from Mwenaro Academy.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Button size="lg" variant="secondary" className="rounded-full px-10 group">
              Hire Talent Now <ArrowRight size={22} className="ml-2 group-hover:translate-x-2 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-10 border-secondary/10 text-secondary hover:bg-secondary hover:text-white">
              Request Partnership
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}