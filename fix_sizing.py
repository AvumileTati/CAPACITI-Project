import sys

file_path = 'src/components/TechnicianWorkspace.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# 1. Title
content = content.replace('text-2xl font-black text-slate-900 tracking-tight', 'text-xl font-extrabold text-slate-900 tracking-tight')

# 2. Status Badge in Header
content = content.replace('px-3 py-1 rounded-full text-xs font-bold border border-emerald-200', 'px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-200')

# 3. Header Avatars
content = content.replace('size-10 rounded-full bg-slate-200', 'size-8 rounded-full bg-slate-200')

# 4. Chat Avatars
content = content.replace('size-10 rounded-full bg-slate-300', 'size-8 rounded-full bg-slate-300 text-xs')
content = content.replace('<div className="flex gap-4">', '<div className="flex gap-3">')
content = content.replace('className={`flex gap-4 ${isMe ? \'flex-row-reverse\' : \'\'}`}', 'className={`flex gap-3 ${isMe ? \'flex-row-reverse\' : \'\'}`}')

# 5. Chat bubbles
content = content.replace('p-4 rounded-2xl text-sm', 'p-3 rounded-xl text-xs')
content = content.replace('p-4 rounded-2xl rounded-tl-sm text-sm', 'p-3 rounded-xl rounded-tl-sm text-xs')
content = content.replace('rounded-2xl text-sm whitespace-pre-wrap', 'rounded-xl text-xs whitespace-pre-wrap')

# 6. Right Column
content = content.replace('w-24 border-l border-slate-200 bg-white p-3 flex flex-col gap-3', 'w-16 border-l border-slate-200 bg-white p-2 flex flex-col gap-2')
# We need to specifically target the icons in the right column, maybe just by changing size-5 to size-4 but let's be careful.
content = content.replace('<UserPlus className="size-5" />', '<UserPlus className="size-4" />')
content = content.replace('<UserCheck className="size-5" />', '<UserCheck className="size-4" />')
content = content.replace('<ArrowUpRight className="size-5" />', '<ArrowUpRight className="size-4" />')
content = content.replace('<CheckCircle className="size-5" />', '<CheckCircle className="size-4" />')

# Right column text
content = content.replace('text-[10px] font-bold text-center leading-tight', 'text-[9px] font-bold text-center leading-tight')

# 7. Composer
content = content.replace('p-3 pb-12 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm', 'p-2 pb-10 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs')
content = content.replace('px-5 py-2 rounded-lg text-sm font-bold', 'px-3 py-1.5 rounded-lg text-xs font-bold')
content = content.replace('flex items-center gap-4 border-b border-slate-200 pb-2', 'flex items-center gap-3 border-b border-slate-200 pb-2')

# 8. Tabs in Details view
content = content.replace('py-4 text-sm font-bold border-b-2', 'py-3 text-xs font-bold border-b-2')
content = content.replace('px-3 py-1.5 text-sm font-medium', 'px-2 py-1 text-xs font-medium')

# 9. Header Text items
content = content.replace('font-bold text-sm text-slate-900">{activeTicket.requester_name}', 'font-bold text-xs text-slate-900">{activeTicket.requester_name}')
content = content.replace('font-bold text-sm text-slate-900">{activeTicket.assigned_name || \'Unassigned\'}', 'font-bold text-xs text-slate-900">{activeTicket.assigned_name || \'Unassigned\'}')
content = content.replace('gap-1.5 text-slate-500 text-sm font-semibold', 'gap-1.5 text-slate-500 text-xs font-semibold')
content = content.replace('space-y-1 text-sm border-l border-slate-200 pl-6', 'space-y-1 text-xs border-l border-slate-200 pl-6')

# Chat timestamp font
content = content.replace('font-bold text-sm text-slate-900">{activeTicket.requester_name}', 'font-bold text-xs text-slate-900">{activeTicket.requester_name}')
content = content.replace('font-bold text-sm text-slate-900">{msg.author_name}', 'font-bold text-xs text-slate-900">{msg.author_name}')

with open(file_path, 'w') as f:
    f.write(content)
print("Updated Sizing")
