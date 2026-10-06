import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, Lock, Fingerprint, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAppStore } from '../store/useAppStore';

export function Login() {
  const navigate = useNavigate();
  const login = useAppStore((state) => state.login);
  const showToast = useAppStore((state) => state.showToast);

  const [phone, setPhone] = useState('08123456789');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login(phone, password);
      setIsLoading(false);
      navigate('/');
    }, 600);
  };

  const handleBiometricLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      login('08123456789', 'biometric');
      setIsLoading(false);
      showToast('Biometric authentication verified ✓', 'success');
      navigate('/');
    }, 500);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-white min-h-[700px] select-none">
      {/* Top Brand Header */}
      <div>
        <div className="flex items-center gap-2 mb-8 pt-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-teal-600 flex items-center justify-center shadow-md shadow-brand-500/20">
            <span className="font-extrabold text-white text-lg">TP</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 leading-tight">TemiPay</h1>
            <p className="text-[10px] text-brand-600 font-bold uppercase tracking-wider">Beyond Banking</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome back</h2>
          <p className="text-xs text-slate-500 mt-1">
            Sign in to access your wallet, transfer funds, and earn daily rewards.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Phone Number"
            type="tel"
            inputMode="numeric"
            placeholder="0801 234 5678"
            leftIcon={Phone}
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setError('');
            }}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            leftIcon={Lock}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
          />

          {error && (
            <p className="text-xs font-semibold text-rose-500 animate-fade-in">• {error}</p>
          )}

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-brand-500 focus:ring-brand-400" />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="font-bold text-brand-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            variant="primary"
            isLoading={isLoading}
            className="mt-2"
          >
            <span>Log In to TemiPay</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          {/* Biometrics Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleBiometricLogin}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-brand-50/70 border border-brand-200/80 text-brand-700 hover:bg-brand-100/60 transition-all active:scale-[0.98] font-bold text-xs"
            >
              <Fingerprint className="w-5 h-5 text-brand-600" />
              <span>Log In with Face ID / Fingerprint</span>
            </button>
          </div>
        </form>
      </div>

      {/* Bottom Footer Actions */}
      <div className="space-y-4 pt-6 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-brand-600 hover:underline">
            Create account
          </Link>
        </p>

        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Secured with 256-bit bank encryption</span>
        </div>
      </div>
    </div>
  );
}
