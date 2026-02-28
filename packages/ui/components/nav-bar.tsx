import React from 'react';
import { BrandLogo } from './brand-logo';
import { Button } from './button';
import { cn } from '../lib/utils';
import { ecosystem } from '@mwenaro/config/ecosystem';

interface NavBarProps {
  currentApp?: 'hub' | 'academy' | 'talent' | 'labs';
  ctaLabel?: string;
  ctaHref?: string;
}

export const NavBar = ({
  currentApp = 'hub',
  ctaLabel,
  ctaHref,
}: NavBarProps) => {

  const links = [
    { name: 'Hub', href: ecosystem.hub, active: currentApp === 'hub' },
    { name: 'Academy', href: ecosystem.academy, active: currentApp === 'academy' },
    { name: 'Talent', href: ecosystem.talent, active: currentApp === 'talent' },
    { name: 'Labs', href: ecosystem.labs, active: currentApp === 'labs' },
  ];

  const defaultCTA = {
    label: currentApp === 'academy' ? 'My Courses' : 'Get Started',
    href:
      ctaHref ||
      (currentApp === 'academy'
        ? `${ecosystem.academy}/login`
        : ecosystem.hub),
    variant: currentApp === 'academy' ? 'primary' : 'secondary',
  };

  const subtexts = {
    hub: 'Innovation Hub',
    academy: 'Tech Academy',
    talent: 'Talent Network',
    labs: 'Innovation Labs',
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <a href={ecosystem.hub} className="hover:opacity-80 transition-opacity">
          <BrandLogo subtext={subtexts[currentApp]} />
        </a>

        {/* Navigation Links */}
        <ul className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className={cn(
                  'text-sm font-bold tracking-wide transition-all duration-300 relative group',
                  link.active
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {link.name}
                <span
                  className={cn(
                    'absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300',
                    link.active ? 'w-full' : 'w-0 group-hover:w-full'
                  )}
                />
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="flex items-center gap-6">
          <Button
            variant={defaultCTA.variant as any}
            size="sm"
            className="rounded-full px-8 shadow-primary/20"
            as="a"
            href={defaultCTA.href}
          >
            {ctaLabel || defaultCTA.label}
          </Button>
        </div>
      </div>
    </nav>
  );
};