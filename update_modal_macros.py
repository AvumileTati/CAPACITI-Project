import sys

with open('src/components/TicketChatModal.tsx', 'r') as f:
    content = f.read()

target = """        {/* Canned Macros for Operators */}
        {isOperator && ("""

replacement = """        {/* Canned Macros for Operators */}
        {isOperator && ticket.status !== 'resolved' && ticket.status !== 'closed' && ("""

if target in content:
    content = content.replace(target, replacement)
    with open('src/components/TicketChatModal.tsx', 'w') as f:
        f.write(content)
    print("Success updating Macros in TicketChatModal.tsx")
else:
    print("Target not found in TicketChatModal.tsx")

