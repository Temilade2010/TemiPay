import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  UserCheck, 
  ChevronDown, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  Share2,
  Home,
  Download,
  Edit2,
  FileText
} from 'lucide-react';
import { Header } from '../components/shared/Header';
import { BankSelector } from '../components/shared/BankSelector';
import { AmountInput } from '../components/ui/AmountInput';
import { PinPad } from '../components/ui/PinPad';
import { BottomSheet } from '../components/ui/BottomSheet';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ReceiptModal } from '../components/shared/ReceiptModal';
import { useAppStore } from '../store/useAppStore';
import { NIGERIAN_BANKS, resolveAccountMock } from '../data/banks';
import { validateNuban, validateAmount } from '../utils/validation';
import { formatNaira, formatDate, generateReference } from '../utils/formatters';
import { generateReceiptImage } from '../utils/receiptGenerator';

export function TransferFlow() {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const beneficiaries = useAppStore((state) => state.beneficiaries);
  const addTransaction = useAppStore((state) => state.addTransaction);
  const addBeneficiary = useAppStore((state) => state.addBeneficiary);
  const showToast = useAppStore((state) => state.showToast);

  // Transfer Form State
  const [selectedBank, setSelectedBank] = useState(NIGERIAN_BANKS[0]); // default TemiPay MFB
  const [showBankSelector, setShowBankSelector] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [isResolvingName, setIsResolvingName] = useState(false);
  const [resolveError, setResolveError] = useState('');
  const [isEditingNameManually, setIsEditingNameManually] = useState(false);

  const [amount, setAmount] = useState('');
  const [narration, setNarration] = useState('');
  const [amountError, setAmountError] = useState('');

  // Flow Steps: 'INPUT' -> 'CONFIRM' -> 'SUCCESS'
  const [step, setStep] = useState('INPUT');
  const [showPinSheet, setShowPinSheet] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [pinError, setPinError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTx, setCompletedTx] = useState(null);

  // Auto-resolve account number when 10 digits entered (only if not manually typed)
  useEffect(() => {
    if (accountNumber.length === 10 && selectedBank && !isEditingNameManually) {
      setIsResolvingName(true);
      setResolveError('');

      resolveAccountMock(accountNumber, selectedBank.id)
        .then((res) => {
          setAccountName(res.accountName);
          setIsResolvingName(false);
        })
        .catch(() => {
          setIsResolvingName(false);
        });
    }
  }, [accountNumber, selectedBank, isEditingNameManually]);

  // Beneficiary quick fill
  const handleSelectBeneficiary = (ben) => {
    const matchedBank = NIGERIAN_BANKS.find(
      (b) => b.code === ben.bankCode || b.name.toLowerCase().includes(ben.bankName.toLowerCase())
    ) || selectedBank;
    
    setSelectedBank(matchedBank);
    setAccountNumber(ben.accountNumber);
    setAccountName(ben.name);
    setIsEditingNameManually(true);
  };

  // Continue to review
  const handleProceedToConfirm = (e) => {
    e.preventDefault();
    const nubanVal = validateNuban(accountNumber);
    if (!nubanVal.valid) {
      setResolveError(nubanVal.message);
      return;
    }
    if (!accountName.trim()) {
      setResolveError('Please input recipient name');
      return;
    }

    const amtVal = validateAmount(amount, user.balance);
    if (!amtVal.valid) {
      setAmountError(amtVal.message);
      return;
    }
    setAmountError('');
    setStep('CONFIRM');
  };

  // Authorize with PIN
  const handlePinSubmit = (enteredPin) => {
    if (enteredPin !== user.pin && enteredPin !== '1234') {
      setPinError('Incorrect transaction PIN. Try 1234.');
      return;
    }
    setPinError('');
    setIsProcessing(true);

    setTimeout(() => {
      const numAmount = parseFloat(amount);
      const newTx = addTransaction({
        type: 'TRANSFER_OUT',
        title: `Transfer to ${accountName.toUpperCase()}`,
        category: 'Transfer',
        amount: -numAmount,
        fee: 0,
        sender: user.fullName,
        senderName: user.fullName,
        senderAccount: user.accountNumber,
        recipient: accountName.toUpperCase(),
        recipientName: accountName.toUpperCase(),
        bank: selectedBank.name,
        accountNumber: accountNumber,
        narration: narration || 'TemiPay Virtual Transfer',
      });

      // Save as beneficiary automatically
      addBeneficiary({
        name: accountName.toUpperCase(),
        bankName: selectedBank.name,
        accountNumber: accountNumber,
        bankCode: selectedBank.code,
      });

      setCompletedTx(newTx);
      setIsProcessing(false);
      setShowPinSheet(false);
      setStep('SUCCESS');
    }, 650);
  };

  const handleDownloadReceipt = () => {
    if (!completedTx) return;
    generateReceiptImage({
      amount: completedTx.amount,
      senderName: user.fullName,
      senderAccount: user.accountNumber,
      recipient: completedTx.recipient,
      bank: completedTx.bank,
      accountNumber: completedTx.accountNumber,
      narration: completedTx.narration,
      reference: completedTx.reference,
      date: formatDate(completedTx.timestamp),
      type: 'Interbank Transfer (Virtual Money)',
    });
    showToast('Official receipt downloaded as PNG!', 'success');
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen select-none pb-12">
      <Header
        title={step === 'SUCCESS' ? 'Transfer Status' : 'Send Virtual Money'}
        subtitle={step === 'CONFIRM' ? 'Confirm Payment Details' : 'Send to Any Account • Instant Receipt'}
        showBack={step !== 'SUCCESS'}
        onBack={() => {
          if (step === 'CONFIRM') setStep('INPUT');
          else navigate(-1);
        }}
      />

      {/* STEP 1: INPUT DETAILS */}
      {step === 'INPUT' && (
        <form onSubmit={handleProceedToConfirm} className="p-4 space-y-4 flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Quick Beneficiaries Carousel */}
            {beneficiaries && beneficiaries.length > 0 && (
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Recent Contacts
                </p>
                <div className="flex items-center gap-2.5 overflow-x-auto hide-scrollbar pb-1">
                  {beneficiaries.map((ben) => (
                    <button
                      key={ben.id}
                      type="button"
                      onClick={() => handleSelectBeneficiary(ben)}
                      className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-white rounded-2xl border border-slate-200/80 hover:border-brand-300 hover:bg-brand-50/30 transition-all text-left shadow-sm active:scale-95"
                    >
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-[11px] font-black"
                        style={{ backgroundColor: ben.color || '#00A86B' }}
                      >
                        {ben.initials || ben.name.slice(0, 2)}
                      </div>
                      <div className="max-w-[110px]">
                        <p className="text-xs font-bold text-slate-800 truncate leading-tight">
                          {ben.name}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {ben.bankName}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Destination Bank Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Select Destination Bank
              </label>
              <button
                type="button"
                onClick={() => setShowBankSelector(true)}
                className="w-full flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-2xl hover:border-brand-400 text-left transition-all shadow-sm focus:ring-2 focus:ring-brand-500/20"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-extrabold shadow-sm"
                    style={{ backgroundColor: selectedBank.color }}
                  >
                    {selectedBank.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 leading-tight">
                      {selectedBank.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {selectedBank.type} Bank • Tap to change
                    </p>
                  </div>
                </div>
                <ChevronDown className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Account Number Input */}
            <div>
              <Input
                label="10-Digit Account Number"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="0123456789"
                value={accountNumber}
                onChange={(e) => {
                  setAccountNumber(e.target.value.replace(/\D/g, ''));
                  setIsEditingNameManually(false);
                }}
                error={resolveError}
                rightIcon={isResolvingName ? null : accountName ? UserCheck : null}
              />

              {/* Real-time resolving indicator */}
              {isResolvingName && (
                <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-slate-100 rounded-xl text-xs text-slate-600 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
                  <span>Looking up name at {selectedBank.name}...</span>
                </div>
              )}
            </div>

            {/* RECIPIENT NAME INPUT (Type Any Name Freely!) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Recipient Name (Add or Edit Name)
                </label>
                <span className="text-[11px] text-brand-600 font-semibold flex items-center gap-1">
                  <Edit2 className="w-3 h-3" />
                  <span>Customizable</span>
                </span>
              </div>

              <Input
                placeholder="Enter recipient full name (e.g. John Doe, Fatima Musa)"
                value={accountName}
                onChange={(e) => {
                  setAccountName(e.target.value);
                  setIsEditingNameManually(true);
                }}
                helperText="You can type any person or business name. It will be printed on the receipt."
              />
            </div>

            {/* Amount Input with Chips */}
            <AmountInput
              value={amount}
              onChange={(val) => {
                setAmount(val);
                setAmountError('');
              }}
              availableBalance={user.balance}
              error={amountError}
            />

            {/* Optional Narration */}
            <Input
              label="Narration / Note (Optional)"
              placeholder="e.g. For food, settlement, birthday gift"
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
            />

            {/* Zero Fee Tag */}
            <div className="flex items-center justify-between p-3 bg-brand-50/60 border border-brand-200/60 rounded-2xl text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span className="font-semibold text-brand-900">TemiPay Virtual Money Transfer</span>
              </div>
              <span className="font-extrabold text-brand-700 bg-brand-100 px-2 py-0.5 rounded-full">
                FREE (₦0.00)
              </span>
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              fullWidth
              size="lg"
              variant="primary"
              disabled={!accountNumber || accountNumber.length !== 10 || !accountName.trim() || !amount}
            >
              Continue to Review
            </Button>
          </div>
        </form>
      )}

      {/* STEP 2: CONFIRMATION SUMMARY */}
      {step === 'CONFIRM' && (
        <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft text-center space-y-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Transfer Amount
              </span>
              <h2 className="text-3xl font-black text-slate-900">
                {formatNaira(amount)}
              </h2>
              <p className="text-xs text-brand-600 font-semibold bg-brand-50 py-1 px-3 rounded-full inline-block">
                Zero Transfer Fee • ₦0.00
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft space-y-3 text-xs">
              <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">
                Transfer Summary
              </h3>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Sender (Your Name)</span>
                <span className="font-bold text-brand-700 uppercase">{user.fullName}</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Recipient Name</span>
                <span className="font-bold text-slate-900 text-right uppercase">{accountName}</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Destination Bank</span>
                <span className="font-semibold text-slate-800">{selectedBank.name}</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Account Number</span>
                <span className="font-mono font-semibold text-slate-800">{accountNumber}</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Narration</span>
                <span className="text-slate-700 italic">{narration || 'TemiPay Transfer'}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-slate-100 pt-2">
                <span className="text-slate-500">Wallet Balance After</span>
                <span className="font-bold text-slate-800">
                  {formatNaira(user.balance - parseFloat(amount))}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-100 rounded-2xl flex items-center gap-2.5 text-xs text-slate-600">
              <ShieldCheck className="w-5 h-5 text-brand-600 flex-shrink-0" />
              <span>Transfers generate an official verifiable TemiPay receipt.</span>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <Button
              fullWidth
              size="lg"
              variant="primary"
              onClick={() => setShowPinSheet(true)}
            >
              Pay {formatNaira(amount)}
            </Button>

            <Button
              fullWidth
              size="md"
              variant="ghost"
              onClick={() => setStep('INPUT')}
            >
              Edit Details
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: SUCCESS STATE WITH RECEIPT ACTIONS */}
      {step === 'SUCCESS' && completedTx && (
        <div className="p-4 space-y-4 flex-1 flex flex-col justify-between animate-fade-in">
          <div className="text-center space-y-3 pt-4">
            <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto shadow-md">
              <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
            </div>

            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Transfer Successful
            </span>

            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {formatNaira(Math.abs(completedTx.amount))}
            </h2>

            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Sent from <span className="font-bold text-slate-800">{user.fullName}</span> to <span className="font-bold text-slate-800">{completedTx.recipient}</span> ({completedTx.bank})
            </p>

            {/* Receipt Summary Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 text-left text-xs space-y-2.5 shadow-sm mt-3">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Sender</span>
                <span className="font-bold text-slate-800 uppercase">{user.fullName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Recipient</span>
                <span className="font-bold text-slate-800 uppercase">{completedTx.recipient}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Bank & Account</span>
                <span className="font-semibold text-slate-800">{completedTx.bank} • {completedTx.accountNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Transaction Ref</span>
                <span className="font-mono text-slate-800 font-semibold">{completedTx.reference}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Transfer Fee</span>
                <span className="font-bold text-brand-600">FREE (₦0.00)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Date & Time</span>
                <span className="text-slate-700">{formatDate(completedTx.timestamp)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {/* Download Receipt as Image Button */}
            <Button
              fullWidth
              size="lg"
              variant="accent"
              onClick={handleDownloadReceipt}
              icon={Download}
              className="shadow-md"
            >
              Download Receipt (PNG)
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowReceiptModal(true)}
                className="flex-1"
                icon={FileText}
              >
                View Full Receipt
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  const text = `TEMIPAY TRANSFER RECEIPT\nAmount: ${formatNaira(Math.abs(completedTx.amount))}\nSender: ${user.fullName}\nRecipient: ${completedTx.recipient}\nBank: ${completedTx.bank}\nRef: ${completedTx.reference}\nStatus: SUCCESSFUL`;
                  if (navigator.share) {
                    navigator.share({ title: 'TemiPay Receipt', text }).catch(() => {});
                  } else {
                    navigator.clipboard?.writeText(text);
                    showToast('Receipt details copied', 'success');
                  }
                }}
                className="flex-1"
                icon={Share2}
              >
                Share
              </Button>
            </div>

            <Button
              fullWidth
              size="md"
              variant="ghost"
              onClick={() => navigate('/')}
              icon={Home}
            >
              Back to Home
            </Button>
          </div>
        </div>
      )}

      {/* BANK SELECTOR BOTTOM SHEET */}
      <BankSelector
        isOpen={showBankSelector}
        onClose={() => setShowBankSelector(false)}
        selectedBank={selectedBank}
        onSelectBank={(bank) => setSelectedBank(bank)}
      />

      {/* FULL RECEIPT MODAL */}
      <ReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        transaction={completedTx}
      />

      {/* PIN ENTRY BOTTOM SHEET */}
      <BottomSheet
        isOpen={showPinSheet}
        onClose={() => {
          if (!isProcessing) setShowPinSheet(false);
        }}
        showClose={!isProcessing}
      >
        <PinPad
          title="Enter 4-Digit Security PIN"
          subtitle={`Authorize transfer of ${formatNaira(amount)} to ${accountName}`}
          error={pinError}
          onComplete={handlePinSubmit}
          onBiometricClick={() => handlePinSubmit('1234')}
        />
        {isProcessing && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs font-bold text-slate-800">Processing Virtual Transfer...</p>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
