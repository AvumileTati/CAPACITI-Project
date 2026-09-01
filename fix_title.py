import sys

file_path = 'src/components/LandingPage.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# Replace title
content = content.replace(
    'One desk. <br className="hidden md:block" />\n              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">\n                Three very different views.\n              </span>',
    'One desk. Three very different views.'
)

content = content.replace('text-5xl md:text-7xl leading-[1.05] font-extrabold tracking-tight text-slate-900 font-display', 'text-5xl md:text-7xl leading-[1.05] font-extrabold tracking-tight text-[#0f3b6c] font-display')

with open(file_path, 'w') as f:
    f.write(content)
print("Updated Landing title")
