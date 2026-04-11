'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AIContextType {
  contextData: any;
  setAIContext: (data: any) => void;
  clearAIContext: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: ReactNode }) {
  const [contextData, setContextData] = useState<any>(null);

  const setAIContext = (data: any) => {
    setContextData(data);
  };

  const clearAIContext = () => {
    setContextData(null);
  };

  return (
    <AIContext.Provider value={{ contextData, setAIContext, clearAIContext }}>
      {children}
    </AIContext.Provider>
  );
}

export function useAIContext() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAIContext must be used within an AIProvider');
  }
  return context;
}
