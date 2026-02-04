import React from 'react';
import { BrandLogo } from './brand-logo';
import { Button } from './button';
import { cn } from '../lib/utils';

export const NavBar = ({ currentApp = 'hub' }: { currentApp?: 'hub' | 'academy' | 'talent' | 'labs' }) => {
    const links = [
        { name: 'Hub', href: '/', active: currentApp === 'hub' },
        { name: 'Academy', href: '/academy', active: currentApp === 'academy' },
        { name: 'Talent', href: '/talent', active: currentApp === 'talent' },
        { name: 'Labs', href: '/labs', active: currentApp === 'labs' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <a href="/" className="hover:opacity-80 transition-opacity">
                    <BrandLogo />
                </a>

                <div className="hidden md:flex items-center gap-10">
                    {links.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "text-sm font-bold tracking-wide transition-all duration-300 relative group",
                                link.active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {link.name}
                            <span className={cn(
                                "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
                                link.active ? "w-full" : "w-0 group-hover:w-full"
                            )} />
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-6">
                    {currentApp === 'academy' ? (
                        <a href="/login" className="text-sm font-bold hover:text-primary transition-colors">Sign In</a>
                    ) : null}
                    <Button
                        variant={currentApp === 'academy' ? 'primary' : 'secondary'}
                        size="sm"
                        className="rounded-full px-8 shadow-primary/20"
                    >
                        {currentApp === 'academy' ? 'My Courses' : 'Get Started'}
                    </Button>
                </div>
            </div>
        </nav>
    );
};
