import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { TicketCategory, Ticket } from '../types';
import { CATEGORIES, FAQ_ITEMS, getCategoryLabel, formatStatus } from '../data/seedData';
import {
  Plus,
  Search,
  MessageSquare,
  HelpCircle,
  User as UserIcon,
  Bot,
  Bell,
  LogOut,
  ChevronRight,
  Laptop,
  Wifi,
  KeyRound,
  CreditCard,
  CheckCircle2,
  FileText,
  Shield,
  Check,
  Sparkles,
} from 'lucide-react';
import { RoleSwitcher } from './RoleSwitcher';
import { NewTicketModal } from './NewTicketModal';
import { TicketChatModal } from './TicketChatModal';
import { motion, AnimatePresence } from 'motion/react';

export const CustomerPortal: React.FC = () => {
  const {
    currentUser,
    tickets,
    unreadCounts,
    signOut,
    unreadNotificationsCount,
    setIsNotificationCenterOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'home' | 'tickets' | 'account' | 'help'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [preselectedCategory, setPreselectedCategory] = useState<TicketCategory | undefined>();
  const [activeChatTicket, setActiveChatTicket] = useState<Ticket | null>(null);

  // Tickets for current user or all general demo tickets
  const myTickets = useMemo(() => {
    return tickets.filter((t) => {
      if (!currentUser) return true;
      return t.requester_id === currentUser.id || t.requester_email === currentUser.email;
    });
  }, [tickets, currentUser]);

  // Filter FAQ items
  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return FAQ_ITEMS;
    const q = searchQuery.toLowerCase();
    return FAQ_ITEMS.filter(
      (item) => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const getStatusPill = (status: string) => {
    if (status === 'resolved' || status === 'closed') {
      return (
        <span className="rounded-full bg-emerald-100 text-emerald-700 px-3.5 py-1 text-xs font-semibold">
          Resolved
        </span>
      );
    }
    if (status === 'in_progress') {
      return (
        <span className="rounded-full bg-sky-100 text-sky-700 px-3.5 py-1 text-xs font-semibold">
          In Progress
        </span>
      );
    }
    if (status === 'escalated') {
      return (
        <span className="rounded-full bg-rose-100 text-rose-700 px-3.5 py-1 text-xs font-semibold">
          Escalated
        </span>
      );
    }
    return (
      <span className="rounded-full bg-blue-100 text-blue-700 px-3.5 py-1 text-xs font-semibold">
        Open
      </span>
    );
  };

  const userName = currentUser?.full_name?.split(' ')[0] || 'Awonke';

  return (
    <div id="customer-portal" className="min-h-screen bg-[#edf5fd] text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-[#0f3b6c] text-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="grid size-8 place-items-center rounded-lg bg-blue-600 text-slate-900 shadow-xs">
              <Bot className="size-5" />
            </div>
            <span className="font-bold text-slate-900 text-base tracking-tight">
              TechnoResolve Desk
            </span>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5">
            {[
              { id: 'home', label: 'Home' },
              { id: 'tickets', label: 'My Tickets' },
              { id: 'account', label: 'Account' },
              { id: 'help', label: 'Help Centre' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-150 ${
                    isActive
                      ? 'bg-white/20 text-white font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBadge"
                      className="absolute inset-0 bg-sky-100 rounded-full -z-10"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Bell */}
            <button
              onClick={() => setIsNotificationCenterOpen(true)}
              title="Notifications"
              className="relative p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <Bell className="size-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-0 right-0 size-4 rounded-full bg-[#4caf50] text-white text-[10px] font-extrabold grid place-items-center shadow-xs">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Role Switcher */}
            <RoleSwitcher />

            {/* Sign Out Button */}
            <button
              onClick={signOut}
              className="flex items-center gap-1 text-slate-300 hover:text-rose-300 text-xs font-semibold px-2 py-1 transition-colors cursor-pointer"
            >
              <span className="hidden sm:inline">Sign out</span>
              <LogOut className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-100 px-3 py-2 text-xs">
          {[
            { id: 'home', label: 'Home' },
            { id: 'tickets', label: `Tickets (${myTickets.length})` },
            { id: 'account', label: 'Account' },
            { id: 'help', label: 'Help' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1 font-semibold rounded-full ${
                activeTab === tab.id ? 'bg-sky-100 text-sky-800' : 'text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content View Container */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 md:py-12">
        <AnimatePresence mode="wait">
          {/* HOME TAB */}
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Header / Search */}
              <div className="space-y-5">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'}, {userName} 👋
                </h1>
                
                {/* Search Bar - Aesthetic */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="size-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    className="w-full bg-white border border-slate-200/80 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                    placeholder="Search knowledge base, error codes, or ask AI..."
                  />
                  <div className="absolute inset-y-0 right-2 flex items-center">
                    <button className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer">
                      Search
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions (Bento Grid) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => {
                    setPreselectedCategory('hardware');
                    setIsNewTicketOpen(true);
                  }}
                  className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col items-start gap-3 hover:border-blue-400 hover:shadow-md transition-all group text-left cursor-pointer"
                >
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-slate-900 transition-colors">
                    <Laptop className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Hardware</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">Devices & Peripherals</p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setPreselectedCategory('software');
                    setIsNewTicketOpen(true);
                  }}
                  className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col items-start gap-3 hover:border-purple-400 hover:shadow-md transition-all group text-left cursor-pointer"
                >
                  <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-slate-900 transition-colors">
                    <Wifi className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Software</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">Apps & Access</p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setPreselectedCategory('access');
                    setIsNewTicketOpen(true);
                  }}
                  className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col items-start gap-3 hover:border-amber-400 hover:shadow-md transition-all group text-left cursor-pointer"
                >
                  <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-slate-900 transition-colors">
                    <KeyRound className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Access</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">Passwords & VPN</p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setPreselectedCategory('billing');
                    setIsNewTicketOpen(true);
                  }}
                  className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col items-start gap-3 hover:border-emerald-400 hover:shadow-md transition-all group text-left cursor-pointer"
                >
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-slate-900 transition-colors">
                    <CreditCard className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Billing</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">Invoices & Cards</p>
                  </div>
                </button>
              </div>

              {/* General Request & AI Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                <button
                  onClick={() => {
                    setPreselectedCategory(undefined);
                    setIsNewTicketOpen(true);
                  }}
                  className="sm:col-span-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-slate-900 rounded-2xl p-5 flex flex-col justify-center items-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  <Plus className="size-6 stroke-[2.5] group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm">Other Request</span>
                </button>
                
                <div className="sm:col-span-3 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-slate-900 flex items-center justify-between relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                  <div className="absolute left-0 bottom-0 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl -ml-5 -mb-5"></div>
                  <div className="relative z-10 space-y-1">
                    <h3 className="font-bold flex items-center gap-2">
                      <Sparkles className="size-4 text-blue-400" /> AI Triage Active
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed max-w-[200px] sm:max-w-[250px]">
                      Your requests are instantly analyzed and routed by Gemini to the fastest available agent.
                    </p>
                  </div>
                  <div className="relative z-10 shrink-0 opacity-20 sm:opacity-50">
                    <Bot className="size-12 sm:size-16" />
                  </div>
                </div>
              </div>

              {/* Recent Activity Header */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Recent Activity
                  </h2>
                  <button 
                    onClick={() => setActiveTab('tickets')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                {/* Ticket Cards Stack */}
                <div className="space-y-3">
                  {myTickets.slice(0, 5).map((ticket, index) => (
                    <motion.div
                      key={ticket.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -2, shadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                      onClick={() => setActiveChatTicket(ticket)}
                      className="bg-white border border-slate-200/80 rounded-xl p-4.5 shadow-xs hover:border-slate-300 transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <div className="space-y-1 pr-4">
                        <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                          {ticket.title}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {getCategoryLabel(ticket.category)} ·{' '}
                          {new Date(ticket.created_at).toISOString().slice(0, 10).replace(/-/g, '/')}
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center gap-3">
                        {getStatusPill(ticket.status)}
                      </div>
                    </motion.div>
                  ))}

                  {myTickets.length === 0 && (
                    <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
                      <FileText className="size-8 mx-auto text-slate-400 mb-2" />
                      <p className="text-sm font-semibold text-slate-800">No requests yet</p>
                      <p className="text-xs mt-1">Submit your first request above to get instant help.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* MY TICKETS TAB */}
          {activeTab === 'tickets' && (
            <motion.div
              key="tickets"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900">My Requests</h1>
                  <p className="text-xs text-slate-500">View progress and chat directly with technicians</p>
                </div>
                <button
                  onClick={() => setIsNewTicketOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-blue-700 shadow-xs"
                >
                  <Plus className="size-4" />
                  <span>New Request</span>
                </button>
              </div>

              <div className="space-y-3">
                {myTickets.map((ticket) => (
                  <motion.div
                    key={ticket.id}
                    whileHover={{ y: -2 }}
                    onClick={() => setActiveChatTicket(ticket)}
                    className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs hover:border-blue-400 transition-all cursor-pointer space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-slate-500">
                            {ticket.id}
                          </span>
                          {getStatusPill(ticket.status)}
                          <span className="rounded-full bg-slate-100 text-slate-700 px-2.5 py-0.5 text-[11px] font-semibold">
                            {getCategoryLabel(ticket.category)}
                          </span>
                        </div>
                        <h2 className="text-base font-bold text-slate-900">{ticket.title}</h2>
                      </div>
                      <span className="text-xs text-slate-400">
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {ticket.description}
                    </p>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Priority: <strong className="capitalize text-slate-800">{ticket.priority}</strong></span>
                      <span className="text-blue-600 font-semibold flex items-center gap-1">
                        <MessageSquare className="size-3.5" />
                        Chat with Technician
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ACCOUNT TAB */}
          {activeTab === 'account' && (
            <motion.div
              key="account"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <h1 className="text-2xl font-extrabold text-slate-900">Account Profile</h1>
                <p className="text-xs text-slate-500">Manage account information and subscription status</p>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                  <span className="text-xs font-semibold uppercase text-slate-400">Full Name</span>
                  <span className="text-sm font-bold text-slate-800">{currentUser?.full_name || 'Awonke Philibane'}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                  <span className="text-xs font-semibold uppercase text-slate-400">Email Address</span>
                  <span className="text-sm font-medium text-slate-800">{currentUser?.email || 'philibaneawonke@gmail.com'}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                  <span className="text-xs font-semibold uppercase text-slate-400">Company / Organization</span>
                  <span className="text-sm font-medium text-slate-800">{currentUser?.company || 'Acme Enterprise'}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                  <span className="text-xs font-semibold uppercase text-slate-400">Membership Tier</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-3 py-0.5 text-xs font-semibold">
                    <CheckCircle2 className="size-3" /> Enterprise SLA (24/7)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-slate-400">Account Created</span>
                  <span className="text-xs text-slate-600">{new Date(currentUser?.created_at || '2025-04-12').toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* HELP CENTRE TAB */}
          {activeTab === 'help' && (
            <motion.div
              key="help"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <h1 className="text-2xl font-extrabold text-slate-900">Help Centre</h1>
                <p className="text-xs text-slate-500">Search verified self-help guides and quick fixes</p>
              </div>

              {/* Search Bar */}
              <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-3 shadow-xs flex items-center gap-2.5">
                <Search className="size-4 text-slate-400 shrink-0" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles (e.g. Wi-Fi, VPN, password reset)..."
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-xs text-slate-400 hover:text-slate-700">
                    Clear
                  </button>
                )}
              </div>

              {/* FAQ List */}
              <div className="space-y-2.5">
                {filteredFaqs.map((faq) => (
                  <details
                    key={faq.q}
                    className="bg-white border border-slate-200/80 rounded-xl p-4.5 group open:border-blue-400 shadow-xs transition-all"
                  >
                    <summary className="cursor-pointer font-bold text-sm text-slate-900 flex items-center justify-between list-none">
                      <span className="flex items-center gap-2">
                        <HelpCircle className="size-4 text-blue-600" />
                        {faq.q}
                      </span>
                      <span className="text-xs text-slate-400 group-open:rotate-90 transition-transform">▸</span>
                    </summary>
                    <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed pl-6 border-l-2 border-blue-400">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      <NewTicketModal
        isOpen={isNewTicketOpen}
        onClose={() => setIsNewTicketOpen(false)}
        initialCategory={preselectedCategory}
      />

      <TicketChatModal
        ticket={activeChatTicket}
        onClose={() => setActiveChatTicket(null)}
      />
    </div>
  );
};

