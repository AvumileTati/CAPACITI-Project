import sys

file_path = 'src/components/TechnicianWorkspace.tsx'
with open(file_path, 'r') as f:
    content = f.read()

count_vars = """  const myTicketsCount = tickets.filter(t => t.assigned_to === currentUser?.id || t.assigned_name?.toLowerCase().includes('marcus') || (currentUser?.full_name && t.assigned_name === currentUser.full_name)).length;
  const teamQueueCount = tickets.length;

  return ("""

content = content.replace("  return (", count_vars, 1)

# Now replace the hardcoded badges
old_my_badge = '<span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-full">5</span>'
new_my_badge = '{myTicketsCount > 0 && <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{myTicketsCount}</span>}'
content = content.replace(old_my_badge, new_my_badge)

old_team_badge = '<span className="bg-blue-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">2</span>'
new_team_badge = '{teamQueueCount > 0 && <span className="bg-blue-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{teamQueueCount}</span>}'
content = content.replace(old_team_badge, new_team_badge)

with open(file_path, 'w') as f:
    f.write(content)
print("Updated badge counts")
