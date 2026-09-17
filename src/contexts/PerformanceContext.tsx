'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface PerformanceConfig {
  particleCount: number;
  maxDPR: number;
  enablePostProcessing: boolean;
  animationFrameRate: number;
  isMobile: boolean;
}

const PerformanceContext = createContext<PerformanceConfig | undefined>(undefined);

export function PerformanceProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<PerformanceConfig>({
    particleCount: 100,
    maxDPR: 1.5,
    enablePostProcessing: false,
    animationFrameRate: 60,
    isMobile: false,
  });

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    let particleCount = 200;
    if (isMobile) {
      particleCount = 50;
    } else if (isSafari) {
      particleCount = 100;
    }

    setConfig({
      particleCount,
      maxDPR: dpr,
      enablePostProcessing: !isMobile && !isSafari,
      animationFrameRate: isMobile ? 30 : 60,
      isMobile,
    });
  }, []);

  return (
    <PerformanceContext.Provider value={config}>
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformance() {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within PerformanceProvider');
  }
  return context;
}
