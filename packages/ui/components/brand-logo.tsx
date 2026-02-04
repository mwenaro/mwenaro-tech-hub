import React from 'react';
import { LucideCommand } from 'lucide-react';

export const BrandLogo = ({ className = "" }: { className?: string }) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white shadow-xl shadow-primary/20 rotate-3 hover:rotate-0 transition-transform duration-500">
                <LucideCommand size={28} />
            </div>
            <div className="flex flex-col -gap-1">
                <span className="text-xl font-black tracking-tight text-foreground leading-none">
                    Mwenaro<span className="text-primary">.Tech</span>
                </span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Innovation Hub
                </span>
            </div>
        </div>
    );
};
