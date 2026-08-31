import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { Ticket, TicketMessage, UserProfile, EmailOutboxItem, UserRole } from '../types';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';

const COLLECTIONS = {
  USERS: 'users',
  TICKETS: 'tickets',
  MESSAGES: 'messages',
  OUTBOX: 'outbox',
  NOTIFICATIONS: 'notifications',
};

// Helper to deep clean undefined values from Firestore payloads
function cleanForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as unknown as T;
  }
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => cleanForFirestore(item)) as unknown as T;
  }
  if (typeof data === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(data as Record<string, any>)) {
      if (value !== undefined) {
        cleaned[key] = cleanForFirestore(value);
      }
    }
    return cleaned as T;
  }
  return data;
}

// Purge all documents from Firestore collections (clean slate)
export async function purgeAllFirestoreData(): Promise<void> {
  try {
    for (const colName of Object.values(COLLECTIONS)) {
      const colRef = collection(db, colName);
      const snapshot = await getDocs(colRef);
      for (const docSnap of snapshot.docs) {
        await deleteDoc(doc(db, colName, docSnap.id));
      }
    }
    console.log('🧹 Firestore database completely purged of all mock/previous data.');
  } catch (error) {
    console.warn('Error purging Firestore database:', error);
  }
}

// Check database initialization and clean previous mock records if needed
export async function initializeFirestoreDatabase(): Promise<void> {
  // Safe initialization - intentionally empty to prevent accidental data wipes
  // Legacy seeds were already handled in prior builds
}

// Check if any registered users exist
export async function getUsersCountFromFirestore(): Promise<number> {
  try {
    const usersCol = collection(db, COLLECTIONS.USERS);
    const userSnapshot = await getDocs(usersCol);
    return userSnapshot.size;
  } catch (error) {
    console.warn('Failed to query users count from Firestore:', error);
    return 0;
  }
}

// Subscribe to real-time Tickets
export function subscribeToTickets(callback: (tickets: Ticket[]) => void) {
  try {
    const q = collection(db, COLLECTIONS.TICKETS);
    return onSnapshot(
      q,
      (snapshot) => {
        const items: Ticket[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as Ticket);
        });
        // Sort descending by created_at
        items.sort(
          (a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
        );
        callback(items);
      },
      (error) => {
        console.warn('Tickets snapshot subscription error:', error);
      }
    );
  } catch (err) {
    console.warn('Failed to listen to tickets in Firestore:', err);
    return () => {};
  }
}

// Subscribe to real-time Messages
export function subscribeToMessages(callback: (messages: TicketMessage[]) => void) {
  try {
    const q = collection(db, COLLECTIONS.MESSAGES);
    return onSnapshot(
      q,
      (snapshot) => {
        const items: TicketMessage[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as TicketMessage);
        });
        items.sort(
          (a, b) => new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime()
        );
        callback(items);
      },
      (error) => {
        console.warn('Messages snapshot subscription error:', error);
      }
    );
  } catch (err) {
    console.warn('Failed to listen to messages in Firestore:', err);
    return () => {};
  }
}

// Subscribe to real-time Users
export function subscribeToUsers(callback: (users: UserProfile[]) => void) {
  try {
    const q = collection(db, COLLECTIONS.USERS);
    return onSnapshot(
      q,
      (snapshot) => {
        const items: UserProfile[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as UserProfile);
        });
        callback(items);
      },
      (error) => {
        console.warn('Users snapshot subscription error:', error);
      }
    );
  } catch (err) {
    console.warn('Failed to listen to users in Firestore:', err);
    return () => {};
  }
}

// Save or Update Ticket in Firestore
export async function saveTicketToFirestore(ticket: Ticket): Promise<void> {
  try {
    const cleaned = cleanForFirestore(ticket);
    await setDoc(doc(db, COLLECTIONS.TICKETS, ticket.id), cleaned, { merge: true });
  } catch (error) {
    console.error('Error saving ticket to Firestore:', error);
  }
}

