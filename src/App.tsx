import React, { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { AssessmentFlow } from './components/AssessmentFlow';
import { StressResults } from './components/StressResults';
import { MindfulChat } from './components/MindfulChat';
import { BreathingExercise } from './components/BreathingExercise';
import { HistoryTrends } from './components/HistoryTrends';
import { DailyMoodCheckIn } from './components/DailyMoodCheckIn';
import {
  auth,
  onAuthStateChanged,
  fetchUserAssessments,
  fetchUserJournalSessions,
  fetchUserDailyMoods,
  saveAssessmentToFirestore,
  saveDailyMoodToFirestore,
  signInAsGuest,
} from './lib/firebase';
import {
  calculateStressScore,
  calculateRefinedScore,
  getDefaultRecommendations,
  MOOD_DEFINITIONS,
} from './lib/scoring';
import {
  getLocalAssessments,
  saveLocalAssessment,
  getLocalJournals,
  getLocalDailyMoods,
  saveLocalDailyMood,
  getPendingSyncCounts,
  syncPendingData,
  getLastSyncTime,
} from './lib/offlineSync';
import {
  AssessmentRecord,
  DailyMoodRecord,
  JournalSession,
  Language,
  MoodType,
  OfflineSyncStatus,
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'assessment' | 'daily_mood' | 'journal' | 'history' | 'breathing'>('assessment');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<AssessmentRecord | null>(null);
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [journals, setJournals] = useState<JournalSession[]>([]);
  const [currentMood, setCurrentMood] = useState<DailyMoodRecord | null>(null);
  const [recentMoods, setRecentMoods] = useState<DailyMoodRecord[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSavingMood, setIsSavingMood] = useState(false);

  // Language state (English / Hindi) with persistent local storage
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('mindpulse_lang');
      if (savedLang === 'hi' || savedLang === 'en') return savedLang;
    }
    return 'en';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('mindpulse_lang', newLang);
    } catch (e) {
      console.warn('Failed to save language preference:', e);
    }
  };

  // Connectivity and Sync State
  const [syncStatus, setSyncStatus] = useState<OfflineSyncStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isSyncing: false,
    pendingAssessmentsCount: 0,
    pendingJournalsCount: 0,
    pendingMoodsCount: 0,
    lastSyncedAt: getLastSyncTime(),
  });

  // Refresh sync pending counter
  const updatePendingCount = useCallback(() => {
    const counts = getPendingSyncCounts(currentUser?.uid);
    setSyncStatus((prev) => ({
      ...prev,
      isOnline: navigator.onLine,
      pendingAssessmentsCount: counts.assessments,
      pendingJournalsCount: counts.journals,
      pendingMoodsCount: counts.moods,
    }));
  }, [currentUser?.uid]);

  // Cloud sync runner
  const handleTriggerSync = useCallback(async () => {
    if (!currentUser?.uid || !navigator.onLine) return;
    setSyncStatus((prev) => ({ ...prev, isSyncing: true }));
    try {
      await syncPendingData(currentUser.uid);
      // Reload fresh lists from cloud
      const cloudAssessments = await fetchUserAssessments(currentUser.uid);
      if (cloudAssessments.length > 0) {
        setAssessments(cloudAssessments);
      }
      const cloudJournals = await fetchUserJournalSessions(currentUser.uid);
      if (cloudJournals.length > 0) {
        setJournals(cloudJournals);
      }
      const cloudMoods = await fetchUserDailyMoods(currentUser.uid);
      if (cloudMoods.length > 0) {
        setRecentMoods(cloudMoods);
        setCurrentMood(cloudMoods[0]);
      }
      setSyncStatus((prev) => ({
        ...prev,
        isSyncing: false,
        lastSyncedAt: Date.now(),
      }));
    } catch (e) {
      console.warn('Sync failed:', e);
      setSyncStatus((prev) => ({ ...prev, isSyncing: false }));
    } finally {
      updatePendingCount();
    }
  }, [currentUser?.uid, updatePendingCount]);

  // Online / offline event listeners
  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus((prev) => ({ ...prev, isOnline: true }));
      handleTriggerSync();
    };

    const handleOffline = () => {
      setSyncStatus((prev) => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleTriggerSync]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Load local records first for instant responsiveness
        const localList = getLocalAssessments(user.uid);
        if (localList.length > 0) {
          setAssessments(localList);
          if (!currentRecord) setCurrentRecord(localList[0]);
        }

        const localJournals = getLocalJournals(user.uid);
        setJournals(localJournals);

        const localMoods = getLocalDailyMoods(user.uid);
        if (localMoods.length > 0) {
          setRecentMoods(localMoods);
          setCurrentMood(localMoods[0]);
        }

        // Fetch from Cloud Firestore
        if (navigator.onLine) {
          try {
            const [cloudAssessments, cloudJournals, cloudMoods] = await Promise.all([
              fetchUserAssessments(user.uid),
              fetchUserJournalSessions(user.uid),
              fetchUserDailyMoods(user.uid),
            ]);

            if (cloudAssessments.length > 0) {
              setAssessments(cloudAssessments);
              if (!currentRecord) setCurrentRecord(cloudAssessments[0]);
            }
            if (cloudJournals.length > 0) {
              setJournals(cloudJournals);
            }
            if (cloudMoods.length > 0) {
              setRecentMoods(cloudMoods);
              setCurrentMood(cloudMoods[0]);
            }

            // Trigger sync for any pending offline items
            syncPendingData(user.uid);
          } catch (err) {
            console.warn('Cloud fetch deferred:', err);
          }
        }
      } else {
        // Automatically start guest session so user has seamless immediate experience
        signInAsGuest().catch((e) => {
          console.warn('Guest sign-in fallback:', e);
        });
      }
      updatePendingCount();
    });

    return () => unsubscribe();
  }, [updatePendingCount]);

  // Daily mood check-in handler
  const handleSaveDailyMood = async (mood: MoodType, note?: string) => {
    setIsSavingMood(true);
    const userId = currentUser?.uid || 'guest-user';
    const moodDef = MOOD_DEFINITIONS[mood];

    const newMoodRecord: DailyMoodRecord = {
      id: `mood-${Date.now()}`,
      userId,
      createdAt: Date.now(),
      mood,
      emoji: moodDef.emoji,
      label: moodDef.label.en,
      stressModifier: moodDef.stressModifier,
      note,
      syncedToCloud: false,
    };

    // Save locally
    saveLocalDailyMood(newMoodRecord);
    setCurrentMood(newMoodRecord);
    setRecentMoods((prev) => [newMoodRecord, ...prev.filter((m) => m.id !== newMoodRecord.id)]);

    // Try cloud save
    if (navigator.onLine && currentUser) {
      try {
        await saveDailyMoodToFirestore(currentUser.uid, newMoodRecord);
        newMoodRecord.syncedToCloud = true;
      } catch (err) {
        console.warn('Daily mood cloud persistence queued for next sync:', err);
      }
    }

    // Live-recalibrate existing assessment score if one is currently viewed
    if (currentRecord) {
      const rawScore = currentRecord.moodCalibration?.rawScore ?? currentRecord.score;
      const refined = calculateRefinedScore(rawScore, newMoodRecord, lang);
      const updatedRecord: AssessmentRecord = {
        ...currentRecord,
        score: refined.refinedScore,
        tier: refined.tier,
        emoji: refined.tierInfo.emoji,
        dailyMoodId: newMoodRecord.id,
        moodCalibration: {
          mood: newMoodRecord.mood,
          emoji: newMoodRecord.emoji,
          label: newMoodRecord.label,
          stressModifier: newMoodRecord.stressModifier,
          rawScore,
          refinedScore: refined.refinedScore,
        },
      };
      saveLocalAssessment(updatedRecord);
      setCurrentRecord(updatedRecord);
      setAssessments((prev) => prev.map((a) => (a.id === updatedRecord.id ? updatedRecord : a)));
    }

    updatePendingCount();
    setIsSavingMood(false);
  };

  // Complete assessment handler with mood calibration & localized Gemini AI
  const handleCompleteAssessment = async (answers: Record<string, number>, userNotes: string) => {
    setIsAnalyzing(true);
    const raw = calculateStressScore(answers);
    const refined = calculateRefinedScore(raw.score, currentMood, lang);
    const finalScore = refined.refinedScore;
    const finalTier = refined.tier;
    const finalTierInfo = refined.tierInfo;

    // Initial deterministic recommendations for instant responsiveness
    let recommendations = getDefaultRecommendations(finalScore, finalTier);

    // If online, enrich with deep Gemini AI analysis
    if (navigator.onLine) {
      try {
        const response = await fetch('/api/gemini/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            score: finalScore,
            categoryScores: raw.categoryScores,
            responses: answers,
            userNotes,
            dailyMood: currentMood
              ? {
                  mood: currentMood.mood,
                  label: currentMood.label,
                  emoji: currentMood.emoji,
                  stressModifier: currentMood.stressModifier,
                  note: currentMood.note,
                }
              : undefined,
            language: lang,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.analysis && data.analysis.summary) {
            recommendations = {
              ...recommendations,
              ...data.analysis,
            };
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini analysis failed or offline; using default clinical recommendations:', geminiErr);
      }
    }

    const userId = currentUser?.uid || 'guest-user';
    const newRecord: AssessmentRecord = {
      id: `assessment-${Date.now()}`,
      userId,
      createdAt: Date.now(),
      score: finalScore,
      tier: finalTier,
      emoji: finalTierInfo.emoji,
      categoryScores: raw.categoryScores,
      answers,
      userNotes,
      recommendations,
      dailyMoodId: currentMood?.id,
      moodCalibration: currentMood
        ? {
            mood: currentMood.mood,
            emoji: currentMood.emoji,
            label: currentMood.label,
            stressModifier: currentMood.stressModifier,
            rawScore: raw.score,
            refinedScore: finalScore,
          }
        : undefined,
      syncedToCloud: false,
    };

    // Save locally
    saveLocalAssessment(newRecord);
    setCurrentRecord(newRecord);
    setAssessments((prev) => [newRecord, ...prev]);

    // Try cloud save
    if (navigator.onLine && currentUser) {
      try {
        await saveAssessmentToFirestore(currentUser.uid, newRecord);
        newRecord.syncedToCloud = true;
      } catch (err) {
        console.warn('Cloud persistence queued for next sync:', err);
      }
    }

    updatePendingCount();
    setIsAnalyzing(false);
  };

  const handleRetake = () => {
    setCurrentRecord(null);
    setActiveTab('assessment');
  };

  const handleOpenChatWithContext = (score: number, dominantFactor: string) => {
    setActiveTab('journal');
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] font-serif text-[#4a4a3a] antialiased flex flex-col">
      {/* Top App Bar with Natural Tones Design & Language Switcher */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={currentUser}
        openAuthModal={() => setIsAuthModalOpen(true)}
        syncStatus={syncStatus}
        triggerSync={handleTriggerSync}
        lang={lang}
        setLang={setLang}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-6 sm:px-6">
        {activeTab === 'assessment' && (
          <div>
            {currentRecord ? (
              <StressResults
                record={currentRecord}
                onRetake={handleRetake}
                onOpenChat={handleOpenChatWithContext}
                onOpenBreathing={() => setActiveTab('breathing')}
                lang={lang}
                currentMood={currentMood}
              />
            ) : (
              <AssessmentFlow
                onComplete={handleCompleteAssessment}
                isSubmitting={isAnalyzing}
                lang={lang}
                currentMood={currentMood}
                onOpenMoodCheckIn={() => setActiveTab('daily_mood')}
              />
            )}
          </div>
        )}

        {activeTab === 'daily_mood' && (
          <DailyMoodCheckIn
            currentMood={currentMood}
            onSaveMood={handleSaveDailyMood}
            lang={lang}
            recentMoods={recentMoods}
            isSaving={isSavingMood}
            baseStressScore={currentRecord?.score}
          />
        )}

        {activeTab === 'journal' && (
          <MindfulChat
            userId={currentUser?.uid}
            currentStressScore={currentRecord?.score}
            dominantFactor={
              currentRecord
                ? Object.entries(currentRecord.categoryScores || {}).sort((a, b) => Number(b[1]) - Number(a[1]))[0]?.[0]
                : undefined
            }
            dailyMood={currentMood}
            lang={lang}
            onSaveSession={(newSession) => {
              setJournals((prev) => [newSession, ...prev]);
              updatePendingCount();
            }}
          />
        )}

        {activeTab === 'breathing' && <BreathingExercise />}

        {activeTab === 'history' && (
          <HistoryTrends
            assessments={assessments}
            journals={journals}
            onSelectAssessment={(rec) => {
              setCurrentRecord(rec);
              setActiveTab('assessment');
            }}
            onOpenNewAssessment={handleRetake}
            isAuthenticated={!!currentUser && !currentUser.isAnonymous}
            openAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
      />
    </div>
  );
}

