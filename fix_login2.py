import sys

file_path = 'src/components/LoginPage.tsx'
with open(file_path, 'r') as f:
    content = f.read()

content = content.replace(
    'className="w-full flex items-center justify-center gap-3 rounded-xl border border-transparent bg-[#5088c3] hover:bg-[#0a2e5c] text-white font-semibold py-2.5 px-4 text-xs transition-all shadow-sm cursor-pointer disabled:opacity-50"',
    'className="w-full flex items-center justify-center gap-3 rounded-xl border border-transparent bg-[#4c7db7] hover:bg-[#3b608f] text-white font-semibold py-2.5 px-4 text-xs transition-all shadow-sm cursor-pointer disabled:opacity-50"'
)

with open(file_path, 'w') as f:
    f.write(content)
print("Updated LoginPage button")
