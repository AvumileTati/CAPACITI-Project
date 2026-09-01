import sys

file_path = 'src/index.css'
with open(file_path, 'r') as f:
    content = f.read()

content = content.replace('background-color: #09090b;', 'background-color: #f4f6f8;')
content = content.replace('color: #f4f4f5;', 'color: #0f172a;')
content = content.replace('background: rgba(9, 9, 11, 0.8);', 'background: rgba(244, 246, 248, 0.8);')
content = content.replace('background: rgba(63, 63, 70, 0.6);', 'background: rgba(203, 213, 225, 0.6);')
content = content.replace('background: rgba(6, 182, 212, 0.5);', 'background: rgba(76, 175, 80, 0.5);')
content = content.replace('rgba(24, 24, 27, 0.85)', 'rgba(255, 255, 255, 0.85)')
content = content.replace('rgba(18, 18, 21, 0.95)', 'rgba(255, 255, 255, 0.95)')

with open(file_path, 'w') as f:
    f.write(content)
print("Updated index.css body")
