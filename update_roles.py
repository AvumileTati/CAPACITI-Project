import sys

file_path = 'src/components/RoleSwitcher.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# Update RoleSwitcher container
container_target = 'className="flex items-center gap-1 rounded-full border border-white/20 bg-white/10 p-1 text-xs shadow-xs"'
container_replace = 'className="flex items-center gap-1.5 rounded-full p-1 text-xs"'
content = content.replace(container_target, container_replace)

# Update buttons loop
btn_target = """            className={`flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
              isActive
                ? 'bg-[#4caf50] text-white shadow-xs font-bold'
                : isLocked
                ? 'text-white/40 opacity-60'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}"""

btn_replace = """            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-all cursor-pointer shadow-sm ${
              isActive
                ? (r.id === 'admin' ? 'bg-[#10b981] text-white font-bold' : r.id === 'technician' ? 'bg-[#3b82f6] text-white font-bold' : 'bg-[#f59e0b] text-white font-bold')
                : isLocked
                ? 'bg-slate-100 text-slate-400 opacity-60 border border-slate-200'
                : (r.id === 'admin' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : r.id === 'technician' ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' : 'bg-amber-50 text-amber-700 hover:bg-amber-100')
            }`}"""

content = content.replace(btn_target, btn_replace)

with open(file_path, 'w') as f:
    f.write(content)
