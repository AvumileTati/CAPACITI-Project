import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bot,
  ArrowRight,
  ShieldCheck,
  Workflow,
  LifeBuoy,
  Sparkles,
  CheckCircle2,
  Lock,
  Layers,
  Activity,
  Zap,
} from 'lucide-react';
import { RoleSwitcher } from './RoleSwitcher';
import { motion, AnimatePresence } from 'motion/react';

export const LandingPage: React.FC<{
  onOpenAuth: () => void;
  onOpenNewTicket: () => void;
}> = ({ onOpenAuth, onOpenNewTicket }) => {
  const { tickets } = useApp();
  
  const triageItems = tickets.slice(0, 4).map(t => {
    let color = 'text-blue-600';
    let bg = 'bg-blue-100';
    let dot = 'bg-blue-600';
    
    if (t.priority === 'urgent') { color = 'text-red-600'; bg = 'bg-red-100'; dot = 'bg-red-600'; }
    else if (t.priority === 'high') { color = 'text-amber-500'; bg = 'bg-amber-100'; dot = 'bg-amber-500'; }
    else if (t.priority === 'medium') { color = 'text-blue-600'; bg = 'bg-blue-100'; dot = 'bg-blue-600'; }
    else if (t.priority === 'low') { color = 'text-emerald-600'; bg = 'bg-emerald-100'; dot = 'bg-emerald-600'; }
    
    return {
      id: t.id,
      t: t.title,
      c: t.category.charAt(0).toUpperCase() + t.category.slice(1),
      p: t.priority.charAt(0).toUpperCase() + t.priority.slice(1),
      color, bg, dot
    };
  });

  return (
    <div id="landing-page" className="min-h-screen bg-background text-foreground transition-colors duration-200 overflow-x-hidden font-sans selection:bg-primary/20">
      
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/10 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-[#4caf50]/10 blur-[120px]" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 bg-[#6c96c3] text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Bot className="size-5" />
          </div>
          <div>
            <span className="font-display text-lg font-bold tracking-tight text-slate-900">TechnoResolve Desk</span>
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <button
            id="landing-signin-btn"
            onClick={onOpenAuth}
            className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-900 transition-all hover:bg-slate-100 shadow-sm cursor-pointer"
          >
            Sign in
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-12 md:pt-20">
        
        {/* Center Hero */}
        <div className="max-w-4xl mx-auto text-center space-y-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-bold text-blue-700 border border-blue-200 shadow-sm mb-6">
              <Sparkles className="size-4 text-blue-600" />
              AI ticket classification built in
            </span>
            <h1 className="text-5xl md:text-7xl leading-[1.05] font-extrabold tracking-tight text-[#0f3b6c] font-display">
              One desk. Three very different views.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium">
              Customers get a clean self-service storefront. Technicians get a fast workspace. Admins get a dense control center. Every incoming request is triaged by AI before it lands.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              id="hero-get-started-btn"
              onClick={onOpenAuth}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0f3b6c] px-8 py-4 text-base font-bold text-white transition-all hover:bg-[#0a2e5c] shadow-sm hover:shadow-md cursor-pointer"
            >
              <span>Launch Desk</span>
              <ArrowRight className="size-4" />
            </button>
            <button
              id="hero-submit-request-btn"
              onClick={onOpenNewTicket}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-transparent bg-[#0f3b6c] px-8 py-4 text-base font-bold text-white transition-all hover:bg-[#0a2e5c] shadow-sm cursor-pointer"
            >
              <span>Submit a request</span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-6 md:gap-8 pt-8 text-sm font-semibold text-slate-500"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4.5 text-emerald-500" />
              Zero setup required
            </span>
            <span className="flex items-center gap-2">
              <Lock className="size-4.5 text-emerald-500" />
              Role-based access
            </span>
            <span className="flex items-center gap-2">
              <Layers className="size-4.5 text-emerald-500" />
              Gemini 2.5 AI Triage
            </span>
          </motion.div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 md:gap-8 auto-rows-[minmax(300px,auto)]">
          
          {/* Bento Box 1: Live Triage Engine (Col Span 4) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-4 rounded-3xl bg-white border border-slate-200 p-8 shadow-xl flex flex-col relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 font-display mb-1 flex items-center gap-2">
                  <Bot className="size-6 text-blue-400" /> Active Engine
                </h3>
                <p className="text-slate-400 text-sm">Gemini routing tickets in real-time</p>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 bg-emerald-400/10 px-3 py-1.5 rounded-full">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Preview
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-3 relative z-10">
              <AnimatePresence mode="popLayout">
                {triageItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 backdrop-blur-sm"
                  >
                    <span className="font-semibold text-slate-800 text-sm truncate flex-1 pr-4">
                      {item.t}
                    </span>
                    <div className="flex shrink-0 items-center gap-2.5">
                      <span className="rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-bold text-slate-700 border border-slate-600">
                        {item.c}
                      </span>
                      <span className={`flex items-center gap-1.5 rounded-lg ${item.bg} px-3 py-1.5 text-xs font-bold ${item.color}`}>
                        <span className={`size-1.5 rounded-full ${item.dot}`} />
                        {item.p}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 font-mono relative z-10">
              <span>Avg classification: <strong className="text-slate-700">0.38s</strong></span>
              <span>Confidence: <strong className="text-blue-400">96.4%</strong></span>
            </div>
          </motion.div>

          {/* Bento Box 2: Customer Portal (Col Span 2) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 rounded-3xl bg-white border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col relative overflow-hidden group cursor-pointer"
            onClick={onOpenAuth}
          >
            <div className="absolute -right-6 -top-6 size-32 bg-sky-100 rounded-full blur-[40px] group-hover:bg-sky-200 transition-colors pointer-events-none" />
            
            <div className="size-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mb-6 relative z-10">
              <LifeBuoy className="size-6" />
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 font-display mb-3 relative z-10">
              Customer self-service
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed flex-1 relative z-10 font-medium">
              One friendly place to submit a request, track it, and search the knowledge base.
            </p>
            
            <div className="mt-6 flex items-center gap-1.5 text-sm font-bold text-sky-600 group-hover:translate-x-1 transition-transform relative z-10">
              Preview Customer Portal <ArrowRight className="size-4" />
            </div>
          </motion.div>

          {/* Bento Box 3: Technician Workspace (Col Span 3) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-3 rounded-3xl bg-white border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6 items-start sm:items-center relative overflow-hidden group cursor-pointer"
            onClick={onOpenAuth}
          >
             <div className="absolute -left-10 -bottom-10 size-40 bg-purple-100 rounded-full blur-[50px] group-hover:bg-purple-200 transition-colors pointer-events-none" />

            <div className="size-14 shrink-0 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center relative z-10">
              <Zap className="size-7" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-slate-900 font-display mb-2">
                Technician workspace
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4 font-medium">
                A live queue, focused active-ticket pane, quick replies and instant AI resolve actions.
              </p>
              <div className="flex items-center gap-1.5 text-sm font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
                Preview Tech Workspace <ArrowRight className="size-4" />
              </div>
            </div>
          </motion.div>

          {/* Bento Box 4: Admin Center (Col Span 3) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-3 rounded-3xl bg-white border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6 items-start sm:items-center relative overflow-hidden group cursor-pointer"
            onClick={onOpenAuth}
          >
            <div className="absolute right-0 bottom-0 size-40 bg-rose-100 rounded-full blur-[50px] group-hover:bg-rose-200 transition-colors pointer-events-none" />

            <div className="size-14 shrink-0 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center relative z-10">
              <ShieldCheck className="size-7" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-slate-900 font-display mb-2">
                Admin control center
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4 font-medium">
                System analytics, user & role management, deep configuration and data exports.
              </p>
              <div className="flex items-center gap-1.5 text-sm font-bold text-rose-600 group-hover:translate-x-1 transition-transform">
                Preview Admin View <ArrowRight className="size-4" />
              </div>
            </div>
          </motion.div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-10 text-center relative z-10">
        <p className="text-sm font-medium text-slate-500">
          © {new Date().getFullYear()} TechnoResolve Desk. Powered by Gemini 2.5 Flash Triage Engine.
        </p>
      </footer>
    </div>
  );
};
