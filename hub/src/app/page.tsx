// import { hubContent } from "../content/hubContent";
import { hubContent } from "@mwenaro/content/hub-content"
import { Button, Card, NavBar, Footer } from "@mwenaro/ui";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar currentApp="hub" />

      {/* HERO */}
      <section className="relative pt-40 pb-32 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
          {hubContent.hero.badge}
        </div>
        <h1 className="text-6xl md:text-8xl font-black leading-tight mb-6 animate-reveal">
          {hubContent.hero.title}
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 animate-reveal [animation-delay:200ms]">
          {hubContent.hero.description}
        </p>
        <div className="flex flex-wrap justify-center gap-6 animate-reveal [animation-delay:400ms]">
          {hubContent.hero.ctas.map((cta) => (
            <Button
              key={cta.text}
              as="a"
              href={cta.href}
              size="lg"
              className={`rounded-full px-10 group ${cta.type === "primary" ? "bg-primary" : "border-foreground/10 text-foreground hover:bg-foreground hover:text-background"}`}
            >
              {cta.text} <ArrowRight size={22} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          ))}
        </div>
      </section>

      {/* 3-PILLAR ECOSYSTEM */}
      <section className="py-32 px-6 bg-secondary/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-16 text-center">
            A Unified <span className="text-primary italic">Ecosystem</span> for Tech Excellence
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {hubContent.pillars.map((pillar) => (
              <Card key={pillar.name} className="flex flex-col items-start text-left p-10 hover:shadow-xl transition-shadow">
                <div className={`w-20 h-20 rounded-2xl ${pillar.color} flex items-center justify-center text-white mb-6`}>
                  {pillar.icon}
                </div>
                <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-2">{pillar.name}</h3>
                <h4 className="text-2xl font-black mb-4">{pillar.headline}</h4>
                <p className="text-muted-foreground mb-6">{pillar.subtext}</p>
                <a href={pillar.href} className="mt-auto flex items-center gap-2 font-black text-primary hover:underline">
                  {pillar.cta} <ArrowRight size={18} />
                </a>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* LIFECYCLE */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-20 animate-reveal">
            The <span className="text-primary">Mwenaro Lifecycle</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {hubContent.lifecycle.map((item, index) => (
              <div key={item.step} className="flex flex-col items-center animate-reveal" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center mb-6 border-4 border-background">
                  {item.icon}
                </div>
                <h4 className="text-2xl font-black mb-4">{item.name}</h4>
                <p className="text-muted-foreground px-4">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY MWENARO */}
      <section className="py-24 px-6 border-y border-foreground/5 bg-foreground/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-black mb-6 animate-reveal">
            {hubContent.whyMwenaro.headline}
          </h2>
          <p className="text-muted-foreground font-medium tracking-wide animate-reveal [animation-delay:200ms]">
            {hubContent.whyMwenaro.description}
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 px-6 bg-primary/10 text-center relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-5xl md:text-6xl font-black mb-6 animate-reveal">
            {hubContent.finalCTA.headline}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-reveal [animation-delay:200ms]">
            {hubContent.finalCTA.description}
          </p>
          <div className="flex flex-wrap justify-center gap-6 animate-reveal [animation-delay:400ms]">
            {hubContent.finalCTA.ctas.map((cta) => (
              <Button
                key={cta.text}
                as="a"
                href={cta.href}
                size="lg"
                className={`rounded-full px-12 ${cta.type === "primary" ? "bg-primary" : "border-foreground/10 text-foreground hover:bg-foreground hover:text-background"}`}
              >
                {cta.text}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}