import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  ShieldCheck,
  Wrench,
  User,
  Lock,
  Mail,
  Building,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  Layers,
  ArrowLeft,
  Crown,
  Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoginPageProps {
  onBackToLanding?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBackToLanding }) => {
  const {
    users,
    signIn,
    signInWithGoogle,
    signUp,
    switchDemoUser,
    setActivePage,
    setViewRole,
    purgeAllData,
    showToast,
  } = useApp();

  const isSystemEmpty = users.length === 0;

  const [mode, setMode] = useState<'signin' | 'signup'>(isSystemEmpty ? 'signup' : 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState<UserRole>('admin');
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const success = await signInWithGoogle();
      if (success) {
        setActivePage('dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Google authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Please provide both email and password.');
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === 'signin') {
        const success = await signIn(email, password);
        if (success) {
          setActivePage('dashboard');
        } else {
          setErrorMsg('Authentication failed. Please check your credentials.');
        }
      } else {
        const success = await signUp({
          email,
          password,
          full_name: fullName,
          company: company || 'TechnoResolve Global',
          role: isSystemEmpty ? 'admin' : role,
        });
        if (success) {
          setActivePage('dashboard');
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFirstAdmin = async () => {
    setIsLoading(true);
    try {
      await signUp({
        email: 'admin@technoresolve.internal',
        password: 'AdminPassword123!',
        full_name: 'Lead System Administrator',
        company: 'TechnoResolve Control',
        role: 'admin',
      });
      setActivePage('dashboard');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to setup admin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="login-page"
      className="min-h-screen w-full bg-white text-slate-900 flex flex-col justify-between relative overflow-hidden font-sans"
    >
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header with brand & back button */}
      <header className="relative z-10 max-w-6xl mx-auto w-full px-6 py-6 flex items-center justify-between bg-[#5088c3] text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-slate-100 text-[#0f3b6c] border border-[#0f3b6c]/20 flex items-center justify-center shadow-xs">
            <Layers className="size-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#ffffff] tracking-tight">TechnoResolve Desk</h1>
            <p className="text-[11px] text-white/80 font-mono">Enterprise Cloud Service</p>
          </div>
        </div>

        {onBackToLanding && (
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:border-slate-500 transition-all cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            <span>Portal Home</span>
          </button>
        )}
      </header>

      {/* Center Container */}
      <main className="relative z-10 max-w-md mx-auto w-full px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-md p-6 sm:p-8 shadow-2xl space-y-6"
        >
          {/* First User Notice Banner */}
          {isSystemEmpty && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-950/40 p-3.5 text-amber-200 text-xs flex items-start gap-2.5">
              <Crown className="size-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900 text-[12px]">First User Registration</p>
                <p className="text-[11px] text-amber-300/90 leading-relaxed mt-0.5">
                  Database is clean with 0 users. The first person to sign in or register will automatically receive full <strong>System Administrator</strong> privileges.
                </p>
              </div>
            </div>
          )}

          {/* Header tabs: Sign In vs Create Account */}
          <div className="flex rounded-xl bg-white p-1 border border-slate-200">
            <button
              onClick={() => {
                setMode('signin');
                setErrorMsg(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-[#4caf50] text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              <LogIn className="size-3.5" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setErrorMsg(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-[#4caf50] text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              <UserPlus className="size-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          {/* Title & subtitle */}
          <div className="text-center space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {mode === 'signin' ? 'Sign In to Account' : isSystemEmpty ? 'Initialize Administrator Account' : 'Create Account'}
            </h2>
            <p className="text-xs text-slate-400">
              {mode === 'signin'
                ? 'Enter your credentials to access your portal and tickets'
                : isSystemEmpty
                ? 'Set up the root administrator profile for your organisation'
                : 'Register your account with Cloud Firestore sync'}
            </p>
          </div>

          {/* Error Message banner */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/50 p-3 text-xs text-rose-300"
            >
              <AlertCircle className="size-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {/* Google Sign In with Firebase Auth */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-transparent bg-[#4c7db7] hover:bg-[#3b608f] text-white font-semibold py-2.5 px-4 text-xs transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              <svg className="size-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>
                {mode === 'signin'
                  ? 'Sign in with Google'
                  : isSystemEmpty
                  ? 'Initialize Admin with Google'
                  : 'Continue with Google'}
              </span>
            </button>

            <div className="flex items-center gap-3 text-xs text-slate-500">
              <div className="flex-1 border-t border-slate-200"></div>
              <span className="text-[11px] font-medium text-slate-400">or with email credentials</span>
              <div className="flex-1 border-t border-slate-200"></div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name <span className="text-[#0f3b6c]">*</span>
                  </label>
                  <div className="relative">
                    <User className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Awonke Philibane"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-500 outline-none focus:border-[#0f3b6c] focus:ring-1 focus:ring-[#0f3b6c]/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Company / Organization
                  </label>
                  <div className="relative">
                    <Building className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Acme Enterprise"
                      className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-500 outline-none focus:border-[#0f3b6c] focus:ring-1 focus:ring-[#0f3b6c]/20 transition-all"
                    />
                  </div>
                </div>

                {!isSystemEmpty && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Account Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#0f3b6c] transition-all"
                    >
                      <option value="user">Customer / User (Self Service & Tickets)</option>
                      <option value="technician">Support Technician (Triage & Queues)</option>
                    </select>
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address <span className="text-[#0f3b6c]">*</span>
              </label>
              <div className="relative">
                <Mail className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-500 outline-none focus:border-[#0f3b6c] focus:ring-1 focus:ring-[#0f3b6c]/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password <span className="text-[#0f3b6c]">*</span>
              </label>
              <div className="relative">
                <Lock className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder:text-slate-500 outline-none focus:border-[#0f3b6c] focus:ring-1 focus:ring-[#0f3b6c]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900"
                >
                  {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm Password <span className="text-[#0f3b6c]">*</span>
                </label>
                <div className="relative">
                  <Lock className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-500 outline-none focus:border-[#0f3b6c] focus:ring-1 focus:ring-[#0f3b6c]/20 transition-all"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#4caf50] hover:bg-[#388e3c] text-white font-bold py-3 text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <span>Processing...</span>
              ) : mode === 'signin' ? (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="size-4" />
                </>
              ) : (
                <>
                  <span>{isSystemEmpty ? 'Initialize Administrator Account' : 'Create Account'}</span>
                  <CheckCircle2 className="size-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick First-Admin Initialization Helper */}
          {isSystemEmpty && (
            <div className="border-t border-slate-200 pt-4 text-center">
              <button
                type="button"
                onClick={handleQuickFirstAdmin}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-950/30 hover:bg-amber-900/40 text-amber-200 py-2.5 text-xs font-semibold transition-all cursor-pointer"
              >
                <Crown className="size-4 text-amber-400" />
                <span>1-Click Setup Default Admin</span>
              </button>
            </div>
          )}
        </motion.div>
      </main>

      {/* Footer with Purge button */}
      <footer className="relative z-10 py-4 px-6 max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <p>TechnoResolve IT Service Desk · Real-time Firestore Persisted</p>
        <button
          onClick={purgeAllData}
          className="flex items-center gap-1 text-slate-500 hover:text-rose-400 transition-colors text-[11px] cursor-pointer"
        >
          <Trash2 className="size-3" />
          <span>Wipe & Reset All Database Collections</span>
        </button>
      </footer>
    </div>
  );
};
