import React from 'react';
import { cn } from '../lib/utils';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    glass?: boolean;
    hover?: boolean;
}

export const Card = ({ children, className, glass = true, hover = true }: CardProps) => {
    return (
        <div
            className={cn(
                'rounded-[2rem] p-8 transition-all duration-500 overflow-hidden relative group',
                glass ? 'glass-card' : 'bg-card border border-border shadow-md',
                hover && 'hover:scale-[1.02] hover:shadow-2xl hover:border-primary/20',
                className
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative z-10">{children}</div>
        </div>
    );
};
