import sys

with open('src/components/CustomerPortal.tsx', 'r') as f:
    content = f.read()

target = """      {/* Main Content View Container */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {/* HOME TAB (Screenshot 3 layout) */}
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Greeting */}
              <div className="space-y-1.5">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  Hi, {userName} 👋
                </h1>
                <p className="text-sm text-slate-600 leading-relaxed">
                  How can we help you today? Submit a request and we'll route it to the right team automatically.
                </p>
              </div>

              {/* Submit a new request Hero CTA Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setPreselectedCategory(undefined);
                  setIsNewTicketOpen(true);
                }}
                className="w-full py-3.5 px-6 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold rounded-2xl shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-base transition-all duration-150 cursor-pointer"
              >
                <Plus className="size-5 stroke-[2.5]" />
                <span>Submit a new request</span>
              </motion.button>

              {/* Recent Activity Header */}
              <div className="pt-6">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3.5">
                  Recent Activity
                </h2>

                {/* Ticket Cards Stack */}
                <div className="space-y-3">
                  {myTickets.slice(0, 5).map((ticket, index) => ("""

replacement = """      {/* Main Content View Container */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 md:py-12">
        <AnimatePresence mode="wait">
          {/* HOME TAB */}
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Header / Search */}
              <div className="space-y-5">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'}, {userName} 👋
                </h1>
                
                {/* Search Bar - Aesthetic */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="size-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    className="w-full bg-white border border-slate-200/80 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                    placeholder="Search knowledge base, error codes, or ask AI..."
                  />
                  <div className="absolute inset-y-0 right-2 flex items-center">
                    <button className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer">
                      Search
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions (Bento Grid) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => {
                    setPreselectedCategory('hardware');
                    setIsNewTicketOpen(true);
                  }}
                  className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col items-start gap-3 hover:border-blue-400 hover:shadow-md transition-all group text-left cursor-pointer"
                >
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Laptop className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Hardware</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">Devices & Peripherals</p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setPreselectedCategory('software');
                    setIsNewTicketOpen(true);
                  }}
                  className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col items-start gap-3 hover:border-purple-400 hover:shadow-md transition-all group text-left cursor-pointer"
                >
                  <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Wifi className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Software</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">Apps & Access</p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setPreselectedCategory('access');
                    setIsNewTicketOpen(true);
                  }}
                  className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col items-start gap-3 hover:border-amber-400 hover:shadow-md transition-all group text-left cursor-pointer"
                >
                  <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <KeyRound className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Access</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">Passwords & VPN</p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setPreselectedCategory('billing');
                    setIsNewTicketOpen(true);
                  }}
                  className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col items-start gap-3 hover:border-emerald-400 hover:shadow-md transition-all group text-left cursor-pointer"
                >
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <CreditCard className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Billing</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">Invoices & Cards</p>
                  </div>
                </button>
              </div>

              {/* General Request & AI Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                <button
                  onClick={() => {
                    setPreselectedCategory(undefined);
                    setIsNewTicketOpen(true);
                  }}
                  className="sm:col-span-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-2xl p-5 flex flex-col justify-center items-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  <Plus className="size-6 stroke-[2.5] group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm">Other Request</span>
                </button>
                
                <div className="sm:col-span-3 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white flex items-center justify-between relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                  <div className="absolute left-0 bottom-0 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl -ml-5 -mb-5"></div>
                  <div className="relative z-10 space-y-1">
                    <h3 className="font-bold flex items-center gap-2">
                      <Sparkles className="size-4 text-blue-400" /> AI Triage Active
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-[200px] sm:max-w-[250px]">
                      Your requests are instantly analyzed and routed by Gemini to the fastest available agent.
                    </p>
                  </div>
                  <div className="relative z-10 shrink-0 opacity-20 sm:opacity-50">
                    <Bot className="size-12 sm:size-16" />
                  </div>
                </div>
              </div>

              {/* Recent Activity Header */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Recent Activity
                  </h2>
                  <button 
                    onClick={() => setActiveTab('tickets')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                {/* Ticket Cards Stack */}
                <div className="space-y-3">
                  {myTickets.slice(0, 5).map((ticket, index) => ("""

if target in content:
    content = content.replace(target, replacement)
    with open('src/components/CustomerPortal.tsx', 'w') as f:
        f.write(content)
    print("Success")
else:
    print("Target not found")
