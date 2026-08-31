import sys

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Generic header replacement
    if '<header className="' in content:
        import re
        # Find the header class string
        pattern = r'<header className="([^"]+)"'
        
        def repl(match):
            classes = match.group(1).split()
            
            # Remove bg-white, text-slate-900, etc.
            classes = [c for c in classes if not c.startswith('bg-') and not c.startswith('text-') and c != 'shadow-xs' and c != 'shadow-sm']
            
            # Add new header styles
            classes.append('bg-[#0f3b6c]')
            classes.append('text-white')
            classes.append('shadow-md')
            
            return f'<header className="{" ".join(classes)}"'

        new_content = re.sub(pattern, repl, content)
        
        # In headers, some icons or texts might be hardcoded to dark, fix them
        # Specifically inside the header, we want text to be white or slate-200.
        # This is a bit tricky, but we can just let it be or replace text-slate-900 with text-white if it's in a header.
        
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Fixed header in {filepath}")

for path in ['src/components/LoginPage.tsx', 'src/components/LandingPage.tsx', 'src/components/TechnicianWorkspace.tsx', 'src/components/CustomerPortal.tsx', 'src/components/AdminControlCenter.tsx']:
    process_file(path)
