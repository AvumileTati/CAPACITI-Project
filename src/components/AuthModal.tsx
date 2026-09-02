import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  ShieldCheck,
  Wrench,
  User,
  X,
  Bot,
  Lock,
  Mail,
  Building,
  ArrowRight,
  Sparkles,
  Crown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AuthModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}> = ({ isOpen, onClose, initialMode = 'signin' }) => {
  const { signIn, signInWithGoogle, signUp, switchDemoUser, setActivePage, setViewRole } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const success = await signInWithGoogle();
      if (success) {
        setActivePage('dashboard');
        onClose();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        await signUp({
          email,
          password,
          full_name: fullName,
          company,
          role,
        });
      }
      setActivePage('dashboard');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (demoRole: UserRole) => {
    switchDemoUser(demoRole);
    setViewRole(demoRole);
    setActivePage('dashboard');
    onClose();
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-xs transition-opacity duration-200"
    >
      <motion.div
        id="auth-modal"
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="panel max-h-[92vh] w-full max-w-md overflow-y-auto p-6 shadow-2xl bg-surface border-border"
      >
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Bot className="size-4" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-foreground">
                {mode === 'signin' ? 'Sign in to TechnoResolve' : 'Create your account'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Google Sign In Option */}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-border bg-card hover:bg-secondary text-foreground font-semibold py-2.5 px-4 text-xs transition-all shadow-xs cursor-pointer disabled:opacity-50"
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
            <span>{mode === 'signin' ? 'Sign in with Google' : 'Continue with Google'}</span>
          </button>
        </div>

        <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex-1 border-t border-border"></div>
          <span>or continue with email</span>
          <div className="flex-1 border-t border-border"></div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <>
              <label className="block">
                <span className="text-xs font-semibold text-foreground">Full Name</span>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Awonke Philibane"
                  required
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-foreground">Company</span>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Acme Corp"
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
                />
              </label>

              <label className="block">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-foreground">Requested Role</span>
                  <span className="text-[10px] text-amber-600 font-medium">Assigned by Admin</span>
                </div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="user">Customer (Self Service)</option>
                  <option value="technician">Support Technician</option>
                  <option value="admin">Administrator</option>
                </select>
                <span className="text-[11px] text-muted-foreground block mt-1">
                  Your account will be reviewed by an Administrator to approve and assign your role.
                </span>
              </label>
            </>
          )}

          <label className="block">
            <span className="text-xs font-semibold text-foreground">Work Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
              className="mt-1 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-foreground">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="mt-1 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </label>

          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
          >
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Toggle mode */}
        <div className="mt-4 text-center text-xs text-muted-foreground">
          {mode === 'signin' ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setMode('signup')}
                className="font-semibold text-primary hover:underline cursor-pointer"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setMode('signin')}
                className="font-semibold text-primary hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};
