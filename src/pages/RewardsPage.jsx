import React, { useState } from 'react';
import { Gift, Sparkles, Trophy, Share2, Copy, Check, CheckCircle2, RotateCw } from 'lucide-react';
import { Header } from '../components/shared/Header';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../store/useAppStore';
import { formatNaira } from '../utils/formatters';

export function RewardsPage() {
  const user = useAppStore((state) => state.user);
  const addTransaction = useAppStore((state) => state.addTransaction);
  const showToast = useAppStore((state) => state.showToast);

  const [checkedInDays, setCheckedInDays] = useState([1, 2, 3]);
  const [canCheckInToday, setCanCheckInToday] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(null);
  const [copiedRef, setCopiedRef] = useState(false);

  const referralCode = 'TEMI8849';

  // Handle Daily Check-in
  const handleDailyCheckIn = () => {
    if (!canCheckInToday) return;
    const todayReward = 150;
    addTransaction({
      type: 'REWARD',
      title: 'Daily Check-in Reward (Day 4)',
      category: 'Money In',
      amount: todayReward,
      fee: 0,
      narration: 'TemiPay Daily Streak Bonus',
    });

    setCheckedInDays([...checkedInDays, 4]);
    setCanCheckInToday(false);
    showToast(`Claimed +₦${todayReward} daily streak bonus!`, 'success');
  };

  // Handle Spin Wheel
  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSpinResult(null);

    const outcomes = [100, 250, 500, 1000, 50];
    const prize = outcomes[Math.floor(Math.random() * outcomes.length)];

    setTimeout(() => {
      setIsSpinning(false);
      setSpinResult(prize);
      addTransaction({
        type: 'REWARD',
        title: 'Lucky Wheel Spin Win',
        category: 'Money In',
        amount: prize,
        fee: 0,
        narration: 'Golden Spin Reward',
      });
      showToast(`🎉 You won ₦${prize}! Added to wallet.`, 'success');
    }, 2000);
  };

  const handleCopyRef = () => {
    navigator.clipboard?.writeText(referralCode);
    setCopiedRef(true);
    showToast('Referral code copied!', 'info');
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen select-none pb-20">
      <Header
        title="TemiPay Rewards"
        subtitle="Daily Cash, Bonuses & Referrals"
        showBack={false}
      />

      <div className="p-4 space-y-4">
        {/* HERO CASHBACK BANNER */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 rounded-3xl p-5 text-white shadow-card flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full border border-white/20">
              Total Cashback Earned
            </span>
            <h2 className="text-3xl font-black tracking-tight mt-1">
              {formatNaira(user.cashbackBalance)}
            </h2>
            <p className="text-xs text-amber-100 mt-0.5">
              Ready to spend on Airtime, Data or Transfers
            </p>
          </div>
          <div className="w-14 h-14 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl">
            🎁
          </div>
        </div>

        {/* DAILY CHECK-IN STREAK */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-800">Daily Check-in Streak</h3>
              <p className="text-[11px] text-slate-400">Check in every day to claim increasing cash rewards</p>
            </div>
            <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-xl">
              Day 4 of 7
            </span>
          </div>

          {/* 7 Days pills */}
          <div className="grid grid-cols-7 gap-1.5 pt-1">
            {[
              { day: 1, reward: 50 },
              { day: 2, reward: 100 },
              { day: 3, reward: 120 },
              { day: 4, reward: 150 },
              { day: 5, reward: 200 },
              { day: 6, reward: 300 },
              { day: 7, reward: 500 },
            ].map((d) => {
              const isDone = checkedInDays.includes(d.day);
              const isToday = d.day === 4;

              return (
                <div
                  key={d.day}
                  className={`flex flex-col items-center p-2 rounded-2xl border text-center transition-all ${
                    isDone
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : isToday
                      ? 'bg-brand-50 border-brand-500 text-brand-900 ring-2 ring-brand-500/30'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <span className="text-[10px] font-bold">D{d.day}</span>
                  <span className="text-sm my-1">{isDone ? '✓' : '🪙'}</span>
                  <span className="text-[10px] font-black">+{d.reward}</span>
                </div>
              );
            })}
          </div>

          <Button
            fullWidth
            variant={canCheckInToday ? 'primary' : 'secondary'}
            size="md"
            disabled={!canCheckInToday}
            onClick={handleDailyCheckIn}
          >
            {canCheckInToday ? 'Check In Today (+₦150)' : 'Checked In for Today! Come Back Tomorrow'}
          </Button>
        </div>

        {/* LUCKY SPIN WHEEL */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-soft text-center space-y-4">
          <div className="flex items-center justify-between text-left">
            <div>
              <h3 className="text-sm font-black text-slate-800">Golden Wheel Spin</h3>
              <p className="text-[11px] text-slate-400">Spin to win up to ₦10,000 instant cash</p>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
              1 Free Spin
            </span>
          </div>

          {/* Animated Spinner Graphic */}
          <div className="relative w-44 h-44 mx-auto flex items-center justify-center my-2">
            <div
              className={`w-full h-full rounded-full border-8 border-amber-400 p-2 bg-gradient-to-tr from-amber-500 via-yellow-400 to-orange-500 shadow-xl transition-transform duration-[2000ms] ${
                isSpinning ? 'rotate-[1440deg] ease-out' : ''
              }`}
            >
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-black">
                {spinResult ? `₦${spinResult}` : 'SPIN & WIN'}
              </div>
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2 w-4 h-5 bg-rose-500 clip-triangle shadow-md" />
          </div>

          <Button
            fullWidth
            variant="accent"
            size="md"
            isLoading={isSpinning}
            onClick={handleSpinWheel}
            icon={RotateCw}
          >
            Spin the Wheel Now
          </Button>
        </div>

        {/* REFER AND EARN */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-soft space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl font-bold">
              👥
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800">Refer & Earn ₦1,000</h3>
              <p className="text-[11px] text-slate-400">Invite your friends to experience TemiPay</p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Your Referral Code</span>
              <p className="text-base font-black font-mono text-slate-900">{referralCode}</p>
            </div>
            <button
              type="button"
              onClick={handleCopyRef}
              className="px-3 py-1.5 bg-brand-500 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-brand-600 transition-colors"
            >
              {copiedRef ? 'Copied' : 'Copy Code'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
