import sys

file_path = 'src/components/NewTicketModal.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# Add handlers
handlers = """
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
"""

# Replace handleSubmit
import re
content = re.sub(r'const handleSubmit = async.*?};', handlers, content, flags=re.DOTALL)


file_ui = """
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
"""

content = content.replace("          </label>\n          {/* AI Intelligence Feature Card */}", file_ui)

# Make description optional if attachments are present
content = content.replace(
    'placeholder="Describe the issue in detail, error codes, affected devices or business impact..."\n              required\n              minLength={10}',
    'placeholder="Describe the issue in detail, error codes, affected devices or business impact..."\n              required={attachments.length === 0}\n              minLength={attachments.length === 0 ? 10 : undefined}'
)


with open(file_path, 'w') as f:
    f.write(content)
