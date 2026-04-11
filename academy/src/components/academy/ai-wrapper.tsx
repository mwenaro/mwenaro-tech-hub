'use client';

import { usePathname } from 'next/navigation';
import { AcademyAI } from './academy-ai';

export function AcademyAIWrapper() {
  const pathname = usePathname();

  // If we are in the learning portal/dashboard, be a Tutor
  if (pathname?.startsWith('/learn') || pathname?.startsWith('/dashboard')) {
    return (
      <AcademyAI 
        name="Mwenaro Tutor" 
        role="tutor" 
        initialMessage="Hello Scholar! I'm your Mwenaro Tutor. I've studied all our curriculum files and I'm ready to help you with code or conceptual questions. What are we studying today?" 
      />
    );
  }

  // If we are on public pages (courses, about, landing), be Support
  return (
    <AcademyAI 
      name="Academy Support" 
      role="support" 
      initialMessage="Welcome to Mwenaro Academy! I'm here to help with information about our programs, fees, and admissions. How can I assist you today?" 
    />
  );
}
