import React from 'react';
import {
  Cloud,
  CloudOff,
  RefreshCw,
  UserCheck,
  LogIn,
  Sparkles,
  BookOpen,
  BarChart3,
  Wind,
  Heart,
  Globe,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { Language, OfflineSyncStatus } from '../types';
import { getTranslation } from '../lib/i18n';

interface HeaderProps {
  activeTab: 'assessment' | 'daily_mood' | 'journal' | 'history' | 'breathing';
  setActiveTab: (tab: 'assessment' | 'daily_mood' | 'journal' | 'history' | 'breathing') => void;
  user: User | null;
  openAuthModal: () => void;
  syncStatus: OfflineSyncStatus;
  triggerSync: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  user,
  openAuthModal,
  syncStatus,
  triggerSync,
  lang,
  setLang,
}) => {
  const pendingTotal =
    syncStatus.pendingAssessmentsCount +
    syncStatus.pendingJournalsCount +
    (syncStatus.pendingMoodsCount || 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#e0e0d5] bg-[#ecece4]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5A5A40] text-[#f5f5f0] shadow-xs text-lg font-serif font-bold">
            M
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#4a4a3a]">
                {getTranslation('appTitle', lang)}
              </span>
              <span className="rounded-full border border-[#5A5A40]/40 bg-white/60 px-2.5 py-0.5 text-[10px] uppercase tracking-widest font-semibold text-[#5A5A40]">
                100 - 1000
              </span>
            </div>
            <p className="hidden text-xs italic text-[#7a7a6a] sm:block">
              {getTranslation('appSubtitle', lang)}
            </p>
          </div>
        </div>

        {/* Primary Navigation */}
        <nav className="hidden lg:flex items-center gap-1 rounded-full bg-white/70 p-1 border border-[#d8d8cc] shadow-2xs">
          <button
            id="nav-tab-assessment"
            onClick={() => setActiveTab('assessment')}
            className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'assessment'
                ? 'bg-[#5A5A40] text-[#f5f5f0] shadow-xs'
                : 'text-[#7a7a6a] hover:text-[#4a4a3a]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {getTranslation('tabAssessment', lang)}
          </button>
          <button
            id="nav-tab-daily-mood"
            onClick={() => setActiveTab('daily_mood')}
            className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'daily_mood'
                ? 'bg-[#5A5A40] text-[#f5f5f0] shadow-xs'
                : 'text-[#7a7a6a] hover:text-[#4a4a3a]'
            }`}
          >
            <Heart className="h-3.5 w-3.5" />
            {getTranslation('tabDailyMood', lang)}
          </button>
          <button
            id="nav-tab-journal"
            onClick={() => setActiveTab('journal')}
            className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'journal'
                ? 'bg-[#5A5A40] text-[#f5f5f0] shadow-xs'
                : 'text-[#7a7a6a] hover:text-[#4a4a3a]'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            {getTranslation('tabJournal', lang)}
          </button>
          <button
            id="nav-tab-breathing"
            onClick={() => setActiveTab('breathing')}
            className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'breathing'
                ? 'bg-[#5A5A40] text-[#f5f5f0] shadow-xs'
                : 'text-[#7a7a6a] hover:text-[#4a4a3a]'
            }`}
          >
            <Wind className="h-3.5 w-3.5" />
            {getTranslation('tabBreathing', lang)}
          </button>
          <button
            id="nav-tab-history"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-[#5A5A40] text-[#f5f5f0] shadow-xs'
                : 'text-[#7a7a6a] hover:text-[#4a4a3a]'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            {getTranslation('tabTrends', lang)}
          </button>
        </nav>

        {/* Right Section: Language Toggle, Sync Status & Auth */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Language Switcher Button */}
          <div className="flex items-center rounded-full bg-white/80 p-0.5 border border-[#d8d8cc]">
            <button
              id="lang-toggle-en"
              type="button"
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                lang === 'en'
                  ? 'bg-[#5A5A40] text-[#f5f5f0] shadow-2xs font-semibold'
                  : 'text-[#7a7a6a] hover:text-[#4a4a3a]'
              }`}
            >
              EN
            </button>
            <button
              id="lang-toggle-hi"
              type="button"
              onClick={() => setLang('hi')}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                lang === 'hi'
                  ? 'bg-[#5A5A40] text-[#f5f5f0] shadow-2xs font-semibold'
                  : 'text-[#7a7a6a] hover:text-[#4a4a3a]'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Offline Sync Status Badge */}
          <div
            className={`flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1 text-xs font-medium border ${
              syncStatus.isOnline
                ? pendingTotal > 0
                  ? 'border-amber-300 bg-amber-50 text-amber-800'
                  : 'border-[#d8d8cc] bg-white/80 text-[#5A5A40]'
                : 'border-rose-300 bg-rose-50 text-rose-800'
            }`}
            title={
              syncStatus.isOnline
                ? pendingTotal > 0
                  ? `${pendingTotal} items pending cloud sync`
                  : 'Cloud Firestore connected and synchronized'
                : 'Offline mode active. Data saved locally in persistent cache'
            }
          >
            {syncStatus.isOnline ? (
              pendingTotal > 0 ? (
                <button
                  id="btn-sync-trigger"
                  onClick={triggerSync}
                  disabled={syncStatus.isSyncing}
                  className="flex items-center gap-1 hover:underline"
                >
                  <RefreshCw className={`h-3 w-3 ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
                  <span>{syncStatus.isSyncing ? 'Syncing...' : `${pendingTotal} Pending`}</span>
                </button>
              ) : (
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  <Cloud className="h-3.5 w-3.5 text-[#5A5A40]" />
                  <span className="hidden sm:inline">
                    {lang === 'hi' ? 'सिंक संपन्न' : 'Online & Synced'}
                  </span>
                  <span className="sm:hidden">✓</span>
                </span>
              )
            ) : (
              <span className="flex items-center gap-1.5">
                <CloudOff className="h-3.5 w-3.5 text-rose-600" />
                <span>{lang === 'hi' ? 'ऑफ़लाइन' : 'Offline'}</span>
              </span>
            )}
          </div>

          {/* User Profile / Authentication Button */}
          {user ? (
            <button
              id="btn-user-profile"
              onClick={openAuthModal}
              className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-[#d8d8cc] bg-white/90 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-[#4a4a3a] hover:bg-white transition shadow-2xs"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="h-5 w-5 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <UserCheck className="h-4 w-4 text-[#5A5A40]" />
              )}
              <span className="max-w-[80px] sm:max-w-[100px] truncate font-medium">
                {user.isAnonymous
                  ? getTranslation('guestMode', lang)
                  : user.displayName || user.email?.split('@')[0] || getTranslation('verifiedUser', lang)}
              </span>
            </button>
          ) : (
            <button
              id="btn-signin-header"
              onClick={openAuthModal}
              className="flex items-center gap-1.5 rounded-full bg-[#5A5A40] px-3.5 sm:px-4 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-[#484833] transition"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>{lang === 'hi' ? 'साइन इन' : 'Sign In'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Tab bar */}
      <div className="flex lg:hidden border-t border-[#e0e0d5] bg-[#ecece4] px-2 py-2 justify-around overflow-x-auto">
        <button
          onClick={() => setActiveTab('assessment')}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 text-[11px] font-medium rounded-full shrink-0 ${
            activeTab === 'assessment' ? 'text-[#5A5A40] font-bold' : 'text-[#8a8a7a]'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          {getTranslation('tabAssessment', lang)}
        </button>
        <button
          onClick={() => setActiveTab('daily_mood')}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 text-[11px] font-medium rounded-full shrink-0 ${
            activeTab === 'daily_mood' ? 'text-[#5A5A40] font-bold' : 'text-[#8a8a7a]'
          }`}
        >
          <Heart className="h-4 w-4" />
          {getTranslation('tabDailyMood', lang)}
        </button>
        <button
          onClick={() => setActiveTab('journal')}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 text-[11px] font-medium rounded-full shrink-0 ${
            activeTab === 'journal' ? 'text-[#5A5A40] font-bold' : 'text-[#8a8a7a]'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          {getTranslation('tabJournal', lang)}
        </button>
        <button
          onClick={() => setActiveTab('breathing')}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 text-[11px] font-medium rounded-full shrink-0 ${
            activeTab === 'breathing' ? 'text-[#5A5A40] font-bold' : 'text-[#8a8a7a]'
          }`}
        >
          <Wind className="h-4 w-4" />
          {getTranslation('tabBreathing', lang)}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 text-[11px] font-medium rounded-full shrink-0 ${
            activeTab === 'history' ? 'text-[#5A5A40] font-bold' : 'text-[#8a8a7a]'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          {getTranslation('tabTrends', lang)}
        </button>
      </div>
    </header>
  );
};

