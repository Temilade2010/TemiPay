import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, CreditCard, Copy, Check, Share2, ShieldCheck, Sparkles, CheckCircle2, Download, FileText } from 'lucide-react';
import { Header } from '../components/shared/Header';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { AmountInput } from '../components/ui/AmountInput';
import { ReceiptModal } from '../components/shared/ReceiptModal';
import { useAppStore } from '../store/useAppStore';
import { formatNaira, formatDate } from '../utils/formatters';
import { generateReceiptImage } from '../utils/receiptGenerator';

export function AddMoneyFlow() {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const addTransaction = useAppStore((state) => state.addTransaction);
  const showToast = useAppStore((state) => state.showToast);

  const [activeTab, setActiveTab] = useState('transfer'); // 'transfer' | 'card'
  const [copied, setCopied] = useState(false);

  // Card top-up state
  const [cardNumber, setCardNumber] = useState('5399 8102 9182 4491');
  const [expiry, setExpiry] = useState('08/29');
  const [cvv, setCvv] = useState('381');
  const [cardAmount, setCardAmount] = useState('10000');
  const [isProcessingCard, setIsProcessingCard] = useState(false);
  const [cardSuccess, setCardSuccess] = useState(false);
  const [completedTx, setCompletedTx] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const handleCopyAccount = () => {
    navigator.clipboard?.writeText(user.accountNumber);
    setCopied(true);
    showToast('TemiPay account number copied!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareDetails = () => {
    const text = `TemiPay Account Details:\nBank: TemiPay MFB\nAccount Number: ${user.accountNumber}\nName: ${user.fullName.toUpperCase()}\nSend money instantly with zero fees!`;
    if (navigator.share) {
      navigator.share({ title: 'TemiPay Account Details', text }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text);
      showToast('Account details copied to share', 'success');
    }
  };

  const handleCardDeposit = (e) => {
    e.preventDefault();
    const amt = parseFloat(cardAmount);
    if (!amt || amt < 100) {
      showToast('Minimum deposit is ₦100', 'error');
      return;
    }

    setIsProcessingCard(true);
    setTimeout(() => {
      const tx = addTransaction({
        type: 'TRANSFER_IN',
        title: 'Debit Card Top-up',
        category: 'Money In',
        amount: amt,
        fee: 0,
        narration: 'Instant Card Deposit',
        sender: `Card ending in ${cardNumber.slice(-4)}`,
        senderName: `Card ending in ${cardNumber.slice(-4)}`,
        recipient: user.fullName,
        recipientName: user.fullName,
        bank: 'TemiPay MFB',
        accountNumber: user.accountNumber,
      });

      setCompletedTx(tx);
      setIsProcessingCard(false);
      setCardSuccess(true);
      showToast(`₦${amt.toLocaleString()} credited to your wallet!`, 'success');
    }, 900);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen select-none pb-12">
      <Header
        title="Add Money"
        subtitle="Instant Wallet Funding"
        showBack={true}
        onBack={() => navigate(-1)}
      />

      <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Method Selector Tabs */}
          <div className="flex p-1 bg-slate-200/80 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setActiveTab('transfer');
                setCardSuccess(false);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'transfer'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-brand-600" />
              <span>Bank Transfer</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('card');
                setCardSuccess(false);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'card'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-4 h-4 text-teal-600" />
              <span>Debit Card</span>
            </button>
          </div>

          {/* TAB 1: BANK TRANSFER DETAILS */}
          {activeTab === 'transfer' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 mx-auto">
                  <Building2 className="w-6 h-6 stroke-[2]" />
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Your Dedicated TemiPay Account
                  </span>
                  <div className="flex items-center justify-center gap-3 mt-1.5">
                    <span className="text-3xl font-black text-slate-900 font-mono tracking-wider">
                      {user.accountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyAccount}
                      className="p-2 rounded-xl bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors shadow-sm"
                      title="Copy account number"
                    >
                      {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-2.5 text-xs border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bank Name</span>
                    <span className="font-bold text-slate-800">TemiPay MFB / Wema Bank</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Account Name</span>
                    <span className="font-bold text-slate-800 uppercase">{user.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Credit Speed</span>
                    <span className="font-bold text-brand-600">Instant (0 - 5 seconds)</span>
                  </div>
                </div>

                {/* Instructions */}
                <p className="text-xs text-slate-500 leading-relaxed">
                  Open any banking app or dial your bank USSD code, select <span className="font-bold text-slate-700">TemiPay MFB</span> (or Wema Bank), and transfer funds to this account number.
                </p>

                <div className="pt-2 flex gap-2">
                  <Button
                    fullWidth
                    variant="outline"
                    size="sm"
                    onClick={handleShareDetails}
                    icon={Share2}
                  >
                    Share Account Details
                  </Button>
                </div>
              </div>

              {/* USSD Quick Code Box */}
              <div className="p-4 bg-teal-50/70 rounded-3xl border border-teal-200/80 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-teal-950">Dial USSD Quick Code</p>
                  <p className="text-[11px] text-teal-700 font-mono mt-0.5">*999*{user.accountNumber}#</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(`*999*${user.accountNumber}#`);
                    showToast('USSD string copied', 'info');
                  }}
                  className="px-3 py-1.5 bg-teal-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-teal-700 transition-colors"
                >
                  Copy USSD
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: DEBIT CARD TOP-UP */}
          {activeTab === 'card' && (
            <div className="animate-fade-in">
              {!cardSuccess ? (
                <form onSubmit={handleCardDeposit} className="space-y-4">
                  <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-soft space-y-3.5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-bold text-slate-800">Debit Card Details</span>
                      <div className="flex gap-1">
                        <span className="text-[10px] font-black px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded">VISA</span>
                        <span className="text-[10px] font-black px-1.5 py-0.5 bg-rose-50 text-rose-700 rounded">Mastercard</span>
                        <span className="text-[10px] font-black px-1.5 py-0.5 bg-brand-50 text-brand-700 rounded">Verve</span>
                      </div>
                    </div>

                    <Input
                      label="Card Number"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="0000 0000 0000 0000"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Expiry Date"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM/YY"
                      />
                      <Input
                        label="CVV"
                        type="password"
                        maxLength={3}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="123"
                      />
                    </div>

                    <AmountInput
                      value={cardAmount}
                      onChange={(val) => setCardAmount(val)}
                      label="Deposit Amount"
                    />
                  </div>

                  <div className="p-3 bg-slate-100 rounded-2xl flex items-center gap-2.5 text-xs text-slate-600">
                    <ShieldCheck className="w-5 h-5 text-brand-600 flex-shrink-0" />
                    <span>Card payments secured with PCIDSS bank-grade tokenization.</span>
                  </div>

                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    variant="primary"
                    isLoading={isProcessingCard}
                  >
                    Pay & Fund Wallet ({formatNaira(cardAmount)})
                  </Button>
                </form>
              ) : (
                <div className="p-6 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-soft animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">Wallet Funded!</h3>
                  <p className="text-xs text-slate-500">
                    Successfully deposited <span className="font-bold text-slate-800">{formatNaira(cardAmount)}</span> into your TemiPay wallet.
                  </p>

                  <div className="bg-slate-50 rounded-2xl p-4 text-left text-xs space-y-2 border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Recipient Account:</span>
                      <span className="font-bold text-slate-800 uppercase">{user.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Payment Channel:</span>
                      <span className="font-semibold text-slate-700">Debit Card •••• {cardNumber.slice(-4)}</span>
                    </div>
                    {completedTx && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Reference:</span>
                        <span className="font-mono text-slate-700">{completedTx.reference}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 pt-2">
                    {completedTx && (
                      <>
                        <Button
                          fullWidth
                          size="md"
                          variant="accent"
                          icon={Download}
                          onClick={() => {
                            generateReceiptImage({
                              amount: completedTx.amount,
                              senderName: completedTx.senderName || `Card ending in ${cardNumber.slice(-4)}`,
                              senderAccount: '•••• ' + cardNumber.slice(-4),
                              recipient: user.fullName,
                              bank: 'TemiPay MFB',
                              accountNumber: user.accountNumber,
                              narration: completedTx.narration,
                              reference: completedTx.reference,
                              date: formatDate(completedTx.timestamp),
                              type: 'Card Top-up (Virtual Deposit)',
                            });
                            showToast('Official deposit receipt downloaded!', 'success');
                          }}
                        >
                          Download Deposit Receipt (PNG)
                        </Button>
                        <Button
                          fullWidth
                          size="md"
                          variant="outline"
                          icon={FileText}
                          onClick={() => setShowReceiptModal(true)}
                        >
                          View Full Receipt
                        </Button>
                      </>
                    )}

                    <Button fullWidth variant="primary" onClick={() => navigate('/')}>
                      Go to Dashboard
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        transaction={completedTx}
      />
    </div>
  );
}
