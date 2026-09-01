import sys

with open('src/components/LandingPage.tsx', 'r') as f:
    content = f.read()

target_logic = """  const [triageItems, setTriageItems] = useState([
    { id: 1, t: 'Card declined on renewal', c: 'Billing', p: 'High', color: 'text-amber-500', bg: 'bg-amber-100', dot: 'bg-amber-500' },
    { id: 2, t: 'API returning 502 since 09:12', c: 'Software', p: 'Urgent', color: 'text-red-600', bg: 'bg-red-100', dot: 'bg-red-600' },
    { id: 3, t: 'Add three seats to our plan', c: 'Sales', p: 'Medium', color: 'text-blue-600', bg: 'bg-blue-100', dot: 'bg-blue-600' },
  ]);

  // Simulate incoming tickets for the live preview
  useEffect(() => {
    const newItems = [
      { t: 'MacBook dock dual display glitch', c: 'Hardware', p: 'Medium', color: 'text-purple-600', bg: 'bg-purple-100', dot: 'bg-purple-600' },
      { t: 'Phishing email targeting payroll wire', c: 'Security', p: 'Urgent', color: 'text-red-600', bg: 'bg-red-100', dot: 'bg-red-600' },
      { t: 'Need access to AWS staging env', c: 'Access', p: 'Low', color: 'text-emerald-600', bg: 'bg-emerald-100', dot: 'bg-emerald-600' },
    ];
    let count = 0;
    const interval = setInterval(() => {
      if (count >= newItems.length) {
        clearInterval(interval);
        return;
      }
      setTriageItems((prev) => {
        const next = [ { id: Date.now(), ...newItems[count] }, ...prev ];
        if (next.length > 4) next.pop(); // keep max 4
        return next;
      });
      count++;
    }, 3000);
    return () => clearInterval(interval);
  }, []);"""

replacement_logic = """  const { tickets } = useApp();
  
  const triageItems = tickets.slice(0, 4).map(t => {
    let color = 'text-blue-600';
    let bg = 'bg-blue-100';
    let dot = 'bg-blue-600';
    
    if (t.priority === 'urgent') { color = 'text-red-600'; bg = 'bg-red-100'; dot = 'bg-red-600'; }
    else if (t.priority === 'high') { color = 'text-amber-500'; bg = 'bg-amber-100'; dot = 'bg-amber-500'; }
    else if (t.priority === 'medium') { color = 'text-blue-600'; bg = 'bg-blue-100'; dot = 'bg-blue-600'; }
    else if (t.priority === 'low') { color = 'text-emerald-600'; bg = 'bg-emerald-100'; dot = 'bg-emerald-600'; }
    
    return {
      id: t.id,
      t: t.title,
      c: t.category.charAt(0).toUpperCase() + t.category.slice(1),
      p: t.priority.charAt(0).toUpperCase() + t.priority.slice(1),
      color, bg, dot
    };
  });"""

if target_logic in content:
    content = content.replace(target_logic, replacement_logic)
    with open('src/components/LandingPage.tsx', 'w') as f:
        f.write(content)
    print("Success")
else:
    print("Failed to replace logic")

