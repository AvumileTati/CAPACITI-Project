import sys
import re

file_path = 'src/context/AppContext.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# Update context type
content = content.replace(
    "category?: TicketCategory;",
    "category?: TicketCategory;\n    attachments?: { id: string; name: string; size: number; type: string; url: string; }[];"
)

# Update createTicket function declaration
content = content.replace(
    "const newTicket: Ticket = {",
    "const newTicket: Ticket = {\n      attachments: data.attachments || [],"
)

with open(file_path, 'w') as f:
    f.write(content)

