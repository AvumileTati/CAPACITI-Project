import sys

file_path = 'src/components/LandingPage.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# Replace Launch Desk button
content = content.replace(
    'className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-base font-bold text-slate-900 transition-all hover:bg-blue-700 shadow-sm hover:shadow-md cursor-pointer"',
    'className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0f3b6c] px-8 py-4 text-base font-bold text-white transition-all hover:bg-[#0a2e5c] shadow-sm hover:shadow-md cursor-pointer"'
)

# Replace Submit Request button
content = content.replace(
    'className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-700 transition-all hover:border-blue-200 hover:bg-blue-50 shadow-sm cursor-pointer"',
    'className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-transparent bg-[#0f3b6c] px-8 py-4 text-base font-bold text-white transition-all hover:bg-[#0a2e5c] shadow-sm cursor-pointer"'
)

with open(file_path, 'w') as f:
    f.write(content)
print("Updated Landing buttons")
