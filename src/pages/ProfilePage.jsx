import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  ShieldCheck, 
  Lock, 
  Fingerprint, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  Copy, 
  Check, 
  MessageSquare, 
  PhoneCall, 
  KeyRound,
  FileText
} from 'lucide-react';
import { Header } from '../components/shared/Header';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useAppStore } from '../store/useAppStore';
import { formatNaira } from '../utils/formatters';

export function ProfilePage() {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);
  const upgradeKycTier = useAppStore((state) => state.upgradeKycTier);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const showToast = useAppStore((state) => state.showToast);

  const [copiedAcc, setCopiedAcc] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [customName, setCustomName] = useState(user.fullName);
  const [customBal, setCustomBal] = useState(user.balance.toString());
  const setVirtualBalance = useAppStore((state) => state.setVirtualBalance);

  // KYC modal state
  const [bvnInput, setBvnInput] = useState('');
  const [isUpgradingKyc, setIsUpgradingKyc] = useState(false);

  // PIN modal state
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');

  const handleCopyAccount = () => {
    navigator.clipboard?.writeText(user.accountNumber);
    setCopiedAcc(true);
    showToast('Account number copied', 'info');
    setTimeout(() => setCopiedAcc(false), 2000);
  };

  const handleKycUpgrade = (e) => {
    e.preventDefault();
    if (bvnInput.length < 11) {
      showToast('BVN must be 11 digits', 'error');
      return;
    }
    setIsUpgradingKyc(true);
    setTimeout(() => {
      upgradeKycTier(3, bvnInput);
      setIsUpgradingKyc(false);
      setShowKycModal(false);
    }, 800);
  };

  const handleChangePin = (e) => {
    e.preventDefault();
    if (newPin.length !== 4) {
      showToast('PIN must be 4 digits', 'error');
      return;
    }
    updateProfile({ pin: newPin });
    showToast('Transaction PIN changed successfully!', 'success');
    setShowPinModal(false);
    setCurrentPin('');
    setNewPin('');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen select-none pb-24">
      <Header
        title="My Profile"
        subtitle="Account & Security Settings"
        showBack={false}
      />

      <div className="p-4 space-y-4">
        {/* USER PROFILE CARD */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.fullName}
                className="w-16 h-16 rounded-3xl object-cover ring-2 ring-brand-500/40 shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] text-white font-black">
                ✓
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-base font-black text-slate-900 truncate">
                {user.fullName}
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{user.phone}</p>
              
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-brand-50 text-brand-700 px-2 py-0.5 rounded-md border border-brand-200">
                  Tier {user.kycTier} Verified
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  TemiPay MFB: {user.accountNumber}
                </span>
                <button
                  type="button"
                  onClick={handleCopyAccount}
                  className="p-1 text-slate-400 hover:text-brand-600 rounded transition-colors"
                >
                  {copiedAcc ? <Check className="w-3 h-3 text-brand-600" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>

              {/* Edit name button */}
              <button
                type="button"
                onClick={() => {
                  setCustomName(user.fullName);
                  setCustomBal(user.balance.toString());
                  setShowEditProfileModal(true);
                }}
                className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-xl transition-colors border border-brand-200"
              >
                <span>Edit My Name & Balance</span>
              </button>
            </div>
          </div>
        </div>

        {/* KYC TIER CARD & LIMITS */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-950 rounded-3xl p-5 text-white shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-300">
                KYC Level & Limits
              </span>
              <h3 className="text-sm font-black mt-0.5">
                Current Status: Tier {user.kycTier}
              </h3>
            </div>
            {user.kycTier < 3 && (
              <button
                type="button"
                onClick={() => setShowKycModal(true)}
                className="px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
              >
                Upgrade to Tier 3
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10 text-xs">
            <div>
              <p className="text-teal-200 text-[10px]">Daily Transfer Limit</p>
              <p className="font-extrabold text-white text-sm mt-0.5">
                {formatNaira(user.dailyLimit, { showDecimals: false })}
              </p>
            </div>
            <div>
              <p className="text-teal-200 text-[10px]">Single Transaction Limit</p>
              <p className="font-extrabold text-white text-sm mt-0.5">
                {formatNaira(user.singleLimit, { showDecimals: false })}
              </p>
            </div>
          </div>
        </div>

        {/* SECURITY & SETTINGS */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-soft space-y-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 py-1 mb-1">
            Security & Authentication
          </h3>

          <button
            type="button"
            onClick={() => setShowPinModal(true)}
            className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <KeyRound className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Change Transaction PIN</p>
                <p className="text-[11px] text-slate-400">Update your 4-digit security code</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => {
              updateProfile({ biometricsEnabled: !user.biometricsEnabled });
              showToast(`Biometrics ${!user.biometricsEnabled ? 'enabled' : 'disabled'}`, 'info');
            }}
            className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Fingerprint className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Biometric Sign-In</p>
                <p className="text-[11px] text-slate-400">Face ID & Fingerprint login</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={user.biometricsEnabled}
              readOnly
              className="w-4 h-4 text-brand-600 rounded border-slate-300"
            />
          </button>
        </div>

        {/* SUPPORT & INFORMATION */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-soft space-y-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 py-1 mb-1">
            Help & Customer Support
          </h3>

          <button
            type="button"
            onClick={() => setShowSupportModal(true)}
            className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">24/7 Live Support Chat</p>
                <p className="text-[11px] text-slate-400">Speak with a friendly TemiPay agent</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => showToast('Terms of Service & CBN policy up to date', 'info')}
            className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                <FileText className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Legal & Privacy Policy</p>
                <p className="text-[11px] text-slate-400">NDIC & CBN Compliance</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* LOGOUT BUTTON */}
        <div className="pt-2">
          <Button
            fullWidth
            variant="danger"
            size="md"
            onClick={handleLogout}
            icon={LogOut}
          >
            Log Out of TemiPay
          </Button>
        </div>
      </div>

      {/* KYC UPGRADE MODAL */}
      <Modal
        isOpen={showKycModal}
        onClose={() => setShowKycModal(false)}
        title="Upgrade to Tier 3 Account"
      >
        <form onSubmit={handleKycUpgrade} className="space-y-4">
          <div className="p-3 bg-brand-50 rounded-2xl text-xs text-brand-800 space-y-1 border border-brand-200">
            <p className="font-bold">Tier 3 Benefits:</p>
            <p>• Daily transfer limit up to ₦10,000,000</p>
            <p>• Unlimited wallet balance</p>
          </div>

          <Input
            label="Bank Verification Number (BVN)"
            inputMode="numeric"
            maxLength={11}
            placeholder="Enter 11-digit BVN"
            value={bvnInput}
            onChange={(e) => setBvnInput(e.target.value.replace(/\D/g, ''))}
            helperText="Dial *565*0# on your registered SIM to check BVN"
            required
          />

          <Button
            type="submit"
            fullWidth
            size="lg"
            variant="primary"
            isLoading={isUpgradingKyc}
          >
            Verify BVN & Upgrade
          </Button>
        </form>
      </Modal>

      {/* CHANGE PIN MODAL */}
      <Modal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        title="Change Transaction PIN"
      >
        <form onSubmit={handleChangePin} className="space-y-4">
          <Input
            label="Current PIN"
            type="password"
            maxLength={4}
            inputMode="numeric"
            placeholder="••••"
            value={currentPin}
            onChange={(e) => setCurrentPin(e.target.value)}
            required
          />

          <Input
            label="New 4-Digit PIN"
            type="password"
            maxLength={4}
            inputMode="numeric"
            placeholder="••••"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
            required
          />

          <Button type="submit" fullWidth size="lg" variant="primary">
            Save New PIN
          </Button>
        </form>
      </Modal>

      {/* LIVE SUPPORT MODAL */}
      <Modal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
        title="TemiPay Customer Support"
      >
        <div className="space-y-3 text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto text-2xl">
            💬
          </div>
          <h4 className="text-base font-bold text-slate-800">We are here 24/7</h4>
          <p className="text-xs text-slate-500">
            Need help with a transfer, transaction reversal or bill payment? Contact us:
          </p>

          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={() => {
                showToast('Connecting to WhatsApp support (+234 800 TEMIPAY)...', 'info');
                setShowSupportModal(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-xs shadow-sm hover:bg-emerald-700 transition-colors"
            >
              <span>Chat on WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => {
                showToast('Dialing toll-free customer desk: 0700-TEMIPAY', 'info');
                setShowSupportModal(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-800 rounded-2xl font-bold text-xs hover:bg-slate-200 transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Toll-Free Helpline</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* EDIT PROFILE / VIRTUAL WALLET MODAL */}
      <Modal
        isOpen={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
        title="Edit Account Name & Virtual Balance"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!customName.trim()) {
              showToast('Name is required', 'error');
              return;
            }
            updateProfile({ fullName: customName.trim() });
            setVirtualBalance(customBal);
            setShowEditProfileModal(false);
            showToast('Profile name & balance saved!', 'success');
          }}
          className="space-y-4"
        >
          <Input
            label="Your Full Name"
            placeholder="e.g. John Doe, Fatima Bello"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            helperText="This name will appear on all your receipts and account cards."
            required
          />

          <Input
            label="Virtual Money Balance (₦)"
            type="number"
            placeholder="500000"
            value={customBal}
            onChange={(e) => setCustomBal(e.target.value)}
            helperText="Custom balance for testing virtual transactions."
            required
          />

          <Button type="submit" fullWidth size="lg" variant="primary">
            Save Changes
          </Button>
        </form>
      </Modal>
    </div>
  );
}
