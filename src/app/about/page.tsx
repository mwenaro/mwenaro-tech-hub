import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
    Target,
    Users,
    Lightbulb,
    BookOpen,
    ChevronRight,
    Award,
    Rocket,
    Globe
} from 'lucide-react'

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Hero Section */}
            <header className="relative pt-32 pb-48 overflow-visible bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-primary text-white text-center">
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="container relative z-10 mx-auto px-4">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                            <Rocket className="w-3 h-3 text-primary" />
                            Our Mission
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
                            Empowering the Next Generation of <span className="text-primary italic">Tech Talent</span>
                        </h1>
                        <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-medium">
                            We're more than just an academy. We're a launchpad for careers in the digital age, combining expert-led instruction with AI-powered personalized learning.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 pt-4">
                            <Button size="lg" className="h-14 px-8 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-xl shadow-primary/20 transition-all hover:-translate-y-1">
                                Join Our Community <ChevronRight className="ml-2 w-5 h-5" />
                            </Button>
                            <Button variant="outline" size="lg" className="h-14 px-8 border-white/20 hover:bg-white/10 text-white font-black rounded-2xl backdrop-blur-md">
                                Learn More
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Decorative floating stats */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 z-20 hidden lg:block">
                    <div className="grid grid-cols-3 gap-8">
                        {[
                            { label: 'Active Students', value: '10k+' },
                            { label: 'Courses Published', value: '150+' },
                            { label: 'Hiring Partners', value: '200+' }
                        ].map((stat, i) => (
                            <div key={i} className="p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-3xl border border-zinc-100 dark:border-white/5 text-center transition-transform hover:-translate-y-2">
                                <p className="text-3xl font-black text-secondary dark:text-white mb-1">{stat.value}</p>
                                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            {/* Our Story Section */}
            <section className="py-32 lg:pt-56 lg:pb-32 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
                            <div className="space-y-4">
                                <h2 className="text-4xl md:text-5xl font-black text-secondary dark:text-white leading-tight">
                                    Our Story: From a Small Vision to a <span className="text-primary">Global Movement</span>
                                </h2>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    Founded in 2024, Mwenaro Tech Academy started with a simple belief: high-quality tech education should be accessible, practical, and future-proof.
                                </p>
                            </div>
                            <div className="space-y-6">
                                <p className="text-muted-foreground">
                                    We began by offering specialized web development bootcamps in Nairobi. Today, we've expanded globally, leveraging cutting-edge AI to personalize the learning experience for every single student.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        'Industry-expert instructors with real-world experience',
                                        'Curriculum designed for immediate career impact',
                                        'AI-driven feedback and personalized project marking',
                                        'Direct connections to global hiring partners'
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 group">
                                            <div className="mt-1 w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                <ChevronRight className="w-3 h-3" />
                                            </div>
                                            <span className="text-sm font-bold text-secondary/80 dark:text-white/80">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="relative animate-in fade-in slide-in-from-right duration-1000">
                            <div className="rounded-[3rem] overflow-hidden shadow-3xl border border-zinc-200 dark:border-white/5">
                                <img
                                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800"
                                    alt="Students collaborating"
                                    className="w-full aspect-square object-cover"
                                />
                            </div>
                            {/* Floating social proof badge */}
                            <div className="absolute -bottom-8 -left-8 p-6 bg-white dark:bg-zinc-900 rounded-3xl shadow-3xl border border-zinc-100 dark:border-white/5 max-w-[200px] animate-bounce-slow">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                                        <Award className="w-6 h-6" />
                                    </div>
                                    <p className="text-xl font-black">5,000+</p>
                                </div>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-normal">
                                    Career Placements Worldwide
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="py-32 bg-zinc-100 dark:bg-zinc-900/50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-black text-secondary dark:text-white">Our Core Values</h2>
                        <p className="text-muted-foreground font-medium">The principles that guide every course and interaction at Mwenaro Tech.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                title: 'Quality First',
                                desc: 'We never compromise on the depth and accuracy of our learning materials.',
                                icon: Target,
                                color: 'bg-blue-500'
                            },
                            {
                                title: 'Student Success',
                                desc: "Your career goals are our primary metric of success. We're here for your wins.",
                                icon: Users,
                                color: 'bg-primary'
                            },
                            {
                                title: 'Innovation',
                                desc: 'We embrace the latest tools, including AI, to make learning more efficient.',
                                icon: Lightbulb,
                                color: 'bg-purple-500'
                            },
                            {
                                title: 'Practical Skills',
                                desc: 'Theory is good, but hands-on projects are what get you hired in today\'s market.',
                                icon: BookOpen,
                                color: 'bg-green-500'
                            }
                        ].map((value, i) => (
                            <div key={i} className="group p-10 bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-xl border border-zinc-100 dark:border-white/5 hover:border-primary/30 transition-all hover:-translate-y-2">
                                <div className={`w-14 h-14 ${value.color} rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform`}>
                                    <value.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-black mb-4">{value.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed leading-7">
                                    {value.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Meet Our Team */}
            <section className="py-32">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-black text-secondary dark:text-white">Meet Our Visionaries</h2>
                        <p className="text-muted-foreground font-medium">The experts behind our industry-leading curriculum and AI integration.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {[
                            { name: 'Alex Mwero', role: 'Founder & CEO', bio: 'Former Senior Engineer at Google with a passion for accessible education.', img: 'https://i.pravatar.cc/300?u=alex' },
                            { name: 'Sarah Johnson', role: 'Head of Curriculum', bio: '15+ years in instructional design and educational psychology.', img: 'https://i.pravatar.cc/300?u=sarah' },
                            { name: 'David Chen', role: 'Chief AI Architect', bio: 'Pioneer in adaptive learning systems and large language model integration.', img: 'https://i.pravatar.cc/300?u=david' },
                            { name: 'Emily Rodriguez', role: 'Student Success Lead', bio: 'Expert in career coaching and industry placement for tech talent.', img: 'https://i.pravatar.cc/300?u=emily' }
                        ].map((person, i) => (
                            <div key={i} className="text-center space-y-6 group">
                                <div className="relative mx-auto w-48 h-48 lg:w-56 lg:h-56">
                                    <div className="absolute inset-0 bg-primary/10 rounded-full scale-110 group-hover:scale-125 transition-transform duration-500 blur-2xl"></div>
                                    <img
                                        src={person.img}
                                        alt={person.name}
                                        className="relative rounded-full w-full h-full object-cover border-4 border-white dark:border-zinc-800 shadow-2xl transition-transform group-hover:scale-105 duration-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-secondary dark:text-white">{person.name}</h3>
                                    <p className="text-xs font-black text-primary uppercase tracking-[0.2em]">{person.role}</p>
                                    <p className="text-sm text-muted-foreground max-w-[200px] mx-auto leading-relaxed">
                                        {person.bio}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="pb-32 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="relative p-12 lg:p-24 rounded-[4rem] bg-gradient-to-br from-primary via-primary to-orange-500 overflow-hidden text-center text-white">
                        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                        <div className="relative z-10 space-y-10">
                            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
                                Ready to Transform Your Career Today?
                            </h2>
                            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed font-bold">
                                Join thousands of students already learning and growing with Mwenaro Tech Academy. Your journey to tech mastery starts here.
                            </p>
                            <div className="flex flex-wrap justify-center gap-6">
                                <Link href="/signup">
                                    <Button size="lg" className="h-16 px-10 bg-white text-primary hover:bg-zinc-100 font-black rounded-2xl shadow-xl transition-all hover:-translate-y-1">
                                        Get Started For Free
                                    </Button>
                                </Link>
                                <Link href="/contact">
                                    <Button variant="outline" size="lg" className="h-16 px-10 border-white/30 hover:bg-white/10 text-white font-black rounded-2xl">
                                        Talk to an Advisor
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
