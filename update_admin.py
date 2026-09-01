import sys

file_path = 'src/components/AdminControlCenter.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# 1. Update the overall container (maybe it's fine, but sidebar needs dark mode)
# Let's find the sidebar section.
sidebar_start = """      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[240px] flex flex-col bg-slate-50 border-r border-slate-200 transition-transform duration-300 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-[#151617]">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-slate-100 text-[#0f3b6c] border border-[#0f3b6c]/20 shadow-xs">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="font-bold text-sm tracking-tight bg-[#100f0f] text-[#1c0808]">TechnoResolve Control</p>
              <p className="text-[11px] font-mono font-semibold text-[#110202]">Administrator</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-slate-900"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Nav Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navItems.map((group) => (
            <div key={group.group} className="space-y-1">
              <p className="text-[11px] font-bold tracking-wider uppercase text-slate-500 px-3 mb-2">
                {group.group}
              </p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveNav(item.id as any);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="size-4" />
                      {item.label}
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </aside>"""

new_sidebar = """      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[240px] flex flex-col bg-[#1c2128] border-r border-[#30363d] transition-transform duration-300 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-[#30363d]">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="font-bold text-sm tracking-tight text-white leading-tight">TechnoResolve Control</p>
              <p className="text-[11px] font-medium text-slate-400">Administrator</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Nav Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-6 space-y-6">
          {navItems.map((group) => (
            <div key={group.group} className="space-y-1">
              <p className="text-[10px] font-bold tracking-wider uppercase text-slate-500 px-3 mb-2">
                {group.group}
              </p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveNav(item.id as any);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#1f2937] text-white border border-[#3b82f6] shadow-[0_0_10px_rgba(59,130,246,0.1)]'
                        : 'text-slate-400 hover:bg-[#2d333b] hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`size-4 ${isActive ? 'text-[#3b82f6]' : 'text-slate-400'}`} />
                      {item.label}
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-[#3b82f6] text-white' : 'bg-slate-700 text-slate-300'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </aside>"""

content = content.replace(sidebar_start, new_sidebar)

# 2. Update Header
header_start = """        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between bg-[#487aea] text-white shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-1.5 -ml-2 rounded-lg hover:bg-white/20"
            >
              <Menu className="size-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">System Control Center</h1>
              <p className="text-xs font-mono hidden sm:block border-[#171919] text-[#121111]">{currentUser?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <RoleSwitcher />
          </div>
        </header>"""

new_header = """        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-8 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-1.5 -ml-2 rounded-lg hover:bg-slate-100 text-slate-500"
            >
              <Menu className="size-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">System Control Center</h1>
              <p className="text-xs text-slate-500">{currentUser?.email}</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 ml-4">
               <button className="p-1.5 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"><Mail className="size-4" /></button>
               <div className="size-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center relative overflow-hidden">
                  <img src="https://i.pravatar.cc/100" alt="avatar" className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 right-0 size-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell className="size-5" />
              <span className="absolute top-0 right-0 size-4 bg-blue-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">3</span>
            </button>
            
            <div className="hidden sm:block border-l border-slate-200 h-6 mx-1"></div>
            
            <RoleSwitcher />
            
            <div className="hidden sm:block border-l border-slate-200 h-6 mx-1"></div>
            
            <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm bg-white">
              <Download className="size-3.5" /> Export
            </button>
          </div>
        </header>"""

content = content.replace(header_start, new_header)

# 3. Update main background
content = content.replace('<main className="flex-1 p-4 sm:p-8">', '<main className="flex-1 p-4 sm:p-8 bg-[#f4f7f9]">')

# 4. Replace Overview content
overview_start = """            {/* OVERVIEW TAB */}
            {activeNav === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Metric Cards Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col hover:border-blue-300 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Requests</p>
                      <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Inbox className="size-4" /></div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-3xl font-black text-slate-900">{totalTickets}</h3>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">+12%</span>
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col hover:border-blue-300 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Open Workload</p>
                      <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Clock className="size-4" /></div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-3xl font-black text-slate-900">{openWorkload}</h3>
                      <span className="text-xs font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md">+4%</span>
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col hover:border-rose-300 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Urgent Alerts</p>
                      <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg"><AlertOctagon className="size-4" /></div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-3xl font-black text-rose-600">{urgentTickets}</h3>
                      <span className="text-xs font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md">Action Req</span>
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col hover:border-purple-300 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">AI Confidence</p>
                      <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg"><Sparkles className="size-4" /></div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-3xl font-black text-slate-900">{aiConfidencePct}%</h3>
                      <span className="text-xs font-bold text-slate-500">avg acc</span>
                    </div>
                  </div>
                </div>

                {/* Charts Row */}
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Line Chart */}
                  <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
                    <h3 className="text-sm font-bold text-slate-900 mb-6">7-Day Ticket Throughput</h3>
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                          <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          />
                          <Area type="monotone" dataKey="created" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCreated)" />
                          <Area type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorResolved)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Status Donut */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
                    <h3 className="text-sm font-bold text-slate-900 mb-2">Status Distribution</h3>
                    <div className="h-[250px] w-full relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-2xl font-black text-slate-900">{totalTickets}</span>
                        <span className="text-[10px] font-bold text-slate-500">Total</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}"""

