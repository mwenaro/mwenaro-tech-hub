import { NavBar, Footer, Button, Card } from "@mwenaro/ui";
import {
    Search,
    MapPin,
    ShieldCheck,
    Rocket,
    Building2,
    ArrowRight,
    UserCheck,
    Code2,
    Trophy,
    Users,
    Star,
    ExternalLink,
    Award
} from "lucide-react";

export default function Home() {
    const talents = [
        { name: "Isaac Mwero", role: "Software Engineer", skills: ["Next.js", "Typescript", "Go", "PostgreSQL"], status: "Ready to Hire", location: "Nairobi, KE" },
        { name: "Jane Smith", role: "Frontend Architect", skills: ["React", "Tailwind", "Figma", "Redux"], status: "Project Ready", location: "Lagos, NG" },
        { name: "Alex Kamau", role: "Product Designer", skills: ["Figma", "Design Systems", "Prototyping"], status: "Available", location: "Kigali, RW" },
    ];

    const benefits = [
        { icon: <ShieldCheck className="text-primary" size={32} />, title: "Elite Vetting", text: "Every graduate has passed multi-round technical assessments and project reviews by senior engineers." },
        { icon: <Rocket className="text-secondary" size={32} />, title: "Production Ready", text: "Trained in the modern stacks and agile workflows used by top global tech companies." },
        { icon: <Building2 className="text-orange-500" size={32} />, title: "Cultural Fit", text: "Equipped with the soft skills and professional etiquette needed to lead and collaborate effectively." }
    ];

    return (
        <div className="min-h-screen bg-background">
            <NavBar currentApp="talent" />

            {/* HERO SECTION */}
            <section className="relative pt-40 pb-32 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent pointer-events-none -z-10" />
                <div className="max-w-6xl mx-auto text-center animate-reveal">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-card text-secondary text-xs font-black uppercase tracking-[0.2em] mb-10 shadow-xl border-secondary/10">
                        <Award size={16} className="text-primary" />
                        Verified Africa Tech Network
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tight text-foreground mb-8 leading-[1.1]">
                        Connect with <span className="gradient-text">Elite</span> <br />
                        Tech Talent
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-14 leading-relaxed font-medium">
                        Mwenaro Talent is the bridge between world-class graduates and top-tier companies.
                        We showcase only the top 5% of tech talent in Africa.
                    </p>

                    <div className="flex flex-wrap justify-center gap-6">
                        <Button size="lg" variant="secondary" className="rounded-full px-10 group">
                            Search Talent <Search size={22} className="ml-2" />
                        </Button>
                        <Button size="lg" variant="outline" className="rounded-full px-10 border-foreground/10 text-foreground hover:bg-foreground hover:text-background">
                            Partner with Us
                        </Button>
                    </div>
                </div>
            </section>

            {/* STATS STRIP */}
            <section className="py-12 bg-secondary text-white border-y border-white/5 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-wrap justify-center gap-16 md:gap-32 items-center opacity-70">
                        {[
                            { label: "Graduates Hired", val: "500+" },
                            { label: "Partner Companies", val: "120+" },
                            { label: "Vetting Accuracy", val: "99.2%" },
                            { label: "Time to Hire", val: "14 Days" }
                        ].map(stat => (
                            <div key={stat.label} className="text-center group">
                                <div className="text-3xl font-black mb-1 group-hover:text-primary transition-colors">{stat.val}</div>
                                <div className="text-[10px] uppercase font-bold tracking-widest text-white/50">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* BENEFITS SECTION */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-5xl font-black mb-6">Why Companies Choose <span className="text-primary">Mwenaro</span></h2>
                        <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto">We redefine technical recruiting through rigorous education and active project-based assessment.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {benefits.map((benefit, i) => (
                            <div key={i} className="flex flex-col items-center text-center group">
                                <div className="w-20 h-20 rounded-[2rem] bg-muted border border-border flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:shadow-xl transition-all duration-500">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-2xl font-black mb-4">{benefit.title}</h3>
                                <p className="text-muted-foreground leading-relaxed font-medium">{benefit.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TALENT SPOTLIGHT */}
            <section className="py-32 px-6 bg-muted/30">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-end justify-between gap-10 mb-20">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-5xl font-black mb-6">Spotlight: <span className="text-primary italic">Featured</span> Talent</h2>
                            <p className="text-lg text-muted-foreground font-medium">Explore top-performing graduates from our Academy, vetted for excellence.</p>
                        </div>
                        <Button variant="ghost" className="font-black group">
                            View All Portfolios <ArrowRight size={22} className="ml-2 group-hover:translate-x-2 transition-transform" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {talents.map((talent, i) => (
                            <Card key={i} className="flex flex-col">
                                <div className="flex justify-between items-start mb-10">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary to-secondary/80 border-4 border-white shadow-2xl flex items-center justify-center text-white text-3xl font-black">
                                        {talent.name.charAt(0)}
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-green-500/10 text-green-600 border border-green-500/20">
                                            {talent.status}
                                        </span>
                                        <div className="flex gap-1 text-orange-400">
                                            <Star size={12} fill="currentColor" />
                                            <Star size={12} fill="currentColor" />
                                            <Star size={12} fill="currentColor" />
                                            <Star size={12} fill="currentColor" />
                                            <Star size={12} fill="currentColor" />
                                        </div>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black mb-1">{talent.name}</h3>
                                <p className="font-bold text-primary text-sm mb-6">{talent.role}</p>

                                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mb-10 tracking-wide uppercase">
                                    <MapPin size={14} className="text-secondary" /> {talent.location}
                                </div>

                                <div className="flex flex-wrap gap-2 mb-12">
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
            <section className="py-32 px-6">
                <div className="max-w-5xl mx-auto glass-card rounded-[4rem] p-16 md:p-24 text-center group border-primary/10">
                    <div className="w-24 h-24 rounded-[2.5rem] bg-primary/10 flex items-center justify-center text-primary mx-auto mb-10 group-hover:scale-110 transition-transform duration-500">
                        <Users size={48} />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Ready to Boost Your <span className="text-secondary font-black">Engineering</span> Team?</h2>
                    <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto mb-16 leading-relaxed">
                        Join dozens of forward-thinking companies already hiring from Mwenaro Academy.
                        Get access to the most vetted junior developers in the African market.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6">
                        <Button size="lg" variant="secondary" className="rounded-full px-12 group">
                            Hire Talent Now <ArrowRight size={22} className="ml-2 group-hover:translate-x-2 transition-transform" />
                        </Button>
                        <Button size="lg" variant="outline" className="rounded-full px-12 border-secondary/10 text-secondary hover:bg-secondary hover:text-white">
                            Request Partnership
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
