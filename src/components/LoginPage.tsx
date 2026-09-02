import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Bot,
  Mail,
  Lock,
  User,
  Building,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoginPageProps {
  onBackToLanding?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBackToLanding }) => {
  const {
    users,
    signIn,
    signUp,
    showToast,
  } = useApp();

  const isSystemEmpty = users.length === 0;
  const [mode, setMode] = useState<'signin' | 'signup'>(isSystemEmpty ? 'signup' : 'signin');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        if (password.length < 6) {
          showToast('Password must be at least 6 characters.', 'error');
          setIsLoading(false);
          return;
        }
        await signUp({
          email,
          password,
          full_name: fullName,
          company: company || 'TechnoResolve',
          role: 'user', // Always default to user, backend promotes first user to admin
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-[#f8fafc] text-slate-900 font-sans selection:bg-[#00d492]/30">
      
      {/* LEFT PANEL - Branding (Hidden on small mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#123333] flex-col justify-between p-12 relative overflow-hidden">
        {/* Ambient background blur */}
        <div className="absolute -top-[10%] -left-[10%] w-[55%] h-[55%] rounded-full bg-[#00d492]/10 blur-[130px]" />
        <div className="absolute top-[35%] -right-[10%] w-[45%] h-[45%] rounded-full bg-[#0f3b6c]/30 blur-[140px]" />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="size-10 rounded-xl bg-[#00d492] text-[#123333] shadow-md grid place-items-center font-bold">
            <Bot className="size-5" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-white">TechnoResolve Desk</span>
        </div>

        <div className="relative z-10 max-w-lg mb-10">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white font-display leading-[1.1] mb-6">
            Intelligent IT Service Management.
          </h1>
          <p className="text-lg text-slate-300 font-medium leading-relaxed">
            Unify your team's support operations with automated AI triage, real-time ticket execution, and a friction-free storefront.
          </p>
        </div>

        <div className="relative z-10 text-sm font-medium text-slate-400">
          © {new Date().getFullYear()} TechnoResolve Enterprise
        </div>
      </div>

      {/* RIGHT PANEL - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 md:px-20 py-12 relative overflow-y-auto">
        
        {/* Mobile Header (Visible only on small screens) */}
        <div className="lg:hidden flex items-center gap-3 mb-10">
          <div className="size-10 rounded-xl bg-[#123333] text-[#00d492] shadow-sm grid place-items-center font-bold">
            <Bot className="size-5" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-[#123333]">TechnoResolve</span>
        </div>

        {/* Back Button */}
        {onBackToLanding && (
          <button 
            onClick={onBackToLanding}
            className="absolute top-8 left-6 lg:left-12 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Back to website</span>
          </button>
        )}

        <div className="max-w-md w-full mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 font-display mb-2">
              {mode === 'signin' ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-slate-500 font-medium">
              {mode === 'signin' 
                ? 'Sign in to access your workspace and tickets.'
                : (isSystemEmpty ? 'Set up the initial Administrator account.' : 'Join the organization to submit and track requests.')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <AnimatePresence mode="popLayout">
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Jane Doe"
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00d492] focus:border-transparent transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Company / Department <span className="text-slate-400 font-normal">(Optional)</span></label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Engineering"
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00d492] focus:border-transparent transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00d492] focus:border-transparent transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5 pb-2">
              <label className="text-sm font-bold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-10 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00d492] focus:border-transparent transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-[#123333] hover:bg-[#1a4a4a] text-white rounded-xl font-bold transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>


          {/* Toggle Mode */}
          {!isSystemEmpty && (
            <p className="mt-8 text-center text-sm font-medium text-slate-600">
              {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="font-bold text-[#123333] hover:text-[#00d492] hover:underline transition-all"
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          )}

        </div>
      </div>
    </div>
  );
};