new_overview = """            {/* OVERVIEW TAB */}
            {activeNav === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Metric Cards Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Requests</p>
                      <div className="size-10 rounded-full border border-slate-200 flex items-center justify-center overflow-hidden">
                        <div className="absolute size-10 rounded-full border-4 border-t-blue-400 border-r-rose-400 border-b-emerald-400 border-l-amber-400 opacity-50"></div>
                        <Inbox className="size-4 text-slate-600 relative z-10" />
                      </div>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <div>
                        <h3 className="text-3xl font-bold text-slate-900 leading-none">{totalTickets}</h3>
                        <p className="text-xs text-slate-500 mt-1">all time</p>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
                        <span className="text-emerald-500">▲</span>+2% from yesterday
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Open Workload</p>
                      <div className="size-10 rounded-full bg-slate-50 flex items-center justify-center">
                        <Clock className="size-4 text-slate-600" />
                      </div>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <div>
                        <h3 className="text-3xl font-bold text-slate-900 leading-none">{openWorkload}</h3>
                        <p className="text-xs text-slate-500 mt-1">unresolved</p>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
                        <span className="text-emerald-500">▼</span>-10% from yesterday
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Urgent</p>
                      <div className="size-10 rounded-full bg-rose-50 flex items-center justify-center">
                        <AlertOctagon className="size-4 text-rose-500" />
                      </div>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <div>
                        <h3 className="text-3xl font-bold text-slate-900 leading-none">{urgentTickets}</h3>
                        <p className="text-xs text-slate-500 mt-1">needs escalation</p>
                      </div>
                      <span className="text-[11px] font-bold text-rose-600 flex items-center gap-0.5">
                        <span className="text-rose-500">▲</span>+1 this hour
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">AI Confidence</p>
                      <div className="size-10 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                        <Sparkles className="size-4 text-emerald-500" />
                      </div>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <div>
                        <h3 className="text-3xl font-bold text-slate-900 leading-none">{aiConfidencePct}%</h3>
                        <p className="text-xs text-slate-500 mt-1">{aiClassifiedCount} auto-triaged</p>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
                        <span className="text-emerald-500">▲</span>+0.5%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Second Row: Big Chart + Bar Chart */}
                <div className="grid lg:grid-cols-3 gap-4">
                  {/* Line Chart */}
                  <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">7-Day Ticket Throughput</h3>
                        <p className="text-xs text-slate-500">Created vs resolved volume</p>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                        <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-blue-600"></div>Created</div>
                        <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-emerald-500"></div>Resolved</div>
                      </div>
                    </div>
                    <div className="h-[220px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.6} />
                              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                          <Area type="monotone" dataKey="created" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorCreated)" />
                          <Area type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorResolved)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Horizontal Bar Chart for Categories */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Issue Categories</h3>
                        <p className="text-xs text-slate-500">Distribution across domains</p>
                      </div>
                      <p className="text-[10px] text-slate-400">Last update: 11:18 AM</p>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="w-16 text-xs text-slate-700 text-right">Software</span>
                        <div className="flex-1 h-4 flex rounded-sm overflow-hidden">
                          <div className="bg-rose-500 w-[20%]"></div>
                          <div className="bg-amber-500 w-[20%]"></div>
                          <div className="bg-amber-300 w-[30%]"></div>
                          <div className="bg-emerald-500 w-[15%]"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-16 text-xs text-slate-700 text-right">Hardware</span>
                        <div className="flex-1 h-4 flex rounded-sm overflow-hidden">
                          <div className="bg-rose-500 w-[30%]"></div>
                          <div className="bg-amber-500 w-[40%]"></div>
                          <div className="bg-amber-300 w-[20%]"></div>
                          <div className="bg-emerald-500 w-[10%]"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-16 text-xs text-slate-700 text-right">Network</span>
                        <div className="flex-1 h-4 flex rounded-sm overflow-hidden">
                          <div className="bg-rose-500 w-[15%]"></div>
                          <div className="bg-amber-500 w-[25%]"></div>
                          <div className="bg-amber-300 w-[35%]"></div>
                          <div className="bg-emerald-500 w-[25%]"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-16 text-xs text-slate-700 text-right">General</span>
                        <div className="flex-1 h-4 flex rounded-sm overflow-hidden">
                          <div className="bg-rose-500 w-[10%]"></div>
                          <div className="bg-amber-500 w-[20%]"></div>
                          <div className="bg-amber-300 w-[40%]"></div>
                          <div className="bg-emerald-500 w-[30%]"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center gap-3 mt-4 text-[10px] font-semibold text-slate-600">
                      <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-rose-500"></div>Urgent</div>
                      <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-amber-500"></div>High</div>
                      <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-amber-300"></div>Medium</div>
                      <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-emerald-500"></div>Low</div>
                    </div>
                  </div>
                </div>
                
                {/* Third Row */}
                <div className="grid lg:grid-cols-3 gap-4">
                   {/* Status Donut & Bar */}
                   <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-900">Status Distribution</h3>
                        <p className="text-[10px] text-slate-400">Last update: 11:18 AM</p>
                      </div>
                      <div className="flex items-center gap-8 h-[100px]">
                        <div className="relative size-[90px] shrink-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={25}
                                outerRadius={40}
                                paddingAngle={2}
                                dataKey="value"
                                stroke="none"
                              >
                                {pieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="flex-1 flex flex-col gap-2">
                           <div className="w-full h-8 flex rounded overflow-hidden">
                              <div className="bg-sky-400 w-[20%] flex items-center justify-center text-[10px] font-bold text-white">1</div>
                              <div className="bg-amber-400 w-[20%] flex items-center justify-center text-[10px] font-bold text-white">1</div>
                              <div className="bg-rose-500 w-[40%] flex items-center justify-center text-[10px] font-bold text-white">2</div>
                              <div className="bg-emerald-500 w-[20%] flex items-center justify-center text-[10px] font-bold text-white">1</div>
                           </div>
                           <div className="flex items-center justify-between mt-1 px-1">
                              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600"><div className="size-2 rounded-full bg-sky-400"></div>New</div>
                              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600"><div className="size-2 rounded-full bg-amber-400"></div>Assigned</div>
                              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600"><div className="size-2 rounded-full bg-rose-500"></div>In Progress</div>
                              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600"><div className="size-2 rounded-full bg-emerald-500"></div>Resolved</div>
                              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600"><div className="size-2 rounded-full bg-slate-500"></div>Closed</div>
                           </div>
                        </div>
                      </div>
                   </div>
                   
                   {/* Platform Health */}
                   <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-900">Platform Health</h3>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-bold flex items-center gap-1">
                          OPERATIONAL <div className="size-1.5 bg-emerald-500 rounded-full"></div>
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                         <div className="flex items-center justify-between text-xs">
                           <div className="flex items-center gap-1.5 text-slate-600"><CheckCircle2 className="size-3 text-emerald-500" /> API</div>
                           <span className="font-mono text-emerald-600">45ms</span>
                         </div>
                         <div className="flex items-center justify-between text-xs">
                           <div className="flex items-center gap-1.5 text-slate-600"><CheckCircle2 className="size-3 text-emerald-500" /> DB</div>
                           <span className="font-mono text-emerald-600">12ms</span>
                         </div>
                         <div className="flex items-center justify-between text-xs">
                           <div className="flex items-center gap-1.5 text-slate-600"><CheckCircle2 className="size-3 text-emerald-500" /> Webhook</div>
                           <span className="font-mono text-emerald-600">23ms</span>
                         </div>
                         <div className="flex items-center justify-between text-xs">
                           <div className="flex items-center gap-1.5 text-slate-600"><CheckCircle2 className="size-3 text-emerald-500" /> Auth</div>
                           <span className="font-mono text-emerald-600">34ms</span>
                         </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
                         <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Uptime:</span>
                            <span className="font-mono text-slate-900 font-medium">99.98%</span>
                         </div>
                         <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Recent Incidents:</span>
                            <span className="text-slate-900 font-medium">None</span>
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}"""

content = content.replace(overview_start, new_overview)

with open(file_path, 'w') as f:
    f.write(content)

