import React, { useState } from 'react';
import { CheckCircle2, Share2, Copy, Download, UserPlus, Check, Printer, FileText } from 'lucide-react';
import { formatNaira, formatDate } from '../../utils/formatters';
import { generateReceiptImage } from '../../utils/receiptGenerator';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/useAppStore';

export function ReceiptModal({ isOpen, onClose, transaction }) {
  const [copied, setCopied] = useState(false);
  const [savedBeneficiary, setSavedBeneficiary] = useState(false);
  const user = useAppStore((state) => state.user);
  const addBeneficiary = useAppStore((state) => state.addBeneficiary);
  const showToast = useAppStore((state) => state.showToast);

  if (!transaction) return null;

  const senderName = transaction.sender || transaction.senderName || user.fullName;
  const recipientName = transaction.recipient || transaction.recipientName || transaction.title;

  const handleCopyRef = () => {
    if (transaction.reference) {
      navigator.clipboard?.writeText(transaction.reference);
      setCopied(true);
      showToast('Reference copied to clipboard', 'info');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = () => {
    const text = `TEMIPAY TRANSACTION RECEIPT\n` +
      `---------------------------\n` +
      `Status: SUCCESSFUL\n` +
      `Amount: ${formatNaira(Math.abs(transaction.amount))}\n` +
      `Sender: ${senderName.toUpperCase()}\n` +
      `Beneficiary: ${recipientName.toUpperCase()}\n` +
      `Bank: ${transaction.bank || 'TemiPay MFB'}\n` +
      (transaction.accountNumber ? `Account: ${transaction.accountNumber}\n` : '') +
      `Ref: ${transaction.reference}\n` +
      `Date: ${formatDate(transaction.timestamp)}\n` +
      `Narration: ${transaction.narration || 'TemiPay Transfer'}\n` +
      `---------------------------\n` +
      `Generated on TemiPay — Beyond Banking`;

    if (navigator.share) {
      navigator.share({
        title: 'TemiPay Transaction Receipt',
        text: text,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text);
      showToast('Full receipt details copied to clipboard!', 'success');
    }
  };

  const handleDownloadImage = () => {
    generateReceiptImage({
      amount: transaction.amount,
      senderName: senderName,
      senderAccount: user.accountNumber,
      recipient: recipientName,
      bank: transaction.bank || 'Commercial Bank',
      accountNumber: transaction.accountNumber,
      narration: transaction.narration,
      reference: transaction.reference,
      date: formatDate(transaction.timestamp),
      type: transaction.type?.includes('IN') ? 'Credit Received' : 'Interbank Transfer (Virtual Money)',
    });
    showToast('Receipt image downloaded! Check your downloads.', 'success');
  };

  const handleSaveBen = () => {
    if (recipientName && transaction.accountNumber) {
      addBeneficiary({
        name: recipientName,
        bankName: transaction.bank || 'Commercial Bank',
        accountNumber: transaction.accountNumber,
      });
      setSavedBeneficiary(true);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showClose={true} maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center">
        {/* TemiPay Brand Watermark Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-brand-500 to-teal-700 flex items-center justify-center text-white font-black text-xs shadow-sm">
            TP
          </div>
          <div>
            <span className="font-extrabold text-sm text-slate-900 tracking-tight block leading-none">TemiPay</span>
            <span className="text-[9px] text-brand-700 font-bold uppercase tracking-wider">Official Bank Receipt</span>
          </div>
        </div>

        {/* Status Stamp */}
        <div className="w-12 h-12 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center text-emerald-600 my-1">
          <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
        </div>
        <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200">
          Transaction Successful
        </span>

        {/* Big Amount Display */}
        <h2 className="text-3xl font-black text-slate-900 mt-2 mb-0.5 tracking-tight">
          {formatNaira(Math.abs(transaction.amount))}
        </h2>
        <p className="text-[11px] text-slate-400 mb-4">{transaction.title}</p>

        {/* Complete Breakdown Card */}
        <div className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left space-y-2 text-xs mb-5">
          {/* Sender Details */}
          <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium">Sender Name</span>
            <span className="font-bold text-slate-900 text-right uppercase">{senderName}</span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium">Sender Account</span>
            <span className="font-semibold text-slate-800 font-mono">TemiPay MFB • {user.accountNumber}</span>
          </div>

          {/* Recipient Details */}
          <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium">Recipient Name</span>
            <span className="font-bold text-slate-900 text-right uppercase">{recipientName}</span>
          </div>

          {transaction.bank && (
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Destination Bank</span>
              <span className="font-semibold text-slate-800">{transaction.bank}</span>
            </div>
          )}

          {transaction.accountNumber && (
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Account Number</span>
              <span className="font-semibold text-slate-800 font-mono">{transaction.accountNumber}</span>
            </div>
          )}

          {transaction.meterNumber && (
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Meter Number</span>
              <span className="font-semibold text-slate-800 font-mono">{transaction.meterNumber}</span>
            </div>
          )}

          {transaction.token && (
            <div className="flex flex-col py-1.5 border-b border-slate-200/60 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
              <span className="text-slate-500 text-[10px] font-bold uppercase">Prepaid Token</span>
              <span className="font-black text-brand-700 font-mono text-sm tracking-wider">{transaction.token}</span>
            </div>
          )}

          {transaction.narration && (
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Narration</span>
              <span className="font-medium text-slate-700 italic max-w-[200px] truncate">{transaction.narration}</span>
            </div>
          )}

          <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium">Transaction Fee</span>
            <span className="font-bold text-brand-600">
              {transaction.fee ? formatNaira(transaction.fee) : 'Free (₦0.00)'}
            </span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium">Date & Time</span>
            <span className="font-medium text-slate-700">{formatDate(transaction.timestamp)}</span>
          </div>

          <div className="flex justify-between items-center pt-1">
            <span className="text-slate-500 font-medium">Reference</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[11px] text-slate-700 font-bold">{transaction.reference}</span>
              <button
                type="button"
                onClick={handleCopyRef}
                className="p-1 hover:text-brand-600 rounded text-slate-400"
                title="Copy reference"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-brand-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons: Download Image, Share, Save Beneficiary, Done */}
        <div className="w-full space-y-2">
          <Button
            fullWidth
            variant="accent"
            size="md"
            onClick={handleDownloadImage}
            icon={Download}
            className="shadow-md"
          >
            Download Receipt Image (PNG)
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex-1"
              icon={Share2}
            >
              Share Details
            </Button>

            {transaction.accountNumber && !savedBeneficiary && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSaveBen}
                className="flex-1"
                icon={UserPlus}
              >
                Save Contact
              </Button>
            )}
          </div>

          <Button fullWidth variant="ghost" size="sm" onClick={onClose}>
            Close Receipt
          </Button>
        </div>
      </div>
    </Modal>
  );
}
