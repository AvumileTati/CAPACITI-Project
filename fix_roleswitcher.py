import sys

file_path = 'src/components/RoleSwitcher.tsx'
with open(file_path, 'r') as f:
    content = f.read()

content = content.replace(
    'className="flex items-center gap-1 rounded-full border border-slate-700/80 bg-slate-900/80 p-1 text-xs backdrop-blur-sm shadow-xs"',
    'className="flex items-center gap-1 rounded-full border border-white/20 bg-white/10 p-1 text-xs shadow-xs"'
)
content = content.replace(
    "'bg-cyan-500 text-slate-950 shadow-xs font-bold'",
    "'bg-[#4caf50] text-white shadow-xs font-bold'"
)
content = content.replace(
    "'text-slate-500 hover:text-slate-400 opacity-60'",
    "'text-white/40 opacity-60'"
)
content = content.replace(
    "'text-slate-300 hover:text-white hover:bg-slate-800'",
    "'text-slate-300 hover:text-white hover:bg-white/10'"
)

with open(file_path, 'w') as f:
    f.write(content)
print("Updated Role Switcher")
