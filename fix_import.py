import sys

file_path = 'src/components/TicketChatModal.tsx'
with open(file_path, 'r') as f:
    content = f.read()

content = content.replace("} from 'Download, Trash2, Paperclip, FileIcon } from 'lucide-react';", "} from 'lucide-react';")

with open(file_path, 'w') as f:
    f.write(content)
