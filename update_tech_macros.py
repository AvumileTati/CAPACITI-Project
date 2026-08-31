import sys

with open('src/components/TechnicianWorkspace.tsx', 'r') as f:
    content = f.read()

target = """                    {/* Quick Macro Pills + AI Draft Suggestion */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                      {/* AI Suggested Response Button */}"""

replacement = """                    {/* Quick Macro Pills + AI Draft Suggestion */}
                    {activeTicket.status !== 'resolved' && activeTicket.status !== 'closed' && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                      {/* AI Suggested Response Button */}"""

target_end = """                        </button>
                      ))}
                    </div>

                    {/* Textarea Form */}"""

replacement_end = """                        </button>
                      ))}
                    </div>
                    )}

                    {/* Textarea Form */}"""


if target in content and target_end in content:
    content = content.replace(target, replacement)
    content = content.replace(target_end, replacement_end)
    with open('src/components/TechnicianWorkspace.tsx', 'w') as f:
        f.write(content)
    print("Success updating Macros in TechnicianWorkspace.tsx")
else:
    print("Target not found in TechnicianWorkspace.tsx")

