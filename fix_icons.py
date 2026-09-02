import sys
import re

file_path = 'src/components/TicketChatModal.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# Fix Download, Paperclip, Trash2 by ensuring they are in the lucide-react import
import_line = re.search(r'import {([^}]+)} from \'lucide-react\';', content)
if import_line:
    imports = import_line.group(1).split(',')
    imports = [i.strip() for i in imports]
    for new_icon in ['Download', 'Trash2', 'Paperclip', 'File as FileIcon']:
        if new_icon.split(' as ')[0] not in [i.split(' as ')[0] for i in imports]:
            imports.append(new_icon)
    
    new_import_line = f"import {{ {', '.join(imports)} }} from 'lucide-react';"
    content = content.replace(import_line.group(0), new_import_line)

content = content.replace('<File className', '<FileIcon className')

with open(file_path, 'w') as f:
    f.write(content)

