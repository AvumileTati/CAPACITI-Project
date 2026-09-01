import sys

file_path = 'src/components/TechnicianWorkspace.tsx'
with open(file_path, 'r') as f:
    content = f.read()

target = """        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-end px-6 gap-4 shrink-0">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-full py-1.5 px-3">"""

replacement = """        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-end px-6 gap-4 shrink-0">
          <RoleSwitcher />
          
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-full py-1.5 px-3">"""

content = content.replace(target, replacement)

with open(file_path, 'w') as f:
    f.write(content)
print("Added RoleSwitcher to TechnicianWorkspace")
