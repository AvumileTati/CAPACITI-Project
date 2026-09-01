import sys

file_path = 'src/components/TicketChatModal.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# Add File icon
content = content.replace(
    "import { X, Send, Bot, User, Wrench, ShieldCheck, Clock, CheckCircle, AlertTriangle, AlertCircle, Building, Mail, Sparkles, Plus, Copy } from 'lucide-react';",
    "import { X, Send, Bot, User, Wrench, ShieldCheck, Clock, CheckCircle, AlertTriangle, AlertCircle, Building, Mail, Sparkles, Plus, Copy, File as FileIcon, Download } from 'lucide-react';"
)

format_bytes_func = """
  const formatBytes = (bytes: number) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };
"""

content = content.replace("const [msgBody, setMsgBody] = useState('');", "const [msgBody, setMsgBody] = useState('');\n" + format_bytes_func)

attachments_ui = """
                {/* Attachments Section */}
                {ticket.attachments && ticket.attachments.length > 0 && (
                  <div className="pt-4 mt-4 border-t border-slate-200/60">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Attachments ({ticket.attachments.length})</h4>
                    <div className="space-y-2">
                      {ticket.attachments.map(att => (
                        <a 
                          key={att.id}
                          href={att.url}
                          download={att.name}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-3 p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-colors group"
                        >
                          <div className="size-8 rounded bg-white flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden">
                            {att.type.startsWith('image/') ? (
                                <img src={att.url} alt={att.name} className="size-full object-cover" />
                            ) : (
                                <FileIcon className="size-4 text-slate-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-700 truncate">{att.name}</p>
                            <p className="text-[10px] text-slate-500">{formatBytes(att.size)}</p>
                          </div>
                          <Download className="size-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
"""

# Insert attachments UI after the description or after requester info
content = content.replace(
    "{/* AI Analysis */}",
    attachments_ui + "\n                {/* AI Analysis */}"
)

with open(file_path, 'w') as f:
    f.write(content)
