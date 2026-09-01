import sys

file_path = 'src/components/TechnicianWorkspace.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# Add import
import_target = "import { RoleSwitcher } from './RoleSwitcher';"
import_replacement = "import { RoleSwitcher } from './RoleSwitcher';\nimport { AssignAgentModal } from './AssignAgentModal';"
content = content.replace(import_target, import_replacement)

# Add state
state_target = "const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);"
state_replacement = "const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);\n  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);"
content = content.replace(state_target, state_replacement)

# Replace right-sidebar "Assign Agent" button's onClick (UserPlus icon)
# There are two Assign Agent places: the top right under "Assignee", and the quick action menu on the right sidebar.

btn1_target = '<button onClick={handleAssignToMe} className="text-xs text-blue-600 font-bold hover:underline">Assign Agent</button>'
btn1_replace = '<button onClick={() => setIsAssignModalOpen(true)} className="text-xs text-blue-600 font-bold hover:underline">Assign Agent</button>'
content = content.replace(btn1_target, btn1_replace)

btn2_target = """<button onClick={handleAssignToMe} className="w-full flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700 hover:text-slate-900">
                           <UserPlus className="size-4" />
                           <span className="text-[9px] font-bold text-center leading-tight">Assign<br/>Agent</span>
                        </button>"""
btn2_replace = """<button onClick={() => setIsAssignModalOpen(true)} className="w-full flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700 hover:text-slate-900">
                           <UserPlus className="size-4" />
                           <span className="text-[9px] font-bold text-center leading-tight">Assign<br/>Agent</span>
                        </button>"""
content = content.replace(btn2_target, btn2_replace)


# Add the modal right before the final closing div
closing_target = "    </div>\n  );\n};"
closing_replace = "      {activeTicket && (\n        <AssignAgentModal\n          isOpen={isAssignModalOpen}\n          onClose={() => setIsAssignModalOpen(false)}\n          ticket={activeTicket}\n        />\n      )}\n    </div>\n  );\n};"
content = content.replace(closing_target, closing_replace)

with open(file_path, 'w') as f:
    f.write(content)
print("Updated TechWorkspace with AssignAgentModal")
