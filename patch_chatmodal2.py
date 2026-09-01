import sys

file_path = 'src/components/TicketChatModal.tsx'
with open(file_path, 'r') as f:
    content = f.read()

imports_find = "import { Sparkles, X, Send, Bot, Shield, Wrench, User, Lock, Loader2, Play } from 'lucide-react';"
if imports_find in content:
    content = content.replace(
        imports_find,
        "import { Sparkles, X, Send, Bot, Shield, Wrench, User, Lock, Loader2, Play, FileIcon as File, Download, Paperclip, Trash2 } from 'lucide-react';"
    )
else:
    # Try just inserting it at top
    pass

state_replace = "const [inputBody, setInputBody] = useState('');"
state_new = """const [inputBody, setInputBody] = useState('');
  const [attachments, setAttachments] = useState<{ id: string; file: File; previewUrl: string; size: number }[]>([]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newAttachments = Array.from(e.target.files).map(file => ({
        id: Math.random().toString(36).substring(7),
        file,
        previewUrl: URL.createObjectURL(file),
        size: file.size
      }));
      setAttachments(prev => [...prev, ...newAttachments].slice(0, 5));
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };
"""
content = content.replace(state_replace, state_new)

submit_replace = """  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputBody.trim()) return;

    try {
      await sendMessage(ticket.id, inputBody.trim(), isInternal);
      setInputBody('');
      setIsInternal(false);
    } catch (error) {
      console.error(error);
    }
  };"""

submit_new = """  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputBody.trim() && attachments.length === 0) return;

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
      await sendMessage(ticket.id, inputBody.trim(), isInternal, processedAttachments);
      setInputBody('');
      setAttachments([]);
      setIsInternal(false);
    } catch (error) {
      console.error(error);
    }
  };"""
content = content.replace(submit_replace, submit_new)

form_inputs_find = """          <div className="flex items-center gap-2">
            <textarea"""

form_inputs_new = """          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {attachments.map(att => (
                <div key={att.id} className="flex items-center gap-2 bg-secondary/50 rounded-lg p-1.5 pr-2 border border-border">
                  <div className="size-8 shrink-0 rounded bg-background flex items-center justify-center overflow-hidden">
                    {att.file.type.startsWith('image/') ? (
                      <img src={att.previewUrl} alt="preview" className="size-full object-cover" />
                    ) : (
                      <File className="size-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="text-xs overflow-hidden max-w-[100px]">
                    <p className="truncate font-medium text-foreground">{att.file.name}</p>
                    <p className="text-[9px] text-muted-foreground">{formatBytes(att.size)}</p>
                  </div>
                  <button type="button" onClick={() => removeAttachment(att.id)} className="p-1 hover:bg-destructive/10 hover:text-destructive rounded-md ml-1 transition-colors">
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => document.getElementById('chat-file-upload')?.click()}
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground transition hover:bg-secondary/80 hover:text-foreground shadow-xs border border-border"
            >
              <Paperclip className="size-4" />
            </button>
            <input 
              id="chat-file-upload" 
              type="file" 
              multiple 
              className="hidden" 
              onChange={handleFileSelect}
            />
            <textarea"""
content = content.replace(form_inputs_find, form_inputs_new)

disabled_btn_find = "disabled={!inputBody.trim()}"
disabled_btn_new = "disabled={!inputBody.trim() && attachments.length === 0}"
content = content.replace(disabled_btn_find, disabled_btn_new)


chat_bubble_find = """                    <p className="text-sm whitespace-pre-wrap leading-relaxed mt-0.5">
                      {msg.body}
                    </p>
                  </div>
                )}
              </div>
            );"""

chat_bubble_new = """                    <p className="text-sm whitespace-pre-wrap leading-relaxed mt-0.5">
                      {msg.body}
                    </p>
                    
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-3 space-y-1.5 border-t pt-2 border-current/10">
                        {msg.attachments.map(att => (
                          <a 
                            key={att.id}
                            href={att.url}
                            download={att.name}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 p-1.5 rounded-lg border border-current/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
                          >
                            <div className="size-7 rounded bg-background/50 flex items-center justify-center shrink-0 border border-current/10 overflow-hidden">
                              {att.type.startsWith('image/') ? (
                                  <img src={att.url} alt={att.name} className="size-full object-cover" />
                              ) : (
                                  <File className="size-3 text-current opacity-70" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-semibold text-current truncate">{att.name}</p>
                              <p className="text-[9px] text-current opacity-70">{formatBytes(att.size)}</p>
                            </div>
                            <Download className="size-3 text-current opacity-50 group-hover:opacity-100 transition-opacity shrink-0 mr-1" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );"""
content = content.replace(chat_bubble_find, chat_bubble_new)

# Same for internal notes
internal_bubble_find = """                    <p className="mt-1.5 text-sm whitespace-pre-wrap text-foreground">
                      {msg.body}
                    </p>
                  </div>
                ) : ("""
internal_bubble_new = """                    <p className="mt-1.5 text-sm whitespace-pre-wrap text-foreground">
                      {msg.body}
                    </p>
                    
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-3 space-y-1.5 border-t pt-2 border-amber-500/20">
                        {msg.attachments.map(att => (
                          <a 
                            key={att.id}
                            href={att.url}
                            download={att.name}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 p-1.5 rounded-lg border border-amber-500/20 hover:bg-amber-500/10 transition-colors group"
                          >
                            <div className="size-7 rounded bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20 overflow-hidden">
                              {att.type.startsWith('image/') ? (
                                  <img src={att.url} alt={att.name} className="size-full object-cover" />
                              ) : (
                                  <File className="size-3 text-amber-600 dark:text-amber-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 truncate">{att.name}</p>
                              <p className="text-[9px] text-amber-600/70 dark:text-amber-400/70">{formatBytes(att.size)}</p>
                            </div>
                            <Download className="size-3 text-amber-600/50 group-hover:text-amber-600 transition-opacity shrink-0 mr-1" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : ("""
content = content.replace(internal_bubble_find, internal_bubble_new)


with open(file_path, 'w') as f:
    f.write(content)
