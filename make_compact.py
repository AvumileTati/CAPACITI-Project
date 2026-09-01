import sys

file_path = 'src/components/TechnicianWorkspace.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# Structural Widths & Heights
content = content.replace('w-[240px]', 'w-[200px]')
content = content.replace('w-[320px]', 'w-[280px]')
content = content.replace('h-16', 'h-12') # Compact headers

# Paddings and Gaps
content = content.replace('px-6', 'px-4')
content = content.replace('p-6', 'p-4')
content = content.replace('py-6', 'py-4')
content = content.replace('gap-6', 'gap-4')
content = content.replace('p-8', 'p-6') # Empty states

# Sidebar adjustments
content = content.replace('px-3 py-2 rounded-xl text-sm', 'px-2 py-1.5 rounded-lg text-xs')
content = content.replace('size-4', 'size-3.5') # General icon sizing down slightly where it was size-4

# Header tweaks
content = content.replace('text-2xl font-black', 'text-lg font-black') # App Logo Text
content = content.replace('text-xl font-extrabold', 'text-lg font-bold') # Ticket Title
content = content.replace('size-8 rounded-full', 'size-6 rounded-full text-[10px]') # Avatars
content = content.replace('size-7 rounded-full', 'size-6 rounded-full text-[10px]') # Header avatar

# Ticket List Item tweaks
content = content.replace('p-3 rounded-xl border', 'p-2.5 rounded-lg border')
content = content.replace('p-4 border-b', 'p-3 border-b')

# Composer tweaks
content = content.replace('p-3 pb-12', 'p-2 pb-10')

# Message Bubbles
content = content.replace('p-3 rounded-xl', 'p-2.5 rounded-lg')
content = content.replace('space-y-6', 'space-y-4')

with open(file_path, 'w') as f:
    f.write(content)
print("Made UI compact!")
