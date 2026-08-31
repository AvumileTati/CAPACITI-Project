import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Ticket, TicketPriority, TicketStatus, UserProfile } from '../types';
import { CATEGORIES, getCategoryLabel, formatStatus, MACROS } from '../data/seedData';
import {
  ArrowLeft,
  Wrench,
  CheckCircle2,
  UserCheck,
  Sparkles,
  Lock,
  Send,
  Loader2,
  Clock,
  AlertTriangle,
  Flame,
  ArrowRight,
  Filter,
  Check,
  User,
  Shield,
  Layers,
  Inbox,
  LogOut,
  Bell,
  Zap,
  ArrowUpRight,
  Plus,
  Search,
  MessageSquare,
  Cpu,
  FileText,
  Building,
  Mail,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';
import { RoleSwitcher } from './RoleSwitcher';
import { motion, AnimatePresence } from 'motion/react';

export const TechnicianWorkspace: React.FC = () => {
  const {
    currentUser,
    tickets,
    messages,
    users,
    unreadCounts,
    markTicketRead,
    updateTicket,
    sendMessage,
    draftAIReply,
    signOut,
    unreadNotificationsCount,
    setIsNotificationCenterOpen,
    setIsOutboxOpen,
  } = useApp();

  // Navigation and Filter States
  const [filterMode, setFilterMode] = useState<
    'all' | 'mine' | 'new' | 'in_progress' | 'escalated' | 'resolved'
  >('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Active Ticket Sub-tabs
  const [inspectorTab, setInspectorTab] = useState<'discussion' | 'ai_intel' | 'requester'>(
    'discussion'
  );

  // Message compose states
  const [replyText, setReplyText] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inspectorTab === 'discussion') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, selectedTicketId, inspectorTab]);

  // Filter technician tickets with search & category
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      // 1. Filter mode
      if (filterMode === 'mine') {
        const isMine =
          t.assigned_to === currentUser?.id ||
          t.assigned_name?.toLowerCase().includes('marcus') ||
          (currentUser?.full_name && t.assigned_name === currentUser.full_name);
        if (!isMine) return false;
      } else if (filterMode === 'new') {
        if (t.status !== 'new') return false;
      } else if (filterMode === 'in_progress') {
        if (t.status !== 'in_progress' && t.status !== 'pending_user') return false;
      } else if (filterMode === 'escalated') {
        if (t.status !== 'escalated' && t.priority !== 'urgent') return false;
      } else if (filterMode === 'resolved') {
        if (t.status !== 'resolved' && t.status !== 'closed') return false;
      } else if (filterMode === 'all') {
        // Show all active by default, or all
      }

      // 2. Category filter
      if (categoryFilter !== 'all' && t.category !== categoryFilter) {
        return false;
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.id.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.requester_name.toLowerCase().includes(q) ||
          (t.company && t.company.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [tickets, filterMode, categoryFilter, searchQuery, currentUser]);

  // Auto-select first ticket if current selection is invalid
  useEffect(() => {
    if (!selectedTicketId || !filteredTickets.some((t) => t.id === selectedTicketId)) {
      if (filteredTickets.length > 0) {
        setSelectedTicketId(filteredTickets[0].id);
      } else {
        setSelectedTicketId(null);
      }
    }
  }, [filteredTickets, selectedTicketId]);

  const activeTicket = tickets.find((t) => t.id === selectedTicketId) || null;
  const activeTicketId = activeTicket?.id;

  useEffect(() => {
    if (activeTicketId) {
      markTicketRead(activeTicketId);
    }
  }, [activeTicketId, markTicketRead]);

  // Messages for active ticket
  const activeMessages = messages.filter((m) => m.ticket_id === selectedTicketId);

  // Counts for queue badges
  const totalCount = tickets.length;
  const newCount = tickets.filter((t) => t.status === 'new').length;
  const workingCount = tickets.filter((t) => t.status === 'in_progress' || t.status === 'pending_user').length;
  const escalatedCount = tickets.filter((t) => t.status === 'escalated' || t.priority === 'urgent').length;
  const resolvedCount = tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length;
  const myAssignedCount = tickets.filter(
    (t) =>
      t.assigned_to === currentUser?.id ||
      t.assigned_name?.toLowerCase().includes('marcus') ||
      (currentUser?.full_name && t.assigned_name === currentUser.full_name)
  ).length;

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !replyText.trim()) return;

    await sendMessage(activeTicket.id, replyText.trim(), isInternal);
    setReplyText('');
  };

  const handleAIDraft = async () => {
    if (!activeTicket) return;
    setIsDrafting(true);
    try {
      const draft = await draftAIReply(activeTicket.id);
      if (draft) {
        setReplyText(draft);
        setIsInternal(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsDrafting(false);
    }
  };

  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (!activeTicket) return;
    setIsUpdatingStatus(true);
    try {
      await updateTicket(activeTicket.id, { status: newStatus });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAssignToMe = async () => {
    if (!activeTicket) return;
    await updateTicket(activeTicket.id, {
      status: activeTicket.status === 'new' ? 'in_progress' : activeTicket.status,
      assigned_to: currentUser?.id,
      assigned_name: currentUser?.full_name || 'Support Technician',
    });
  };

  const handleEscalate = async () => {
    if (!activeTicket) return;
    await updateTicket(activeTicket.id, {
      status: 'escalated',
      priority: 'urgent',
    });
  };

  const handleResolve = async () => {
    if (!activeTicket) return;
    await updateTicket(activeTicket.id, {
      status: 'resolved',
      resolved_at: new Date().toISOString(),
    });
  };

  // Helper for priority styling
  const getPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 border border-rose-200 px-2 py-0.5 text-[10px] font-bold text-rose-700">
            <Flame className="size-3 text-rose-400 fill-rose-400" /> URGENT
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-orange-100 border border-orange-200 px-2 py-0.5 text-[10px] font-bold text-orange-700">
            <AlertTriangle className="size-3 text-amber-400" /> HIGH
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center rounded-md bg-sky-100 border border-sky-200 px-2 py-0.5 text-[10px] font-bold text-sky-700">
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-md bg-slate-100/80 border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
            LOW
          </span>
        );
    }
  };

  return (
    <div
      id="technician-workspace"
      className="flex h-screen flex-col overflow-hidden bg-white text-slate-900 font-sans antialiased"
    >
      {/* 1. TOP GLOBAL COCKPIT BAR */}
      <header className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-3 z-30 bg-[#0f3b6c] text-white shadow-md">
        {/* Brand & Active Tech Info */}
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-slate-100 text-[#0f3b6c] border border-[#0f3b6c]/20 flex items-center justify-center shadow-xs">
            <Zap className="size-4.5 fill-cyan-400 text-[#0f3b6c]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-900 tracking-tight">Technician Cockpit</h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-bold text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Cloud Sync
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {currentUser?.full_name || 'Support Tech'} ({currentUser?.email || 'tech@technoresolve.io'})
            </p>
          </div>
        </div>

        {/* Global Queue Filter Navigation Pills (Easy One-Click Switching) */}
        <nav className="hidden md:flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 text-xs">
          {[
            { id: 'all' as const, label: 'All Queue', count: totalCount },
            { id: 'mine' as const, label: 'Assigned to Me', count: myAssignedCount },
            { id: 'new' as const, label: 'New', count: newCount },
            { id: 'in_progress' as const, label: 'Working', count: workingCount },
            { id: 'escalated' as const, label: 'Escalated', count: escalatedCount },
            { id: 'resolved' as const, label: 'Resolved', count: resolvedCount },
          ].map((item) => {
            const isActive = filterMode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setFilterMode(item.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#4caf50] text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-[#f4f6f8]/20 text-white font-bold'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {item.count}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right Utility: Notification bell, Resolved stat, Role switcher, Sign out */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification Center */}
          <button
            onClick={() => setIsNotificationCenterOpen(true)}
            title="Notifications & Alerts"
            className="relative p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <Bell className="size-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 size-4 rounded-full bg-[#4caf50] text-white text-[10px] font-extrabold grid place-items-center shadow-xs">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="size-3.5" />
            <span>{resolvedCount} resolved</span>
          </div>

          {/* Role Switcher */}
          <RoleSwitcher />

          {/* Sign Out */}
          <button
            onClick={signOut}
            title="Sign out / Switch account"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:border-slate-500 transition-colors cursor-pointer"
          >
            <LogOut className="size-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN 2-COLUMN SPLIT WORKSPACE */}
      <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[380px_1fr] overflow-hidden relative">
        {/* LEFT COLUMN: Queue Sidebar & Fast Navigator */}
        <aside className={`flex-col min-h-0 border-r border-slate-200 bg-white overflow-hidden z-20 ${selectedTicketId ? 'hidden md:flex' : 'flex'}`}>

          {/* Quick Search & Category Filter Bar */}
          <div className="p-3 border-b border-slate-200 bg-white space-y-2 shrink-0">
            {/* Search Input */}
            <div className="relative">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticket #, title, requester..."
                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-500 outline-none focus:border-[#0f3b6c] focus:ring-1 focus:ring-[#0f3b6c]/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-900"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Dropdown */}
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-800 outline-none focus:border-[#0f3b6c]"
              >
                <option value="all">All Domains ({tickets.length})</option>
                {CATEGORIES.map((c) => {
                  const count = tickets.filter((t) => t.category === c.value).length;
                  return (
                    <option key={c.value} value={c.value}>
                      {c.label} ({count})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Queue Count Summary bar */}
          <div className="px-4 py-2 bg-white border-b border-slate-200 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            <span>
              Showing {filteredTickets.length} of {tickets.length} tickets
            </span>
            {filterMode !== 'all' && (
              <button
                onClick={() => setFilterMode('all')}
                className="text-[#0f3b6c] hover:underline capitalize"
              >
                Reset Filter
              </button>
            )}
          </div>

          {/* Scrollable Ticket List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#12284b]/60">
            {filteredTickets.map((ticket) => {
              const isSelected = ticket.id === selectedTicketId;
              const hasUnread = (unreadCounts[ticket.id] || 0) > 0;

              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`p-3.5 cursor-pointer transition-all relative ${
                    isSelected
                      ? 'bg-blue-50/60 border-l-4 border-[#0f3b6c] shadow-inner'
                      : 'hover:bg-slate-50 bg-white border-b border-slate-100'
                  }`}
                >
                  {/* Top Line: Ticket ID, Category, Priority */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#0f3b6c]">
                        {ticket.id}
                      </span>
                      {hasUnread && (
                        <span className="size-2 rounded-full bg-[#4caf50] animate-ping" />
                      )}
                    </div>
                    {getPriorityBadge(ticket.priority)}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-sm text-slate-900 line-clamp-1 mb-1">
                    {ticket.title}
                  </h3>

                  {/* Requester & Company */}
                  <p className="text-xs text-slate-400 line-clamp-1 mb-2">
                    {ticket.requester_name} · <span className="text-slate-500">{ticket.company || 'Acme Corp'}</span>
                  </p>

                  {/* Bottom Line: Category pill + Status + Timestamp */}
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="inline-block bg-[#0e2a52] text-sky-300 px-2 py-0.5 rounded-md font-medium">
                      {getCategoryLabel(ticket.category)}
                    </span>
                    <span
                      className={`capitalize font-semibold ${
                        ticket.status === 'resolved'
                          ? 'text-emerald-400'
                          : ticket.status === 'escalated'
                          ? 'text-rose-400'
                          : ticket.status === 'in_progress'
                          ? 'text-purple-400'
                          : 'text-[#0f3b6c]'
                      }`}
                    >
                      {formatStatus(ticket.status)}
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredTickets.length === 0 && (
              <div className="p-8 text-center text-slate-500 space-y-2">
                <Inbox className="size-8 mx-auto opacity-40 text-slate-400" />
                <p className="text-xs font-semibold text-slate-700">No tickets found in this queue</p>
                <p className="text-[11px] text-slate-500">
                  Try clearing your search term or switching filter mode to 'All Queue'.
                </p>
                <button
                  onClick={() => {
                    setFilterMode('all');
                    setCategoryFilter('all');
                    setSearchQuery('');
                  }}
                  className="mt-2 inline-flex items-center gap-1 text-xs text-[#0f3b6c] hover:underline"
                >
                  <RefreshCw className="size-3" /> Reset all filters
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT COLUMN: Interactive Ticket Workspace & Operations */}
        <main className={`flex-col min-h-0 overflow-hidden bg-[#f4f6f8] ${!selectedTicketId ? 'hidden md:flex' : 'flex'}`}>
          {activeTicket ? (
            <div className="flex flex-col h-full overflow-hidden">
              {/* 1. Ticket Action Header Banner */}
              <div className="border-b border-slate-200 bg-white p-5 shrink-0 space-y-3 relative">
                
                {/* Mobile Back Button */}
                <button 
                  onClick={() => setSelectedTicketId(null)}
                  className="md:hidden absolute top-4 right-4 p-2 rounded-lg bg-slate-100 text-[#0f3b6c] hover:bg-[#123868] transition-colors"
                >
                  <ArrowLeft className="size-4" />
                </button>

                <div className="flex flex-wrap items-start justify-between gap-4 pr-10 md:pr-0">
                  {/* Title & Metadata */}
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-[#0f3b6c] border border-[#0f3b6c]/20">
                        {activeTicket.id}
                      </span>
                      {getPriorityBadge(activeTicket.priority)}
                      <span className="text-xs text-slate-400 font-medium">
                        {getCategoryLabel(activeTicket.category)}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                      {activeTicket.title}
                    </h2>

                    <p className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
                      <span>Requester: <strong className="text-slate-800">{activeTicket.requester_name}</strong></span>
                      <span>·</span>
                      <span>Email: <strong className="text-slate-800">{activeTicket.requester_email}</strong></span>
                      <span>·</span>
                      <span>Assigned to: <strong className="text-[#0f3b6c]">{activeTicket.assigned_name || 'Unassigned'}</strong></span>
                    </p>
                  </div>

                  {/* 1-Click Operational Controls */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Status Dropdown */}
                    <div className="relative">
                      <select
                        value={activeTicket.status}
                        onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
                        disabled={isUpdatingStatus}
                        className="rounded-xl border border-transparent bg-[#4caf50] px-3 py-1.5 text-xs font-semibold text-white outline-none hover:bg-[#388e3c] transition-colors cursor-pointer appearance-none"
                      >
                        <option value="new">Status: New</option>
                        <option value="in_progress">Status: In Progress</option>
                        <option value="pending_user">Status: Pending User</option>
                        <option value="escalated">Status: Escalated</option>
                        <option value="resolved">Status: Resolved</option>
                        <option value="closed">Status: Closed</option>
                      </select>
                    </div>

                    {/* Take / Assign to Me */}
                    <button
                      onClick={handleAssignToMe}
                      className="flex items-center gap-1.5 rounded-xl border border-[#0f3b6c]/20 bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-[#0f3b6c] hover:bg-[#4caf50]/20 transition-all shadow-xs cursor-pointer"
                    >
                      <UserCheck className="size-3.5" />
                      <span>Take Ticket</span>
                    </button>

                    {/* Escalate */}
                    <button
                      onClick={handleEscalate}
                      className="flex items-center gap-1.5 rounded-xl border-transparent bg-[#4caf50] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#388e3c] transition-all shadow-xs cursor-pointer"
                    >
                      <ArrowUpRight className="size-3.5" />
                      <span>Escalate</span>
                    </button>

                    {/* Resolve Button */}
                    <button
                      onClick={handleResolve}
                      className="flex items-center gap-1.5 rounded-xl bg-[#4caf50] hover:bg-[#388e3c] px-4 py-1.5 text-xs font-bold text-white transition-all shadow-xs cursor-pointer"
                    >
                      <Check className="size-3.5 stroke-[2.5]" />
                      <span>Resolve</span>
                    </button>
                  </div>
                </div>

                {/* Sub-tab Switcher: Discussion vs AI Intel vs Requester Profile */}
                <div className="flex items-center gap-2 border-t border-slate-200 pt-3 text-xs">
                  <button
                    onClick={() => setInspectorTab('discussion')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      inspectorTab === 'discussion'
                        ? 'bg-[#0f3b6c] text-white'
                        : 'text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <MessageSquare className="size-3.5" />
                    <span>Discussion & Notes ({activeMessages.length + 1})</span>
                  </button>

                  <button
                    onClick={() => setInspectorTab('ai_intel')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      inspectorTab === 'ai_intel'
                        ? 'bg-[#0f3b6c] text-white'
                        : 'text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <Sparkles className="size-3.5 text-amber-400" />
                    <span>AI Triage & Intel ({Math.round((activeTicket.ai_confidence || 0.85) * 100)}%)</span>
                  </button>

                  <button
                    onClick={() => setInspectorTab('requester')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      inspectorTab === 'requester'
                        ? 'bg-[#0f3b6c] text-white'
                        : 'text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <User className="size-3.5" />
                    <span>Requester Profile</span>
                  </button>
                </div>
              </div>

              {/* 2. TAB 1: DISCUSSION & MESSAGING */}
              {inspectorTab === 'discussion' && (
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                  {/* Messages Feed Container */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {/* Customer's Original Issue Report Card */}
                    <div className="rounded-2xl bg-white text-slate-900 p-5 shadow-sm max-w-2xl border border-slate-200">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="size-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                            {activeTicket.requester_name.charAt(0)}
                          </span>
                          <span className="font-bold text-xs text-slate-800">
                            {activeTicket.requester_name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(activeTicket.created_at).toLocaleString()}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                          Original Issue Report
                        </span>
                      </div>
                      <p className="text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-wrap">
                        {activeTicket.description}
                      </p>
                    </div>

                    {/* Messages List */}
                    {activeMessages.map((msg) => {
                      const isNote = msg.internal;
                      const isMe = msg.author_id === currentUser?.id;

                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${
                            isNote ? 'items-center my-3' : isMe ? 'bg-[#f4f6f8] border border-slate-200 text-slate-900 rounded-br-xs' : 'bg-white border border-slate-200 text-slate-900 rounded-bl-xs'
                          }`}
                        >
                          {isNote ? (
                            <div className="w-full max-w-2xl rounded-xl border border-slate-300 bg-white p-4 text-xs shadow-sm">
                              <div className="flex items-center justify-between font-bold text-slate-700 pb-1.5 border-b border-slate-200">
                                <span className="flex items-center gap-1.5">
                                  <Lock className="size-3.5 text-slate-500" />
                                  Internal Diagnostic Note · {msg.author_name}
                                </span>
                                <span className="text-[10px] font-normal text-slate-400">
                                  {new Date(msg.created_at).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                              <p className="mt-2 text-sm whitespace-pre-wrap text-slate-900 leading-relaxed">
                                {msg.body}
                              </p>
                            </div>
                          ) : (
                            <div
                              className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-xs ${
                                isMe ? 'bg-[#f4f6f8] border border-slate-200 text-slate-900 rounded-br-xs' : 'bg-white border border-slate-200 text-slate-900 rounded-bl-xs'
                              }`}
                            >
                              <div
                                className={`flex items-center justify-between gap-4 text-[11px] pb-1 ${
                                  isMe ? 'bg-[#f4f6f8] border border-slate-200 text-slate-900 rounded-br-xs' : 'bg-white border border-slate-200 text-slate-900 rounded-bl-xs'
                                }`}
                              >
                                <span>{msg.author_name}</span>
                                <span>
                                  {new Date(msg.created_at).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                              <p className="text-sm whitespace-pre-wrap leading-relaxed mt-0.5">
                                {msg.body}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Bottom Reply Composer & AI Tools */}
                  <div className="border-t border-slate-200 bg-white p-4 shrink-0 space-y-3">
                    {/* Quick Macro Pills + AI Draft Suggestion */}
                    {activeTicket.status !== 'resolved' && activeTicket.status !== 'closed' && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                      {/* AI Suggested Response Button */}
                      <button
                        type="button"
                        onClick={handleAIDraft}
                        disabled={isDrafting}
                        className="shrink-0 flex items-center gap-1.5 rounded-full border border-[#0f3b6c]/20 bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-[#0f3b6c] hover:bg-[#4caf50]/20 transition-all shadow-xs cursor-pointer"
                      >
                        {isDrafting ? (
                          <>
                            <Loader2 className="size-3.5 animate-spin" />
                            <span>Generating AI Draft...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="size-3.5 text-[#0f3b6c]" />
                            <span>✨ AI suggested reply</span>
                          </>
                        )}
                      </button>

                      {/* Standard Quick Macro Templates */}
                      {MACROS.map((macro) => (
                        <button
                          key={macro.label}
                          onClick={() => setReplyText(macro.body)}
                          className="shrink-0 rounded-full border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:border-slate-400 transition-colors cursor-pointer shadow-sm"
                        >
                          {macro.label}
                        </button>
                      ))}
                    </div>
                    )}

                    {/* Textarea Form */}
                    {(activeTicket.status === 'resolved' || activeTicket.status === 'closed') ? (
                      <div className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col items-center justify-center text-center space-y-2">
                        <Lock className="size-5 text-slate-500" />
                        <p className="text-sm font-bold text-slate-900">
                          This ticket is marked as {activeTicket.status}.
                        </p>
                        <p className="text-xs text-slate-400">
                          Communication is locked. You can reopen the ticket to continue conversation.
                        </p>
                      </div>
                    ) : (
                    <form onSubmit={handleSendReply} className="space-y-2">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply to customer or internal diagnostic note..."
                        rows={3}
                        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 outline-none focus:border-[#0f3b6c] focus:ring-1 focus:ring-[#0f3b6c]/20 transition-all"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                            handleSendReply(e);
                          }
                        }}
                      />

                      <div className="flex items-center justify-between pt-1">
                        {/* Internal Note Toggle */}
                        <label className="flex items-center gap-2 cursor-pointer select-none text-xs">
                          <input
                            type="checkbox"
                            checked={isInternal}
                            onChange={(e) => setIsInternal(e.target.checked)}
                            className="size-4 rounded accent-amber-500 cursor-pointer"
                          />
                          <span
                            className={
                              isInternal
                                ? 'text-amber-400 font-semibold flex items-center gap-1'
                                : 'text-slate-400'
                            }
                          >
                            <Lock className="size-3.5" />
                            Internal Note (Hidden from Customer)
                          </span>
                        </label>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={!replyText.trim()}
                          className="flex items-center gap-2 rounded-xl bg-[#4caf50] hover:bg-[#388e3c] text-white px-5 py-2 text-xs font-bold transition-all disabled:opacity-40 shadow-xs cursor-pointer"
                        >
                          <span>Send Message</span>
                          <Send className="size-3.5" />
                        </button>
                      </div>
                    </form>
                    )}
                  </div>
                </div>
              )}

              {/* 3. TAB 2: AI INTEL & DIAGNOSTICS */}
              {inspectorTab === 'ai_intel' && (
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* AI Triage Card */}
                  <div className="rounded-2xl border border-[#0f3b6c]/20 bg-white p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <div className="size-8 rounded-lg bg-cyan-950/80 text-[#0f3b6c] border border-[#0f3b6c]/20 flex items-center justify-center">
                          <Cpu className="size-4" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-slate-900">Automated Triage Assessment</h3>
                          <p className="text-xs text-slate-400">Gemini Neural Routing Analysis</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xl font-extrabold text-[#0f3b6c]">
                          {Math.round((activeTicket.ai_confidence || 0.88) * 100)}%
                        </span>
                        <p className="text-[10px] text-slate-400 uppercase font-mono">Confidence</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <p className="text-slate-400 mb-1">Detected Category</p>
                        <p className="font-bold text-slate-900 text-sm capitalize">{activeTicket.category}</p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <p className="text-slate-400 mb-1">Assigned Priority</p>
                        <p className="font-bold text-slate-900 text-sm capitalize">{activeTicket.priority}</p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <p className="text-slate-400 mb-1">Auto-Routed To</p>
                        <p className="font-bold text-slate-900 text-sm">Tier 2 Operations</p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
                      <p className="text-xs font-bold text-slate-700">Routing Reasoning:</p>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {activeTicket.ai_reasoning ||
                          'Natural language description matches verified incident heuristics for ' +
                            activeTicket.category +
                            '.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. TAB 3: REQUESTER PROFILE */}
              {inspectorTab === 'requester' && (
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                      <div className="size-12 rounded-2xl bg-cyan-950 text-[#0f3b6c] border border-[#0f3b6c]/20 flex items-center justify-center font-bold text-lg">
                        {activeTicket.requester_name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{activeTicket.requester_name}</h3>
                        <p className="text-xs text-slate-400 font-mono">{activeTicket.requester_email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                        <p className="text-slate-400 mb-1">Company / Organization</p>
                        <p className="font-bold text-slate-900 text-sm">{activeTicket.company || 'Enterprise Partner'}</p>
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                        <p className="text-slate-400 mb-1">SLA Contract Level</p>
                        <p className="font-bold text-emerald-400 text-sm">Enterprise Gold (4h Resolution)</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center p-8 text-center text-slate-500">
              <div className="space-y-3 max-w-sm">
                <div className="size-16 rounded-2xl bg-white border border-slate-200 mx-auto flex items-center justify-center text-[#0f3b6c]">
                  <Inbox className="size-8" />
                </div>
                <h3 className="text-base font-bold text-slate-900">No Ticket Selected</h3>
                <p className="text-xs text-slate-400">
                  Select a ticket from the left queue list to inspect diagnostics, generate AI responses, and manage status.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
