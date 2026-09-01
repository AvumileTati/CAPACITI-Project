import sys

file_path = 'src/context/AppContext.tsx'
with open(file_path, 'r') as f:
    content = f.read()

content = content.replace(
    "sendMessage: (ticketId: string, body: string, internal?: boolean) => Promise<void>;",
    "sendMessage: (ticketId: string, body: string, internal?: boolean, attachments?: any[]) => Promise<void>;"
)

content = content.replace(
    "const sendMessage = async (ticketId: string, body: string, internal: boolean = false) => {",
    "const sendMessage = async (ticketId: string, body: string, internal: boolean = false, attachments: any[] = []) => {"
)

content = content.replace(
    "internal,\n      created_at: new Date().toISOString(),\n    };",
    "internal,\n      created_at: new Date().toISOString(),\n      attachments,\n    };"
)

with open(file_path, 'w') as f:
    f.write(content)

