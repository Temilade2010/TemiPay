import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Eye, EyeOff, Lock, Unlock, ShieldCheck, Globe, Wifi, Copy, Check, ChevronRight } from 'lucide-react';
import { Header } from '../components/shared/Header';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useAppStore } from '../store/useAppStore';

export function CardsPage() {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const showToast = useAppStore((state) => state.showToast);

  const [cardType, setCardType] = useState('virtual'); // 'virtual' | 'physical'
  const [showDetails, setShowDetails] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [onlinePayments, setOnlinePayments] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const cardNumber = '5399 4810 2948 1093';
  const expiry = '09/29';
  const cvv = '842';

  const handleCopyCard = () => {
    navigator.clipboard?.writeText(cardNumber.replace(/\s/g, ''));
    setCopied(true);
    showToast('Card number copied', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleFreeze = () => {
    setIsFrozen(!isFrozen);
    showToast(isFrozen ? 'Card has been unblocked' : 'Card temporarily frozen for safety', isFrozen ? 'success' : 'warning');
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen select-none pb-20">
      <Header
        title="TemiPay Cards"
        subtitle="Virtual & Physical Debit Cards"
        showBack={false}
      />

      <div className="p-4 space-y-4">
        {/* Card Type Selector */}
        <div className="flex p-1 bg-slate-200/80 rounded-2xl">
          <button
            type="button"
            onClick={() => setCardType('virtual')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              cardType === 'virtual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Virtual USD & NGN Card
          </button>
          <button
            type="button"
            onClick={() => setCardType('physical')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              cardType === 'physical' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Physical Debit Card
          </button>
        </div>

        {/* HERO CARD GRAPHIC */}
        <div className={`relative h-56 rounded-3xl p-6 text-white transition-all duration-300 shadow-xl overflow-hidden flex flex-col justify-between ${
          isFrozen 
            ? 'bg-slate-700 grayscale'
            : 'bg-gradient-to-tr from-brand-700 via-teal-800 to-emerald-600 shadow-brand-500/20'
        }`}>
          {/* Card watermark patterns */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          {/* Top row */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-extrabold text-xs">
                TP
              </div>
              <span className="font-extrabold text-sm tracking-tight">TemiPay Platinum</span>
            </div>

            <div className="flex items-center gap-2">
              <Wifi className="w-5 h-5 opacity-80 rotate-90" />
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white/20 backdrop-blur-md border border-white/20">
                {cardType === 'virtual' ? 'Virtual' : 'Physical'}
              </span>
            </div>
          </div>

          {/* Chip and freeze badge */}
          <div className="flex items-center justify-between z-10">
            <div className="w-11 h-8 rounded-lg bg-amber-300/80 border border-amber-200/80 shadow-inner flex items-center justify-center">
              <div className="w-8 h-5 border border-amber-500/40 rounded-sm" />
            </div>

            {isFrozen && (
              <span className="text-[11px] font-bold bg-rose-500 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                <Lock className="w-3.5 h-3.5" /> Frozen
              </span>
            )}
          </div>

          {/* Card Number & details */}
          <div className="z-10 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-lg font-bold tracking-widest">
                {showDetails ? cardNumber : '••••  ••••  ••••  1093'}
              </span>
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="p-1 hover:text-brand-200 transition-colors"
                aria-label="Toggle details"
              >
                {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <div>
                <p className="text-[9px] uppercase tracking-wider text-teal-200 font-bold">Card Holder</p>
                <p className="font-bold tracking-wide uppercase">{user.fullName}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-wider text-teal-200 font-bold">Expires</p>
                <p className="font-bold font-mono">{showDetails ? expiry : '••/••'}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-wider text-teal-200 font-bold">CVV</p>
                <p className="font-bold font-mono">{showDetails ? cvv : '•••'}</p>
              </div>
              <div className="font-black italic text-lg tracking-wider">
                VISA
              </div>
            </div>
          </div>
        </div>

        {/* Quick Card Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyCard}
            icon={copied ? Check : Copy}
          >
            {copied ? 'Copied' : 'Copy Card No.'}
          </Button>

          <Button
            variant={isFrozen ? 'secondary' : 'outline'}
            size="sm"
            onClick={handleToggleFreeze}
            icon={isFrozen ? Unlock : Lock}
          >
            {isFrozen ? 'Unfreeze Card' : 'Freeze Card'}
          </Button>
        </div>

        {/* Card Controls list */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-soft space-y-4 text-xs">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">
            Card Controls & Security
          </h3>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Online International Payments</p>
                <p className="text-[11px] text-slate-400">Works on Netflix, Spotify, Amazon, Apple</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={onlinePayments}
              onChange={() => {
                setOnlinePayments(!onlinePayments);
                showToast(`Online payments ${!onlinePayments ? 'enabled' : 'disabled'}`, 'info');
              }}
              className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center justify-between py-1 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Daily Spend Limit</p>
                <p className="text-[11px] text-slate-400">Maximum ₦500,000 / day</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => showToast('Limit set to ₦500,000', 'info')}
              className="text-xs font-bold text-brand-600 hover:underline"
            >
              Adjust
            </button>
          </div>
        </div>

        {/* Order physical card banner */}
        <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl text-white flex items-center justify-between">
          <div>
            <p className="text-xs font-bold">Need a Physical Card?</p>
            <p className="text-[11px] text-slate-300 mt-0.5">Delivered to your doorstep in 3-5 days</p>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={() => setShowRequestModal(true)}
          >
            Request
          </Button>
        </div>
      </div>

      {/* REQUEST PHYSICAL CARD MODAL */}
      <Modal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        title="Request Physical Debit Card"
      >
        <div className="space-y-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
            <CreditCard className="w-8 h-8 stroke-[2]" />
          </div>
          <h4 className="text-base font-bold text-slate-800">Free Doorstep Delivery</h4>
          <p className="text-xs text-slate-500">
            Your custom TemiPay Chip & PIN card will be dispatched to your registered address in Lagos.
          </p>
          <div className="p-3 bg-slate-50 rounded-2xl text-left text-xs space-y-1 border border-slate-200">
            <p className="text-slate-500">Delivery Address:</p>
            <p className="font-bold text-slate-800">14 Admiralty Way, Lekki Phase 1, Lagos</p>
            <p className="text-brand-600 font-bold mt-1">Delivery Fee: FREE</p>
          </div>
          <Button
            fullWidth
            variant="primary"
            onClick={() => {
              showToast('Physical card order placed! Tracking details sent via SMS.', 'success');
              setShowRequestModal(false);
            }}
          >
            Confirm Card Order
          </Button>
        </div>
      </Modal>
    </div>
  );
}
