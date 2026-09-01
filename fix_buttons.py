import sys
import re

files_to_update = [
    'src/components/LoginPage.tsx',
    'src/components/TechnicianWorkspace.tsx',
    'src/components/CustomerPortal.tsx',
    'src/components/LandingPage.tsx'
]

def fix_content(content):
    c = content
    c = c.replace('bg-cyan-500', 'bg-[#4caf50]')
    c = c.replace('text-slate-950', 'text-white')
    c = c.replace('hover:bg-cyan-400', 'hover:bg-[#388e3c]')
    c = c.replace('border-cyan-500/50', 'border-[#4caf50]/50')
    c = c.replace('bg-[#0f3b6c]/20', 'border-[#0f3b6c]/20')
    return c

for file_path in files_to_update:
    try:
        with open(file_path, 'r') as f:
            content = f.read()
        new_content = fix_content(content)
        with open(file_path, 'w') as f:
            f.write(new_content)
        print(f"Updated buttons in {file_path}")
    except Exception as e:
        print(f"Failed to update {file_path}: {e}")

