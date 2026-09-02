import sys
import re

file_path = 'src/components/TicketChatModal.tsx'
with open(file_path, 'r') as f:
    content = f.read()

content = content.replace("Array.from(e.target.files).map(file =>", "Array.from(e.target.files as ArrayLike<File>).map((file: File) =>")
content = content.replace("lucide-react';", "Download, Trash2, Paperclip, FileIcon } from 'lucide-react';")
# fix type errors for lucide icons
content = re.sub(r'<Download className="([^"]+)" />', r'<Download className="\1" />', content)

with open(file_path, 'w') as f:
    f.write(content)
