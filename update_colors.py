import sys
import re

files_to_update = [
    'src/components/TechnicianWorkspace.tsx',
    'src/components/CustomerPortal.tsx',
    'src/components/LoginPage.tsx',
    'src/components/LandingPage.tsx',
    'src/components/AdminControlCenter.tsx'
]

def replace_theme(content):
    # Base darks to lights
    c = content
    c = c.replace('bg-[#08152a]', 'bg-[#f4f6f8]')
    c = c.replace('bg-[#060f1e]', 'bg-white')
    c = c.replace('bg-[#071326]', 'bg-white')
    c = c.replace('bg-[#09172e]', 'bg-white')
    
    # Borders
    c = c.replace('border-[#12284b]', 'border-slate-200')
    c = c.replace('border-[#132a4f]', 'border-slate-200')
    c = c.replace('border-[#142e56]', 'border-slate-200')
    c = c.replace('border-[#163666]', 'border-slate-200')
    c = c.replace('border-slate-700/50', 'border-slate-200')
    c = c.replace('border-slate-700/80', 'border-slate-200')
    c = c.replace('border-slate-700', 'border-slate-200')
    c = c.replace('border-slate-800', 'border-slate-200')

    # Secondary bgs
    c = c.replace('bg-[#0c1f3d]', 'bg-slate-50')
    c = c.replace('bg-[#0d2a50]', 'bg-slate-100')
    c = c.replace('bg-[#0e2344]', 'bg-slate-50')
    c = c.replace('bg-[#12284b]', 'bg-slate-100')
    c = c.replace('bg-[#091830]', 'bg-slate-50')
    c = c.replace('bg-[#0b2447]', 'bg-slate-100')
    c = c.replace('bg-[#09172e]', 'bg-white')
    
    # Text colors
    c = c.replace('text-slate-100', 'text-slate-900')
    c = c.replace('text-slate-200', 'text-slate-800')
    c = c.replace('text-slate-300', 'text-slate-700')
    # c = c.replace('text-slate-400', 'text-slate-500')
    c = c.replace('text-white', 'text-slate-900')
    
    # Cyan highlights -> Blue/Green
    c = c.replace('text-cyan-400', 'text-[#0f3b6c]')
    c = c.replace('text-cyan-300', 'text-[#0f3b6c]')
    c = c.replace('bg-cyan-400', 'bg-[#4caf50]')
    c = c.replace('hover:bg-cyan-300', 'hover:bg-[#388e3c]')
    c = c.replace('border-cyan-500/40', 'border-[#0f3b6c]/20')
    c = c.replace('border-cyan-500/30', 'border-[#0f3b6c]/20')
    c = c.replace('ring-cyan-400/40', 'ring-[#0f3b6c]/20')
    c = c.replace('focus:border-cyan-400', 'focus:border-[#0f3b6c]')

    # Landing page specific darks
    c = c.replace('bg-slate-950', 'bg-[#f4f6f8]')
    c = c.replace('bg-slate-900', 'bg-white')
    c = c.replace('bg-slate-800/50', 'bg-white')
    c = c.replace('bg-slate-800', 'bg-slate-100')
    
    return c

for file_path in files_to_update:
    try:
        with open(file_path, 'r') as f:
            content = f.read()
        new_content = replace_theme(content)
        with open(file_path, 'w') as f:
            f.write(new_content)
        print(f"Updated {file_path}")
    except Exception as e:
        print(f"Failed to update {file_path}: {e}")

