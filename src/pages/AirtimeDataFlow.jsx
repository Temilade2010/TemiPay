import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Smartphone, Wifi, CheckCircle2, Sparkles, Home, Share2 } from 'lucide-react';
import { Header } from '../components/shared/Header';
import { AmountInput } from '../components/ui/AmountInput';
import { PinPad } from '../components/ui/PinPad';
import { BottomSheet } from '../components/ui/BottomSheet';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAppStore } from '../store/useAppStore';
import { TELCO_NETWORKS, DATA_PLANS } from '../data/services';
import { validateNigerianPhone, validateAmount } from '../utils/validation';
import { formatNaira, formatDate } from '../utils/formatters';

export function AirtimeDataFlow() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'data' ? 'data' : 'airtime';

  const user = useAppStore((state) => state.user);
  const addTransaction = useAppStore((state) => state.addTransaction);
  const showToast = useAppStore((state) => state.showToast);

  const [activeTab, setActiveTab] = useState(initialTab); // 'airtime' | 'data'
  const [selectedNetwork, setSelectedNetwork] = useState(TELCO_NETWORKS[0]); // MTN
  const [phone, setPhone] = useState(user.phone || '08123456789');
  const [phoneError, setPhoneError] = useState('');

  // Airtime state
  const [airtimeAmount, setAirtimeAmount] = useState('1000');
  const [amountError, setAmountError] = useState('');

  // Data state
  const [selectedPlanCategory, setSelectedPlanCategory] = useState('Monthly'); // Daily, Weekly, Monthly
  const [selectedPlan, setSelectedPlan] = useState(DATA_PLANS.mtn[4]); // 12GB Monthly

  // PIN & submission state
  const [showPinSheet, setShowPinSheet] = useState(false);
  const [pinError, setPinError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTx, setCompletedTx] = useState(null);

  const networkPlans = DATA_PLANS[selectedNetwork.id] || DATA_PLANS.mtn;
  const filteredPlans = networkPlans.filter(p => p.category === selectedPlanCategory);

  const handleNetworkChange = (net) => {
    setSelectedNetwork(net);
    const newPlans = DATA_PLANS[net.id] || DATA_PLANS.mtn;
    setSelectedPlan(newPlans[0]);
  };

  const handleProceed = (e) => {
    e.preventDefault();
    const phoneVal = validateNigerianPhone(phone);
    if (!phoneVal.valid) {
      setPhoneError(phoneVal.message);
      return;
    }
    setPhoneError('');

    const targetAmount = activeTab === 'airtime' ? airtimeAmount : selectedPlan.price;
    const amtVal = validateAmount(targetAmount, user.balance, 50, 50000);
    if (!amtVal.valid) {
      setAmountError(amtVal.message);
      return;
    }
    setAmountError('');
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
      const isAirtime = activeTab === 'airtime';
      const numAmount = isAirtime ? parseFloat(airtimeAmount) : selectedPlan.price;
      const cashbackEarned = Math.round(numAmount * 0.03);

      const newTx = addTransaction({
        type: isAirtime ? 'AIRTIME' : 'DATA',
        title: isAirtime 
          ? `${selectedNetwork.name} Airtime Recharge` 
          : `${selectedNetwork.name} ${selectedPlan.name}`,
        category: isAirtime ? 'Airtime' : 'Data',
        amount: -numAmount,
        fee: 0,
        recipient: phone,
        provider: selectedNetwork.name,
        cashback: cashbackEarned,
      });

      setCompletedTx(newTx);
      setIsProcessing(false);
      setShowPinSheet(false);
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen select-none pb-12">
      <Header
        title={completedTx ? 'Purchase Status' : activeTab === 'airtime' ? 'Buy Airtime' : 'Buy Data Bundle'}
        subtitle="Instant Delivery • Up to 5% Cashback"
        showBack={!completedTx}
        onBack={() => navigate(-1)}
      />

      {!completedTx ? (
        <form onSubmit={handleProceed} className="p-4 space-y-4 flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Tab Switcher: Airtime vs Data */}
            <div className="flex p-1 bg-slate-200/80 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveTab('airtime')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'airtime'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-4 h-4 text-brand-600" />
                <span>Airtime</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('data')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'data'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Wifi className="w-4 h-4 text-brand-600" />
                <span>Data Bundle</span>
              </button>
            </div>

            {/* Network Selector Chips */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Select Network Operator
              </p>
              <div className="grid grid-cols-4 gap-2">
                {TELCO_NETWORKS.map((net) => {
                  const isSelected = selectedNetwork.id === net.id;
                  return (
                    <button
                      key={net.id}
                      type="button"
                      onClick={() => handleNetworkChange(net)}
                      className={`flex flex-col items-center p-2.5 rounded-2xl border transition-all active:scale-95 relative ${
                        isSelected
                          ? 'border-brand-500 bg-brand-50 text-brand-900 font-extrabold shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shadow-sm mb-1"
                        style={{ backgroundColor: net.color, color: net.textColor }}
                      >
                        {net.name}
                      </div>
                      <span className="text-[11px] font-bold text-slate-800">{net.name}</span>
                      <span className="text-[9px] text-emerald-700 font-medium">3% Back</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Number Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Mobile Number
                </label>
                <button
                  type="button"
                  onClick={() => setPhone(user.phone)}
                  className="text-xs font-bold text-brand-600 hover:underline"
                >
                  Use My Number
                </button>
              </div>

              <Input
                type="tel"
                inputMode="numeric"
                placeholder="0801 234 5678"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setPhoneError('');
                }}
                error={phoneError}
              />
            </div>

            {/* AIRTIME VIEW: Amount Chips */}
            {activeTab === 'airtime' && (
              <div>
                <AmountInput
                  value={airtimeAmount}
                  onChange={(val) => {
                    setAirtimeAmount(val);
                    setAmountError('');
                  }}
                  chips={[100, 200, 500, 1000, 2000, 5000]}
                  availableBalance={user.balance}
                  error={amountError}
                  label="Select or Enter Recharge Amount"
                />

                {/* Cashback alert */}
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs mt-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-900 font-semibold">Earn 3% Instant Cashback</span>
                  </div>
                  <span className="font-black text-emerald-700">
                    +{formatNaira(Math.round((parseFloat(airtimeAmount) || 0) * 0.03))}
                  </span>
                </div>
              </div>
            )}

            {/* DATA VIEW: Data Packages */}
            {activeTab === 'data' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Select Data Plan
                  </p>
                  {/* Category Filter: Daily, Weekly, Monthly */}
                  <div className="flex gap-1 bg-slate-200/60 p-0.5 rounded-xl">
                    {['Daily', 'Weekly', 'Monthly'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedPlanCategory(cat)}
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-lg transition-all ${
                          selectedPlanCategory === cat
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-500'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {filteredPlans.map((plan) => {
                    const isSelected = selectedPlan?.id === plan.id;
                    return (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => setSelectedPlan(plan)}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'border-brand-500 bg-brand-50/70 shadow-sm'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-extrabold text-slate-800">{plan.name}</p>
                          <p className="text-[10px] text-slate-400">Validity: {plan.validity}</p>
                        </div>
                        <span className="text-sm font-black text-brand-700">
                          {formatNaira(plan.price, { showDecimals: false })}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4">
            <Button type="submit" fullWidth size="lg" variant="primary">
              Proceed to Payment
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
              Recharge Successful
            </span>

            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {formatNaira(Math.abs(completedTx.amount))}
            </h2>

            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Delivered to <span className="font-bold text-slate-800 font-mono">{completedTx.recipient}</span> ({completedTx.provider})
            </p>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 text-left text-xs space-y-2.5 shadow-sm mt-4">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Service</span>
                <span className="font-bold text-slate-800">{completedTx.title}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Cashback Credited</span>
                <span className="font-bold text-emerald-600">+{formatNaira(completedTx.cashback)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Reference</span>
                <span className="font-mono text-slate-800">{completedTx.reference}</span>
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

            <Button
              fullWidth
              size="md"
              variant="outline"
              onClick={() => {
                setCompletedTx(null);
                setAirtimeAmount('1000');
              }}
            >
              Make Another Recharge
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
          title="Authorize Recharge"
          subtitle={`Enter 4-digit PIN to approve ${formatNaira(activeTab === 'airtime' ? airtimeAmount : selectedPlan.price)}`}
          error={pinError}
          onComplete={handlePinSubmit}
          onBiometricClick={() => handlePinSubmit('1234')}
        />
        {isProcessing && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs font-bold text-slate-800">Processing with Network Operator...</p>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
