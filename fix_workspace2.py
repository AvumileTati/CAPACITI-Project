import sys

file_path = 'src/components/TechnicianWorkspace.tsx'
with open(file_path, 'r') as f:
    content = f.read()

settings_btn = """
          <button className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
            <div className="flex items-center gap-3"><Settings className="size-4" /> Settings</div>
            <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full">2</span>
          </button>"""
content = content.replace(settings_btn, '')

with open(file_path, 'w') as f:
    f.write(content)
print("Removed selected elements")
