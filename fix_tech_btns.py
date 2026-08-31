import sys

file_path = 'src/components/TechnicianWorkspace.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# Fix sub-tab Discussion
content = content.replace(
    "'bg-[#122f5a] text-[#0f3b6c] border border-[#0f3b6c]/20'",
    "'bg-[#0f3b6c] text-white'"
)
content = content.replace(
    "'bg-slate-100 text-[#0f3b6c] border border-[#0f3b6c]/20'",
    "'bg-[#0f3b6c] text-white'"
)

# Fix Escalate button
content = content.replace(
    'className="flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-950/40 px-3.5 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-950/70 transition-all shadow-xs cursor-pointer"',
    'className="flex items-center gap-1.5 rounded-xl border-transparent bg-[#4caf50] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#388e3c] transition-all shadow-xs cursor-pointer"'
)

# Fix Take Ticket button
content = content.replace(
    'className="flex items-center gap-1.5 rounded-xl border border-[#0f3b6c]/20 bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-[#0f3b6c] hover:bg-blue-950/60 transition-all shadow-xs cursor-pointer"',
    'className="flex items-center gap-1.5 rounded-xl border border-transparent bg-[#4caf50] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#388e3c] transition-all shadow-xs cursor-pointer"'
)
content = content.replace(
    'className="flex items-center gap-1.5 rounded-xl border border-[#0f3b6c]/20 bg-[#0d2a50] px-3.5 py-1.5 text-xs font-semibold text-[#0f3b6c] hover:bg-blue-950/60 transition-all shadow-xs cursor-pointer"',
    'className="flex items-center gap-1.5 rounded-xl border border-transparent bg-[#4caf50] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#388e3c] transition-all shadow-xs cursor-pointer"'
)

# Fix Select dropdown for Status
content = content.replace(
    'className="rounded-xl border border-slate-700 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none hover:border-slate-500 transition-colors cursor-pointer"',
    'className="rounded-xl border border-transparent bg-[#4caf50] px-3 py-1.5 text-xs font-semibold text-white outline-none hover:bg-[#388e3c] transition-colors cursor-pointer appearance-none"'
)
content = content.replace(
    'className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none hover:border-slate-500 transition-colors cursor-pointer"',
    'className="rounded-xl border border-transparent bg-[#4caf50] px-3 py-1.5 text-xs font-semibold text-white outline-none hover:bg-[#388e3c] transition-colors cursor-pointer appearance-none"'
)

# Fix Send Message button
content = content.replace(
    'className="shrink-0 flex items-center justify-center gap-1.5 rounded-xl bg-[#4caf50] hover:bg-[#388e3c] px-4 py-2 text-xs font-bold text-white transition-all shadow-md cursor-pointer"',
    'className="shrink-0 flex items-center justify-center gap-1.5 rounded-xl bg-[#4caf50] hover:bg-[#388e3c] px-4 py-2 text-xs font-bold text-white transition-all shadow-md cursor-pointer"'
)
content = content.replace(
    'className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:border-slate-500 transition-colors cursor-pointer"',
    'className="shrink-0 rounded-full border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:border-slate-400 transition-colors cursor-pointer shadow-sm"'
)

with open(file_path, 'w') as f:
    f.write(content)
print("Updated Tech buttons")
