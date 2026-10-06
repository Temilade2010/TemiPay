import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAppStore } from '../store/useAppStore';

export function ForgotPassword() {
  const navigate = useNavigate();
  const showToast = useAppStore((state) => state.showToast);
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone) return;
    setSubmitted(true);
    showToast('Reset instructions sent via SMS', 'success');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-white min-h-[700px] select-none">
      <div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 mb-4 border border-brand-100">
          <KeyRound className="w-6 h-6 stroke-[2]" />
        </div>

        <h2 className="text-2xl font-black text-slate-900 leading-tight">Reset Password</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          Enter your registered TemiPay phone number and we will send you an OTP to reset your login password.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Phone Number"
              type="tel"
              placeholder="0812 345 6789"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <Button type="submit" fullWidth size="lg" variant="primary">
              Send Reset Code
            </Button>
          </form>
        ) : (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-emerald-900 text-sm">Code Sent!</h3>
            <p className="text-xs text-emerald-700">
              Check your SMS inbox for the 6-digit recovery code.
            </p>
            <Button fullWidth size="sm" variant="primary" onClick={() => navigate('/login')}>
              Return to Login
            </Button>
          </div>
        )}
      </div>

      <div className="text-center pt-6">
        <Link to="/login" className="text-xs font-bold text-brand-600 hover:underline">
          Remember password? Log in
        </Link>
      </div>
    </div>
  );
}
