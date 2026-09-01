import sys

file_path = 'src/components/TechnicianWorkspace.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# Remove Dashboard button
dashboard_btn = """          <button onClick={() => setFilterMode('dashboard')} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${filterMode === 'dashboard' ? 'bg-blue-100/50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}>
            <div className="flex items-center gap-3"><Home className="size-4" /> Dashboard</div>
          </button>
          """
content = content.replace(dashboard_btn, '')

# Remove Reports button
reports_btn = """
          <button onClick={() => setFilterMode('reports')} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${filterMode === 'reports' ? 'bg-blue-100/50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}>
            <div className="flex items-center gap-3"><BarChart2 className="size-4" /> Reports</div>
            <span className="bg-emerald-100 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full">3</span>
          </button>"""
content = content.replace(reports_btn, '')

# Remove Top tags
tags_block = """                  {/* Top tags */}
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">All</span>
                    <span className="bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1 rounded-full text-xs font-medium">Assigned</span>
                    <span className="bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1 rounded-full text-xs font-medium">New...</span>
                  </div>

"""
content = content.replace(tags_block, '')

with open(file_path, 'w') as f:
    f.write(content)
print("Removed selected elements")
