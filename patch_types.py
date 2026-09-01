import sys

file_path = 'src/types.ts'
with open(file_path, 'r') as f:
    content = f.read()

# Add Attachment interface
attachment_interface = """
export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string; // Could be data URL or remote URL
}
"""

content = content.replace("export interface Ticket {", attachment_interface + "\nexport interface Ticket {\n  attachments?: Attachment[];")

with open(file_path, 'w') as f:
    f.write(content)

