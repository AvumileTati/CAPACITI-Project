import sys

file_path = 'src/components/LoginPage.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# Fix header background
content = content.replace(
    'bg-[#0f3b6c]',
    'bg-[#5088c3]'
)

# Fix header text
content = content.replace(
    '<h1 className="text-base font-bold text-slate-900 tracking-tight">',
    '<h1 className="text-base font-bold text-[#ffffff] tracking-tight">'
)

content = content.replace(
    '<p className="text-[11px] text-slate-400 font-mono">',
    '<p className="text-[11px] text-white/80 font-mono">'
)

# Fix Google Sign In button background
content = content.replace(
    'bg-[#0f3b6c] hover:bg-[#0a2e5c]',
    'bg-[#4c7db7] hover:bg-[#3b608f]'
)

with open(file_path, 'w') as f:
    f.write(content)
print("Updated LoginPage")
