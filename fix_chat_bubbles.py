import sys
import re

file_path = 'src/components/TechnicianWorkspace.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# Replace Internal Note style
content = content.replace(
    'className="w-full max-w-2xl rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs text-amber-200 shadow-sm"',
    'className="w-full max-w-2xl rounded-xl border border-slate-300 bg-white p-4 text-xs shadow-sm"'
)
content = content.replace(
    'className="flex items-center justify-between font-bold text-amber-400 pb-1.5 border-b border-amber-500/20"',
    'className="flex items-center justify-between font-bold text-slate-700 pb-1.5 border-b border-slate-200"'
)
content = content.replace(
    '<Lock className="size-3.5 text-amber-400" />',
    '<Lock className="size-3.5 text-slate-500" />'
)

# Fix Regular message styles
content = content.replace(
    "isMe ? 'bg-[#0b2447] border border-[#0f3b6c]/20 text-[#0f3b6c] rounded-br-xs' : 'bg-[#0d2244] border border-slate-200 text-slate-900 rounded-bl-xs'",
    "isMe ? 'bg-[#f4f6f8] border border-slate-200 text-slate-900 rounded-br-xs' : 'bg-white border border-slate-200 text-slate-900 rounded-bl-xs'"
)
content = content.replace(
    "isMe ? 'bg-[#0c2447] border border-[#0f3b6c]/20 text-[#0f3b6c] rounded-br-xs' : 'bg-[#0d2244] border border-slate-200 text-slate-900 rounded-bl-xs'",
    "isMe ? 'bg-[#f4f6f8] border border-slate-200 text-slate-900 rounded-br-xs' : 'bg-white border border-slate-200 text-slate-900 rounded-bl-xs'"
)

# Find and fix the specific line for regular messages:
# className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-xs ${
#   isMe
#     ? 'bg-[#0b2447] border border-[#0f3b6c]/20 text-[#0f3b6c] rounded-br-xs'
#     : 'bg-[#0d2244] border border-slate-200 text-slate-900 rounded-bl-xs'
# }`}
content = re.sub(
    r"isMe\s*\?\s*'[^']+'\s*:\s*'[^']+'",
    "isMe ? 'bg-[#f4f6f8] border border-slate-200 text-slate-900 rounded-br-xs' : 'bg-white border border-slate-200 text-slate-900 rounded-bl-xs'",
    content
)

with open(file_path, 'w') as f:
    f.write(content)
print("Updated Tech Chat Bubbles")
