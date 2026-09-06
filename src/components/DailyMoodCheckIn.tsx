import React, { useState } from 'react';
import { DailyMoodRecord, Language, MoodType } from '../types';
import { MOOD_DEFINITIONS, MoodDefinition } from '../lib/scoring';
import { getTranslation } from '../lib/i18n';
import { Heart, Sparkles, CheckCircle2, MessageSquare, Clock, Cloud, HardDrive } from 'lucide-react';

interface DailyMoodCheckInProps {
  currentMood?: DailyMoodRecord | null;
  onSaveMood: (mood: MoodType, note?: string) => Promise<void> | void;
  lang: Language;
  recentMoods?: DailyMoodRecord[];
  isSaving?: boolean;
  baseStressScore?: number;
}

export const DailyMoodCheckIn: React.FC<DailyMoodCheckInProps> = ({
  currentMood,
  onSaveMood,
  lang,
  recentMoods = [],
  isSaving = false,
  baseStressScore,
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodType>(currentMood?.mood || 'calm');
  const [note, setNote] = useState<string>(currentMood?.note || '');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const moodList: MoodType[] = [
    'calm',
    'happy',
    'grateful',
    'energetic',
    'tired',
    'sad',
    'anxious',
    'overwhelmed',
  ];

  const handleSelect = (mood: MoodType) => {
    setSelectedMood(mood);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveMood(selectedMood, note.trim() || undefined);
    setFeedbackMessage(getTranslation('moodLoggedSuccess', lang));
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 4000);
  };

  const activeDef: MoodDefinition = MOOD_DEFINITIONS[selectedMood];
  const activeModifier = activeDef.stressModifier;

  // Calculate preview of score calibration
  const baseScoreVal = baseStressScore ?? 500;
  const calibratedPreview = Math.min(1000, Math.max(100, Math.round(baseScoreVal + activeModifier)));

  return (
    <div id="daily-mood-container" className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="bg-[#ecece4] border border-[#e0e0d5] rounded-xl p-6 sm:p-8 text-[#4a4a3a]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e0e0d5]/80 pb-6 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5f5f0] border border-[#e0e0d5] text-xs font-sans font-medium text-[#5A5A40] mb-2">
              <Heart className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>{lang === 'hi' ? 'दैनिक भावनात्मक पल्स' : 'Daily Emotional Pulse'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#4a4a3a]">
              {getTranslation('dailyMoodTitle', lang)}
            </h2>
            <p className="text-sm font-sans text-[#4a4a3a]/80 mt-1 max-w-2xl leading-relaxed">
              {getTranslation('dailyMoodSubtitle', lang)}
            </p>
          </div>

          {currentMood && (
            <div className="flex items-center gap-3 bg-[#f5f5f0] border border-[#e0e0d5] px-4 py-3 rounded-lg self-start sm:self-auto">
              <span className="text-2xl">{currentMood.emoji}</span>
              <div>
                <p className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#5A5A40]">
                  {getTranslation('todayMoodRecorded', lang)}
                </p>
                <p className="text-sm font-serif font-medium text-[#4a4a3a]">
                  {MOOD_DEFINITIONS[currentMood.mood]?.label[lang] || currentMood.label}
                  <span className="ml-1.5 text-xs font-sans text-[#5A5A40]">
                    ({currentMood.stressModifier > 0 ? `+${currentMood.stressModifier}` : currentMood.stressModifier} {getTranslation('ptsAdjustment', lang)})
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-serif text-[#4a4a3a] mb-3">
              {getTranslation('selectMoodPrompt', lang)}
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {moodList.map((m) => {
                const def = MOOD_DEFINITIONS[m];
                const isSelected = selectedMood === m;
                const mod = def.stressModifier;

                return (
                  <button
                    key={m}
                    type="button"
                    id={`mood-btn-${m}`}
                    onClick={() => handleSelect(m)}
                    className={`relative flex flex-col items-center text-center p-3.5 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-[#f5f5f0] border-[#5A5A40] shadow-sm ring-1 ring-[#5A5A40]'
                        : 'bg-[#f5f5f0]/60 border-[#e0e0d5] hover:bg-[#f5f5f0] hover:border-[#5A5A40]/50'
                    }`}
                  >
                    <span className="text-3xl mb-1.5 transform transition-transform hover:scale-110">
                      {def.emoji}
                    </span>
                    <span className="text-sm font-serif font-medium text-[#4a4a3a]">
                      {def.label[lang]}
                    </span>
                    <span className="text-[11px] font-sans text-[#4a4a3a]/70 line-clamp-1 mt-0.5">
                      {def.description[lang]}
                    </span>

                    <span
                      className={`mt-2 text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full ${
                        mod < 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : mod > 50
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {mod > 0 ? `+${mod}` : mod} {getTranslation('ptsAdjustment', lang)}
                    </span>

                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="w-4 h-4 text-[#5A5A40]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Score Impact Preview */}
          <div className="bg-[#f5f5f0] border border-[#e0e0d5] p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{activeDef.emoji}</span>
              <div>
                <p className="text-xs font-sans font-medium text-[#5A5A40] uppercase tracking-wider">
                  {getTranslation('stressAdjustmentEffect', lang)}
                </p>
                <p className="text-sm font-serif text-[#4a4a3a]">
                  {activeModifier < 0
                    ? getTranslation('calmingEffect', lang)
                    : activeModifier > 50
                    ? getTranslation('elevatingEffect', lang)
                    : getTranslation('neutralEffect', lang)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto bg-[#ecece4] px-3 py-1.5 rounded-md border border-[#e0e0d5]">
              <span className="text-xs font-sans text-[#4a4a3a]/80">
                {lang === 'hi' ? 'स्कोर प्रभाव:' : 'Score Impact:'}
              </span>
              <span
                className={`text-sm font-serif font-semibold ${
                  activeModifier < 0 ? 'text-emerald-700' : 'text-amber-800'
                }`}
              >
                {activeModifier > 0 ? `+${activeModifier}` : activeModifier} {getTranslation('ptsAdjustment', lang)}
              </span>
              <span className="text-xs font-sans text-[#4a4a3a]/60">
                ({calibratedPreview} / 1000)
              </span>
            </div>
          </div>

          {/* Optional Note Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="mood-note-input" className="text-xs font-sans font-medium text-[#4a4a3a] flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#5A5A40]" />
                <span>{getTranslation('moodOptionalNote', lang)}</span>
              </label>
              <span className="text-[11px] font-sans text-[#4a4a3a]/60">
                {note.length} / 180
              </span>
            </div>

            <textarea
              id="mood-note-input"
              rows={2}
              maxLength={180}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={getTranslation('moodNotePlaceholder', lang)}
              className="w-full bg-[#f5f5f0] border border-[#e0e0d5] rounded-lg p-3 text-sm font-sans text-[#4a4a3a] placeholder-[#4a4a3a]/40 focus:outline-none focus:border-[#5A5A40] transition-colors resize-none"
            />
          </div>

          {/* Submit and Feedback */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              type="submit"
              id="submit-daily-mood-btn"
              disabled={isSaving}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#5A5A40] text-[#f5f5f0] rounded-lg font-sans text-sm font-medium hover:bg-[#4a4a34] transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-[#e0e0d5]" />
              <span>
                {currentMood
                  ? getTranslation('btnUpdateMood', lang)
                  : getTranslation('btnSaveMood', lang)}
              </span>
            </button>

            {feedbackMessage && (
              <p className="text-xs font-sans font-medium text-[#5A5A40] flex items-center gap-1.5 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-[#5A5A40]" />
                <span>{feedbackMessage}</span>
              </p>
            )}
          </div>
        </form>
      </div>

      {/* Recent Mood History */}
      {recentMoods.length > 0 && (
        <div className="bg-[#ecece4] border border-[#e0e0d5] rounded-xl p-6 text-[#4a4a3a]">
          <div className="flex items-center justify-between mb-4 border-b border-[#e0e0d5]/80 pb-3">
            <h3 className="text-lg font-serif font-normal text-[#4a4a3a] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#5A5A40]" />
              <span>{getTranslation('recentMoods', lang)}</span>
            </h3>
            <span className="text-xs font-sans text-[#4a4a3a]/60">
              {recentMoods.length} {lang === 'hi' ? 'प्रविष्टियाँ' : 'entries logged'}
            </span>
          </div>

          <div className="space-y-3">
            {recentMoods.slice(0, 5).map((entry) => {
              const def = MOOD_DEFINITIONS[entry.mood];
              const dateFormatted = new Date(entry.createdAt).toLocaleDateString(
                lang === 'hi' ? 'hi-IN' : 'en-US',
                {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }
              );

              return (
                <div
                  key={entry.id}
                  className="bg-[#f5f5f0] border border-[#e0e0d5] rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="text-2xl">{entry.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-serif font-medium text-[#4a4a3a]">
                          {def?.label[lang] || entry.label}
                        </span>
                        <span
                          className={`text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full ${
                            entry.stressModifier < 0
                              ? 'bg-emerald-100 text-emerald-800'
                              : entry.stressModifier > 50
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {entry.stressModifier > 0 ? `+${entry.stressModifier}` : entry.stressModifier}{' '}
                          {getTranslation('ptsAdjustment', lang)}
                        </span>
                      </div>
                      {entry.note && (
                        <p className="text-xs font-sans text-[#4a4a3a]/80 mt-1 italic">
                          "{entry.note}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto text-xs font-sans text-[#4a4a3a]/60">
                    <span>{dateFormatted}</span>
                    {entry.syncedToCloud ? (
                      <span className="flex items-center gap-1 text-[#5A5A40]">
                        <Cloud className="w-3.5 h-3.5" />
                        <span className="text-[10px]">{getTranslation('cloudStatusSynced', lang)}</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[#4a4a3a]/60">
                        <HardDrive className="w-3.5 h-3.5" />
                        <span className="text-[10px]">{getTranslation('cloudStatusLocal', lang)}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
