import sys

file_path = 'src/components/TechnicianWorkspace.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# Fix the broken part inside useMemo
broken_part = """      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const myTicketsCount = tickets.filter(t => t.assigned_to === currentUser?.id || t.assigned_name?.toLowerCase().includes('marcus') || (currentUser?.full_name && t.assigned_name === currentUser.full_name)).length;
  const teamQueueCount = tickets.length;

  return (
          t.id.toLowerCase().includes(q) ||"""

fixed_part = """      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.id.toLowerCase().includes(q) ||"""

content = content.replace(broken_part, fixed_part)


# Insert myTicketsCount and teamQueueCount right before the main return
main_return_marker = """  const getStatusBadge = (status: TicketStatus) => {
    if (status === 'resolved' || status === 'closed') {
      return <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold">Resolved</span>;
    } else if (status === 'escalated') {
      return <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full text-[10px] font-bold">Escalated</span>;
    } else if (status === 'in_progress') {
      return <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-bold">In Progress</span>;
    }
    return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold">New</span>;
  };

  return ("""

fixed_main_return = """  const getStatusBadge = (status: TicketStatus) => {
    if (status === 'resolved' || status === 'closed') {
      return <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold">Resolved</span>;
    } else if (status === 'escalated') {
      return <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full text-[10px] font-bold">Escalated</span>;
    } else if (status === 'in_progress') {
      return <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-bold">In Progress</span>;
    }
    return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold">New</span>;
  };

  const myTicketsCount = tickets.filter(t => t.assigned_to === currentUser?.id || t.assigned_name?.toLowerCase().includes('marcus') || (currentUser?.full_name && t.assigned_name === currentUser.full_name)).length;
  const teamQueueCount = tickets.length;

  return ("""

content = content.replace(main_return_marker, fixed_main_return)

with open(file_path, 'w') as f:
    f.write(content)
print("Scope fixed")
