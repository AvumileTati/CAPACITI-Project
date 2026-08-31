import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './components/LandingPage';
import { CustomerPortal } from './components/CustomerPortal';
import { TechnicianWorkspace } from './components/TechnicianWorkspace';
import { AdminControlCenter } from './components/AdminControlCenter';
import { LoginPage } from './components/LoginPage';
import { AuthModal } from './components/AuthModal';
import { NewTicketModal } from './components/NewTicketModal';
import { EmailVerificationView } from './components/EmailVerificationView';
import { PendingApprovalView } from './components/PendingApprovalView';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { EmailOutboxModal } from './components/EmailOutboxModal';
import { CheckCircle2, AlertCircle, Info, X, ShieldAlert, ArrowLeft } from 'lucide-react';

const ToastContainer: React.FC = () => {
  const { toasts = [], dismissToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm sm:max-w-md w-full px-4 sm:px-0 pointer-events-none">
      {toasts.map((toast) => {
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-xs shadow-xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-3 duration-200 ${
              toast.type === 'success'
                ? 'border-emerald-500/40 bg-[#061e14]/95 text-emerald-100'
                : toast.type === 'error'
                ? 'border-rose-500/40 bg-[#250911]/95 text-rose-100'
                : 'border-cyan-500/40 bg-[#081b33]/95 text-cyan-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' ? (
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              ) : toast.type === 'error' ? (
                <AlertCircle className="size-4 text-rose-400 shrink-0" />
              ) : (
                <Info className="size-4 text-cyan-400 shrink-0" />
              )}
              <p className="font-medium leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="rounded p-1 text-white/60 hover:text-white transition-colors cursor-pointer shrink-0"
            >
              <X className="size-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

const AccessDeniedView: React.FC<{ requiredRole: string; onReturn: () => void }> = ({
  requiredRole,
  onReturn,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#060f1e] text-slate-100">
      <div className="max-w-md w-full rounded-2xl border border-rose-500/30 bg-[#09172e] p-8 text-center space-y-4 shadow-2xl">
        <div className="size-14 rounded-2xl bg-rose-950/80 border border-rose-500/30 text-rose-400 mx-auto grid place-items-center">
          <ShieldAlert className="size-7" />
        </div>
        <h2 className="text-lg font-bold text-white">Access Restricted</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Only <strong className="text-rose-300">{requiredRole}</strong> users have permission to
          access this portal view.
        </p>
        <button
          onClick={onReturn}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-all cursor-pointer"
        >
          <ArrowLeft className="size-3.5" />
          <span>Return to Authorized Workspace</span>
        </button>
      </div>
    </div>
  );
};

const MainContent: React.FC = () => {
  const {
    activePage,
    setActivePage,
    viewRole,
    setViewRole,
    currentUser,
    isOutboxOpen,
    setIsOutboxOpen,
    isNotificationCenterOpen,
    setIsNotificationCenterOpen,
  } = useApp();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);

  // 1. Landing and Login pages
  if (activePage === 'login') {
    return (
      <div className="min-h-screen bg-background font-sans theme-user">
        <LoginPage onBackToLanding={() => setActivePage('landing')} />
        <ToastContainer />
        <EmailOutboxModal isOpen={isOutboxOpen} onClose={() => setIsOutboxOpen(false)} />
      </div>
    );
  }

  if (activePage === 'landing') {
    return (
      <div className="min-h-screen bg-background font-sans theme-user">
        <LandingPage
          onOpenAuth={() => setActivePage('login')}
          onOpenNewTicket={() => setIsNewTicketOpen(true)}
        />
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        <NewTicketModal isOpen={isNewTicketOpen} onClose={() => setIsNewTicketOpen(false)} />
        <ToastContainer />
        <EmailOutboxModal isOpen={isOutboxOpen} onClose={() => setIsOutboxOpen(false)} />
        <NotificationCenterModal
          isOpen={isNotificationCenterOpen}
          onClose={() => setIsNotificationCenterOpen(false)}
        />
      </div>
    );
  }

  // 2. User Gate: If logged in, check Email Verification
  if (currentUser && !currentUser.email_verified) {
    return (
      <div className="min-h-screen bg-background font-sans theme-user">
        <EmailVerificationView />
        <ToastContainer />
        <EmailOutboxModal isOpen={isOutboxOpen} onClose={() => setIsOutboxOpen(false)} />
      </div>
    );
  }

  // 3. User Gate: Check Admin Approval
  if (currentUser && !currentUser.is_approved) {
    return (
      <div className="min-h-screen bg-background font-sans theme-user">
        <PendingApprovalView />
        <ToastContainer />
        <EmailOutboxModal isOpen={isOutboxOpen} onClose={() => setIsOutboxOpen(false)} />
        <NotificationCenterModal
          isOpen={isNotificationCenterOpen}
          onClose={() => setIsNotificationCenterOpen(false)}
        />
      </div>
    );
  }

  // 4. Role-Based Access Routing: Only Admin can access all pages
  const renderPortalView = () => {
    if (viewRole === 'admin') {
      if (currentUser?.role === 'admin') {
        return <AdminControlCenter />;
      }
      return (
        <AccessDeniedView
          requiredRole="System Administrator"
          onReturn={() => setViewRole(currentUser?.role || 'user')}
        />
      );
    }

    if (viewRole === 'technician') {
      if (currentUser?.role === 'technician' || currentUser?.role === 'admin') {
        return <TechnicianWorkspace />;
      }
      return (
        <AccessDeniedView
          requiredRole="Technician"
          onReturn={() => setViewRole('user')}
        />
      );
    }

    return <CustomerPortal />;
  };

  return (
    <div className={`min-h-screen bg-background font-sans theme-${viewRole}`}>
      {renderPortalView()}

      {/* Global Modals */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <NewTicketModal isOpen={isNewTicketOpen} onClose={() => setIsNewTicketOpen(false)} />
      <NotificationCenterModal
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
      />
      <EmailOutboxModal isOpen={isOutboxOpen} onClose={() => setIsOutboxOpen(false)} />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
