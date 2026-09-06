import {
  AssessmentRecord,
  DailyMoodRecord,
  JournalSession,
  UserInteraction,
  OfflineSyncStatus,
} from '../types';
import {
  saveAssessmentToFirestore,
  saveDailyMoodToFirestore,
  saveJournalSessionToFirestore,
  saveInteractionToFirestore,
} from './firebase';

const STORAGE_KEYS = {
  ASSESSMENTS: 'mindpulse_offline_assessments',
  JOURNALS: 'mindpulse_offline_journals',
  INTERACTIONS: 'mindpulse_offline_interactions',
  DAILY_MOODS: 'mindpulse_offline_moods',
  LAST_SYNC: 'mindpulse_last_sync_time',
};

export function getLocalAssessments(userId?: string): AssessmentRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
    if (!raw) return [];
    const list: AssessmentRecord[] = JSON.parse(raw);
    if (!userId) return list;
    return list.filter((item) => item.userId === userId);
  } catch {
    return [];
  }
}

export function saveLocalAssessment(record: AssessmentRecord): void {
  try {
    const existing = getLocalAssessments();
    const updated = [record, ...existing.filter((r) => r.id !== record.id)];
    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(updated.slice(0, 100)));
  } catch (err) {
    console.error('Failed to write assessment to local storage:', err);
  }
}

export function getLocalJournals(userId?: string): JournalSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.JOURNALS);
    if (!raw) return [];
    const list: JournalSession[] = JSON.parse(raw);
    if (!userId) return list;
    return list.filter((item) => item.userId === userId);
  } catch {
    return [];
  }
}

export function saveLocalJournal(session: JournalSession): void {
  try {
    const existing = getLocalJournals();
    const updated = [session, ...existing.filter((s) => s.id !== session.id)];
    localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(updated.slice(0, 50)));
  } catch (err) {
    console.error('Failed to write journal to local storage:', err);
  }
}

export function getLocalInteractions(userId?: string): UserInteraction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INTERACTIONS);
    if (!raw) return [];
    const list: UserInteraction[] = JSON.parse(raw);
    if (!userId) return list;
    return list.filter((item) => item.userId === userId);
  } catch {
    return [];
  }
}

export function saveLocalInteraction(interaction: UserInteraction): void {
  try {
    const existing = getLocalInteractions();
    const updated = [interaction, ...existing.filter((i) => i.id !== interaction.id)];
    localStorage.setItem(STORAGE_KEYS.INTERACTIONS, JSON.stringify(updated.slice(0, 100)));
  } catch (err) {
    console.error('Failed to write interaction to local storage:', err);
  }
}

export function getLocalMoods(userId?: string): DailyMoodRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_MOODS);
    if (!raw) return [];
    const list: DailyMoodRecord[] = JSON.parse(raw);
    if (!userId) return list;
    return list.filter((item) => item.userId === userId);
  } catch {
    return [];
  }
}

export function saveLocalMood(mood: DailyMoodRecord): void {
  try {
    const existing = getLocalMoods();
    const updated = [mood, ...existing.filter((m) => m.id !== mood.id)];
    localStorage.setItem(STORAGE_KEYS.DAILY_MOODS, JSON.stringify(updated.slice(0, 60)));
  } catch (err) {
    console.error('Failed to write daily mood to local storage:', err);
  }
}

export const getLocalDailyMoods = getLocalMoods;
export const saveLocalDailyMood = saveLocalMood;

export function getPendingSyncCounts(userId?: string): {
  assessments: number;
  journals: number;
  interactions: number;
  moods: number;
} {
  const localAssessments = getLocalAssessments(userId).filter((a) => !a.syncedToCloud);
  const localJournals = getLocalJournals(userId).filter((j) => !j.syncedToCloud);
  const localInteractions = getLocalInteractions(userId).filter((i) => !i.syncedToCloud);
  const localMoods = getLocalMoods(userId).filter((m) => !m.syncedToCloud);
  return {
    assessments: localAssessments.length,
    journals: localJournals.length,
    interactions: localInteractions.length,
    moods: localMoods.length,
  };
}

/**
 * Synchronize local pending data to Cloud Firestore once online
 */
export async function syncPendingData(
  userId: string
): Promise<{
  syncedAssessments: number;
  syncedJournals: number;
  syncedInteractions: number;
  syncedMoods: number;
}> {
  if (!navigator.onLine || !userId) {
    return { syncedAssessments: 0, syncedJournals: 0, syncedInteractions: 0, syncedMoods: 0 };
  }

  const allAssessments = getLocalAssessments();
  const allJournals = getLocalJournals();
  const allInteractions = getLocalInteractions();
  const allMoods = getLocalMoods();

  let syncedAssessments = 0;
  let syncedJournals = 0;
  let syncedInteractions = 0;
  let syncedMoods = 0;

  // Sync assessments
  const updatedAssessments = await Promise.all(
    allAssessments.map(async (item) => {
      if (item.userId === userId && !item.syncedToCloud) {
        try {
          await saveAssessmentToFirestore(userId, item);
          syncedAssessments++;
          return { ...item, syncedToCloud: true };
        } catch (e) {
          console.warn('Failed to sync assessment document:', item.id, e);
          return item;
        }
      }
      return item;
    })
  );

  // Sync journals
  const updatedJournals = await Promise.all(
    allJournals.map(async (item) => {
      if (item.userId === userId && !item.syncedToCloud) {
        try {
          await saveJournalSessionToFirestore(userId, item);
          syncedJournals++;
          return { ...item, syncedToCloud: true };
        } catch (e) {
          console.warn('Failed to sync journal session:', item.id, e);
          return item;
        }
      }
      return item;
    })
  );

  // Sync interactions
  const updatedInteractions = await Promise.all(
    allInteractions.map(async (item) => {
      if (item.userId === userId && !item.syncedToCloud) {
        try {
          await saveInteractionToFirestore(userId, item);
          syncedInteractions++;
          return { ...item, syncedToCloud: true };
        } catch (e) {
          console.warn('Failed to sync interaction:', item.id, e);
          return item;
        }
      }
      return item;
    })
  );

  // Sync daily moods
  const updatedMoods = await Promise.all(
    allMoods.map(async (item) => {
      if (item.userId === userId && !item.syncedToCloud) {
        try {
          await saveDailyMoodToFirestore(userId, item);
          syncedMoods++;
          return { ...item, syncedToCloud: true };
        } catch (e) {
          console.warn('Failed to sync daily mood document:', item.id, e);
          return item;
        }
      }
      return item;
    })
  );

  localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(updatedAssessments));
  localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(updatedJournals));
  localStorage.setItem(STORAGE_KEYS.INTERACTIONS, JSON.stringify(updatedInteractions));
  localStorage.setItem(STORAGE_KEYS.DAILY_MOODS, JSON.stringify(updatedMoods));
  localStorage.setItem(STORAGE_KEYS.LAST_SYNC, Date.now().toString());

  return { syncedAssessments, syncedJournals, syncedInteractions, syncedMoods };
}

export function getLastSyncTime(): number | null {
  const t = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
  return t ? parseInt(t, 10) : null;
}
