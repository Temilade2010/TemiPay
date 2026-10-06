import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Zap, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

const SLIDES = [
  {
    id: 1,
    title: 'Super-Fast & Free Transfers',
    subtitle: 'Send money instantly to any Nigerian bank with zero transfer fees and 99.9% uptime guarantee.',
    icon: Zap,
    badge: '100% Reliable',
    color: 'from-brand-500 to-teal-700',
  },
  {
    id: 2,
    title: 'Grow Your Wealth with 15.5% Interest',
    subtitle: 'Put your money to work in TemiSave Nest. Earn daily compound returns and withdraw whenever you want.',
    icon: Sparkles,
    badge: 'Daily Payouts',
    color: 'from-teal-600 to-emerald-800',
  },
  {
    id: 3,
    title: 'Bank-Grade Security for Peace of Mind',
    subtitle: 'NDIC insured & CBN regulated microfinance bank. Protected by biometric authentication and instant fraud shields.',
    icon: ShieldCheck,
    badge: 'CBN Licensed',
    color: 'from-emerald-600 to-slate-900',
  },
];

export function SplashOnboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/signup');
    }
  };

  const slide = SLIDES[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-brand-900 via-brand-950 to-slate-950 text-white min-h-[700px] select-none relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header: TemiPay brand & Skip */}
      <div className="flex items-center justify-between z-10 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-brand-400 to-teal-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
            <span className="font-extrabold text-white text-base">TP</span>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight leading-none">TemiPay</h1>
            <span className="text-[10px] text-brand-300 font-semibold tracking-wider uppercase">Beyond Banking</span>
          </div>
        </div>

        {currentSlide < SLIDES.length - 1 && (
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-xs font-bold text-slate-300 hover:text-white px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm transition-colors"
          >
            Skip to Login
          </button>
        )}
      </div>

      {/* Center Hero Card / Graphic */}
      <div className="flex-1 flex flex-col items-center justify-center my-6 z-10">
        <div className="relative mb-8">
          {/* Animated rings */}
          <div className="absolute inset-0 rounded-full bg-brand-500/20 animate-ping" />
          <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-brand-600 to-teal-400 p-1 flex items-center justify-center shadow-float relative">
            <div className="w-full h-full rounded-full bg-slate-900/80 backdrop-blur-md flex items-center justify-center">
              <Icon className="w-16 h-16 text-brand-400 stroke-[1.8] animate-pulse-subtle" />
            </div>
          </div>
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-[11px] font-black uppercase px-3 py-0.5 rounded-full shadow-md whitespace-nowrap border border-white/20">
            {slide.badge}
          </span>
        </div>

        <h2 className="text-2xl font-black text-center text-white leading-tight mb-3 px-2">
          {slide.title}
        </h2>
        <p className="text-sm text-slate-300 text-center max-w-xs leading-relaxed px-2">
          {slide.subtitle}
        </p>

        {/* Dots pagination */}
        <div className="flex items-center gap-2 mt-8">
          {SLIDES.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-8 bg-brand-400' : 'w-2 bg-slate-700'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-3 z-10 pb-2">
        <Button
          fullWidth
          size="lg"
          variant="primary"
          onClick={handleNext}
          className="shadow-lg shadow-brand-500/30 font-bold"
        >
          <span>{currentSlide === SLIDES.length - 1 ? 'Get Started' : 'Continue'}</span>
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        <Button
          fullWidth
          size="md"
          variant="ghost"
          onClick={() => navigate('/login')}
          className="text-white hover:bg-white/10 font-bold"
        >
          I already have an account • Log In
        </Button>

        <p className="text-[10px] text-center text-slate-400">
          Licensed by the Central Bank of Nigeria (CBN). Insured by NDIC.
        </p>
      </div>
    </div>
  );
}
