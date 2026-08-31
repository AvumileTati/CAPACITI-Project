import sys

file_path = 'src/components/TechnicianWorkspace.tsx'
with open(file_path, 'r') as f:
    content = f.read()

content = content.replace(
    'bg-rose-950/70 border border-rose-500/40 px-2 py-0.5 text-[10px] font-bold text-rose-300',
    'bg-rose-100 border border-rose-200 px-2 py-0.5 text-[10px] font-bold text-rose-700'
)
content = content.replace(
    'bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold text-amber-300',
    'bg-orange-100 border border-orange-200 px-2 py-0.5 text-[10px] font-bold text-orange-700'
)
content = content.replace(
    'bg-blue-950/60 border border-blue-500/30 px-2 py-0.5 text-[10px] font-semibold text-blue-300',
    'bg-sky-100 border border-sky-200 px-2 py-0.5 text-[10px] font-bold text-sky-700'
)

with open(file_path, 'w') as f:
    f.write(content)
print("Updated Badges")
