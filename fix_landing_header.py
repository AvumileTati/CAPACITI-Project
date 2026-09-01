import sys

file_path = 'src/components/LandingPage.tsx'
with open(file_path, 'r') as f:
    content = f.read()

content = content.replace(
    'bg-[#0f3b6c]',
    'bg-[#6c96c3]'
)

with open(file_path, 'w') as f:
    f.write(content)
print("Updated Landing Header")
