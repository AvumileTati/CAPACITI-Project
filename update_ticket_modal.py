import sys

with open('src/components/TicketChatModal.tsx', 'r') as f:
    content = f.read()

target = """        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          className="border-t border-border/80 bg-surface p-4 space-y-2"
        >"""

replacement = """        {/* Input Bar */}
        {(ticket.status === 'resolved' || ticket.status === 'closed') ? (
          <div className="border-t border-border/80 bg-secondary/50 p-6 flex flex-col items-center justify-center text-center space-y-2">
            <Lock className="size-5 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              This ticket has been marked as resolved.
            </p>
            <p className="text-xs text-muted-foreground">
              Further communication is disabled. If you need more help, please open a new ticket.
            </p>
          </div>
        ) : (
        <form
          onSubmit={handleSend}
          className="border-t border-border/80 bg-surface p-4 space-y-2"
        >"""

target_end = """              <Send className="size-4" />
            </button>
          </div>
        </form>
      </div>"""

replacement_end = """              <Send className="size-4" />
            </button>
          </div>
        </form>
        )}
      </div>"""

if target in content and target_end in content:
    content = content.replace(target, replacement)
    content = content.replace(target_end, replacement_end)
    with open('src/components/TicketChatModal.tsx', 'w') as f:
        f.write(content)
    print("Success updating TicketChatModal.tsx")
else:
    print("Target not found in TicketChatModal.tsx")

