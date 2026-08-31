import sys

file_path = 'src/components/LoginPage.tsx'
with open(file_path, 'r') as f:
    content = f.read()

content = content.replace(
    'className="w-full flex items-center justify-center gap-3 rounded-xl border border-[#1b3d70] bg-slate-50 hover:bg-slate-100 hover:border-[#4caf50]/50 text-slate-900 font-semibold py-2.5 px-4 text-xs transition-all shadow-sm cursor-pointer disabled:opacity-50"',
    'className="w-full flex items-center justify-center gap-3 rounded-xl border border-transparent bg-[#0f3b6c] hover:bg-[#0a2e5c] text-white font-semibold py-2.5 px-4 text-xs transition-all shadow-sm cursor-pointer disabled:opacity-50"'
)

with open(file_path, 'w') as f:
    f.write(content)
print("Updated Google button")
