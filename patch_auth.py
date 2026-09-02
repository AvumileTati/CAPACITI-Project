import sys

file_path = 'src/context/AppContext.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# Replace signIn
old_sign_in = """  const signIn = async (email: string, password?: string): Promise<boolean> => {
    if (password && password.length >= 6) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (authErr: any) {
        console.log('Firebase Auth sign in notice:', authErr?.message);
      }
    }

    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      if (existing.banned) {
        showToast('This account has been suspended by an administrator.', 'error');
        return false;
      }
      setCurrentUser(existing);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, existing.id);
      setViewRoleState(existing.role);
      localStorage.setItem(STORAGE_KEYS.VIEW_ROLE, existing.role);
      setActivePage('dashboard');
      showToast(`Welcome back, ${existing.full_name}! (${existing.role.toUpperCase()})`, 'success');
      return true;
    }

    // New user signing in: Check if first user in database
    const isFirstUser = users.length === 0;
    const assignedRole: UserRole = isFirstUser ? 'admin' : 'user';
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      full_name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\\b\\w/g, (c) => c.toUpperCase()),
      role: assignedRole,
      is_approved: isFirstUser, // First user is automatically approved
      email_verified: isFirstUser, // First user is automatically verified
      verification_code: isFirstUser ? undefined : code,
      banned: false,
      created_at: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    await saveUserToFirestore(newUser);

    if (!isFirstUser) {
      // Send verification email to outbox
      const outItem: EmailOutboxItem = {
        id: `out-${Date.now()}`,
        to: email,
        subject: `[TechnoResolve] Action Required: Verify your email address - Code: ${code}`,
        template: 'email_verification',
        status: 'sent',
        created_at: new Date().toISOString(),
        payload: `Hi ${newUser.full_name},\\n\\nYour 6-digit email confirmation code is: ${code}`,
      };
      setOutbox((prev) => [outItem, ...prev]);
      saveOutboxToFirestore(outItem);

      // Send admin approval request notification
      const adminNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        user_id: 'admin',
        title: 'New User Awaiting Approval',
        message: `${newUser.full_name} (${newUser.email}) registered and requires admin approval.`,
        type: 'approval',
        read: false,
        created_at: new Date().toISOString(),
        target_id: newUser.id,
        link_page: 'users',
      };
      setNotifications((prev) => [adminNotif, ...prev]);
      saveNotificationToFirestore(adminNotif);
    }

    setCurrentUser(newUser);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, newUser.id);
    setViewRoleState(assignedRole);
    localStorage.setItem(STORAGE_KEYS.VIEW_ROLE, assignedRole);
    setActivePage('dashboard');

    if (isFirstUser) {
      showToast('👑 Welcome! As the first user, you have been granted full Administrator access.', 'success');
    } else {
      showToast('Account created! Please check your email to verify your address.', 'success');
    }
    
    return true;
  };"""

new_sign_in = """  const signIn = async (email: string, password?: string): Promise<boolean> => {
    if (!password || password.length < 6) {
      showToast('Password is required (min 6 chars).', 'error');
      return false;
    }

    try {
      const fbCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = fbCredential.user.uid;
      
      const existing = users.find((u) => u.id === uid || u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        if (existing.banned) {
          showToast('This account has been suspended by an administrator.', 'error');
          return false;
        }
        
        setCurrentUser(existing);
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, existing.id);
        setViewRoleState(existing.role);
        localStorage.setItem(STORAGE_KEYS.VIEW_ROLE, existing.role);
        setActivePage('dashboard');
        
        if (!existing.email_verified && existing.role !== 'admin') {
           // They will be redirected to the email verification page by App.tsx
           return true; 
        }
        
        showToast(`Welcome back, ${existing.full_name}! (${existing.role.toUpperCase()})`, 'success');
        return true;
      } else {
        showToast('Account record not found in system.', 'error');
        return false;
      }
    } catch (authErr: any) {
      console.log('Firebase Auth sign in notice:', authErr?.message);
      showToast('Invalid login details. Please check your email and password.', 'error');
      return false;
    }
  };"""

content = content.replace(old_sign_in, new_sign_in)

with open(file_path, 'w') as f:
    f.write(content)
