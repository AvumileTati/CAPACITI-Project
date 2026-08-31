import sys

file_path = 'src/components/CustomerPortal.tsx'
with open(file_path, 'r') as f:
    content = f.read()

content = content.replace(
    'className="relative p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"',
    'className="relative p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"'
)
content = content.replace(
    'className="flex items-center gap-1 text-slate-600 hover:text-rose-600 text-xs font-semibold px-2 py-1 transition-colors cursor-pointer"',
    'className="flex items-center gap-1 text-slate-300 hover:text-rose-300 text-xs font-semibold px-2 py-1 transition-colors cursor-pointer"'
)

with open(file_path, 'w') as f:
    f.write(content)
print("Updated Right Header")
