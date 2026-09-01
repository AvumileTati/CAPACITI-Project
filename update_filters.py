import sys

file_path = 'src/components/TechnicianWorkspace.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# 1. Add new state variables
state_target = "const [categoryFilter, setCategoryFilter] = useState<string>('all');"
state_replacement = """const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);"""
content = content.replace(state_target, state_replacement)

# 2. Update filteredTickets logic
filter_target = """      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;"""
filter_replacement = """      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
      if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;"""
content = content.replace(filter_target, filter_replacement)


# 3. Update the UI for the filter button and advanced filters
ui_target = """                <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
                   <SlidersHorizontal className="size-3.5" />
                </button>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none bg-white"
                >
                  <option value="all">Category</option>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>"""

ui_replacement = """                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 border rounded-lg transition-colors ${showFilters ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                   <SlidersHorizontal className="size-3.5" />
                </button>
              </div>
              
              {showFilters && (
                <div className="pt-2 space-y-3 border-t border-slate-100 mt-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs focus:border-blue-500 outline-none bg-white"
                    >
                      <option value="all">All Categories</option>
                      {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Priority</label>
                      <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-200 text-xs focus:border-blue-500 outline-none bg-white"
                      >
                        <option value="all">All</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Status</label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-200 text-xs focus:border-blue-500 outline-none bg-white"
                      >
                        <option value="all">All</option>
                        <option value="new">New</option>
                        <option value="in_progress">In Progress</option>
                        <option value="pending_user">Pending</option>
                        <option value="escalated">Escalated</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>
                  
                  {(categoryFilter !== 'all' || priorityFilter !== 'all' || statusFilter !== 'all') && (
                    <button 
                      onClick={() => {
                        setCategoryFilter('all');
                        setPriorityFilter('all');
                        setStatusFilter('all');
                      }}
                      className="text-[10px] font-bold text-slate-400 hover:text-slate-600 w-full text-right"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </div>"""

content = content.replace(ui_target, ui_replacement)

with open(file_path, 'w') as f:
    f.write(content)
print("Updated filters")
