import sys

file_path = 'src/components/CustomerPortal.tsx'
with open(file_path, 'r') as f:
    content = f.read()

content = content.replace(
    "'bg-sky-100 text-sky-800 font-bold'",
    "'bg-white/20 text-white font-bold'"
)
content = content.replace(
    "'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'",
    "'text-slate-300 hover:text-white hover:bg-white/10'"
)

with open(file_path, 'w') as f:
    f.write(content)
print("Updated Nav Tabs")
