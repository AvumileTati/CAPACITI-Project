import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/seedData';
import { TicketCategory } from '../types';
import { Sparkles, X, Loader2, CheckCircle, HelpCircle, UploadCloud, Trash2, File as FileIcon } from 'lucide-react';
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
  const [attachments, setAttachments] = useState<{ id: string; file: File; previewUrl: string; size: number }[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const processFiles = (files: FileList | File[]) => {
    const newAttachments = Array.from(files).map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      previewUrl: URL.createObjectURL(file),
      size: file.size
    }));
    setAttachments(prev => [...prev, ...newAttachments].slice(0, 5)); // max 5
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };
  
  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };
  
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };
  
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Allow submission if description is empty BUT attachments are present
    if (!title.trim() || (!description.trim() && attachments.length === 0)) return;
    setSubmitting(true);
    try {
      const processedAttachments = await Promise.all(
        attachments.map(async (att) => {
          let url = att.previewUrl;
          if (att.size < 500000) {
             url = await fileToBase64(att.file);
          }
          return {
            id: att.id,
            name: att.file.name,
            size: att.size,
            type: att.file.type,
            url: url
          };
        })
      );

      await createTicket({
        title: title.trim(),
        description: description.trim(),
        company: company.trim() || undefined,
        category: selectedCategory || undefined,
        attachments: processedAttachments
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
      setAttachments([]);
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
        className="panel max-h-[96vh] w-full max-w-lg overflow-y-auto p-6 shadow-2xl bg-surface border-border animate-in zoom-in-95 duration-200"
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
              required={attachments.length === 0}
              minLength={attachments.length === 0 ? 10 : undefined}
              maxLength={4000}
              rows={5}
              className="mt-1.5 w-full resize-none rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </label>

          {/* Attachments UI */}
          <div className="block">
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5 block">
              Attachments
            </span>
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`w-full rounded-xl border-2 border-dashed p-6 transition-all flex flex-col items-center justify-center gap-2 text-center cursor-pointer ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:bg-secondary/50'}`}
              onClick={() => document.getElementById('ticket-file-upload')?.click()}
            >
              <input 
                id="ticket-file-upload" 
                type="file" 
                multiple 
                className="hidden" 
                onChange={handleFileSelect}
              />
              <div className="size-10 rounded-full bg-secondary flex items-center justify-center">
                <UploadCloud className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Click to upload or drag & drop</p>
                <p className="text-xs text-muted-foreground mt-0.5">PNG, JPG, PDF up to 10MB</p>
              </div>
            </div>

            {attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {attachments.map(att => (
                  <div key={att.id} className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-secondary/30">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="size-8 rounded bg-background flex items-center justify-center shrink-0 shadow-xs border border-border/50">
                        {att.file.type.startsWith('image/') ? (
                          <img src={att.previewUrl} alt="preview" className="size-full object-cover rounded" />
                        ) : (
                          <FileIcon className="size-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-medium text-foreground truncate">{att.file.name}</p>
                        <p className="text-[10px] text-muted-foreground">{formatBytes(att.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeAttachment(att.id); }}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-destructive/10"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

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
