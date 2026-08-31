import sys
import re

file_path = 'src/index.css'
with open(file_path, 'r') as f:
    content = f.read()

# Replace theme-user, theme-technician, theme-admin with a unified light mode
new_themes = """/* Unified Enterprise Light Theme */
.theme-user, .theme-technician, .theme-admin {
  --background: #f4f6f8;
  --foreground: #0f172a;
  --surface: #ffffff;
  --surface-foreground: #0f172a;
  --card: #ffffff;
  --card-foreground: #0f172a;
  --primary: #4caf50;
  --primary-foreground: #ffffff;
  --secondary: #0f3b6c;
  --secondary-foreground: #ffffff;
  --muted: #f8fafc;
  --muted-foreground: #64748b;
  --accent: rgba(76, 175, 80, 0.15);
  --accent-foreground: #4caf50;
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
  --border: #e2e8f0;
  --input: #cbd5e1;
  --ring: #4caf50;
  --panel-bg: #ffffff;
  --panel-border: #e2e8f0;
}
"""

content = re.sub(r'/\* Sleek Interface - User / Customer Theme \(Light Mode\) \*/.*?/\* Sleek Interface - Admin Control Center Theme \*/.*?}', new_themes, content, flags=re.DOTALL)

with open(file_path, 'w') as f:
    f.write(content)
print("Updated index.css")
