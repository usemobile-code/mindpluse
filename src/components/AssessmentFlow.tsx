import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, Sparkles, HelpCircle, FileText, RotateCcw, Heart } from 'lucide-react';
import { ASSESSMENT_QUESTIONS, MOOD_DEFINITIONS } from '../lib/scoring';
import { DailyMoodRecord, Language, Question } from '../types';
import { getQuestionTranslation, getTranslation } from '../lib/i18n';

interface AssessmentFlowProps {
  onComplete: (answers: Record<string, number>, userNotes: string) => void;
  isSubmitting?: boolean;
  lang: Language;
  currentMood?: DailyMoodRecord | null;
  onOpenMoodCheckIn?: () => void;
}

export const AssessmentFlow: React.FC<AssessmentFlowProps> = ({
  onComplete,
  isSubmitting = false,
  lang,
  currentMood,
  onOpenMoodCheckIn,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [userNotes, setUserNotes] = useState('');
  const [showNotesField, setShowNotesField] = useState(false);

  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const currentQ: Question = ASSESSMENT_QUESTIONS[currentIndex];
  const qTranslation = getQuestionTranslation(currentQ.id, lang);

  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const answeredCount = Object.keys(answers).length;
  const isAllAnswered = answeredCount === totalQuestions;

  const handleSelectOption = (points: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: points,
    }));

    // Auto-advance if not on the last question
    if (currentIndex < totalQuestions - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => Math.min(prev + 1, totalQuestions - 1));
      }, 180);
    }
  };

  const handleFinish = () => {
    if (!isAllAnswered) return;
    onComplete(answers, userNotes);
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentIndex(0);
    setUserNotes('');
  };

  const moodDef = currentMood ? MOOD_DEFINITIONS[currentMood.mood] : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 font-serif">
      {/* Daily Mood Calibration Banner */}
      {currentMood ? (
        <div className="mb-6 rounded-2xl bg-[#ecece4] border border-[#e0e0d5] p-3.5 flex items-center justify-between text-xs font-sans text-[#4a4a3a]">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">{currentMood.emoji}</span>
            <div>
              <span className="font-semibold text-[#5A5A40]">
                {getTranslation('tabDailyMood', lang)}: {moodDef?.label[lang] || currentMood.label}
              </span>
              <p className="text-[11px] text-[#4a4a3a]/70">
                {currentMood.stressModifier < 0
                  ? getTranslation('calmingEffect', lang)
                  : currentMood.stressModifier > 50
                  ? getTranslation('elevatingEffect', lang)
                  : getTranslation('neutralEffect', lang)}
                {' '}({currentMood.stressModifier > 0 ? `+${currentMood.stressModifier}` : currentMood.stressModifier} {getTranslation('ptsAdjustment', lang)})
              </p>
            </div>
          </div>

          {onOpenMoodCheckIn && (
            <button
              onClick={onOpenMoodCheckIn}
              className="text-[11px] text-[#5A5A40] underline hover:text-[#4a4a34] shrink-0"
            >
              {lang === 'hi' ? 'बदलें' : 'Change'}
            </button>
          )}
        </div>
      ) : (
        onOpenMoodCheckIn && (
          <div className="mb-6 rounded-2xl bg-[#ecece4]/60 border border-[#e0e0d5] p-3 flex items-center justify-between text-xs font-sans text-[#4a4a3a]">
            <div className="flex items-center gap-2">
              <Heart className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>{getTranslation('dailyMoodSubtitle', lang)}</span>
            </div>
            <button
              onClick={onOpenMoodCheckIn}
              className="text-[11px] font-medium text-[#5A5A40] underline shrink-0"
            >
              {getTranslation('tabDailyMood', lang)} →
            </button>
          </div>
        )
      )}

      {/* Progress Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-medium text-[#7a7a6a] font-sans">
          <span className="flex items-center gap-2">
            <span className="rounded-full border border-[#d8d8cc] bg-[#ecece4] px-3 py-0.5 font-bold text-[#5A5A40]">
              {getTranslation('questionCounter', lang)} {currentIndex + 1} / {totalQuestions}
            </span>
            <span className="text-[#8a8a7a]">•</span>
            <span>{qTranslation?.categoryLabel || currentQ.categoryLabel}</span>
          </span>
          <span className="italic">{progressPercent}% {getTranslation('completeStatus', lang)}</span>
        </div>
        <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-[#e0e0d5]">
          <div
            className="h-full bg-[#5A5A40] transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div
        id="question-card"
        className="rounded-[40px] border border-[#e0e0d5] bg-white p-8 sm:p-10 shadow-sm"
      >
        <div className="mb-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#8a8a7a] font-sans font-medium">
            {qTranslation?.categoryLabel || currentQ.category}
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[#4a4a3a]">
            {qTranslation?.text || currentQ.text}
          </h2>
          {(qTranslation?.subtext || currentQ.subtext) && (
            <p className="mt-2 text-sm italic text-[#7a7a6a]">
              {qTranslation?.subtext || currentQ.subtext}
            </p>
          )}
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            const isSelected = answers[currentQ.id] === option.points;
            const optionTranslation = qTranslation?.options?.[idx];
            const optLabel = optionTranslation?.label || option.label;
            const optHint = optionTranslation?.hint || option.hint;

            return (
              <button
                key={idx}
                id={`option-${currentQ.id}-${option.points}`}
                onClick={() => handleSelectOption(option.points)}
                className={`group flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? 'border-[#5A5A40] bg-[#f5f5f0] text-[#4a4a3a] ring-1 ring-[#5A5A40]'
                    : 'border-[#e0e0d5] bg-[#f5f5f0]/40 text-[#4a4a3a] hover:border-[#5A5A40]/60 hover:bg-[#f5f5f0]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold font-sans transition ${
                      isSelected
                        ? 'border-[#5A5A40] bg-[#5A5A40] text-white'
                        : 'border-[#d8d8cc] bg-white text-[#7a7a6a] group-hover:border-[#5A5A40]'
                    }`}
                  >
                    {isSelected ? <Check className="h-3.5 w-3.5 stroke-[2.5]" /> : String.fromCharCode(65 + idx)}
                  </div>
                  <div>
                    <span className="text-base font-medium">{optLabel}</span>
                    {optHint && (
                      <p className="text-xs italic text-[#7a7a6a]">{optHint}</p>
                    )}
                  </div>
                </div>
                <div className="text-xs font-sans text-[#8a8a7a]">
                  {option.points === 0
                    ? (lang === 'hi' ? 'न्यूनतम तनाव' : 'Min Stress')
                    : option.points === 4
                    ? (lang === 'hi' ? 'उच्चतम तनाव' : 'Max Stress')
                    : ''}
                </div>
              </button>
            );
          })}
        </div>

        {/* Optional Context Field */}
        <div className="mt-8 border-t border-[#e0e0d5] pt-5">
          {!showNotesField ? (
            <button
              id="btn-toggle-notes"
              onClick={() => setShowNotesField(true)}
              className="flex items-center gap-1.5 text-xs text-[#7a7a6a] hover:text-[#4a4a3a] transition font-sans"
            >
              <FileText className="h-3.5 w-3.5 text-[#5A5A40]" />
              <span>{lang === 'hi' ? 'व्यक्तिगत संदर्भ जोड़ें (वैकल्पिक)' : 'Add personal notes / context (optional)'}</span>
            </button>
          ) : (
            <div className="space-y-2 font-sans">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="user-assessment-notes"
                  className="text-xs font-medium text-[#4a4a3a]"
                >
                  {lang === 'hi' ? 'एआई विश्लेषण के लिए व्यक्तिगत संदर्भ:' : 'Personal context for AI analysis:'}
                </label>
                <button
                  onClick={() => setShowNotesField(false)}
                  className="text-[11px] text-[#7a7a6a] hover:underline"
                >
                  {lang === 'hi' ? 'छिपाएं' : 'Hide'}
                </button>
              </div>
              <textarea
                id="user-assessment-notes"
                rows={2}
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder={lang === 'hi' ? 'उदा. परीक्षा की तैयारी, पिछले 3 दिनों से अनिद्रा, कार्यस्थल पर तनाव...' : 'e.g. Preparing for exams, had poor sleep for 3 nights, work team conflict...'}
                className="w-full rounded-2xl border border-[#d8d8cc] bg-[#f5f5f0] p-3 text-xs text-[#4a4a3a] placeholder-[#8a8a7a] focus:border-[#5A5A40] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
              />
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-[#e0e0d5]">
          <button
            id="btn-prev-question"
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className={`flex items-center gap-1.5 rounded-full border border-[#d8d8cc] px-4 py-2 text-xs font-medium transition ${
              currentIndex === 0
                ? 'cursor-not-allowed opacity-40 text-[#8a8a7a]'
                : 'text-[#7a7a6a] hover:text-[#4a4a3a] hover:bg-[#f5f5f0]'
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            {getTranslation('prevQuestion', lang)}
          </button>

          {currentIndex < totalQuestions - 1 ? (
            <button
              id="btn-next-question"
              onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
              disabled={answers[currentQ.id] === undefined}
              className={`flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-semibold shadow-xs transition ${
                answers[currentQ.id] === undefined
                  ? 'cursor-not-allowed bg-[#d8d8cc] text-white'
                  : 'bg-[#5A5A40] text-white hover:bg-[#484833]'
              }`}
            >
              {getTranslation('nextQuestion', lang)}
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              id="btn-calculate-stress"
              onClick={handleFinish}
              disabled={!isAllAnswered || isSubmitting}
              className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold text-white shadow-xs transition ${
                !isAllAnswered || isSubmitting
                  ? 'cursor-not-allowed bg-[#d8d8cc]'
                  : 'bg-[#5A5A40] hover:bg-[#484833]'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              {isSubmitting
                ? (lang === 'hi' ? 'तनाव का विश्लेषण हो रहा है...' : 'Analyzing Stress...')
                : getTranslation('calculateScoreBtn', lang)}
            </button>
          )}
        </div>
      </div>

      {/* Progress Dots Navigation */}
      <div className="mt-6 flex items-center justify-center gap-1.5">
        {ASSESSMENT_QUESTIONS.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = answers[q.id] !== undefined;

          return (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                isCurrent
                  ? 'w-6 bg-[#5A5A40]'
                  : isAnswered
                  ? 'w-2 bg-[#7a7a50]'
                  : 'w-2 bg-[#d8d8cc]'
              }`}
              title={`Go to Question ${idx + 1}`}
            />
          );
        })}
      </div>

      {answeredCount > 0 && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-[11px] text-[#7a7a6a] hover:text-[#4a4a3a]"
          >
            <RotateCcw className="h-3 w-3" />
            {getTranslation('resetAnswers', lang)}
          </button>
        </div>
      )}
    </div>
  );
};