export async function updateTicketInFirestore(
  ticketId: string,
  updates: Partial<Ticket>
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.TICKETS, ticketId);
    const cleaned = cleanForFirestore(updates);
    await setDoc(docRef, cleaned, { merge: true });
  } catch (error) {
    console.error('Error updating ticket in Firestore:', error);
  }
}

export async function deleteTicketFromFirestore(ticketId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.TICKETS, ticketId));
  } catch (error) {
    console.error('Error deleting ticket in Firestore:', error);
  }
}

// Save Message in Firestore
export async function saveMessageToFirestore(message: TicketMessage): Promise<void> {
  try {
    const cleaned = cleanForFirestore(message);
    await setDoc(doc(db, COLLECTIONS.MESSAGES, message.id), cleaned, { merge: true });
  } catch (error) {
    console.error('Error saving message to Firestore:', error);
  }
}

// Save User in Firestore
export async function saveUserToFirestore(user: UserProfile): Promise<void> {
  try {
    const cleaned = cleanForFirestore(user);
    await setDoc(doc(db, COLLECTIONS.USERS, user.id), cleaned, { merge: true });
  } catch (error) {
    console.error('Error saving user to Firestore:', error);
  }
}

export async function updateUserInFirestore(
  userId: string,
  updates: Partial<UserProfile>
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.USERS, userId);
    const cleaned = cleanForFirestore(updates);
    await setDoc(docRef, cleaned, { merge: true });
  } catch (error) {
    console.error('Error updating user in Firestore:', error);
  }
}

export async function deleteUserFromFirestore(userId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.USERS, userId));
  } catch (error) {
    console.error('Error deleting user in Firestore:', error);
  }
}

// Save Outbox Item in Firestore
export async function saveOutboxToFirestore(item: EmailOutboxItem): Promise<void> {
  try {
    const cleaned = cleanForFirestore(item);
    await setDoc(doc(db, COLLECTIONS.OUTBOX, item.id), cleaned, { merge: true });
  } catch (error) {
    console.error('Error saving outbox item to Firestore:', error);
  }
}

// Subscribe to real-time Outbox
export function subscribeToOutbox(callback: (items: EmailOutboxItem[]) => void) {
  try {
    const q = collection(db, COLLECTIONS.OUTBOX);
    return onSnapshot(
      q,
      (snapshot) => {
        const items: EmailOutboxItem[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as EmailOutboxItem);
        });
        items.sort(
          (a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
        );
        callback(items);
      },
      (error) => {
        console.warn('Outbox snapshot subscription error:', error);
      }
    );
  } catch (err) {
    console.warn('Failed to listen to outbox in Firestore:', err);
    return () => {};
  }
}

// Subscribe to real-time Notifications
export function subscribeToNotifications(callback: (notifications: any[]) => void) {
  try {
    const q = collection(db, COLLECTIONS.NOTIFICATIONS);
    return onSnapshot(
      q,
      (snapshot) => {
        const items: any[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data());
        });
        items.sort(
          (a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
        );
        callback(items);
      },
      (error) => {
        console.warn('Notifications snapshot subscription error:', error);
      }
    );
  } catch (err) {
    console.warn('Failed to listen to notifications in Firestore:', err);
    return () => {};
  }
}

// Save Notification in Firestore
export async function saveNotificationToFirestore(notif: any): Promise<void> {
  try {
    const cleaned = cleanForFirestore(notif);
    await setDoc(doc(db, COLLECTIONS.NOTIFICATIONS, notif.id), cleaned, { merge: true });
  } catch (error) {
    console.error('Error saving notification to Firestore:', error);
  }
}

export async function updateNotificationInFirestore(id: string, updates: any): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.NOTIFICATIONS, id);
    const cleaned = cleanForFirestore(updates);
    await setDoc(docRef, cleaned, { merge: true });
  } catch (error) {
    console.error('Error updating notification in Firestore:', error);
  }
}

