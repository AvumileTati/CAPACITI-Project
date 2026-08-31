import React from 'react';
import { UserRole } from '../types';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Wrench, User, Lock, Crown } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { viewRole, setViewRole, currentUser, isAdmin, showToast } = useApp();

  const roles: {
    id: UserRole;
    label: string;
    icon: React.FC<{ className?: string }>;
    minRole: 'user' | 'technician' | 'admin';
  }[] = [
    { id: 'admin', label: 'Admin', icon: ShieldCheck, minRole: 'admin' },
    { id: 'technician', label: 'Technician', icon: Wrench, minRole: 'technician' },
    { id: 'user', label: 'Customer', icon: User, minRole: 'user' },
  ];

  const handleRoleClick = (targetRole: UserRole) => {
    if (!currentUser) {
      setViewRole(targetRole);
      return;
    }

    if (currentUser.role === 'admin') {
      setViewRole(targetRole);
    } else if (currentUser.role === 'technician') {
      if (targetRole === 'admin') {
        showToast('🔒 Access Denied: Administrator role required to open Admin Center.', 'error');
        return;
      }
      setViewRole(targetRole);
    } else {
      if (targetRole !== 'user') {
        showToast(`🔒 Access Denied: ${targetRole === 'admin' ? 'Administrator' : 'Technician'} role required.`, 'error');
        return;
      }
      setViewRole('user');
    }
  };

  return (
    <div
      id="role-switcher"
      className="flex items-center gap-1 rounded-full border border-white/20 bg-white/10 p-1 text-xs shadow-xs"
    >
      {roles.map((r) => {
        const Icon = r.icon;
        const isActive = viewRole === r.id;
        const isLocked =
          currentUser &&
          ((r.id === 'admin' && currentUser.role !== 'admin') ||
            (r.id === 'technician' && currentUser.role === 'user'));

        return (
          <button
            key={r.id}
            id={`role-btn-${r.id}`}
            onClick={() => handleRoleClick(r.id)}
            title={isLocked ? `${r.label} (Locked - Requires higher privileges)` : `Switch to ${r.label}`}
            className={`flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
              isActive
                ? 'bg-[#4caf50] text-white shadow-xs font-bold'
                : isLocked
                ? 'text-white/40 opacity-60'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {isLocked ? (
              <Lock className="size-3 text-slate-500 shrink-0" />
            ) : (
              <Icon className="size-3.5 shrink-0" />
            )}
            <span className="capitalize">{r.label}</span>
            {r.id === 'admin' && isAdmin && !isActive && (
              <Crown className="size-2.5 text-amber-400 shrink-0" />
            )}
          </button>
        );
      })}
    </div>
  );
};
