import sys

file_path = 'src/context/AppContext.tsx'
with open(file_path, 'r') as f:
    content = f.read()

old_signup = """  const signUp = async (data: {
    email: string;
    password?: string;
    full_name: string;
    company?: string;
    role?: UserRole;
  }): Promise<boolean> => {
    if (data.password && data.password.length >= 6) {
      try {
        await createUserWithEmailAndPassword(auth, data.email, data.password);
      } catch (authErr: any) {
        console.log('Firebase Auth registration notice:', authErr?.message);
      }
    }

    const existing = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      showToast('An account with this email already exists. Signed in.', 'info');
      setCurrentUser(existing);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, existing.id);
      setViewRoleState(existing.role);
      localStorage.setItem(STORAGE_KEYS.VIEW_ROLE, existing.role);
      setActivePage('dashboard');
      return true;
    }

    const isFirstUser = users.length === 0;
    const assignedRole: UserRole = isFirstUser ? 'admin' : data.role || 'user';
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      email: data.email,
      full_name: data.full_name,
      company: data.company || 'TechnoResolve Enterprise',
      role: assignedRole,
      is_approved: isFirstUser, // First user is automatically approved admin
      email_verified: isFirstUser, // First user is automatically verified
      verification_code: isFirstUser ? undefined : code,
      banned: false,
      created_at: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    await saveUserToFirestore(newUser);

    if (!isFirstUser) {
      // 1. Dispatch confirmation email to outbox
      const outItem: EmailOutboxItem = {
        id: `out-${Date.now()}`,
        to: data.email,
        subject: `[TechnoResolve] Action Required: Verify your email address - Code: ${code}`,
        template: 'email_verification',
        status: 'sent',
        created_at: new Date().toISOString(),
        payload: `Hi ${data.full_name},\\n\\nWelcome to TechnoResolve IT Service Desk!\\n\\nYour 6-digit email confirmation code is: ${code}\\n\\nOnce verified, an administrator will review and activate your account access.`,
      };
      setOutbox((prev) => [outItem, ...prev]);
      saveOutboxToFirestore(outItem);

      // 2. Dispatch approval notification to all Admins
      const adminNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        user_id: 'admin',
        title: 'New User Approval Required',
        message: `${data.full_name} (${data.email}) requested ${assignedRole.toUpperCase()} access and requires approval.`,
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

new_signup = """  const signUp = async (data: {
    email: string;
    password?: string;
    full_name: string;
    company?: string;
    role?: UserRole;
  }): Promise<boolean> => {
    if (!data.password || data.password.length < 6) {
      showToast('Password is required (min 6 chars).', 'error');
      return false;
    }
    
    const existing = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      showToast('An account with this email already exists.', 'error');
      return false;
    }

    let uid = '';
    try {
      const fbCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      uid = fbCredential.user.uid;
    } catch (authErr: any) {
      console.log('Firebase Auth registration notice:', authErr?.message);
      showToast(authErr?.message || 'Registration failed.', 'error');
      return false;
    }

    const isFirstUser = users.length === 0;
    const assignedRole: UserRole = isFirstUser ? 'admin' : data.role || 'user';
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser: UserProfile = {
      id: uid,
      email: data.email,
      full_name: data.full_name,
      company: data.company || 'TechnoResolve Enterprise',
      role: assignedRole,
      is_approved: isFirstUser, // First user is automatically approved admin
      email_verified: isFirstUser, // First user is automatically verified
      verification_code: isFirstUser ? undefined : code,
      banned: false,
      created_at: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    await saveUserToFirestore(newUser);

    if (!isFirstUser) {
      // 1. Dispatch confirmation email to outbox
      const outItem: EmailOutboxItem = {
        id: `out-${Date.now()}`,
        to: data.email,
        subject: `[TechnoResolve] Action Required: Verify your email address - Code: ${code}`,
        template: 'email_verification',
        status: 'sent',
        created_at: new Date().toISOString(),
        payload: `Hi ${data.full_name},\\n\\nWelcome to TechnoResolve IT Service Desk!\\n\\nYour 6-digit email confirmation code is: ${code}\\n\\nOnce verified, an administrator will review and activate your account access.`,
      };
      setOutbox((prev) => [outItem, ...prev]);
      saveOutboxToFirestore(outItem);

      // 2. Dispatch approval notification to all Admins
      const adminNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        user_id: 'admin',
        title: 'New User Approval Required',
        message: `${data.full_name} (${data.email}) requested ${assignedRole.toUpperCase()} access and requires approval.`,
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

content = content.replace(old_signup, new_signup)

with open(file_path, 'w') as f:
    f.write(content)
