import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/seedData';
import { TicketCategory } from '../types';
import { Sparkles, X, Loader2, CheckCircle, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const NewTicketModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: TicketCategory;
}> = ({ isOpen, onClose, initialCategory }) => {
  const { createTicket, currentUser, isAIClassifying } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [company, setCompany] = useState(currentUser?.company || '');
  const [selectedCategory, setSelectedCategory] = useState<TicketCategory | ''>(
    initialCategory || ''
  );
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);
    try {
      await createTicket({
        title: title.trim(),
        description: description.trim(),
        company: company.trim() || undefined,
        category: selectedCategory || undefined,
      });

      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
      });

      onClose();
      setTitle('');
      setDescription('');
      setSelectedCategory('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      id="new-ticket-modal-overlay"
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        id="new-ticket-modal"
        className="panel max-h-[92vh] w-full max-w-lg overflow-y-auto p-6 shadow-2xl bg-surface border-border animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-start justify-between pb-3 border-b border-border/60">
          <div>
            <h2 className="text-xl font-bold font-display">New business request</h2>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" />
              AI reads your description and routes it for you automatically.
            </p>
          </div>
          <button
            id="close-ticket-modal-btn"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block">
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Subject
            </span>
            <input
              id="ticket-subject-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Card declined on annual renewal"
              required
              minLength={4}
              maxLength={140}
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center justify-between">
              <span>Category</span>
              <span className="text-[11px] font-normal text-muted-foreground">
                Optional — AI will suggest one
              </span>
            </span>
            <select
              id="ticket-category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as TicketCategory | '')}
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition-all"
            >
              <option value="">Let AI decide automatically</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label} — {cat.blurb}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Company / Department
            </span>
            <input
              id="ticket-company-input"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Acme Corp (Finance)"
              maxLength={120}
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              How can we help?
            </span>
            <textarea
              id="ticket-description-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail, error codes, affected devices or business impact..."
              required
              minLength={10}
              maxLength={4000}
              rows={5}
              className="mt-1.5 w-full resize-none rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </label>

          {/* AI Intelligence Feature Card */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs text-muted-foreground flex items-start gap-2.5">
            <Sparkles className="size-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Gemini Real-Time Triage</p>
              <p className="mt-0.5">
                Our model assesses urgency, extracts technical entities, routes to the on-call queue, and calculates response SLA target instantly.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-xs font-medium text-muted-foreground hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              id="submit-ticket-btn"
              type="submit"
              disabled={submitting || isAIClassifying}
              className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60 shadow-xs"
            >
              {(submitting || isAIClassifying) ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Classifying & Submitting…</span>
                </>
              ) : (
                <>
                  <CheckCircle className="size-3.5" />
                  <span>Submit request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
