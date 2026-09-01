import sys

file_path = 'src/components/AdminControlCenter.tsx'
with open(file_path, 'r') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if "{/* OVERVIEW TAB */}" in line:
        start_idx = i
    if "{/* USER APPROVALS TAB */}" in line:
        end_idx = i
        break

if start_idx != -1 and end_idx != -1:
    before = lines[:start_idx]
    after = lines[end_idx:]
    
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
                      <div className="size-10 rounded-full border border-slate-200 flex items-center justify-center overflow-hidden relative">
                        <div className="absolute size-10 rounded-full border-[3px] border-t-blue-400 border-r-rose-400 border-b-emerald-400 border-l-amber-400 opacity-50"></div>
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
                        <AreaChart data={volumeChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
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
                          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
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
                                data={statusChartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={25}
                                outerRadius={40}
                                paddingAngle={2}
                                dataKey="count"
                                stroke="none"
                              >
                                {statusChartData.map((entry, index) => (
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
                   <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col">
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
                      <div className="mt-auto pt-3 border-t border-slate-100 space-y-1">
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
            )}
"""
    
    with open(file_path, 'w') as f:
        f.writelines(before)
        f.write(new_overview)
        f.writelines(after)
    
    print("Replaced OVERVIEW TAB successfully")
else:
    print(f"Could not find start or end tags. start={start_idx}, end={end_idx}")

