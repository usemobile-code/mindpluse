import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Wind,
  MessageSquare,
  RotateCcw,
  CheckCircle2,
  Clock,
  Lightbulb,
  ShieldAlert,
  Share2,
  Copy,
  ChevronDown,
  ChevronUp,
  Heart,
} from 'lucide-react';
import { AssessmentRecord, Language } from '../types';
import { STRESS_TIERS, MOOD_DEFINITIONS } from '../lib/scoring';
import { getTranslation } from '../lib/i18n';

interface StressResultsProps {
  record: AssessmentRecord;
  onRetake: () => void;
  onOpenChat: (score: number, dominantFactor: string) => void;
  onOpenBreathing: () => void;
  lang: Language;
  onOpenMoodCheckIn?: () => void;
}

export const StressResults: React.FC<StressResultsProps> = ({
  record,
  onRetake,
  onOpenChat,
  onOpenBreathing,
  lang,
  onOpenMoodCheckIn,
}) => {
  const [copied, setCopied] = useState(false);

  const tierInfo = STRESS_TIERS[record.tier] || STRESS_TIERS.MODERATE;
  const score = record.score; // 100 - 1000
  const normalizedGauge = Math.round(((score - 100) / 900) * 100);

  // Identify dominant stress category
  let dominantCategory = 'General Stress';
  let highestCategoryScore = 0;
  if (record.categoryScores) {
    for (const [cat, val] of Object.entries(record.categoryScores)) {
      const numVal = Number(val);
      if (numVal > highestCategoryScore) {
        highestCategoryScore = numVal;
        dominantCategory = cat;
      }
    }
  }

  const handleCopySummary = () => {
    const text = `${getTranslation('appTitle', lang)} ${getTranslation('resultHeader', lang)}:
${getTranslation('stressLevelScore', lang)}: ${score}/1000 (${tierInfo.emoji} ${tierInfo.label[lang]})
${getTranslation('status', lang)}: ${tierInfo.description[lang]}
${getTranslation('groundingTitle', lang)}: ${record.recommendations?.immediateGrounding?.title || 'Grounding breath'}
${getTranslation('affirmation', lang)}: "${record.recommendations?.affirmation || 'I am safe in this moment.'}"`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const recs = record.recommendations;
  const moodDef = record.appliedMood ? MOOD_DEFINITIONS[record.appliedMood] : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-8 font-serif">
      {/* Primary Score Hero Card */}
      <div
        id="stress-score-hero"
        className="relative overflow-hidden rounded-[40px] border border-[#e0e0d5] bg-white p-8 sm:p-12 shadow-sm transition-all text-center md:text-left"
      >
        <p className="text-[11px] uppercase tracking-[0.2em] mb-4 text-[#8a8a7a]">
          {getTranslation('resultHeader', lang)}
        </p>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left: Score & details */}
          <div className="space-y-4">
            <div className="flex items-baseline justify-center md:justify-start gap-2">
              <span className="text-6xl sm:text-7xl font-bold text-[#5A5A40] tracking-tight">
                {score}
              </span>
              <span className="text-2xl opacity-40 text-[#7a7a6a]">
                / 1000
              </span>
            </div>

            <div className="inline-flex flex-wrap items-center justify-center md:justify-start gap-2 rounded-full border border-[#5A5A40]/30 bg-[#f5f5f0] px-3.5 py-1 text-xs text-[#5A5A40] font-sans">
              <span className="text-base">{tierInfo.emoji}</span>
              <span className="font-semibold">{tierInfo.label[lang]}</span>
              <span className="opacity-40">•</span>
              <span>100 - 1000 {getTranslation('ptsAdjustment', lang)}</span>
            </div>

            {/* Daily Mood Calibration pill if applied */}
            {record.appliedMood && record.appliedMoodModifier !== undefined && (
              <div className="flex items-center gap-2 text-xs font-sans text-[#4a4a3a] bg-[#ecece4] px-3 py-1.5 rounded-lg border border-[#e0e0d5]">
                <Heart className="w-3.5 h-3.5 text-[#5A5A40]" />
                <span>
                  {getTranslation('tabDailyMood', lang)}: <strong>{moodDef ? `${moodDef.emoji} ${moodDef.label[lang]}` : record.appliedMood}</strong>
                  {' '}({record.appliedMoodModifier > 0 ? `+${record.appliedMoodModifier}` : record.appliedMoodModifier} pts {lang === 'hi' ? 'समायोजन' : 'calibration'})
                </span>
                {record.baseScore && (
                  <span className="text-[#4a4a3a]/60">
                    ({lang === 'hi' ? 'मूल स्कोर:' : 'Base:'} {record.baseScore})
                  </span>
                )}
              </div>
            )}

            <p className="max-w-md text-base text-[#7a7a6a] italic leading-relaxed">
              "{tierInfo.statusQuote[lang]}"
            </p>
          </div>

          {/* Right: Large Emoji with Natural Tones Pill */}
          <div className="flex flex-col items-center justify-center p-4">
            <div className="relative mb-2 flex h-36 w-36 sm:h-40 sm:w-40 items-center justify-center rounded-full bg-[#f5f5f0] border border-[#e0e0d5] shadow-xs">
              <span className="text-7xl sm:text-8xl select-none leading-none">
                {tierInfo.emoji}
              </span>
              <div className="absolute -bottom-2 -right-2 bg-[#5A5A40] text-white px-4 py-1 rounded-full text-xs italic shadow-xs font-serif">
                {tierInfo.label[lang]}
              </div>
            </div>
          </div>
        </div>

        {/* 100-1000 Spectrum Gauge */}
        <div className="mt-8 pt-6 border-t border-[#e0e0d5] space-y-2 font-sans">
          <div className="flex justify-between text-xs text-[#8a8a7a]">
            <span className="flex items-center gap-1">
              <span>😌 100</span>
              <span className="hidden sm:inline opacity-70">Min / Zen</span>
            </span>
            <span>🙂 250</span>
            <span>😐 450</span>
            <span>😰 650</span>
            <span className="flex items-center gap-1">
              <span>🤯 1000</span>
              <span className="hidden sm:inline opacity-70">Max / Overload</span>
            </span>
          </div>

          <div className="relative h-2.5 w-full rounded-full bg-[#ecece4] overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${tierInfo.gradient} transition-all duration-700 ease-out`}
              style={{ width: `${normalizedGauge}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#8a8a7a] pt-1">
            <span>
              {lang === 'hi'
                ? `गणना किया गया तनाव अनुपात: पैमाने का ${normalizedGauge}%`
                : `Calculated allostatic strain: ${normalizedGauge}% of max scale`}
            </span>
            <span>
              {record.syncedToCloud
                ? getTranslation('cloudStatusSynced', lang)
                : getTranslation('cloudStatusLocal', lang)}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-serif">
        <button
          id="btn-action-chat"
          onClick={() => onOpenChat(record.score, dominantCategory)}
          className="flex items-center justify-center gap-2 rounded-full border border-[#5A5A40] bg-white p-3.5 text-xs font-semibold text-[#5A5A40] shadow-2xs hover:bg-[#5A5A40] hover:text-white transition-all"
        >
          <MessageSquare className="h-4 w-4" />
          <span>{lang === 'hi' ? 'एआई डायरी में विचार साझा करें' : 'Reflect with AI Journal'}</span>
          <ArrowRight className="h-3.5 w-3.5 opacity-60" />
        </button>

        <button
          id="btn-action-breathing"
          onClick={onOpenBreathing}
          className="flex items-center justify-center gap-2 rounded-full bg-[#5A5A40] p-3.5 text-xs font-semibold text-white shadow-xs hover:bg-[#484833] transition-all"
        >
          <Wind className="h-4 w-4" />
          <span>{getTranslation('breathingExercise', lang)}</span>
          <ArrowRight className="h-3.5 w-3.5 opacity-60" />
        </button>

        <button
          id="btn-action-retake"
          onClick={onRetake}
          className="flex items-center justify-center gap-2 rounded-full border border-[#d8d8cc] bg-white p-3.5 text-xs font-semibold text-[#7a7a6a] shadow-2xs hover:text-[#4a4a3a] hover:border-[#5A5A40] transition-all"
        >
          <RotateCcw className="h-4 w-4 opacity-70" />
          <span>{getTranslation('retakeAssessment', lang)}</span>
        </button>
      </div>

      {/* Category Breakdown */}
      {record.categoryScores && (
        <div className="rounded-[40px] border border-[#e0e0d5] bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#8a8a7a]">
                {lang === 'hi' ? 'घटक विश्लेषण' : 'Factor Analysis'}
              </p>
              <h3 className="text-lg font-bold text-[#4a4a3a] tracking-tight">
                {lang === 'hi' ? 'तनाव कारक (पैमाना 100 - 1000)' : 'Stress Drivers (Scale 100 - 1000)'}
              </h3>
            </div>
            <span className="text-xs text-[#7a7a6a] italic">
              {lang === 'hi' ? 'प्राथमिक कारक:' : 'Primary strain:'}{' '}
              <strong className="text-[#5A5A40] not-italic uppercase font-sans font-bold">
                {dominantCategory}
              </strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(record.categoryScores).map(([catKey, catScore]) => {
              const numScore = Number(catScore);
              const catGauge = Math.round(((numScore - 100) / 900) * 100);
              const labelMap: Record<string, { en: string; hi: string }> = {
                sleep: { en: 'Sleep & Physical Vitality', hi: 'नींद एवं शारीरिक ऊर्जा' },
                cognitive: { en: 'Cognitive Load & Focus', hi: 'मानसिक भार और एकाग्रता' },
                emotional: { en: 'Emotional Reactivity', hi: 'भावनात्मक प्रतिक्रियाशीलता' },
                somatic: { en: 'Physical Somatic Tension', hi: 'शारीरिक तनाव व जकड़न' },
                control: { en: 'Coping Capacity & Control', hi: 'सामना करने की क्षमता व नियंत्रण' },
              };

              const catName = labelMap[catKey] ? labelMap[catKey][lang] : catKey;

              return (
                <div
                  key={catKey}
                  className="rounded-2xl border border-[#e0e0d5] bg-[#f5f5f0]/60 p-4"
                >
                  <div className="flex items-center justify-between text-xs font-medium text-[#4a4a3a] mb-2 font-sans">
                    <span>{catName}</span>
                    <span className="font-mono font-bold text-[#5A5A40]">
                      {numScore} / 1000
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#e0e0d5] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        numScore > 650
                          ? 'bg-rose-600'
                          : numScore > 450
                          ? 'bg-amber-600'
                          : 'bg-[#5A5A40]'
                      }`}
                      style={{ width: `${catGauge}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Personalized Wellness Recommendations */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#8a8a7a]">
              {lang === 'hi' ? 'विशेष परामर्श' : 'Tailored Guidance'}
            </p>
            <h3 className="text-2xl font-bold text-[#4a4a3a]">
              {getTranslation('recommendationsTitle', lang)}
            </h3>
          </div>
          <button
            id="btn-copy-summary"
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 rounded-full border border-[#d8d8cc] bg-white px-4 py-2 text-xs font-medium text-[#4a4a3a] shadow-2xs hover:bg-[#ecece4] transition font-sans"
          >
            {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-[#5A5A40]" /> : <Copy className="h-3.5 w-3.5 text-[#7a7a6a]" />}
            <span>{copied ? (lang === 'hi' ? 'कॉपी हो गया' : 'Copied to Clipboard') : (lang === 'hi' ? 'साझा / कॉपी करें' : 'Share / Copy')}</span>
          </button>
        </div>

        {/* Gemini AI Insight Card (Signature Card from Natural Tones Theme) */}
        {recs?.summary && (
          <div className="bg-[#5A5A40] text-[#f5f5f0] rounded-[40px] p-8 sm:p-10 shadow-sm border border-[#484833]">
            <div className="flex items-center gap-2 mb-4 font-sans">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <p className="text-[10px] uppercase tracking-widest opacity-80">
                {lang === 'hi' ? 'जेमिनी एआई क्लिनिकल इनसाइट' : 'Gemini AI Clinical Insight'}
              </p>
            </div>
            <p className="text-xl sm:text-2xl italic leading-relaxed text-[#f5f5f0]">
              "{recs.summary}"
            </p>
            {recs?.affirmation && (
              <div className="mt-6 pt-6 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm italic opacity-90">
                  <span>🌱 {getTranslation('affirmation', lang)}:</span>
                  <span>"{recs.affirmation}"</span>
                </div>
                <div className="flex gap-3 shrink-0 font-sans">
                  <button
                    onClick={() => onOpenChat(record.score, dominantCategory)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs text-white transition-colors"
                  >
                    {lang === 'hi' ? 'एआई से चर्चा करें' : 'Brainstorm with AI'}
                  </button>
                  <button
                    onClick={handleCopySummary}
                    className="px-4 py-2 bg-white text-[#5A5A40] rounded-full text-xs font-bold hover:bg-[#f5f5f0] transition shadow-xs"
                  >
                    {lang === 'hi' ? 'सुरक्षित करें' : 'Save to Log'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section 1: Immediate Grounding Protocol */}
        {recs?.immediateGrounding && (
          <div className="rounded-[32px] border border-[#e0e0d5] bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[#e0e0d5]">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ecece4] text-[#5A5A40] text-xs font-bold">
                  1
                </span>
                <h4 className="font-bold text-lg text-[#4a4a3a]">
                  {getTranslation('groundingTitle', lang)}: {recs.immediateGrounding.title}
                </h4>
              </div>
              <span className="flex items-center gap-1 text-xs text-[#7a7a6a] italic">
                <Clock className="h-3.5 w-3.5" />
                {recs.immediateGrounding.duration}
              </span>
            </div>

            <ol className="mt-5 space-y-3">
              {recs.immediateGrounding.steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3.5 text-sm text-[#4a4a3a]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f5f5f0] text-[#5A5A40] text-xs font-bold border border-[#e0e0d5] mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Section 2: Daily Micro-Habits (with Natural Tones icon tiles) */}
        {recs?.dailyMicroHabits && recs.dailyMicroHabits.length > 0 && (
          <div className="rounded-[32px] border border-[#e0e0d5] bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[#e0e0d5]">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ecece4] text-[#5A5A40] text-xs font-bold">
                  2
                </span>
                <h4 className="font-bold text-lg text-[#4a4a3a]">
                  {getTranslation('habitsTitle', lang)}
                </h4>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-[#8a8a7a]">
                {lang === 'hi' ? 'दैनिक लय' : 'Natural Rhythm'}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              {recs.dailyMicroHabits.map((habit, idx) => {
                const habitIcons = ['🌲', '🫖', '🧘', '🚶', '📖'];
                const icon = habitIcons[idx % habitIcons.length];

                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-[#e0e0d5] bg-[#f5f5f0]/60 p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-white border border-[#e0e0d5] flex items-center justify-center text-base">
                        {icon}
                      </div>
                      <span className="rounded-full bg-white border border-[#d8d8cc] px-2.5 py-0.5 text-[10px] font-bold uppercase text-[#5A5A40] font-sans">
                        {habit.timeOfDay}
                      </span>
                    </div>
                    <h5 className="font-bold text-sm text-[#4a4a3a]">
                      {habit.title}
                    </h5>
                    <p className="text-xs text-[#7a7a6a] leading-relaxed">
                      {habit.description}
                    </p>
                    <p className="text-[11px] text-[#5A5A40] italic pt-1 border-t border-[#e0e0d5]">
                      {lang === 'hi' ? 'लाभ:' : 'Benefit:'} {habit.benefit}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 3: Cognitive Reframes */}
        {recs?.cognitiveReframes && recs.cognitiveReframes.length > 0 && (
          <div className="rounded-[32px] border border-[#e0e0d5] bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 pb-4 border-b border-[#e0e0d5]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ecece4] text-[#5A5A40] text-xs font-bold">
                3
              </span>
              <h4 className="font-bold text-lg text-[#4a4a3a]">
                {getTranslation('reframingTitle', lang)}
              </h4>
            </div>

            <div className="mt-5 space-y-3 font-serif">
              {recs.cognitiveReframes.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl border border-[#e0e0d5] bg-[#f5f5f0]/40 p-4"
                >
                  <div className="rounded-xl bg-white p-3.5 border border-rose-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block mb-1 font-sans">
                      {lang === 'hi' ? 'तनावपूर्ण विचार' : 'Distorted Stress Thought'}
                    </span>
                    <p className="text-xs text-[#4a4a3a] italic">
                      "{item.stressThought}"
                    </p>
                  </div>
                  <div className="rounded-xl bg-white p-3.5 border border-[#5A5A40]/40">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A40] block mb-1 font-sans">
                      {lang === 'hi' ? 'सहानुभूतिपूर्ण सकारात्मक दृष्टिकोण' : 'Empowering Natural Reframe'}
                    </span>
                    <p className="text-xs text-[#4a4a3a] italic font-medium">
                      "{item.empoweringReframe}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Restorative Plan */}
        {recs?.restorativePlan && (
          <div className="rounded-[32px] border border-[#e0e0d5] bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 pb-4 border-b border-[#e0e0d5]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ecece4] text-[#5A5A40] text-xs font-bold">
                4
              </span>
              <h4 className="font-bold text-lg text-[#4a4a3a]">
                {getTranslation('recoveryTitle', lang)}
              </h4>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="rounded-2xl border border-[#e0e0d5] bg-[#f5f5f0]/60 p-4">
                <span className="font-bold text-sm text-[#4a4a3a] block mb-2">
                  🌙 {lang === 'hi' ? 'निद्रा शांति' : 'Sleep Sanctuary'}
                </span>
                <p className="text-[#7a7a6a] leading-relaxed">
                  {recs.restorativePlan.sleepAdvice}
                </p>
              </div>

              <div className="rounded-2xl border border-[#e0e0d5] bg-[#f5f5f0]/60 p-4">
                <span className="font-bold text-sm text-[#4a4a3a] block mb-2">
                  🧘 {lang === 'hi' ? 'तंत्रिका तंत्र संतुलन' : 'Somatic Equilibrium'}
                </span>
                <p className="text-[#7a7a6a] leading-relaxed">
                  {recs.restorativePlan.nervousSystemReset}
                </p>
              </div>

              <div className="rounded-2xl border border-[#e0e0d5] bg-[#f5f5f0]/60 p-4">
                <span className="font-bold text-sm text-[#4a4a3a] block mb-2">
                  🛡️ {lang === 'hi' ? 'सकारात्मक सीमाएं' : 'Gentle Boundaries'}
                </span>
                <p className="text-[#7a7a6a] leading-relaxed">
                  {recs.restorativePlan.boundaryTip}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Safety & Medical Disclaimer */}
      <div className="rounded-2xl border border-[#e0e0d5] bg-[#ecece4]/60 p-4 text-xs text-[#7a7a6a] flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-[#8a8a7a] shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-[#4a4a3a]">
            {getTranslation('disclaimerTitle', lang)}:
          </p>
          <p className="mt-0.5 leading-relaxed">
            {getTranslation('disclaimerText', lang)}
          </p>
        </div>
      </div>
    </div>
  );
};
