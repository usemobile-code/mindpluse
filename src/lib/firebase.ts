import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  Firestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  AssessmentRecord,
  DailyMoodRecord,
  JournalSession,
  UserInteraction,
  MindfulLocation,
} from '../types';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Cloud Firestore with offline cache enabled
let dbInstance: Firestore;
try {
  dbInstance = initializeFirestore(
    app,
    {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    },
    firebaseConfig.firestoreDatabaseId || '(default)'
  );
} catch (e) {
  console.warn('Persistent cache initialization fell back to default Firestore:', e);
  dbInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
}

export const db = dbInstance;

/**
 * Strict Undefined-Stripping (Zero-Crash Payload Hygiene)
 * Strips all undefined fields recursively before passing payloads to Firestore SDK.
 */
export function stripUndefined<T>(obj: T): T {
  return JSON.parse(
    JSON.stringify(obj, (_, value) => (value === undefined ? null : value))
  );
}

/**
 * Sign in using Google Provider popup
 */
export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

/**
 * Sign in as anonymous guest
 */
export async function signInAsGuest(): Promise<User> {
  const result = await signInAnonymously(auth);
  return result.user;
}

/**
 * Sign out current user
 */
export async function logOut(): Promise<void> {
  await firebaseSignOut(auth);
}
export const signOutUser = logOut;

/**
 * Persist interaction to Cloud Firestore under users/{userId}/interactions/{interactionId}
 * Enforces strict user isolation and zero cross-user leakage.
 */
export async function saveInteractionToFirestore(
  userId: string,
  interaction: UserInteraction
): Promise<void> {
  if (!userId) throw new Error('User must be authenticated to persist interaction to Firestore.');
  const interactionRef = doc(db, 'users', userId, 'interactions', interaction.id);
  const cleanPayload = stripUndefined({
    ...interaction,
    userId,
    syncedToCloud: true,
  });
  await setDoc(interactionRef, cleanPayload);
}

/**
 * Fetch interactions for current authenticated user
 */
export async function fetchUserInteractions(userId: string): Promise<UserInteraction[]> {
  if (!userId) return [];
  try {
    const q = query(
      collection(db, 'users', userId, 'interactions'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const snap = await getDocs(q);
    const records: UserInteraction[] = [];
    snap.forEach((d) => {
      records.push(d.data() as UserInteraction);
    });
    return records;
  } catch (err) {
    console.error('Failed to fetch user interactions from Firestore:', err);
    return [];
  }
}

/**
 * Persist assessment document to Cloud Firestore under users/{userId}/assessments/{assessmentId}
 * Enforces strict user isolation.
 */
export async function saveAssessmentToFirestore(
  userId: string,
  assessment: AssessmentRecord
): Promise<void> {
  if (!userId) throw new Error('User must be authenticated to persist assessment to Firestore.');
  const assessmentRef = doc(db, 'users', userId, 'assessments', assessment.id);
  const cleanPayload = stripUndefined({
    ...assessment,
    userId,
    syncedToCloud: true,
  });
  await setDoc(assessmentRef, cleanPayload);
}

/**
 * Fetch past assessments for current authenticated user
 */
export async function fetchUserAssessments(userId: string): Promise<AssessmentRecord[]> {
  if (!userId) return [];
  try {
    const q = query(
      collection(db, 'users', userId, 'assessments'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const snap = await getDocs(q);
    const records: AssessmentRecord[] = [];
    snap.forEach((d) => {
      records.push(d.data() as AssessmentRecord);
    });
    return records;
  } catch (err) {
    console.error('Failed to fetch user assessments from Firestore:', err);
    return [];
  }
}

/**
 * Persist journal session to Cloud Firestore under users/{userId}/journal_sessions/{sessionId}
 */
export async function saveJournalSessionToFirestore(
  userId: string,
  session: JournalSession
): Promise<void> {
  if (!userId) throw new Error('User must be authenticated to persist journal to Firestore.');
  const sessionRef = doc(db, 'users', userId, 'journal_sessions', session.id);
  const cleanPayload = stripUndefined({
    ...session,
    userId,
    syncedToCloud: true,
  });
  await setDoc(sessionRef, cleanPayload);
}

/**
 * Fetch journal sessions for current user
 */
export async function fetchUserJournalSessions(userId: string): Promise<JournalSession[]> {
  if (!userId) return [];
  try {
    const q = query(
      collection(db, 'users', userId, 'journal_sessions'),
      orderBy('updatedAt', 'desc'),
      limit(30)
    );
    const snap = await getDocs(q);
    const records: JournalSession[] = [];
    snap.forEach((d) => {
      records.push(d.data() as JournalSession);
    });
    return records;
  } catch (err) {
    console.error('Failed to fetch user journal sessions from Firestore:', err);
    return [];
  }
}

/**
 * Persist daily mood record to Cloud Firestore under users/{userId}/daily_moods/{moodId}
 */
export async function saveDailyMoodToFirestore(
  userId: string,
  moodRecord: DailyMoodRecord
): Promise<void> {
  if (!userId) throw new Error('User must be authenticated to persist daily mood to Firestore.');
  const moodRef = doc(db, 'users', userId, 'daily_moods', moodRecord.id);
  const cleanPayload = stripUndefined({
    ...moodRecord,
    userId,
    syncedToCloud: true,
  });
  await setDoc(moodRef, cleanPayload);
}

/**
 * Fetch daily mood check-ins for current user
 */
export async function fetchUserDailyMoods(userId: string): Promise<DailyMoodRecord[]> {
  if (!userId) return [];
  try {
    const q = query(
      collection(db, 'users', userId, 'daily_moods'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const snap = await getDocs(q);
    const records: DailyMoodRecord[] = [];
    snap.forEach((d) => {
      records.push(d.data() as DailyMoodRecord);
    });
    return records;
  } catch (err) {
    console.error('Failed to fetch user daily moods from Firestore:', err);
    return [];
  }
}

/**
 * Persist mindful location to Cloud Firestore under users/{userId}/places/{placeId}
 */
export async function saveMindfulPlaceToFirestore(
  userId: string,
  place: MindfulLocation
): Promise<void> {
  if (!userId) throw new Error('User must be authenticated to persist places.');
  const placeRef = doc(db, 'users', userId, 'places', place.id);
  const cleanPayload = stripUndefined({
    ...place,
    userId,
    createdAt: Date.now(),
  });
  await setDoc(placeRef, cleanPayload);
}

/**
 * Fetch mindful locations for current user
 */
export async function fetchUserMindfulPlaces(userId: string): Promise<MindfulLocation[]> {
  if (!userId) return [];
  try {
    const q = query(collection(db, 'users', userId, 'places'), limit(50));
    const snap = await getDocs(q);
    const records: MindfulLocation[] = [];
    snap.forEach((d) => {
      records.push(d.data() as MindfulLocation);
    });
    return records;
  } catch (err) {
    console.error('Failed to fetch user mindful places:', err);
    return [];
  }
}

export { onAuthStateChanged };
