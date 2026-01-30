import { Button } from '@/components/ui/button'
import {
    Mail,
    Phone,
    MapPin,
    Clock,
    MessageSquare,
    HelpCircle,
    Send,
    Headphones,
    BookOpen,
    Users
} from 'lucide-react'

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-32">
            {/* Hero Section */}
            <header className="relative pt-32 pb-48 overflow-visible bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-primary text-white text-center">
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="container relative z-10 mx-auto px-4">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center mx-auto backdrop-blur-xl border border-white/20 shadow-2xl animate-pulse">
                            <Headphones className="w-10 h-10 text-primary" />
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
                            Get in <span className="text-primary italic">Touch</span>
                        </h1>
                        <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-medium">
                            Have questions about our courses, cohorts, or career placement? We're here to help you every step of the way.
                        </p>
                    </div>
                </div>

                {/* Contact Info Cards */}
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-full max-w-6xl px-4 z-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: Mail,
                                label: 'Email Us',
                                value: 'hello@mwenaro.tech',
                                sub: 'Quick response guaranteed'
                            },
                            {
                                icon: Phone,
                                label: 'Call Us',
                                value: '+254 700 123 456',
                                sub: 'Mon-Fri, 9am - 6pm'
                            },
                            {
                                icon: MapPin,
                                label: 'Visit Us',
                                value: 'Nairobi, Kenya',
                                sub: 'Westlands Tech Hub'
                            },
                            {
                                icon: Clock,
                                label: 'Support 24/7',
                                value: 'Online Community',
                                sub: 'Join the discussion'
                            }
                        ].map((item, i) => (
                            <div key={i} className="p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-xl border border-zinc-100 dark:border-white/5 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">{item.label}</h3>
                                <p className="text-sm font-black text-secondary dark:text-white mb-2">{item.value}</p>
                                <p className="text-[10px] font-bold text-muted-foreground">{item.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            {/* Message Form Section */}
            <section className="pt-56 pb-32">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        {/* Form */}
                        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-[3rem] p-8 lg:p-16 shadow-2xl border border-zinc-100 dark:border-white/5">
                            <div className="max-w-xl space-y-8">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-secondary dark:text-white">Send us a Message</h2>
                                    <p className="text-muted-foreground font-medium">Tell us what you're looking for, and we'll get back to you shortly.</p>
                                </div>
                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Full Name</label>
                                            <input
                                                type="text"
                                                placeholder="John Doe"
                                                className="w-full h-14 px-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-primary font-bold text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Email Address</label>
                                            <input
                                                type="email"
                                                placeholder="john@example.com"
                                                className="w-full h-14 px-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-primary font-bold text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Subject</label>
                                        <input
                                            type="text"
                                            placeholder="Course Enrollment Query"
                                            className="w-full h-14 px-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-primary font-bold text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Message</label>
                                        <textarea
                                            rows={5}
                                            placeholder="Write your message here..."
                                            className="w-full p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-primary font-bold text-sm resize-none"
                                        ></textarea>
                                    </div>
                                    <Button size="lg" className="h-16 w-full md:w-auto px-10 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-xl shadow-primary/20 transition-all hover:-translate-y-1">
                                        Send Message <Send className="ml-2 w-5 h-5" />
                                    </Button>
                                </form>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            <div className="p-8 bg-zinc-900 rounded-[2.5rem] text-white space-y-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full"></div>
                                <h3 className="text-xl font-black relative z-10">How can we help?</h3>
                                <div className="space-y-4 relative z-10">
                                    {[
                                        { icon: MessageSquare, title: 'Live Chat', desc: 'Typical response < 5 min' },
                                        { icon: HelpCircle, title: 'Help Center', desc: 'Browse detailed guides' },
                                        { icon: BookOpen, title: 'Resources', desc: 'Free guides & ebooks' },
                                        { icon: Users, title: 'Community', desc: 'Join 50k+ students' }
                                    ].map((link, i) => (
                                        <button key={i} className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-colors text-left group">
                                            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                <link.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black">{link.title}</p>
                                                <p className="text-[10px] text-white/50">{link.desc}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-8 bg-primary/10 rounded-[2.5rem] border border-primary/20 text-center space-y-4">
                                <p className="text-sm font-bold text-primary">Student Support</p>
                                <h4 className="text-xl font-black text-secondary dark:text-white">Already a student?</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Log in to your dashboard to access dedicated technical support and mentorship.
                                </p>
                                <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black">
                                    Go to Dashboard
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-zinc-100 dark:bg-zinc-900/50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-black text-secondary dark:text-white">Frequently Asked Questions</h2>
                        <p className="text-muted-foreground font-medium">Clear answers to your most common inquiries about Mwenaro Tech.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {[
                            { q: 'How do I enroll in a course?', a: 'Enrolling is simple! Browse our catalog, select a course, and click "Enroll Now". You can start learning immediately after payment.' },
                            { q: 'What is your refund policy?', a: 'We offer a 14-day "No Questions Asked" refund policy if you are not satisfied with your purchase, provided you haven\'t completed more than 20% of the content.' },
                            { q: 'Are the certificates recognized?', a: 'Yes, our certificates are recognized by leading tech companies globally. Each certificate comes with a unique verification ID for LinkedIn.' },
                            { q: 'Can I access the courses on mobile?', a: 'Absolutely! Our platform is fully responsive and optimized for mobile devices, allowing you to learn on the go via any modern browser.' },
                            { q: 'Do you offer seasonal discounts?', a: 'Yes, we frequently run promotions during major tech events and holidays. Sign up for our newsletter to get notified first!' },
                            { q: 'Is there a community for support?', a: 'Yes! Every student gets access to our private Discord community where they can interact with peers, mentors, and instructors.' }
                        ].map((faq, i) => (
                            <div key={i} className="p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-zinc-100 dark:border-white/5 space-y-4 hover:border-primary/30 transition-all">
                                <h3 className="text-lg font-black text-secondary dark:text-white flex items-start gap-3">
                                    <span className="mt-1 w-6 h-6 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs">Q</span>
                                    {faq.q}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed pl-9">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
