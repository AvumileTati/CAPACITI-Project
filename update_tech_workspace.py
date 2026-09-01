import sys

with open('src/components/TechnicianWorkspace.tsx', 'r') as f:
    content = f.read()

target = """                    {/* Textarea Form */}
                    <form onSubmit={handleSendReply} className="space-y-2">"""

replacement = """                    {/* Textarea Form */}
                    {(activeTicket.status === 'resolved' || activeTicket.status === 'closed') ? (
                      <div className="rounded-xl border border-[#132a4f] bg-[#060f1e] p-6 flex flex-col items-center justify-center text-center space-y-2">
                        <Lock className="size-5 text-slate-500" />
                        <p className="text-sm font-bold text-white">
                          This ticket is marked as {activeTicket.status}.
                        </p>
                        <p className="text-xs text-slate-400">
                          Communication is locked. You can reopen the ticket to continue conversation.
                        </p>
                      </div>
                    ) : (
                    <form onSubmit={handleSendReply} className="space-y-2">"""

target_end = """                          <Send className="size-3.5" />
                        </button>
                      </div>
                    </form>"""

replacement_end = """                          <Send className="size-3.5" />
                        </button>
                      </div>
                    </form>
                    )}"""

if target in content and target_end in content:
    content = content.replace(target, replacement)
    content = content.replace(target_end, replacement_end)
    with open('src/components/TechnicianWorkspace.tsx', 'w') as f:
        f.write(content)
    print("Success updating TechnicianWorkspace.tsx")
else:
    print("Target not found in TechnicianWorkspace.tsx")

