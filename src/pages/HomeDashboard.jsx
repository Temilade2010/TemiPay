import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Plus, 
  Send, 
  ArrowDownLeft, 
  Clock, 
  Bell, 
  Smartphone, 
  Wifi, 
  Zap, 
  Tv, 
  Trophy, 
  PiggyBank, 
  Coins, 
  Grid, 
  Copy, 
  Check, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles,
  ArrowUpRight,
  UserCheck,
  Edit3,
  Wallet
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { formatNaira } from '../utils/formatters';
import { ServiceTile } from '../components/shared/ServiceTile';
import { TransactionItem } from '../components/shared/TransactionItem';
import { ReceiptModal } from '../components/shared/ReceiptModal';
import { BottomSheet } from '../components/ui/BottomSheet';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PROMO_BANNERS } from '../data/mockData';

export function HomeDashboard() {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const setVirtualBalance = useAppStore((state) => state.setVirtualBalance);
  const simulateCredit = useAppStore((state) => state.simulateCredit);
  const hideBalance = useAppStore((state) => state.hideBalance);
  const toggleHideBalance = useAppStore((state) => state.toggleHideBalance);
  const transactions = useAppStore((state) => state.transactions);
  const notifications = useAppStore((state) => state.notifications);
  const showToast = useAppStore((state) => state.showToast);

  const [selectedTx, setSelectedTx] = useState(null);
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [showMoreServices, setShowMoreServices] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [activeBanner, setActiveBanner] = useState(0);

  // Custom User Profile & Virtual Wallet Modal
  const [showCustomWalletModal, setShowCustomWalletModal] = useState(false);
  const [customNameInput, setCustomNameInput] = useState(user.fullName);
  const [customBalanceInput, setCustomBalanceInput] = useState(user.balance.toString());
  const [customAccountInput, setCustomAccountInput] = useState(user.accountNumber);

  // Simulate Credit Alert Modal
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [creditSenderName, setCreditSenderName] = useState('DAMILOLA ADELEKE');
  const [creditAmount, setCreditAmount] = useState('50000');
  const [creditNarration, setCreditNarration] = useState('Payment for services rendered');

  const unreadNotifsCount = notifications.filter((n) => n.unread).length;
  const recentTransactions = transactions.slice(0, 5);

  const handleCopyAccount = () => {
    navigator.clipboard?.writeText(user.accountNumber);
    setCopiedAcc(true);
    showToast('Account number copied to clipboard', 'info');
    setTimeout(() => setCopiedAcc(false), 2000);
  };

  const handleSaveCustomProfile = (e) => {
    e.preventDefault();
    if (!customNameInput.trim()) {
      showToast('Please enter your name', 'error');
      return;
    }
    updateProfile({
      fullName: customNameInput.trim(),
      accountNumber: customAccountInput.trim() || user.accountNumber,
    });
    setVirtualBalance(customBalanceInput);
    setShowCustomWalletModal(false);
    showToast(`Hello ${customNameInput}! Your virtual wallet was updated.`, 'success');
  };

  const handleSimulateCreditSubmit = (e) => {
    e.preventDefault();
    const createdTx = simulateCredit({
      senderName: creditSenderName.trim(),
      amount: creditAmount,
      narration: creditNarration,
    });
    setShowCreditModal(false);
    setSelectedTx(createdTx);
  };

  const services = [
    { id: 'airtime', label: 'Airtime', icon: Smartphone, badge: '5% Back', bgColor: 'bg-amber-50 text-amber-600', action: () => navigate('/airtime-data?tab=airtime') },
    { id: 'data', label: 'Data', icon: Wifi, badge: '5G Hot', bgColor: 'bg-sky-50 text-sky-600', action: () => navigate('/airtime-data?tab=data') },
    { id: 'electricity', label: 'Electricity', icon: Zap, badge: 'Instant', bgColor: 'bg-emerald-50 text-emerald-600', action: () => navigate('/bills?tab=electricity') },
    { id: 'cable', label: 'Cable TV', icon: Tv, badge: '', bgColor: 'bg-indigo-50 text-indigo-600', action: () => navigate('/bills?tab=cable') },
    { id: 'betting', label: 'Betting', icon: Trophy, badge: '', bgColor: 'bg-rose-50 text-rose-600', action: () => navigate('/bills?tab=betting') },
    { id: 'savings', label: 'Savings', icon: PiggyBank, badge: '15.5% Int', badgeColor: 'bg-emerald-600 text-white', bgColor: 'bg-teal-50 text-teal-600', action: () => navigate('/savings') },
    { id: 'loans', label: 'Loans', icon: Coins, badge: 'Up to ₦1M', badgeColor: 'bg-purple-600 text-white', bgColor: 'bg-purple-50 text-purple-600', action: () => setShowLoanModal(true) },
    { id: 'more', label: 'More', icon: Grid, badge: '', bgColor: 'bg-slate-100 text-slate-700', action: () => setShowMoreServices(true) },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 pb-20 select-none">
      {/* Top Bar: User Greeting + Profile Customizer + Notification Bell */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between bg-white border-b border-slate-100">
        <button
          type="button"
          onClick={() => {
            setCustomNameInput(user.fullName);
            setCustomBalanceInput(user.balance.toString());
            setCustomAccountInput(user.accountNumber);
            setShowCustomWalletModal(true);
          }}
          className="flex items-center gap-3 group text-left"
          title="Click to change your name or wallet balance"
        >
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.fullName}
              className="w-10 h-10 rounded-2xl object-cover ring-2 ring-brand-500/30 group-hover:ring-brand-500 transition-all"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-[9px] text-white font-bold">
              ✓
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 font-medium">Hello,</span>
              <span className="text-xs font-bold text-slate-800">{user.firstName} 👋</span>
              <Edit3 className="w-3 h-3 text-brand-600 opacity-75 group-hover:opacity-100" />
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider bg-brand-50 text-brand-700 px-1.5 py-0.2 rounded-md border border-brand-200">
                Tier {user.kycTier} Verified
              </span>
            </div>
          </div>
        </button>

        {/* Right actions: Receive Virtual Money & Notifications */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowCreditModal(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-[11px] font-bold border border-emerald-200 transition-colors"
            title="Simulate receiving money from someone"
          >
            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Receive</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/notifications')}
            className="relative p-2.5 rounded-2xl bg-slate-100/80 hover:bg-slate-200/70 text-slate-700 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5 stroke-[2]" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                {unreadNotifsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* HERO BALANCE CARD */}
        <div className="relative rounded-3xl p-5 bg-gradient-to-br from-brand-600 via-brand-700 to-teal-800 text-white shadow-card overflow-hidden">
          {/* Ambient geometric curves */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-36 h-36 bg-teal-400/10 rounded-full blur-xl pointer-events-none" />

          {/* Top row of card */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-brand-100 tracking-wide">Available Virtual Balance</span>
              <button
                type="button"
                onClick={toggleHideBalance}
                className="p-1 text-brand-200 hover:text-white transition-colors"
                aria-label="Toggle balance visibility"
              >
                {hideBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Quick edit balance button */}
            <button
              type="button"
              onClick={() => {
                setCustomNameInput(user.fullName);
                setCustomBalanceInput(user.balance.toString());
                setCustomAccountInput(user.accountNumber);
                setShowCustomWalletModal(true);
              }}
              className="flex items-center gap-1 bg-black/20 hover:bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-emerald-200 border border-white/15 transition-all"
            >
              <Edit3 className="w-3 h-3 text-amber-300" />
              <span>Edit Wallet</span>
            </button>
          </div>

          {/* Large Amount */}
          <div className="my-1.5">
            <h2 className="text-3xl font-black tracking-tight font-sans">
              {formatNaira(user.balance, { hidden: hideBalance })}
            </h2>
          </div>

          {/* Account details with user name & copy */}
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/15">
            <div className="flex items-center gap-1.5 text-xs text-brand-100">
              <span className="opacity-80">TemiPay:</span>
              <span className="font-mono font-bold tracking-wider text-white">{user.accountNumber}</span>
              <button
                type="button"
                onClick={handleCopyAccount}
                className="p-1 hover:text-white transition-colors rounded"
                title="Copy account number"
              >
                {copiedAcc ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 text-brand-200" />}
              </button>
            </div>

            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
              {user.fullName}
            </span>
          </div>
        </div>

        {/* QUICK ACTIONS ROW (Add Money, Transfer, Withdraw, History) */}
        <div className="grid grid-cols-4 gap-2 bg-white p-3 rounded-2xl border border-slate-100 shadow-soft">
          <button
            type="button"
            onClick={() => navigate('/add-money')}
            className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-slate-50 active:scale-95 transition-all"
          >
            <div className="w-11 h-11 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-md shadow-brand-500/30 mb-1.5">
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-xs font-bold text-slate-800 tracking-tight">Add Money</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/transfer')}
            className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-slate-50 active:scale-95 transition-all"
          >
            <div className="w-11 h-11 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/30 mb-1.5">
              <Send className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-slate-800 tracking-tight">Transfer</span>
          </button>

          <button
            type="button"
            onClick={() => setShowWithdrawModal(true)}
            className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-slate-50 active:scale-95 transition-all"
          >
            <div className="w-11 h-11 rounded-2xl bg-slate-800 text-white flex items-center justify-center shadow-md shadow-slate-800/20 mb-1.5">
              <ArrowDownLeft className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-slate-800 tracking-tight">Withdraw</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/history')}
            className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-slate-50 active:scale-95 transition-all"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-brand-700 border border-brand-200 flex items-center justify-center mb-1.5">
              <Clock className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-slate-800 tracking-tight">History</span>
          </button>
        </div>

        {/* SERVICES GRID */}
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-soft">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Services</h3>
            <span className="text-[11px] font-semibold text-brand-600">Zero Fees</span>
          </div>

          <div className="grid grid-cols-4 gap-y-3 gap-x-2">
            {services.map((service) => (
              <ServiceTile
                key={service.id}
                icon={service.icon}
                label={service.label}
                badge={service.badge}
                badgeColor={service.badgeColor}
                bgColor={service.bgColor}
                onClick={service.action}
              />
            ))}
          </div>
        </div>

        {/* PROMO CAROUSEL BANNER */}
        <div className="relative overflow-hidden rounded-3xl shadow-sm">
          <div
            className={`p-4 rounded-3xl text-white bg-gradient-to-r ${PROMO_BANNERS[activeBanner].bg} transition-all duration-300 flex items-center justify-between`}
          >
            <div className="space-y-1 pr-3">
              <span className="inline-block text-[10px] font-black uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full border border-white/20">
                {PROMO_BANNERS[activeBanner].tag}
              </span>
              <h4 className="text-sm font-black leading-snug">
                {PROMO_BANNERS[activeBanner].title}
              </h4>
              <p className="text-[11px] text-white/80 leading-tight">
                {PROMO_BANNERS[activeBanner].subtitle}
              </p>
            </div>
            <Button
              size="sm"
              variant="dark"
              onClick={() => navigate(PROMO_BANNERS[activeBanner].action)}
              className="flex-shrink-0 text-xs px-3 shadow-md"
            >
              {PROMO_BANNERS[activeBanner].btnText}
            </Button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-2">
            {PROMO_BANNERS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveBanner(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  activeBanner === idx ? 'w-5 bg-brand-500' : 'w-1.5 bg-slate-300'
                }`}
                aria-label={`Promo ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* RECENT TRANSACTIONS */}
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-soft">
          <div className="flex items-center justify-between mb-2 px-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Transactions</h3>
            <Link
              to="/history"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-0.5"
            >
              <span>See All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentTransactions.map((tx) => (
              <TransactionItem
                key={tx.id}
                transaction={tx}
                onClick={() => setSelectedTx(tx)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CUSTOMIZE NAME & VIRTUAL WALLET MODAL */}
      <Modal
        isOpen={showCustomWalletModal}
        onClose={() => setShowCustomWalletModal(false)}
        title="Customize Name & Virtual Wallet"
      >
        <form onSubmit={handleSaveCustomProfile} className="space-y-4">
          <div className="p-3 bg-brand-50 rounded-2xl text-xs text-brand-800 space-y-1 border border-brand-200">
            <p className="font-bold">Set Your Name & Virtual Money</p>
            <p>Input your name here and the entire app, receipts, and sender information will update with your name.</p>
          </div>

          <Input
            label="Your Full Name (Sender Name)"
            placeholder="e.g. John Doe, Fatima Bello, Emeka Obi"
            value={customNameInput}
            onChange={(e) => setCustomNameInput(e.target.value)}
            required
            helperText="This name will appear on all transaction receipts."
          />

          <Input
            label="Virtual Account Number"
            inputMode="numeric"
            maxLength={10}
            placeholder="10-digit number"
            value={customAccountInput}
            onChange={(e) => setCustomAccountInput(e.target.value.replace(/\D/g, ''))}
            helperText="Your TemiPay virtual account number"
          />

          <Input
            label="Virtual Balance (₦)"
            type="number"
            placeholder="e.g. 500000"
            value={customBalanceInput}
            onChange={(e) => setCustomBalanceInput(e.target.value)}
            helperText="Set how much virtual money is in your wallet"
            required
          />

          <Button type="submit" fullWidth size="lg" variant="primary">
            Save & Update My Wallet
          </Button>
        </form>
      </Modal>

      {/* SIMULATE CREDIT ALERT / RECEIVE VIRTUAL MONEY MODAL */}
      <Modal
        isOpen={showCreditModal}
        onClose={() => setShowCreditModal(false)}
        title="Simulate Credit Alert"
      >
        <form onSubmit={handleSimulateCreditSubmit} className="space-y-4">
          <p className="text-xs text-slate-500">
            Simulate receiving virtual money into your wallet from someone else, and view the credit alert receipt.
          </p>

          <Input
            label="Sender Name"
            placeholder="e.g. Dangote Group, Uncle Segun, Paystack"
            value={creditSenderName}
            onChange={(e) => setCreditSenderName(e.target.value)}
            required
          />

          <Input
            label="Credit Amount (₦)"
            type="number"
            placeholder="50000"
            value={creditAmount}
            onChange={(e) => setCreditAmount(e.target.value)}
            required
          />

          <Input
            label="Narration"
            placeholder="e.g. Project milestone payment"
            value={creditNarration}
            onChange={(e) => setCreditNarration(e.target.value)}
          />

          <Button type="submit" fullWidth size="lg" variant="primary">
            Receive Virtual Money (+₦{Number(creditAmount || 0).toLocaleString()})
          </Button>
        </form>
      </Modal>

      {/* RECEIPT MODAL */}
      <ReceiptModal
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        transaction={selectedTx}
      />

      {/* WITHDRAW MODAL */}
      <Modal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        title="Withdraw Funds"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Choose your preferred method to cash out from your TemiPay wallet:
          </p>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => {
                setShowWithdrawModal(false);
                navigate('/transfer');
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/40 text-left transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                  🏦
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Transfer to Bank</p>
                  <p className="text-[11px] text-slate-400">Withdraw to any Nigerian commercial bank</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => {
                showToast('Agent POS code: #7829-1094 generated. Valid for 15 mins.', 'success');
                setShowWithdrawModal(false);
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/40 text-left transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                  🏪
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">TemiPay POS Agent</p>
                  <p className="text-[11px] text-slate-400">Generate OTP for cardless withdrawal at nearby agent</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </Modal>

      {/* LOANS MODAL */}
      <Modal
        isOpen={showLoanModal}
        onClose={() => setShowLoanModal(false)}
        title="TemiPay Instant Nano Loan"
      >
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto text-2xl shadow-sm">
            💰
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-800">You Qualify for up to ₦150,000</h4>
            <p className="text-xs text-slate-500 mt-1">
              Based on your Tier 2 KYC status and wallet activity. Disbursed in 60 seconds with no paperwork.
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl text-left text-xs space-y-1.5 border border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-500">Interest rate:</span>
              <span className="font-bold text-slate-800">2.5% monthly</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Repayment term:</span>
              <span className="font-bold text-slate-800">30 - 90 Days</span>
            </div>
          </div>
          <Button
            fullWidth
            variant="primary"
            onClick={() => {
              showToast('Loan application received! Processing credit score...', 'success');
              setShowLoanModal(false);
            }}
          >
            Apply Now
          </Button>
        </div>
      </Modal>

      {/* MORE SERVICES BOTTOM SHEET */}
      <BottomSheet
        isOpen={showMoreServices}
        onClose={() => setShowMoreServices(false)}
        title="All TemiPay Services"
      >
        <div className="grid grid-cols-4 gap-3">
          {services.map((s) => (
            <ServiceTile
              key={s.id}
              icon={s.icon}
              label={s.label}
              badge={s.badge}
              badgeColor={s.badgeColor}
              bgColor={s.bgColor}
              onClick={() => {
                setShowMoreServices(false);
                s.action();
              }}
            />
          ))}
          <ServiceTile
            icon={ShieldCheck}
            label="Insurance"
            badge="New"
            bgColor="bg-cyan-50 text-cyan-600"
            onClick={() => {
              showToast('Micro-health insurance coming soon', 'info');
              setShowMoreServices(false);
            }}
          />
        </div>
      </BottomSheet>
    </div>
  );
}
