import React from 'react';
import { NavBar, Footer, Button, Card } from '@mwenaro/ui';
import { LucideFlaskConical, LucideZap, LucideCpu, LucideGlobe, LucideArrowRight, LucideCode2, LucideSparkles } from 'lucide-react';

export default function LabsPage() {
    return (
        <main className="min-h-screen bg-background selection:bg-primary/20">
            <NavBar currentApp="labs" />

            {/* Hero Section - Futuristic & Bold */}
            <section className="relative pt-40 pb-32 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary/10 to-transparent blur-3xl opacity-50" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-8 animate-reveal">
                        <LucideFlaskConical size={14} />
                        Mwenaro Innovation Engine
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black text-foreground tracking-tight mb-8 leading-[1.1] animate-reveal">
                        Building the <span className="gradient-text">Future</span> <br />
                        of Digital Africa
                    </h1>

                    <p className="max-w-2xl mx-auto text-xl text-muted-foreground leading-relaxed mb-12 animate-reveal [animation-delay:200ms]">
                        Mwenaro Labs is our R&D powerhouse. We transform bold ideas into scalable digital solutions, leveraging cutting-edge technology to solve local and global challenges.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-reveal [animation-delay:400ms]">
                        <Button size="lg" className="rounded-full shadow-2xl">
                            Explore Projects <LucideArrowRight className="ml-2" size={20} />
                        </Button>
                        <Button variant="outline" size="lg" className="rounded-full">
                            Partner with Us
                        </Button>
                    </div>
                </div>

                {/* Animated Background Elements */}
                <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px] animate-pulse [animation-delay:1s]" />
            </section>

            {/* Innovation Pillars */}
            <section className="py-24 bg-secondary/5 border-y border-primary/10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <LucideCode2 className="text-primary" size={32} />,
                                title: "Custom Software",
                                desc: "End-to-end development of high-performance web and mobile applications tailored for impact."
                            },
                            {
                                icon: <LucideCpu className="text-primary" size={32} />,
                                title: "AI & Automation",
                                desc: "Integrating intelligent systems and workflows to drive efficiency and smarter decision making."
                            },
                            {
                                icon: <LucideGlobe className="text-primary" size={32} />,
                                title: "Digital Transformation",
                                desc: "Helping organizations navigate the digital age with strategic consulting and implementation."
                            }
                        ].map((pillar, i) => (
                            <div key={i} className="p-8 rounded-[2.5rem] bg-background border border-border shadow-soft group hover:border-primary/30 transition-all duration-500">
                                <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    {pillar.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{pillar.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{pillar.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Projects Grid */}
            <section className="py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-5xl font-black mb-6">Born in the <span className="text-primary">Labs</span>.</h2>
                            <p className="text-lg text-muted-foreground">From internal tools to community-driven platforms, these are the solutions we're currently brewing.</p>
                        </div>
                        <Button variant="ghost" className="text-primary font-bold">View all Archive →</Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <Card className="!p-0 overflow-hidden group">
                            <div className="aspect-video bg-secondary relative">
                                <div className="absolute inset-0 flex items-center justify-center text-white/10">
                                    <LucideSparkles size={120} />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-secondary to-transparent">
                                    <div className="inline-block px-3 py-1 rounded-full bg-primary text-[10px] font-black uppercase tracking-wider mb-4">Internal Tool</div>
                                    <h3 className="text-3xl font-bold text-white mb-2">Mwenaro Flow</h3>
                                    <p className="text-white/70">An AI-powered workforce matching engine for talent coordination.</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="!p-0 overflow-hidden group">
                            <div className="aspect-video bg-primary/20 relative">
                                <div className="absolute inset-0 flex items-center justify-center text-primary/10">
                                    <LucideZap size={120} />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent">
                                    <div className="inline-block px-3 py-1 rounded-full bg-white text-primary text-[10px] font-black uppercase tracking-wider mb-4">Enterprise</div>
                                    <h3 className="text-3xl font-bold text-white mb-2">SafariLink CRM</h3>
                                    <p className="text-white/70">Streamlining logistics for East African regional trade routes.</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Build-With-Us CTA */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="relative rounded-[3rem] bg-secondary p-12 md:p-24 overflow-hidden">
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent pointer-events-none" />

                        <div className="relative z-10 max-w-2xl">
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-8">Have a big idea? <br /><span className="text-primary">Let's build it.</span></h2>
                            <p className="text-xl text-white/70 mb-12 leading-relaxed">
                                We partner with visionary founders and established enterprises to ship digital products that matter. Our labs team is ready to scale your vision.
                            </p>
                            <Button size="lg" className="rounded-full px-10">Start a Conversation</Button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
