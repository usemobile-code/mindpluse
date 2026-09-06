import React, { useState, useEffect } from 'react';
import { Wind, Play, Pause, RotateCcw, CheckCircle2 } from 'lucide-react';

type BreathingPattern = 'box' | 'relax' | 'sigh';

interface PatternConfig {
  name: string;
  description: string;
  stages: { label: string; duration: number }[];
}

const PATTERNS: Record<BreathingPattern, PatternConfig> = {
  box: {
    name: 'Box Breathing (4-4-4-4)',
    description: 'Used by high-stress professionals and first-responders to reset adrenaline and steady focus.',
    stages: [
      { label: 'Inhale gently through nose', duration: 4 },
      { label: 'Hold lungs gently full', duration: 4 },
      { label: 'Smooth exhale through mouth', duration: 4 },
      { label: 'Hold lungs empty and relaxed', duration: 4 },
    ],
  },
  relax: {
    name: '4-7-8 Relaxing Breath',
    description: 'Dr. Andrew Weil’s parasympathetic tranquilizer to lower heart rate and reduce acute anxiety.',
    stages: [
      { label: 'Inhale quietly through nose', duration: 4 },
      { label: 'Hold breath with ease', duration: 7 },
      { label: 'Whoosh exhale through mouth', duration: 8 },
    ],
  },
  sigh: {
    name: 'Physiological Sigh',
    description: 'Stanford neurobiology fastest known somatic down-regulator: double inhale followed by long sigh.',
    stages: [
      { label: 'Deep inhale through nose', duration: 3 },
      { label: 'Quick top-off sniff inhale', duration: 1.5 },
      { label: 'Extended releasing sigh', duration: 6 },
    ],
  },
};

