import sys
import re

file_path = 'src/components/LandingPage.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# I want to specifically target the header to have bg-[#6c96c3]
# Let's fix the buttons back to bg-[#0f3b6c]
content = content.replace(
    'className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#6c96c3] px-8 py-4 text-base font-bold text-white transition-all hover:bg-[#0a2e5c] shadow-sm hover:shadow-md cursor-pointer"',
    'className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0f3b6c] px-8 py-4 text-base font-bold text-white transition-all hover:bg-[#0a2e5c] shadow-sm hover:shadow-md cursor-pointer"'
)
content = content.replace(
    'className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-transparent bg-[#6c96c3] px-8 py-4 text-base font-bold text-white transition-all hover:bg-[#0a2e5c] shadow-sm cursor-pointer"',
    'className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-transparent bg-[#0f3b6c] px-8 py-4 text-base font-bold text-white transition-all hover:bg-[#0a2e5c] shadow-sm cursor-pointer"'
)

with open(file_path, 'w') as f:
    f.write(content)
print("Restored Landing buttons")
