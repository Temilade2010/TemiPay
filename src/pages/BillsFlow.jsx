import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Zap, Tv, Trophy, CheckCircle2, Copy, Check, Home, ShieldCheck } from 'lucide-react';
import { Header } from '../components/shared/Header';
import { AmountInput } from '../components/ui/AmountInput';
import { PinPad } from '../components/ui/PinPad';
import { BottomSheet } from '../components/ui/BottomSheet';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAppStore } from '../store/useAppStore';
import { ELECTRICITY_DISCOS, CABLE_PROVIDERS, BETTING_PLATFORMS } from '../data/services';
import { validateAmount } from '../utils/validation';
import { formatNaira, formatDate } from '../utils/formatters';

export function BillsFlow() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('tab') || 'electricity';

  const user = useAppStore((state) => state.user);
  const addTransaction = useAppStore((state) => state.addTransaction);
  const showToast = useAppStore((state) => state.showToast);

  const [category, setCategory] = useState(initialCategory); // 'electricity' | 'cable' | 'betting'

  // Electricity state
  const [selectedDisco, setSelectedDisco] = useState(ELECTRICITY_DISCOS[0]);
  const [meterType, setMeterType] = useState('prepaid'); // 'prepaid' | 'postpaid'
  const [meterNumber, setMeterNumber] = useState('45091823901');
  const [meterOwner, setMeterOwner] = useState('OLUWASEUN ADEYEMI (Verified)');
  const [electricityAmount, setElectricityAmount] = useState('5000');

  // Cable state
  const [selectedCable, setSelectedCable] = useState(CABLE_PROVIDERS[0]);
  const [smartcardNumber, setSmartcardNumber] = useState('1094829104');
  const [selectedPackage, setSelectedPackage] = useState(CABLE_PROVIDERS[0].packages[1]);

  // Betting state
  const [selectedBetting, setSelectedBetting] = useState(BETTING_PLATFORMS[0]);
  const [bettingUserId, setBettingUserId] = useState('9812491');
  const [bettingAmount, setBettingAmount] = useState('2000');

  // PIN & processing
  const [showPinSheet, setShowPinSheet] = useState(false);
  const [pinError, setPinError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTx, setCompletedTx] = useState(null);
  const [copiedToken, setCopiedToken] = useState(false);

  const handleProceed = (e) => {
    e.preventDefault();
    let amt = 0;
    if (category === 'electricity') amt = electricityAmount;
    if (category === 'cable') amt = selectedPackage.price;
    if (category === 'betting') amt = bettingAmount;

    const val = validateAmount(amt, user.balance, 100);
    if (!val.valid) {
      showToast(val.message, 'error');
      return;
    }
    setShowPinSheet(true);
  };

  const handlePinSubmit = (enteredPin) => {
    if (enteredPin !== user.pin && enteredPin !== '1234') {
      setPinError('Incorrect PIN. Try 1234.');
      return;
    }
    setPinError('');
    setIsProcessing(true);

    setTimeout(() => {
      let txData = {};
      if (category === 'electricity') {
        const numAmount = parseFloat(electricityAmount);
        // Generate authentic 20-digit prepaid meter token
        const token = Array.from({ length: 5 }, () => Math.floor(1000 + Math.random() * 9000)).join('-');
        txData = {
          type: 'BILL',
          title: `${selectedDisco.name} ${meterType.toUpperCase()}`,
          category: 'Electricity',
          amount: -numAmount,
          fee: 100,
          meterNumber,
          token: meterType === 'prepaid' ? token : null,
          recipient: meterOwner,
        };
      } else if (category === 'cable') {
        txData = {
          type: 'BILL',
          title: `${selectedCable.name} - ${selectedPackage.name}`,
          category: 'Cable TV',
          amount: -selectedPackage.price,
          fee: 0,
          recipient: smartcardNumber,
        };
      } else {
        const numAmount = parseFloat(bettingAmount);
        txData = {
          type: 'BILL',
          title: `${selectedBetting.name} Wallet Funding`,
          category: 'Betting',
          amount: -numAmount,
          fee: 0,
          recipient: `ID: ${bettingUserId}`,
        };
      }

      const tx = addTransaction(txData);
      setCompletedTx(tx);
      setIsProcessing(false);
      setShowPinSheet(false);
    }, 700);
  };

  const handleCopyToken = (tok) => {
    navigator.clipboard?.writeText(tok);
    setCopiedToken(true);
    showToast('Token copied to clipboard', 'info');
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen select-none pb-12">
      <Header
        title={completedTx ? 'Receipt' : 'Bill Payments'}
        subtitle="Electricity • Cable TV • Betting"
        showBack={!completedTx}
        onBack={() => navigate(-1)}
      />

      {!completedTx ? (
        <form onSubmit={handleProceed} className="p-4 space-y-4 flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Category Switcher */}
            <div className="flex p-1 bg-slate-200/80 rounded-2xl">
              <button
                type="button"
                onClick={() => setCategory('electricity')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  category === 'electricity'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Zap className="w-4 h-4 text-emerald-600" />
                <span>Electricity</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('cable')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  category === 'cable'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Tv className="w-4 h-4 text-indigo-600" />
                <span>Cable TV</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('betting')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  category === 'betting'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Trophy className="w-4 h-4 text-rose-600" />
                <span>Betting</span>
              </button>
            </div>

            {/* ELECTRICITY SECTION */}
            {category === 'electricity' && (
              <div className="space-y-4 animate-fade-in">
                {/* Meter Type Pills */}
                <div className="flex gap-2">
                  {['prepaid', 'postpaid'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setMeterType(type)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                        meterType === type
                          ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      {type} Meter
                    </button>
                  ))}
                </div>

                {/* Disco Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Electricity Distribution Company (DISCO)
                  </label>
                  <select
                    value={selectedDisco.id}
                    onChange={(e) => setSelectedDisco(ELECTRICITY_DISCOS.find(d => d.id === e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    {ELECTRICITY_DISCOS.map((disco) => (
                      <option key={disco.id} value={disco.id}>
                        {disco.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Meter Number */}
                <div>
                  <Input
                    label="Meter Number"
                    inputMode="numeric"
                    placeholder="Enter meter number"
                    value={meterNumber}
                    onChange={(e) => setMeterNumber(e.target.value.replace(/\D/g, ''))}
                  />
                  {meterNumber && (
                    <p className="mt-1 text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Customer: {meterOwner}</span>
                    </p>
                  )}
                </div>

                {/* Amount Input */}
                <AmountInput
                  value={electricityAmount}
                  onChange={(val) => setElectricityAmount(val)}
                  availableBalance={user.balance}
                  label="Purchase Amount"
                />
              </div>
            )}

            {/* CABLE TV SECTION */}
            {category === 'cable' && (
              <div className="space-y-4 animate-fade-in">
                {/* Provider Selection */}
                <div className="grid grid-cols-4 gap-2">
                  {CABLE_PROVIDERS.map((cable) => (
                    <button
                      key={cable.id}
                      type="button"
                      onClick={() => {
                        setSelectedCable(cable);
                        setSelectedPackage(cable.packages[0]);
                      }}
                      className={`p-2.5 rounded-2xl border text-center font-bold text-xs transition-all ${
                        selectedCable.id === cable.id
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      {cable.name}
                    </button>
                  ))}
                </div>

                <Input
                  label="Smartcard / UIC Number"
                  inputMode="numeric"
                  placeholder="Enter smartcard number"
                  value={smartcardNumber}
                  onChange={(e) => setSmartcardNumber(e.target.value.replace(/\D/g, ''))}
                />

                {/* Bouquet Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select Bouquet Package
                  </label>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {selectedCable.packages.map((pkg) => (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => setSelectedPackage(pkg)}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                          selectedPackage.id === pkg.id
                            ? 'border-brand-500 bg-brand-50/70 font-bold'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <span className="text-xs text-slate-800">{pkg.name}</span>
                        <span className="text-xs font-black text-brand-700">
                          {formatNaira(pkg.price, { showDecimals: false })}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* BETTING SECTION */}
            {category === 'betting' && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select Bookmaker
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {BETTING_PLATFORMS.slice(0, 6).map((bet) => (
                      <button
                        key={bet.id}
                        type="button"
                        onClick={() => setSelectedBetting(bet)}
                        className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all ${
                          selectedBetting.id === bet.id
                            ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-sm'
                            : 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        {bet.name}
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  label="User ID / Account ID"
                  placeholder="Enter betting user ID"
                  value={bettingUserId}
                  onChange={(e) => setBettingUserId(e.target.value)}
                />

                <AmountInput
                  value={bettingAmount}
                  onChange={(val) => setBettingAmount(val)}
                  availableBalance={user.balance}
                  label="Deposit Amount"
                />
              </div>
            )}
          </div>

          <div className="pt-4">
            <Button type="submit" fullWidth size="lg" variant="primary">
              Pay Bill Now
            </Button>
          </div>
        </form>
      ) : (
        /* SUCCESS RECEIPT */
        <div className="p-4 space-y-4 flex-1 flex flex-col justify-between animate-fade-in">
          <div className="text-center space-y-3 pt-6">
            <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto shadow-md">
              <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
            </div>

            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Payment Successful
            </span>

            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {formatNaira(Math.abs(completedTx.amount))}
            </h2>

            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {completedTx.title}
            </p>

            {/* Prepaid Meter Token Highlight Card */}
            {completedTx.token && (
              <div className="bg-emerald-50/90 border-2 border-emerald-200 rounded-3xl p-4 text-center my-3 shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                  Prepaid Meter Token
                </span>
                <p className="text-lg font-black text-emerald-950 font-mono tracking-widest my-1">
                  {completedTx.token}
                </p>
                <button
                  type="button"
                  onClick={() => handleCopyToken(completedTx.token)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-emerald-700 text-xs font-bold rounded-xl shadow-sm border border-emerald-200 hover:bg-emerald-100/50 transition-colors"
                >
                  {copiedToken ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedToken ? 'Token Copied!' : 'Copy Token'}</span>
                </button>
              </div>
            )}

            <div className="bg-white rounded-3xl p-5 border border-slate-200 text-left text-xs space-y-2.5 shadow-sm">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Transaction Ref</span>
                <span className="font-mono text-slate-800">{completedTx.reference}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Service</span>
                <span className="font-bold text-slate-800">{completedTx.title}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Date & Time</span>
                <span className="text-slate-700">{formatDate(completedTx.timestamp)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-4">
            <Button
              fullWidth
              size="lg"
              variant="primary"
              onClick={() => navigate('/')}
              icon={Home}
            >
              Back to Home
            </Button>
          </div>
        </div>
      )}

      {/* PIN ENTRY BOTTOM SHEET */}
      <BottomSheet
        isOpen={showPinSheet}
        onClose={() => {
          if (!isProcessing) setShowPinSheet(false);
        }}
        showClose={!isProcessing}
      >
        <PinPad
          title="Authorize Bill Payment"
          subtitle="Enter 4-digit PIN to finalize transaction"
          error={pinError}
          onComplete={handlePinSubmit}
          onBiometricClick={() => handlePinSubmit('1234')}
        />
        {isProcessing && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs font-bold text-slate-800">Contacting Utility Provider...</p>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