export const BreathingExercise: React.FC = () => {
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>('box');
  const [isActive, setIsActive] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [timeLeftInStage, setTimeLeftInStage] = useState(PATTERNS.box.stages[0].duration);
  const [completedCycles, setCompletedCycles] = useState(0);

  const pattern = PATTERNS[selectedPattern];
  const currentStage = pattern.stages[currentStageIndex];

  // Reset when pattern changes
  useEffect(() => {
    setIsActive(false);
    setCurrentStageIndex(0);
    setTimeLeftInStage(PATTERNS[selectedPattern].stages[0].duration);
    setCompletedCycles(0);
  }, [selectedPattern]);

  // Breathing loop timer
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeftInStage((prev) => {
        if (prev <= 1) {
          // Advance to next stage
          const nextIndex = (currentStageIndex + 1) % pattern.stages.length;
          if (nextIndex === 0) {
            setCompletedCycles((c) => c + 1);
          }
          setCurrentStageIndex(nextIndex);
          return pattern.stages[nextIndex].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, currentStageIndex, pattern]);

  const toggleActive = () => {
    setIsActive((prev) => !prev);
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentStageIndex(0);
    setTimeLeftInStage(pattern.stages[0].duration);
    setCompletedCycles(0);
  };

  // Determine scale for breathing ring
  const isHolding = currentStage.label.toLowerCase().includes('hold');
  const isExhaling = currentStage.label.toLowerCase().includes('exhale') || currentStage.label.toLowerCase().includes('sigh');
  const isInhaling = currentStage.label.toLowerCase().includes('inhale');

  let ringScale = 'scale-100';
  if (isActive) {
    if (isInhaling) ringScale = 'scale-125';
    if (isHolding) ringScale = 'scale-125';
    if (isExhaling) ringScale = 'scale-90';
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 font-serif">
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3.5 py-1 text-xs font-medium text-[#5A5A40] border border-[#d8d8cc] font-sans">
          <Wind className="h-3.5 w-3.5" />
          <span>Somatic Nervous System Reset</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#4a4a3a]">
          Grounding Breath Rhythm
        </h2>
        <p className="text-xs italic text-[#7a7a6a] max-w-md mx-auto">
          Synchronized breathing directly stimulates the vagus nerve, rapidly lowering sympathetic stress signals.
        </p>
      </div>

      {/* Pattern selector tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-full bg-white/70 p-1 border border-[#d8d8cc] shadow-2xs">
          <button
            onClick={() => setSelectedPattern('box')}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
              selectedPattern === 'box'
                ? 'bg-[#5A5A40] text-[#f5f5f0] shadow-xs'
                : 'text-[#7a7a6a] hover:text-[#4a4a3a]'
            }`}
          >
            Box (4-4-4-4)
          </button>
          <button
            onClick={() => setSelectedPattern('relax')}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
              selectedPattern === 'relax'
                ? 'bg-[#5A5A40] text-[#f5f5f0] shadow-xs'
                : 'text-[#7a7a6a] hover:text-[#4a4a3a]'
            }`}
          >
            4-7-8 Relax
          </button>
          <button
            onClick={() => setSelectedPattern('sigh')}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
              selectedPattern === 'sigh'
                ? 'bg-[#5A5A40] text-[#f5f5f0] shadow-xs'
                : 'text-[#7a7a6a] hover:text-[#4a4a3a]'
            }`}
          >
            Physiological Sigh
          </button>
        </div>
      </div>

      {/* Interactive Visual Breathing Canvas */}
      <div
        id="breathing-stage-card"
        className="rounded-[40px] border border-[#e0e0d5] bg-white p-8 sm:p-10 text-center shadow-sm relative overflow-hidden"
      >
        <p className="text-xs text-[#7a7a6a] italic font-medium mb-6">
          {pattern.description}
        </p>

        {/* Dynamic breathing orb */}
        <div className="relative my-10 flex items-center justify-center">
          {/* Ambient outer aura */}
          <div
            className={`absolute h-56 w-56 rounded-full bg-[#5A5A40]/15 blur-2xl transition-all duration-1000 ${
              isActive ? 'opacity-90' : 'opacity-20'
            }`}
          />

          {/* Primary animated circle */}
          <div
            className={`relative flex h-48 w-48 items-center justify-center rounded-full border-4 border-[#5A5A40]/30 bg-gradient-to-tr from-[#ecece4] to-[#f5f5f0] shadow-inner transition-transform ease-in-out ${
              pattern.stages[currentStageIndex]?.duration
                ? `duration-[${pattern.stages[currentStageIndex].duration * 1000}ms]`
                : 'duration-1000'
            } ${ringScale}`}
          >
            <div className="flex flex-col items-center">
              <span className="text-5xl font-bold text-[#5A5A40] font-serif">
                {isActive ? timeLeftInStage : pattern.stages[0].duration}
              </span>
              <span className="text-xs uppercase tracking-widest text-[#7a7a6a] font-sans font-semibold mt-1">
                {isActive ? currentStage.label.split(' ')[0] : 'Ready'}
              </span>
            </div>
          </div>
        </div>

        {/* Stage Instruction Prompt */}
        <div className="min-h-[50px] mb-6">
          <h3 className="text-xl font-bold text-[#4a4a3a] transition-all">
            {isActive ? currentStage.label : 'Press Start to begin guided breathing'}
          </h3>
          <p className="text-xs italic text-[#7a7a6a] mt-1 font-sans">
            Cycles completed: <strong className="text-[#5A5A40] not-italic font-bold">{completedCycles}</strong>
          </p>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            id="btn-toggle-breathing"
            onClick={toggleActive}
            className={`flex items-center gap-2 rounded-full px-7 py-3 text-xs font-bold text-white shadow-xs transition ${
              isActive
                ? 'bg-amber-700 hover:bg-amber-800'
                : 'bg-[#5A5A40] hover:bg-[#484833]'
            }`}
          >
            {isActive ? (
              <>
                <Pause className="h-4 w-4" />
                <span>Pause Session</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-white" />
                <span>Start Exercise</span>
              </>
            )}
          </button>

          <button
            id="btn-reset-breathing"
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-full border border-[#d8d8cc] bg-white px-5 py-3 text-xs font-medium text-[#7a7a6a] hover:text-[#4a4a3a] hover:bg-[#ecece4] transition shadow-2xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
