import sys

content = """import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Ticket, TicketPriority, TicketStatus } from '../types';
import { CATEGORIES, getCategoryLabel, formatStatus, MACROS } from '../data/seedData';
import {
  Home, Ticket as TicketIcon, List, BarChart2, Settings,
  Bell, LogOut, Search, SlidersHorizontal, Copy, UserPlus,
  UserCheck, ArrowUpRight, CheckCircle, Lock, Send, Cpu, User,
  RefreshCw, CheckCircle2
} from 'lucide-react';
import { RoleSwitcher } from './RoleSwitcher';

export const TechnicianWorkspace: React.FC = () => {
  const {
    currentUser,
    tickets,
    messages,
    unreadCounts,
    markTicketRead,
    updateTicket,
    sendMessage,
    draftAIReply,
    signOut,
    unreadNotificationsCount,
    setIsNotificationCenterOpen,
  } = useApp();

  const [filterMode, setFilterMode] = useState<'all' | 'mine' | 'new' | 'in_progress' | 'escalated' | 'resolved' | 'dashboard' | 'reports'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const [inspectorTab, setInspectorTab] = useState<'discussion' | 'ai_intel' | 'requester'>('discussion');
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

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      if (filterMode === 'mine') {
        const isMine = t.assigned_to === currentUser?.id || t.assigned_name?.toLowerCase().includes('marcus') || (currentUser?.full_name && t.assigned_name === currentUser.full_name);
        if (!isMine) return false;
      } else if (filterMode === 'new') {
        if (t.status !== 'new') return false;
      } else if (filterMode === 'in_progress') {
        if (t.status !== 'in_progress' && t.status !== 'pending_user') return false;
      } else if (filterMode === 'escalated') {
        if (t.status !== 'escalated' && t.priority !== 'urgent') return false;
      } else if (filterMode === 'resolved') {
        if (t.status !== 'resolved' && t.status !== 'closed') return false;
      }

      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.id.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.requester_name.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [tickets, filterMode, categoryFilter, searchQuery, currentUser]);

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

  const activeMessages = messages.filter((m) => m.ticket_id === selectedTicketId);

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
    await updateTicket(activeTicket.id, { status: 'escalated', priority: 'urgent' });
  };

  const handleResolve = async () => {
    if (!activeTicket) return;
    await updateTicket(activeTicket.id, { status: 'resolved', resolved_at: new Date().toISOString() });
  };

  const getPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case 'urgent': return <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-[10px] font-bold">Urgent</span>;
      case 'high': return <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-[10px] font-bold">High</span>;
      case 'medium': return <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-[10px] font-bold">Medium</span>;
      default: return <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-bold">Low</span>;
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    if (status === 'resolved' || status === 'closed') {
      return <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold">Resolved</span>;
    } else if (status === 'escalated') {
      return <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full text-[10px] font-bold">Escalated</span>;
    } else if (status === 'in_progress') {
      return <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-bold">In Progress</span>;
    }
    return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold">New</span>;
  };

  return (
    <div className="flex h-screen w-full bg-white text-slate-900 overflow-hidden font-sans">
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-[240px] border-r border-slate-200 flex flex-col bg-slate-50 shrink-0">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 gap-3 shrink-0">
          <div className="flex items-center gap-1.5">
             <span className="text-2xl font-black text-blue-600">T</span>
             <div className="leading-tight">
               <h1 className="font-bold text-sm text-slate-800">Technician</h1>
               <h1 className="font-bold text-sm text-slate-800">Cockpit</h1>
             </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          <button onClick={() => setFilterMode('dashboard')} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${filterMode === 'dashboard' ? 'bg-blue-100/50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}>
            <div className="flex items-center gap-3"><Home className="size-4" /> Dashboard</div>
          </button>
          
          <button onClick={() => setFilterMode('mine')} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${filterMode === 'mine' ? 'bg-blue-100/50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}>
            <div className="flex items-center gap-3"><TicketIcon className="size-4" /> My Tickets</div>
            <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-full">5</span>
          </button>
          
          <button onClick={() => setFilterMode('all')} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${filterMode === 'all' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}>
            <div className="flex items-center gap-3"><List className="size-4" /> Team Queue</div>
            <span className="bg-blue-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">2</span>
          </button>

          <button onClick={() => setFilterMode('reports')} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${filterMode === 'reports' ? 'bg-blue-100/50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}>
            <div className="flex items-center gap-3"><BarChart2 className="size-4" /> Reports</div>
            <span className="bg-emerald-100 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full">3</span>
          </button>

          <button className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
            <div className="flex items-center gap-3"><Settings className="size-4" /> Settings</div>
            <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full">2</span>
          </button>
        </nav>
      </aside>

      {/* 2. MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-end px-6 gap-4 shrink-0">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-full py-1.5 px-3">
             <div className="size-7 rounded-full bg-slate-300 flex items-center justify-center text-xs font-bold text-slate-700 uppercase">
                {currentUser?.full_name?.charAt(0) || 'A'}
             </div>
             <div className="leading-tight pr-2 text-left">
               <p className="text-xs font-bold text-slate-800">{currentUser?.full_name || 'Avumile Tati'}</p>
               <div className="flex items-center gap-1">
                 <p className="text-[10px] text-slate-500">Live Cloud Sync</p>
                 <span className="size-1.5 rounded-full bg-emerald-500"></span>
               </div>
             </div>
             <Settings className="size-4 text-slate-500 cursor-pointer hover:text-slate-700" />
          </div>
          
          <button onClick={() => setIsNotificationCenterOpen(true)} className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
            <Bell className="size-5" />
            <span className="absolute top-1.5 right-1.5 size-3.5 bg-blue-600 border-2 border-white rounded-full text-[8px] font-bold text-white flex items-center justify-center">1</span>
          </button>

          <button onClick={signOut} className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
            <LogOut className="size-4" /> Sign Out
          </button>
        </header>

        {/* 3. WORKSPACE AREA (Middle & Right Columns) */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Middle Column: Ticket List */}
          <div className="w-[320px] border-r border-slate-200 flex flex-col bg-white shrink-0">
            {/* Search/Filter Header */}
            <div className="p-4 border-b border-slate-200 space-y-3 shrink-0">
              <h2 className="font-bold text-sm text-slate-800">Search / Filter</h2>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Tickets"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
                   <SlidersHorizontal className="size-4" />
                </button>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none bg-white"
                >
                  <option value="all">Category</option>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50/50">
              {filteredTickets.map(ticket => {
                const isSelected = ticket.id === selectedTicketId;
                return (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-300 bg-blue-50 shadow-sm' 
                        : 'border-slate-200 bg-white hover:border-blue-200'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="size-8 rounded-full bg-slate-200 shrink-0 overflow-hidden flex items-center justify-center font-bold text-slate-500 text-xs">
                         {ticket.requester_name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between">
                           <span className="font-bold text-sm text-slate-800 line-clamp-1">{ticket.id}</span>
                        </div>
                        <p className="text-sm text-slate-900 font-semibold line-clamp-1">{ticket.title}</p>
                        <p className="text-xs text-slate-500">{getCategoryLabel(ticket.category)}</p>
                        <div className="flex items-center justify-between pt-2">
                           {getPriorityBadge(ticket.priority)}
                           {getStatusBadge(ticket.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredTickets.length === 0 && (
                <div className="text-center p-6 text-sm text-slate-500">No tickets found</div>
              )}
            </div>
          </div>

          {/* Right Column: Ticket Details */}
          <div className="flex-1 flex flex-col min-w-0 bg-white">
            {activeTicket ? (
              <>
                {/* Details Header */}
                <div className="p-6 border-b border-slate-200 shrink-0 space-y-4">
                  {/* Top tags */}
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">All</span>
                    <span className="bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1 rounded-full text-xs font-medium">Assigned</span>
                    <span className="bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1 rounded-full text-xs font-medium">New...</span>
                  </div>

                  {/* Title */}
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{activeTicket.title}</h2>
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
                      {formatStatus(activeTicket.status)}
                    </span>
                  </div>

                  {/* 3 Data Columns */}
                  <div className="grid grid-cols-3 gap-6 pt-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-slate-500 text-sm font-semibold">
                         <User className="size-4" /> Requester
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 uppercase">
                          {activeTicket.requester_name.charAt(0)}
                        </div>
                        <div className="leading-tight">
                          <p className="font-bold text-sm text-slate-900">{activeTicket.requester_name}</p>
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            {activeTicket.requester_email} <Copy className="size-3 cursor-pointer hover:text-slate-800" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-slate-500 text-sm font-semibold">
                         <UserCheck className="size-4" /> Assignee
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 uppercase">
                           {activeTicket.assigned_name ? activeTicket.assigned_name.charAt(0) : '?'}
                        </div>
                        <div className="leading-tight">
                          <p className="font-bold text-sm text-slate-900">{activeTicket.assigned_name || 'Unassigned'}</p>
                          <button onClick={handleAssignToMe} className="text-xs text-blue-600 font-bold hover:underline">Assign Agent</button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 text-sm border-l border-slate-200 pl-6">
                       <div className="flex items-center gap-1.5 text-slate-500 font-semibold mb-2">
                         <TicketIcon className="size-4" /> Ticket Info
                       </div>
                       <p className="flex justify-between"><span className="text-slate-500">Category:</span> <span className="font-medium text-slate-900 capitalize">{activeTicket.category}</span></p>
                       <p className="flex justify-between"><span className="text-slate-500">Created Date:</span> <span className="font-medium text-slate-900">{new Date(activeTicket.created_at).toLocaleDateString()}</span></p>
                       <p className="flex justify-between items-center"><span className="text-slate-500">SLA Status:</span> <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold text-[10px]">Green</span></p>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center justify-between px-6 border-b border-slate-200 shrink-0">
                  <div className="flex items-center gap-6">
                    <button onClick={() => setInspectorTab('discussion')} className={`py-4 text-sm font-bold border-b-2 transition-colors ${inspectorTab === 'discussion' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                      Activity Feed
                    </button>
                    <button onClick={() => setInspectorTab('ai_intel')} className={`py-4 text-sm font-bold border-b-2 transition-colors ${inspectorTab === 'ai_intel' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                      AI Insights (91%)
                    </button>
                    <button onClick={() => setInspectorTab('requester')} className={`py-4 text-sm font-bold border-b-2 transition-colors ${inspectorTab === 'requester' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                      Requester Profile
                    </button>
                  </div>
                  
                  <select 
                    value={activeTicket.status}
                    onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
                    className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 outline-none bg-white"
                  >
                    <option value="new">Status: New</option>
                    <option value="in_progress">Status: In Progress</option>
                    <option value="escalated">Status: Escalated</option>
                    <option value="resolved">Status: Resolved</option>
                  </select>
                </div>

                {/* Main Content Area based on Tab */}
                {inspectorTab === 'discussion' && (
                  <div className="flex-1 flex flex-col min-h-0 bg-[#f8fafc]">
                    
                    {/* Chat Area & Floating Actions */}
                    <div className="flex-1 flex overflow-hidden">
                      <div className="flex-1 overflow-y-auto p-6 space-y-6">
                         
                         {/* Customer Original */}
                         <div className="flex gap-4">
                           <div className="size-10 rounded-full bg-slate-300 shrink-0 flex items-center justify-center font-bold text-slate-600">
                             {activeTicket.requester_name.charAt(0)}
                           </div>
                           <div className="max-w-[75%] space-y-1">
                             <div className="flex items-center gap-2">
                               <span className="font-bold text-sm text-slate-900">{activeTicket.requester_name}</span>
                               <span className="text-xs text-slate-400">· {new Date(activeTicket.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                             </div>
                             <div className="bg-slate-200/70 text-slate-900 p-4 rounded-2xl rounded-tl-sm text-sm whitespace-pre-wrap leading-relaxed shadow-sm">
                               {activeTicket.description}
                               <div className="mt-3">
                                 <span className="bg-slate-300 text-slate-700 text-[10px] font-bold uppercase px-2 py-1 rounded-md">Original Report</span>
                               </div>
                             </div>
                           </div>
                         </div>

                         {/* Messages List */}
                         {activeMessages.map(msg => {
                           const isMe = msg.author_id === currentUser?.id;
                           const isNote = msg.internal;

                           if (isNote) {
                             return (
                               <div key={msg.id} className="flex justify-center my-4">
                                  <div className="flex items-start gap-2 max-w-lg bg-amber-50 border border-amber-200 p-3 rounded-xl text-sm text-amber-900 shadow-sm">
                                     <Lock className="size-4 shrink-0 text-amber-500 mt-0.5" />
                                     <div>
                                        <p className="font-bold text-xs text-amber-700 mb-1">{msg.author_name} (Internal Note)</p>
                                        <p>{msg.body}</p>
                                     </div>
                                  </div>
                               </div>
                             );
                           }

                           return (
                             <div key={msg.id} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}>
                               <div className="size-10 rounded-full bg-slate-300 shrink-0 flex items-center justify-center font-bold text-slate-600">
                                 {msg.author_name.charAt(0)}
                               </div>
                               <div className={`max-w-[75%] space-y-1 ${isMe ? 'text-right' : ''}`}>
                                 <div className={`flex items-center gap-2 ${isMe ? 'justify-end' : ''}`}>
                                   <span className="font-bold text-sm text-slate-900">{msg.author_name}</span>
                                   <span className="text-xs text-slate-400">· {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                 </div>
                                 <div className={`p-4 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed shadow-sm text-left ${isMe ? 'bg-blue-200 text-blue-900 rounded-tr-sm' : 'bg-slate-200/70 text-slate-900 rounded-tl-sm'}`}>
                                   {msg.body}
                                 </div>
                               </div>
                             </div>
                           );
                         })}
                         <div ref={messagesEndRef} />
                      </div>

                      {/* Right Action Column */}
                      <div className="w-24 border-l border-slate-200 bg-white p-3 flex flex-col gap-3 shrink-0 items-center overflow-y-auto">
                        <button onClick={handleAssignToMe} className="w-full flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700 hover:text-slate-900">
                           <UserPlus className="size-5" />
                           <span className="text-[10px] font-bold text-center leading-tight">Assign<br/>Agent</span>
                        </button>
                        <button onClick={handleAssignToMe} className="w-full flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700 hover:text-slate-900">
                           <UserCheck className="size-5" />
                           <span className="text-[10px] font-bold text-center leading-tight">Take<br/>Ticket</span>
                        </button>
                        <button onClick={handleEscalate} className="w-full flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700 hover:text-slate-900">
                           <ArrowUpRight className="size-5" />
                           <span className="text-[10px] font-bold text-center leading-tight">Escalate</span>
                        </button>
                        <button onClick={handleResolve} className="w-full flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700 hover:text-slate-900">
                           <CheckCircle className="size-5" />
                           <span className="text-[10px] font-bold text-center leading-tight">Resolve</span>
                        </button>
                      </div>
                    </div>

                    {/* Bottom Composer */}
                    <div className="bg-white border-t border-slate-200 p-4 shrink-0 space-y-3">
                       <div className="flex items-center gap-4 border-b border-slate-200 pb-2">
                         <button onClick={() => setIsInternal(false)} className={`text-sm font-bold pb-2 -mb-[9px] border-b-2 transition-colors ${!isInternal ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}>
                           Customer Reply
                         </button>
                         <button onClick={() => setIsInternal(true)} className={`flex items-center gap-1 text-sm font-bold pb-2 -mb-[9px] border-b-2 transition-colors ${isInternal ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500'}`}>
                           Internal Note <Lock className="size-3.5" />
                         </button>
                         
                         {/* Quick Pills */}
                         <div className="flex-1 flex justify-end gap-2 overflow-x-auto">
                            <button onClick={handleAIDraft} className="shrink-0 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-full transition-colors flex items-center gap-1">
                               AI Suggested
                            </button>
                            {MACROS.map(m => (
                              <button key={m.label} onClick={() => setReplyText(m.body)} className="shrink-0 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-full transition-colors">
                                {m.label}
                              </button>
                            ))}
                         </div>
                       </div>
                       
                       <form onSubmit={handleSendReply} className="relative">
                         <textarea
                           value={replyText}
                           onChange={e => setReplyText(e.target.value)}
                           placeholder="Type your reply..."
                           rows={3}
                           className="w-full resize-none p-3 pb-12 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm outline-none focus:border-blue-500 transition-colors"
                           onKeyDown={e => {
                             if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                               handleSendReply(e);
                             }
                           }}
                         />
                         <button
                           type="submit"
                           disabled={!replyText.trim()}
                           className="absolute bottom-3 right-3 bg-[#4c7db7] hover:bg-[#3b608f] text-white px-5 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
                         >
                           Send Message
                         </button>
                       </form>
                    </div>

                  </div>
                )}
                
                {inspectorTab === 'ai_intel' && (
                  <div className="flex-1 p-8 text-slate-500 flex flex-col items-center justify-center">
                    <Cpu className="size-12 mb-4 text-blue-500" />
                    <p className="font-bold">AI Triage Data</p>
                    <p className="text-sm">Confidence: {activeTicket.ai_confidence ? Math.round(activeTicket.ai_confidence * 100) : 91}%</p>
                  </div>
                )}
                {inspectorTab === 'requester' && (
                  <div className="flex-1 p-8 text-slate-500 flex flex-col items-center justify-center">
                    <User className="size-12 mb-4 text-blue-500" />
                    <p className="font-bold">{activeTicket.requester_name}</p>
                    <p className="text-sm">{activeTicket.requester_email}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400">
                 <TicketIcon className="size-16 mb-4 opacity-50" />
                 <p className="font-bold text-lg">No Ticket Selected</p>
                 <p className="text-sm">Select a ticket from the queue to view details.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
"""

with open('src/components/TechnicianWorkspace.tsx', 'w') as f:
    f.write(content)
print("Replaced TechnicianWorkspace.tsx")
