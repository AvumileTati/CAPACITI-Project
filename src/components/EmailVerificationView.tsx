import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RotateCw,
  LogOut,
  Inbox,
  KeyRound,
  ShieldAlert,
} from 'lucide-react';
import { motion } from 'motion/react';

export const EmailVerificationView: React.FC = () => {
  const {
    currentUser,
    verifyEmail,
    resendVerificationEmail,
    signOut,
    outbox,
    setIsOutboxOpen,
  } = useApp();

  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Find latest verification email in outbox for quick test helper
  const latestOutboxItem = outbox.find(
    (item) => item.to.toLowerCase() === currentUser?.email?.toLowerCase() && item.template === 'email_verification'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setErrorMsg('Please enter your 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const success = await verifyEmail(code);
    setIsSubmitting(false);

    if (!success) {
      setErrorMsg('Invalid code. Please verify the code sent to your email or check the outbox.');
    }
  };

  const handleAutoFill = () => {
    if (currentUser?.verification_code) {
      setCode(currentUser.verification_code);
    }
  };

  return (
    <div
      id="email-verification-view"
      className="min-h-screen w-full bg-[#060f1e] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans p-4 sm:p-6"
    >
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 max-w-4xl mx-auto w-full flex items-center justify-between py-4">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold">
            TR
          </div>
          <span className="text-sm font-bold text-white tracking-tight">TechnoResolve Desk</span>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors px-3 py-1.5 rounded-lg border border-slate-800 hover:border-rose-900/50 cursor-pointer"
        >
          <LogOut className="size-3.5" />
          <span>Sign Out</span>
        </button>
      </header>

      {/* Center card */}
      <main className="relative z-10 max-w-md mx-auto w-full my-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[#163666] bg-[#09172e]/95 backdrop-blur-md p-6 sm:p-8 shadow-2xl space-y-6"
        >
          <div className="size-14 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 mx-auto grid place-items-center shadow-inner">
            <Mail className="size-7 animate-pulse" />
          </div>

          <div className="text-center space-y-1.5">
            <h2 className="text-xl font-bold text-white tracking-tight">Confirm Your Email Address</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              We sent a 6-digit confirmation code to{' '}
              <span className="font-semibold text-cyan-300 font-mono">{currentUser?.email}</span>
            </p>
          </div>

          {/* Quick simulation helper badge */}
          {currentUser?.verification_code && (
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/40 p-3.5 text-xs text-cyan-200 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px] uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                  <KeyRound className="size-3.5" /> Outbox Verification Code
                </span>
                <button
                  type="button"
                  onClick={handleAutoFill}
                  className="text-[11px] font-bold text-cyan-300 hover:underline cursor-pointer bg-cyan-500/20 px-2 py-0.5 rounded"
                >
                  Auto-fill code
                </button>
              </div>
              <div className="flex items-center justify-between bg-[#060f1e] px-3 py-2 rounded-lg border border-cyan-900/50">
                <span className="font-mono text-base font-extrabold tracking-widest text-white">
                  {currentUser.verification_code}
                </span>
                <button
                  type="button"
                  onClick={() => setIsOutboxOpen(true)}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                >
                  <Inbox className="size-3" /> View Outbox
                </button>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/50 p-3 text-xs text-rose-300">
              <AlertCircle className="size-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-center">
                Enter 6-Digit Confirmation Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full text-center tracking-[0.4em] font-mono text-2xl font-bold rounded-xl border border-[#142e56] bg-[#060f1e] py-3 text-white placeholder:text-slate-600 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || code.length < 6}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-3 text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <span>Confirm Email</span>
                  <CheckCircle2 className="size-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-[#12284b] flex items-center justify-between text-xs text-slate-400">
            <span>Didn't receive the email?</span>
            <button
              type="button"
              onClick={() => resendVerificationEmail()}
              className="flex items-center gap-1 font-semibold text-cyan-400 hover:underline cursor-pointer"
            >
              <RotateCw className="size-3" /> Resend Code
            </button>
          </div>
        </motion.div>
      </main>

      <footer className="relative z-10 py-4 max-w-4xl mx-auto w-full text-center text-xs text-slate-500">
        TechnoResolve Security & Identity Verification
      </footer>
    </div>
  );
};
