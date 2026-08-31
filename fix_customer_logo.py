import sys

file_path = 'src/components/CustomerPortal.tsx'
with open(file_path, 'r') as f:
    content = f.read()

content = content.replace(
    '<span className="font-bold text-slate-900 text-base tracking-tight">',
    '<span className="font-bold text-white text-base tracking-tight">'
)
content = content.replace(
    '<div className="grid size-8 place-items-center rounded-lg bg-blue-600 text-slate-900 shadow-xs">',
    '<div className="grid size-8 place-items-center rounded-lg bg-white text-[#0f3b6c] shadow-xs">'
)
# also the nav tabs need to be updated since they are in a dark header now
content = content.replace(
    "const isActive = activeTab === tab.id;",
    "const isActive = activeTab === tab.id;"
)
# Let's see the nav buttons
