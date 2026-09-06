import React, { useState } from 'react';
import { BarChart3, Calendar, Cloud, CloudOff, ArrowUpRight, Sparkles, BookOpen, Clock, ChevronRight } from 'lucide-react';
import { AssessmentRecord, JournalSession } from '../types';
import { STRESS_TIERS } from '../lib/scoring';

interface HistoryTrendsProps {
  assessments: AssessmentRecord[];
  journals: JournalSession[];
  onSelectAssessment: (record: AssessmentRecord) => void;
  onOpenNewAssessment: () => void;
  isAuthenticated: boolean;
  openAuthModal: () => void;
}

export const HistoryTrends: React.FC<HistoryTrendsProps> = ({
  assessments,
  journals,
  onSelectAssessment,
  onOpenNewAssessment,
  isAuthenticated,
  openAuthModal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'assessments' | 'journals'>('assessments');

  // Compute stats
  const totalCount = assessments.length;
  const avgScore = totalCount > 0
    ? Math.round(assessments.reduce((acc, a) => acc + a.score, 0) / totalCount)
    : 0;

  const latestScore = totalCount > 0 ? assessments[0].score : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-6 font-serif">
      {/* Top Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e0e0d5]">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#5A5A40]" />
            <h2 className="text-2xl font-bold tracking-tight text-[#4a4a3a]">
              Personal Stress Trends & History
            </h2>
          </div>
          <p className="text-xs italic text-[#7a7a6a] mt-0.5">
            Isolated Firestore vault tracking your mental health scores, emoji states, and journal reflections over time.
          </p>
        </div>

        <button
          onClick={onOpenNewAssessment}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-[#5A5A40] px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#484833] transition font-sans"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>New Assessment</span>
        </button>
      </div>

      {!isAuthenticated && (
        <div className="rounded-2xl border border-[#d8d8cc] bg-[#ecece4]/80 p-4 text-xs text-[#4a4a3a] flex items-center justify-between">
          <span>You are viewing local session data. Sign in with Firebase to synchronize across devices permanently.</span>
          <button
            onClick={openAuthModal}
            className="font-bold underline text-[#5A5A40] hover:text-[#484833] shrink-0 ml-3"
          >
            Sign In
          </button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-[28px] border border-[#e0e0d5] bg-white p-5 shadow-2xs">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#8a8a7a] font-sans font-medium">
            Total Check-Ins
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#4a4a3a]">{totalCount}</span>
            <span className="text-xs italic text-[#7a7a6a]">assessments logged</span>
          </div>
        </div>

        <div className="rounded-[28px] border border-[#e0e0d5] bg-white p-5 shadow-2xs">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#8a8a7a] font-sans font-medium">
            Average Stress Score
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#4a4a3a]">
              {avgScore ? `${avgScore} / 1000` : '—'}
            </span>
          </div>
        </div>

        <div className="rounded-[28px] border border-[#e0e0d5] bg-white p-5 shadow-2xs">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#8a8a7a] font-sans font-medium">
            Latest Score
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#4a4a3a]">
              {latestScore ? `${latestScore} / 1000` : '—'}
            </span>
            {totalCount > 0 && (
              <span className="text-xl">
                {STRESS_TIERS[assessments[0].tier]?.emoji}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Sub tabs: Assessments vs Journal Entries */}
      <div className="flex border-b border-[#e0e0d5]">
        <button
          onClick={() => setActiveSubTab('assessments')}
          className={`pb-3 px-5 text-xs font-semibold border-b-2 transition ${
            activeSubTab === 'assessments'
              ? 'border-[#5A5A40] text-[#5A5A40]'
              : 'border-transparent text-[#7a7a6a] hover:text-[#4a4a3a]'
          }`}
        >
          Assessment Records ({assessments.length})
        </button>
        <button
          onClick={() => setActiveSubTab('journals')}
          className={`pb-3 px-5 text-xs font-semibold border-b-2 transition ${
            activeSubTab === 'journals'
              ? 'border-[#5A5A40] text-[#5A5A40]'
              : 'border-transparent text-[#7a7a6a] hover:text-[#4a4a3a]'
          }`}
        >
          Saved Journal Reflections ({journals.length})
        </button>
      </div>

      {/* Tab 1: Assessments List */}
      {activeSubTab === 'assessments' && (
        <div className="space-y-3">
          {assessments.length === 0 ? (
            <div className="rounded-[32px] border border-dashed border-[#d8d8cc] p-10 text-center bg-white/50">
              <p className="text-base font-bold text-[#4a4a3a]">
                No mental health assessments logged yet.
              </p>
              <p className="text-xs italic text-[#7a7a6a] mt-1">
                Take your first stress evaluation to establish your baseline score out of 1000.
              </p>
              <button
                onClick={onOpenNewAssessment}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#5A5A40] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#484833] font-sans"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Start First Check-In
              </button>
            </div>
          ) : (
            assessments.map((rec) => {
              const tierInfo = STRESS_TIERS[rec.tier] || STRESS_TIERS.MODERATE;
              const dateStr = new Date(rec.createdAt).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={rec.id}
                  onClick={() => onSelectAssessment(rec)}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-[#e0e0d5] bg-white p-5 shadow-2xs hover:border-[#5A5A40] cursor-pointer transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ecece4] text-2xl shadow-2xs border border-[#d8d8cc]">
                      {tierInfo.emoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-base text-[#4a4a3a]">
                          {rec.score} / 1000
                        </span>
                        <span className="rounded-full border border-[#d8d8cc] bg-[#f5f5f0] px-3 py-0.5 text-[11px] font-medium text-[#5A5A40] font-sans">
                          {tierInfo.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-[#7a7a6a] font-sans">
                        <Calendar className="h-3 w-3" />
                        <span>{dateStr}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-0 border-[#e0e0d5]">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-medium font-sans ${
                        rec.syncedToCloud ? 'text-[#5A5A40]' : 'text-amber-700'
                      }`}
                    >
                      {rec.syncedToCloud ? (
                        <>
                          <Cloud className="h-3.5 w-3.5" />
                          <span>Cloud Synced</span>
                        </>
                      ) : (
                        <>
                          <CloudOff className="h-3.5 w-3.5" />
                          <span>Local Vault</span>
                        </>
                      )}
                    </span>

                    <button className="flex items-center gap-1 text-xs font-semibold text-[#5A5A40] group-hover:translate-x-0.5 transition-transform font-sans">
                      <span>View Breakdown</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Journal Sessions */}
      {activeSubTab === 'journals' && (
        <div className="space-y-3">
          {journals.length === 0 ? (
            <div className="rounded-[32px] border border-dashed border-[#d8d8cc] p-10 text-center bg-white/50">
              <BookOpen className="h-8 w-8 text-[#8a8a7a] mx-auto mb-2" />
              <p className="text-base font-bold text-[#4a4a3a]">
                No saved journal reflections yet.
              </p>
              <p className="text-xs italic text-[#7a7a6a] mt-1">
                Open the AI Mindful Journal tab to brainstorm, deconstruct worries, or reflect on your day.
              </p>
            </div>
          ) : (
            journals.map((j) => {
              const dateStr = new Date(j.createdAt).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={j.id}
                  className="rounded-3xl border border-[#e0e0d5] bg-white p-5 shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#4a4a3a]">
                      {j.title}
                    </span>
                    <span className="text-[11px] text-[#7a7a6a] font-sans">{dateStr}</span>
                  </div>
                  <p className="text-xs italic text-[#7a7a6a] line-clamp-2">
                    {j.messages[1]?.text || j.messages[0]?.text}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-[#8a8a7a] font-sans pt-1">
                    <span>{j.messages.length} messages in dialogue</span>
                    <span className="text-[#5A5A40] font-medium">Encrypted in Vault</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
