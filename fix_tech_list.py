import sys

file_path = 'src/components/TechnicianWorkspace.tsx'
with open(file_path, 'r') as f:
    content = f.read()

content = content.replace(
    "'bg-[#0c2447] border-l-4 border-cyan-400 shadow-inner'",
    "'bg-blue-50/60 border-l-4 border-[#0f3b6c] shadow-inner'"
)
content = content.replace(
    "'hover:bg-[#0a1b35] bg-white'",
    "'hover:bg-slate-50 bg-white border-b border-slate-100'"
)
content = content.replace(
    "border-cyan-400 shadow-inner",
    "border-[#0f3b6c] shadow-inner"
)

with open(file_path, 'w') as f:
    f.write(content)
print("Updated Tech List")
