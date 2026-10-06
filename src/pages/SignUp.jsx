import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ShieldCheck, Lock, User, Phone, KeyRound } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PinPad } from '../components/ui/PinPad';
import { validateNigerianPhone, validateOtp, validatePin } from '../utils/validation';
import { useAppStore } from '../store/useAppStore';

export function SignUp() {
  const navigate = useNavigate();
  const signup = useAppStore((state) => state.signup);
  const showToast = useAppStore((state) => state.showToast);

  const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: Details & Password, 4: PIN
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // OTP state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const otpInputsRef = useRef([]);

  // User details state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [detailsError, setDetailsError] = useState('');

  // PIN state
  const [pinStep, setPinStep] = useState(1); // 1: set PIN, 2: confirm PIN
  const [pin1, setPin1] = useState('');
  const [pinError, setPinError] = useState('');

  // Resend timer countdown
  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Step 1: Submit Phone
  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    const val = validateNigerianPhone(phone);
    if (!val.valid) {
      setPhoneError(val.message);
      return;
    }
    setPhoneError('');
    setStep(2);
    setTimer(30);
    setCanResend(false);
    showToast(`Verification code sent to ${phone}`, 'info');
  };

  // Step 2: Handle OTP input
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits entered
    if (newOtp.every((digit) => digit !== '')) {
      setTimeout(() => {
        setStep(3);
        showToast('Phone number verified successfully!', 'success');
      }, 300);
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    setOtp(['', '', '', '', '', '']);
    setTimer(30);
    setCanResend(false);
    showToast('New 6-digit OTP sent!', 'info');
  };

  // Step 3: Handle Personal Info & Password
  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setDetailsError('Please provide your full legal name');
      return;
    }
    if (password.length < 6) {
      setDetailsError('Password must be at least 6 characters');
      return;
    }
    setDetailsError('');
    setStep(4);
  };

  // Step 4: Handle PIN Creation
  const handlePinInput = (enteredPin) => {
    if (pinStep === 1) {
      setPin1(enteredPin);
      setPinStep(2);
      setPinError('');
    } else {
      if (enteredPin !== pin1) {
        setPinError('PINs do not match. Please try again.');
        setPinStep(1);
        setPin1('');
      } else {
        // Successful signup
        signup({
          phone,
          firstName,
          lastName,
          pin: enteredPin,
        });
        navigate('/');
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white min-h-[700px] select-none">
      {/* Top Bar with Step Indicators */}
      <div className="p-4 flex items-center justify-between border-b border-slate-100">
        <button
          type="button"
          onClick={() => {
            if (step > 1) {
              if (step === 4 && pinStep === 2) {
                setPinStep(1);
              } else {
                setStep(step - 1);
              }
            } else {
              navigate(-1);
            }
          }}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Progress pill */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === s ? 'w-6 bg-brand-500' : step > s ? 'w-3 bg-brand-200' : 'w-2 bg-slate-200'
              }`}
            />
          ))}
        </div>

        <Link to="/login" className="text-xs font-bold text-brand-600 hover:underline">
          Log in
        </Link>
      </div>

      <div className="flex-1 p-6 flex flex-col justify-between">
        {/* STEP 1: PHONE NUMBER */}
        {step === 1 && (
          <form onSubmit={handlePhoneSubmit} className="space-y-6 animate-fade-in">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 mb-4 border border-brand-100">
                <Phone className="w-6 h-6 stroke-[2]" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">Create your TemiPay account</h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your mobile number. Your phone number becomes your 10-digit account number!
              </p>
            </div>

            <div className="space-y-4">
              <Input
                label="Phone Number"
                type="tel"
                inputMode="numeric"
                placeholder="0801 234 5678"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setPhoneError('');
                }}
                error={phoneError}
                helperText="Must be a valid 11-digit Nigerian mobile number"
              />

              <div className="p-3.5 bg-brand-50/60 rounded-2xl border border-brand-100 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-brand-800 leading-relaxed font-medium">
                  We use your phone number to automatically provision your high-yield TemiPay digital wallet.
                </p>
              </div>
            </div>

            <Button type="submit" fullWidth size="lg" variant="primary">
              Verify Phone Number
            </Button>
          </form>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in flex flex-col items-center">
            <div className="w-full">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 mb-4 border border-brand-100">
                <KeyRound className="w-6 h-6 stroke-[2]" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">Enter 6-digit Code</h2>
              <p className="text-xs text-slate-500 mt-1">
                We sent an SMS OTP code to <span className="font-bold text-slate-800 font-mono">{phone}</span>
              </p>
            </div>

            {/* 6 OTP boxes */}
            <div className="flex justify-between gap-2 w-full max-w-[340px] my-4">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (otpInputsRef.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-11 h-14 text-center text-xl font-bold bg-slate-50 border border-slate-200 rounded-2xl focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
                  autoFocus={idx === 0}
                />
              ))}
            </div>

            <div className="text-center">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-xs font-bold text-brand-600 hover:underline"
                >
                  Didn't get code? Tap to Resend OTP
                </button>
              ) : (
                <p className="text-xs text-slate-400">
                  Resend code in <span className="font-bold text-slate-600 font-mono">{timer}s</span>
                </p>
              )}
            </div>

            <Button
              fullWidth
              size="lg"
              variant="secondary"
              onClick={() => {
                setOtp(['1', '2', '3', '4', '5', '6']);
                setTimeout(() => setStep(3), 200);
              }}
              className="mt-4"
            >
              Auto-fill Demo Code (123456)
            </Button>
          </div>
        )}

        {/* STEP 3: NAME & PASSWORD */}
        {step === 3 && (
          <form onSubmit={handleDetailsSubmit} className="space-y-5 animate-fade-in">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 mb-4 border border-brand-100">
                <User className="w-6 h-6 stroke-[2]" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">Personal Details</h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your details exactly as they appear on your BVN / National ID.
              </p>
            </div>

            <div className="space-y-3.5">
              <Input
                label="First Name"
                placeholder="e.g. Temitope"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />

              <Input
                label="Last Name"
                placeholder="e.g. Adebayo"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />

              <Input
                label="Create Password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {detailsError && (
                <p className="text-xs text-rose-500 font-semibold">• {detailsError}</p>
              )}
            </div>

            <Button type="submit" fullWidth size="lg" variant="primary">
              Continue to PIN Setup
            </Button>
          </form>
        )}

        {/* STEP 4: 4-DIGIT TRANSACTION PIN */}
        {step === 4 && (
          <div className="space-y-4 animate-fade-in flex flex-col items-center">
            <PinPad
              title={pinStep === 1 ? 'Create 4-Digit Security PIN' : 'Confirm Your Security PIN'}
              subtitle={
                pinStep === 1
                  ? 'You will use this PIN to authorize all transfers and payments'
                  : 'Re-enter your 4 digits to verify'
              }
              error={pinError}
              allowBiometrics={false}
              onComplete={handlePinInput}
            />

            <p className="text-[11px] text-center text-slate-400 mt-2">
              Never share your transaction PIN with anyone, including TemiPay agents.
            </p>
          </div>
        )}

        {/* Bottom footer note */}
        <div className="pt-4 text-center">
          <p className="text-[11px] text-slate-400">
            By signing up, you agree to TemiPay's Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
