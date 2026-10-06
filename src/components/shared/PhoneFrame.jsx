import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Wifi, Battery, Signal } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export function PhoneFrame({ children }) {
  const viewMode = useAppStore((state) => state.viewMode);
  const setViewMode = useAppStore((state) => state.setViewMode);
  const [currentTime, setCurrentTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const isFrame = viewMode === 'mobile-frame';

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-0 md:p-6 transition-colors selection:bg-brand-500 selection:text-white">
      {/* Top Desktop Controls Bar (hidden on small screens) */}
      <div className="hidden md:flex items-center justify-between w-full max-w-[430px] mb-3 px-3 py-2 bg-slate-800/90 rounded-2xl backdrop-blur-md border border-slate-700/60 shadow-lg text-slate-300 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-400 animate-pulse" />
          <span className="font-bold text-white tracking-wide">TemiPay Mobile Preview</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-700/50">
          <button
            type="button"
            onClick={() => setViewMode('mobile-frame')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              isFrame ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Phone</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('full-screen')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              !isFrame ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Full</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div
        className={`w-full bg-slate-50 relative flex flex-col transition-all duration-300 ${
          isFrame
            ? 'md:max-w-[410px] md:h-[860px] md:rounded-[48px] md:shadow-[0_25px_70px_rgba(0,0,0,0.5),0_0_0_12px_#1E293B,0_0_0_14px_#334155] md:overflow-hidden md:border-4 md:border-slate-800'
            : 'max-w-2xl min-h-screen shadow-2xl'
        }`}
      >
        {/* Simulated iOS / Android Status Bar (Visible in phone frame) */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-6 pt-3 pb-1 flex items-center justify-between text-xs font-bold text-slate-800 select-none border-b border-slate-100">
          <span>{currentTime}</span>
          
          {/* Dynamic Island / Notch */}
          <div className="hidden md:block w-24 h-4 bg-slate-900 rounded-full mx-auto" />

          <div className="flex items-center gap-1.5 text-slate-700">
            <Signal className="w-3.5 h-3.5 stroke-[2.5]" />
            <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
            <Battery className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>

        {/* Scrollable screen content */}
        <div className="flex-1 overflow-y-auto overscroll-contain flex flex-col relative hide-scrollbar">
          {children}
        </div>

        {/* Bottom Home Indicator Bar on iOS */}
        <div className="w-full flex justify-center py-1.5 bg-white select-none">
          <div className="w-32 h-1 bg-slate-300 rounded-full" />
        </div>
      </div>
    </div>
  );
}
