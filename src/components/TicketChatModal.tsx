import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Ticket, TicketStatus } from '../types';
import { getCategoryLabel, formatStatus, MACROS } from '../data/seedData';
import {
  X,
  Send,
  Sparkles,
  Lock,
  MessageSquare,
  Clock,
  User,
  Shield,
  Wrench,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export const TicketChatModal: React.FC<{
  ticket: Ticket | null;
  onClose: () => void;
}> = ({ ticket, onClose }) => {
  const {
    currentUser,
    messages,
    sendMessage,
    updateTicket,
    draftAIReply,
    markTicketRead,
    viewRole,
  } = useApp();

  const [inputBody, setInputBody] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const ticketId = ticket?.id;

  useEffect(() => {
    if (ticketId) {
      markTicketRead(ticketId);
    }
  }, [ticketId, markTicketRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, ticketId]);

  if (!ticket) return null;

  const ticketMessages = messages.filter((m) => {
    if (m.ticket_id !== ticket.id) return false;
    // Customer cannot view internal notes
    if (viewRole === 'user' && m.internal) return false;
    return true;
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputBody.trim()) return;

    sendMessage(ticket.id, inputBody.trim(), isInternal);
    setInputBody('');
  };

  const handleAIDraft = async () => {
    setIsDrafting(true);
    try {
      const suggestion = await draftAIReply(ticket.id);
      if (suggestion) {
        setInputBody(suggestion);
        setIsInternal(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDrafting(false);
    }
  };

  const isOperator = viewRole === 'admin' || viewRole === 'technician';

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'urgent':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'high':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'medium':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'resolved':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'in_progress':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'escalated':
        return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
      case 'pending_user':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      default:
        return 'bg-sky-500/10 text-sky-600 border-sky-500/20';
    }
  };

  return (
    <div
      id="ticket-chat-modal-overlay"
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        id="ticket-chat-modal"
        className="panel flex h-[88vh] w-full max-w-3xl flex-col overflow-hidden bg-surface border-border shadow-2xl animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/80 p-5 bg-surface">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-bold text-muted-foreground">
                {ticket.id}
              </span>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${getStatusColor(
                  ticket.status
                )}`}
              >
                {formatStatus(ticket.status)}
              </span>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${getPriorityColor(
                  ticket.priority
                )}`}
              >
                {ticket.priority} Priority
              </span>
            </div>
            <h2 className="text-lg font-bold font-display text-foreground line-clamp-1">
              {ticket.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span>{getCategoryLabel(ticket.category)}</span>
              <span>·</span>
              <span>
                Requester: <strong>{ticket.requester_name}</strong>{' '}
                {ticket.company ? `(${ticket.company})` : ''}
              </span>
              {ticket.assigned_name && (
                <>
                  <span>·</span>
                  <span>
                    Assigned: <strong>{ticket.assigned_name}</strong>
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isOperator && (
              <select
                value={ticket.status}
                onChange={(e) =>
                  updateTicket(ticket.id, { status: e.target.value as TicketStatus })
                }
                className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="new">Status: New</option>
                <option value="in_progress">In Progress</option>
                <option value="pending_user">Pending User</option>
                <option value="escalated">Escalated</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* AI Triage Banner */}
        {ticket.ai_reasoning && (
          <div className="flex items-center justify-between border-b border-primary/15 bg-primary/5 px-5 py-2.5 text-xs">
            <div className="flex items-center gap-2 text-foreground">
              <Sparkles className="size-3.5 text-primary shrink-0" />
              <span>
                <strong>AI Triage:</strong> {ticket.ai_reasoning}
              </span>
            </div>
            {ticket.ai_confidence && (
              <span className="shrink-0 text-[11px] font-semibold text-primary">
                {Math.round(ticket.ai_confidence * 100)}% Confidence
              </span>
            )}
          </div>
        )}

        {/* Conversation Stream */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5 bg-background/50">
          {/* Initial Ticket Description Card */}
          <div className="rounded-xl border border-border/80 bg-surface p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border/40 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <User className="size-3.5 text-primary" />
                {ticket.requester_name} (Initial Request)
              </span>
              <span>{new Date(ticket.created_at).toLocaleString()}</span>
            </div>
            <p className="mt-2.5 text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {ticket.description}
            </p>
          </div>

          {/* Messages */}
          {ticketMessages.map((msg) => {
            const isMe = msg.author_id === currentUser?.id;
            const isNote = msg.internal;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  isNote
                    ? 'items-center my-3'
                    : isMe
                    ? 'items-end'
                    : 'items-start'
                }`}
              >
                {isNote ? (
                  <div className="w-full rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-foreground">
                    <div className="flex items-center justify-between font-semibold text-amber-600 dark:text-amber-400">
                      <span className="flex items-center gap-1.5">
                        <Lock className="size-3.5" />
                        Internal Technician Note · {msg.author_name}
                      </span>
                      <span className="text-[11px] font-normal text-muted-foreground">
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm whitespace-pre-wrap text-foreground">
                      {msg.body}
                    </p>
                  </div>
                ) : (
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-xs ${
                      isMe
                        ? 'bg-primary text-primary-foreground rounded-br-xs'
                        : 'bg-surface border border-border text-foreground rounded-bl-xs'
                    }`}
                  >
                    <div
                      className={`flex items-center justify-between gap-3 text-[11px] pb-1 ${
                        isMe ? 'text-primary-foreground/80' : 'text-muted-foreground'
                      }`}
                    >
                      <span className="font-semibold flex items-center gap-1">
                        {msg.author_role === 'technician' ? (
                          <Wrench className="size-3" />
                        ) : msg.author_role === 'admin' ? (
                          <Shield className="size-3" />
                        ) : (
                          <User className="size-3" />
                        )}
                        {msg.author_name}
                      </span>
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

        {/* Canned Macros for Operators */}
        {isOperator && ticket.status !== 'resolved' && ticket.status !== 'closed' && (
          <div className="flex items-center gap-1.5 overflow-x-auto border-t border-border/60 bg-surface px-5 py-2 text-xs">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider shrink-0 mr-1">
              Macros:
            </span>
            {MACROS.map((macro) => (
              <button
                key={macro.label}
                onClick={() => setInputBody(macro.body)}
                className="shrink-0 rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium text-foreground hover:border-primary/40 hover:bg-secondary transition-colors"
              >
                {macro.label}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        {(ticket.status === 'resolved' || ticket.status === 'closed') ? (
          <div className="border-t border-border/80 bg-secondary/50 p-6 flex flex-col items-center justify-center text-center space-y-2">
            <Lock className="size-5 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              This ticket has been marked as resolved.
            </p>
            <p className="text-xs text-muted-foreground">
              Further communication is disabled. If you need more help, please open a new ticket.
            </p>
          </div>
        ) : (
        <form
          onSubmit={handleSend}
          className="border-t border-border/80 bg-surface p-4 space-y-2"
        >
          <div className="flex items-center justify-between text-xs">
            {isOperator ? (
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isInternal}
                    onChange={(e) => setIsInternal(e.target.checked)}
                    className="size-3.5 rounded accent-amber-500"
                  />
                  <span
                    className={`font-semibold flex items-center gap-1 ${
                      isInternal ? 'text-amber-500' : 'text-muted-foreground'
                    }`}
                  >
                    <Lock className="size-3" />
                    Internal Technician Note
                  </span>
                </label>

                <button
                  type="button"
                  onClick={handleAIDraft}
                  disabled={isDrafting}
                  className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-semibold text-primary hover:bg-primary/20 transition-all text-xs"
                >
                  {isDrafting ? (
                    <>
                      <Loader2 className="size-3 animate-spin" />
                      <span>Drafting with Gemini…</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-3" />
                      <span>AI Draft Reply</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <span className="text-muted-foreground">
                Reply to the support technician directly:
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <textarea
              value={inputBody}
              onChange={(e) => setInputBody(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleSend(e);
                }
              }}
              placeholder={
                isInternal
                  ? 'Write an internal note (visible to admins and technicians only)...'
                  : 'Type your message (Ctrl+Enter to send)...'
              }
              rows={2}
              className={`w-full resize-none rounded-xl border px-3.5 py-2 text-sm text-foreground outline-none focus:ring-2 transition-all ${
                isInternal
                  ? 'border-amber-500/40 bg-amber-500/5 focus:ring-amber-500'
                  : 'border-input bg-background focus:ring-primary'
              }`}
            />
            <button
              type="submit"
              disabled={!inputBody.trim()}
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition hover:opacity-90 disabled:opacity-50 shadow-xs"
            >
              <Send className="size-4" />
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};
