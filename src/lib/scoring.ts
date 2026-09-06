import { DailyMoodRecord, Language, MoodType, Question, StressTier, StressTierInfo, WellnessRecommendation } from '../types';

export interface MoodDefinition {
  mood: MoodType;
  emoji: string;
  label: { en: string; hi: string };
  description: { en: string; hi: string };
  stressModifier: number; // impact on 100-1000 scale
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

export const MOOD_DEFINITIONS: Record<MoodType, MoodDefinition> = {
  calm: {
    mood: 'calm',
    emoji: '🧘',
    label: { en: 'Calm', hi: 'शांत' },
    description: { en: 'Tranquil & centered nervous system', hi: 'शांत एवं स्थिर तंत्रिका तंत्र' },
    stressModifier: -65,
    colorClass: 'text-[#5A5A40]',
    bgClass: 'bg-[#ecece4]',
    borderClass: 'border-[#5A5A40]',
  },
  happy: {
    mood: 'happy',
    emoji: '😊',
    label: { en: 'Happy', hi: 'प्रसन्न' },
    description: { en: 'Positive vitality & emotional balance', hi: 'सकारात्मक ऊर्जा एवं भावनात्मक संतुलन' },
    stressModifier: -50,
    colorClass: 'text-emerald-800',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-300',
  },
  grateful: {
    mood: 'grateful',
    emoji: '🙏',
    label: { en: 'Grateful', hi: 'आभारी' },
    description: { en: 'Appreciative & grounded perspective', hi: 'सकारात्मक दृष्टिकोण एवं कृतज्ञता' },
    stressModifier: -40,
    colorClass: 'text-amber-800',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-300',
  },
  energetic: {
    mood: 'energetic',
    emoji: '⚡',
    label: { en: 'Energetic', hi: 'ऊर्जावान' },
    description: { en: 'Motivated & driven to take action', hi: 'प्रेरित एवं कार्य के लिए तत्पर' },
    stressModifier: -25,
    colorClass: 'text-blue-800',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-300',
  },
  tired: {
    mood: 'tired',
    emoji: '😴',
    label: { en: 'Tired', hi: 'थका हुआ' },
    description: { en: 'Low physical stamina, needing recovery', hi: 'कम शारीरिक ऊर्जा, विश्राम की आवश्यकता' },
    stressModifier: 35,
    colorClass: 'text-stone-700',
    bgClass: 'bg-stone-100',
    borderClass: 'border-stone-300',
  },
  sad: {
    mood: 'sad',
    emoji: '😔',
    label: { en: 'Sad', hi: 'उदास' },
    description: { en: 'Low mood, heavy heart, craving comfort', hi: 'उदास मन, भावनात्मक बोझ' },
    stressModifier: 50,
    colorClass: 'text-indigo-800',
    bgClass: 'bg-indigo-50',
    borderClass: 'border-indigo-300',
  },
  anxious: {
    mood: 'anxious',
    emoji: '😰',
    label: { en: 'Anxious', hi: 'चिंतित' },
    description: { en: 'Restless tension, anticipation & worry', hi: 'आंतरिक बेचैनी, अनजाना डर' },
    stressModifier: 75,
    colorClass: 'text-orange-800',
    bgClass: 'bg-orange-50',
    borderClass: 'border-orange-300',
  },
  overwhelmed: {
    mood: 'overwhelmed',
    emoji: '🤯',
    label: { en: 'Overwhelmed', hi: 'व्यग्र' },
    description: { en: 'System overload, too many open loops', hi: 'मानसिक अधिभार, असहजता' },
    stressModifier: 95,
    colorClass: 'text-rose-800',
    bgClass: 'bg-rose-50',
    borderClass: 'border-rose-300',
  },
};

export const STRESS_TIERS: Record<StressTier, StressTierInfo> = {
  ZEN: {
    tier: 'ZEN',
    label: 'Zen Serenity',
    emoji: '😌',
    minScore: 100,
    maxScore: 250,
    colorClass: 'text-[#5A5A40]',
    bgClass: 'bg-[#ecece4]',
    borderClass: 'border-[#d8d8cc]',
    gradient: 'from-[#5A5A40] to-[#7a7a50]',
    description: 'Optimal nervous system balance, high parasympathetic tone, and calm mental clarity.',
    statusQuote: 'Your mind and body are in a harmonious, restorative state.',
  },
  BALANCED: {
    tier: 'BALANCED',
    label: 'Balanced Flow',
    emoji: '🙂',
    minScore: 251,
    maxScore: 450,
    colorClass: 'text-[#6e6e4e]',
    bgClass: 'bg-[#f0f0e8]',
    borderClass: 'border-[#d8d8cc]',
    gradient: 'from-[#6e6e4e] to-[#8a8a66]',
    description: 'Mild, adaptive daily stimulation. You have solid coping capacity with healthy resilience.',
    statusQuote: 'You are handling daily demands with poise and equilibrium.',
  },
  MODERATE: {
    tier: 'MODERATE',
    label: 'Moderate Tension',
    emoji: '😐',
    minScore: 451,
    maxScore: 650,
    colorClass: 'text-amber-800',
    bgClass: 'bg-amber-50/80',
    borderClass: 'border-amber-200',
    gradient: 'from-amber-600 to-amber-700',
    description: 'Noticeable cumulative strain. Mental fatigue, mild irritability, and somatic tension are rising.',
    statusQuote: 'Your reserves are depleting. Time for conscious decompression and micro-breaks.',
  },
  HIGH: {
    tier: 'HIGH',
    label: 'High Stress Strain',
    emoji: '😰',
    minScore: 651,
    maxScore: 850,
    colorClass: 'text-orange-800',
    bgClass: 'bg-orange-50/80',
    borderClass: 'border-orange-200',
    gradient: 'from-orange-600 to-rose-600',
    description: 'Elevated sympathetic nervous activation. Restless sleep, cognitive fog, and feeling frequently stretched thin.',
    statusQuote: 'Active distress is impacting your daily bandwidth. Intentional decompression required.',
  },
  CRITICAL: {
    tier: 'CRITICAL',
    label: 'Extreme Overload',
    emoji: '🤯',
    minScore: 851,
    maxScore: 1000,
    colorClass: 'text-rose-900',
    bgClass: 'bg-rose-50/80',
    borderClass: 'border-rose-200',
    gradient: 'from-rose-600 to-red-800',
    description: 'Severe allostatic load and nervous system exhaustion. You may feel frozen, hypervigilant, or burned out.',
    statusQuote: 'Emergency self-compassion needed. Step back from non-essential demands immediately.',
  },
};

export const ASSESSMENT_QUESTIONS: Question[] = [
  {
    id: 'q_sleep',
    category: 'sleep',
    categoryLabel: 'Sleep & Physical Vitality',
    text: 'How rested and physically energized do you feel when starting your day?',
    subtext: 'Consider your sleep continuity and morning physical fatigue over recent days.',
    options: [
      { label: 'Deeply refreshed and energized', points: 0, hint: 'Restorative sleep cycle' },
      { label: 'Generally fine, wake up easily', points: 1, hint: 'Adequate recovery' },
      { label: 'Somewhat groggy, need caffeine/time to function', points: 2, hint: 'Mild sleep fragmentation' },
      { label: 'Frequently unrefreshed and sluggish', points: 3, hint: 'Chronic sleep debt' },
      { label: 'Exhausted, restless insomnia, or dreading morning', points: 4, hint: 'Severe physical depletion' },
    ],
  },
  {
    id: 'q_racing_thoughts',
    category: 'cognitive',
    categoryLabel: 'Cognitive Load & Focus',
    text: 'How often do racing thoughts, mental clutter, or constant worries distract you?',
    subtext: 'Feeling unable to quiet mental chatter or focus on a single task.',
    options: [
      { label: 'Rarely — mind feels clear and present', points: 0, hint: 'High focus' },
      { label: 'Occasionally during busy moments', points: 1, hint: 'Manageable load' },
      { label: 'Frequently jumping between open loops', points: 2, hint: 'Moderate mental friction' },
      { label: 'Very often, mind feels like a browser with 50 tabs open', points: 3, hint: 'High cognitive overload' },
      { label: 'Non-stop mental turbulence, cannot quiet thoughts', points: 4, hint: 'Hyperactive cognitive strain' },
    ],
  },
  {
    id: 'q_emotional_reactivity',
    category: 'emotional',
    categoryLabel: 'Emotional Regulation',
    text: 'How quickly do you find yourself feeling irritable, anxious, or emotionally short-tempered?',
    subtext: 'Tolerance for minor inconveniences, sudden mood shifts, or spontaneous worry.',
    options: [
      { label: 'Patient, calm, and grounded even when delayed', points: 0, hint: 'High emotional bandwidth' },
      { label: 'Mostly patient with brief momentary sighs', points: 1, hint: 'Normal reactivity' },
      { label: 'Irritated more easily than I would like', points: 2, hint: 'Reduced emotional buffer' },
      { label: 'Frequently snapping, anxious, or feeling on edge', points: 3, hint: 'Thin emotional margin' },
      { label: 'Emotionally volatile, overwhelmed, or ready to burst/shut down', points: 4, hint: 'Depleted emotional reserves' },
    ],
  },
  {
    id: 'q_somatic_tension',
    category: 'somatic',
    categoryLabel: 'Physical & Somatic Tension',
    text: 'Do you notice physical manifestations of stress (clenched jaw, tight shoulders, shallow breathing, stomach tightness)?',
    subtext: 'The body often holds distress long before our thoughts consciously acknowledge it.',
    options: [
      { label: 'Body feels loose, comfortable, and relaxed', points: 0, hint: 'Open posture, deep breath' },
      { label: 'Occasional tightness after long desk hours', points: 1, hint: 'Ergonomic tension' },
      { label: 'Noticeable tension in neck, jaw, or upper back', points: 2, hint: 'Stress holding patterns' },
      { label: 'Persistent tightness, shallow chest breathing, or tension headaches', points: 3, hint: 'Sympathetic arousal' },
      { label: 'Constant physical aches, knots, clenched teeth, or digestive knots', points: 4, hint: 'Acute somatic distress' },
    ],
  },
  {
    id: 'q_control_overwhelm',
    category: 'control',
    categoryLabel: 'Coping Capacity & Control',
    text: 'To what degree do you feel that obligations, demands, and events are piling up beyond your control?',
    subtext: 'Sense of personal agency versus feeling swept away by circumstances.',
    options: [
      { label: 'Fully in control and confident in prioritizing', points: 0, hint: 'Strong personal agency' },
      { label: 'Generally in control with occasional tight deadlines', points: 1, hint: 'Healthy pacing' },
      { label: 'Feeling somewhat stretched and struggling to stay ahead', points: 2, hint: 'Borderline capacity' },
      { label: 'Often feeling submerged under endless to-do lists', points: 3, hint: 'High overwhelm' },
      { label: 'Completely paralyzed or submerged, powerless to cope', points: 4, hint: 'System paralysis' },
    ],
  },
  {
    id: 'q_disconnect',
    category: 'emotional',
    categoryLabel: 'Joy, Detachment & Connection',
    text: 'Can you easily unwind and enjoy quiet leisure or moments with loved ones without guilt?',
    subtext: 'Ability to switch off work/responsibilities and experience genuine joy.',
    options: [
      { label: 'Yes, fully present and enjoy deep downtime', points: 0, hint: 'Healthy boundary' },
      { label: 'Usually can disconnect with little effort', points: 1, hint: 'Good relaxation' },
      { label: 'Feel nagging guilt or check notifications while resting', points: 2, hint: 'Compulsive checking' },
      { label: 'Very difficult to relax, feeling restless when idle', points: 3, hint: 'Stress habituation' },
      { label: 'Numb, detached, or unable to feel pleasure/calm at all', points: 4, hint: 'Anhedonia / Burnout' },
    ],
  },
  {
    id: 'q_decision_fatigue',
    category: 'cognitive',
    categoryLabel: 'Decision & Mental Bandwidth',
    text: 'How difficult is it for you to make decisions (from small daily choices to key priorities)?',
    subtext: 'Decision paralysis and mental friction over simple choices.',
    options: [
      { label: 'Decisive, clear, and confident in choices', points: 0, hint: 'High mental clarity' },
      { label: 'Normal decision speed with occasional reflection', points: 1, hint: 'Clear thinking' },
      { label: 'Feeling some hesitation and second-guessing', points: 2, hint: 'Mild decision fatigue' },
      { label: 'Struggling to decide simple things like meals or replies', points: 3, hint: 'Decision paralysis' },
      { label: 'Completely frozen, exhausted by any request to decide', points: 4, hint: 'Severe cognitive exhaustion' },
    ],
  },
  {
    id: 'q_recovery_speed',
    category: 'control',
    categoryLabel: 'Resilience & Bounce-Back',
    text: 'When an unexpected disruption happens, how quickly do you regain your composure?',
    subtext: 'Nervous system down-regulation time after sudden stress.',
    options: [
      { label: 'Within minutes, I adapt smoothly', points: 0, hint: 'High psychological flexibility' },
      { label: 'Within an hour or two once handled', points: 1, hint: 'Good resilience' },
      { label: 'It lingers through the half of the day', points: 2, hint: 'Slower recovery' },
      { label: 'Ruminates for days, hard to reset', points: 3, hint: 'Prolonged stress cycle' },
      { label: 'Completely derailment and intense emotional spiral', points: 4, hint: 'Hyper-vulnerable' },
    ],
  },
];

/**
 * Calculates stress score strictly between 100 (min) and 1000 (max)
 */
export function calculateStressScore(answers: Record<string, number>): {
  score: number;
  tier: StressTier;
  tierInfo: StressTierInfo;
  categoryScores: Record<string, number>;
} {
  let totalPoints = 0;
  let maxPossiblePoints = 0;

  const categoryTotals: Record<string, { points: number; max: number }> = {};

  for (const question of ASSESSMENT_QUESTIONS) {
    const selectedPoints = answers[question.id] ?? 0;
    totalPoints += selectedPoints;
    maxPossiblePoints += 4;

    if (!categoryTotals[question.category]) {
      categoryTotals[question.category] = { points: 0, max: 0 };
    }
    categoryTotals[question.category].points += selectedPoints;
    categoryTotals[question.category].max += 4;
  }

  // Strictly maps to 100 - 1000 scale
  // formula: 100 + (totalPoints / maxPossiblePoints) * 900
  const normalizedRatio = maxPossiblePoints > 0 ? totalPoints / maxPossiblePoints : 0;
  const rawBaseScore = Math.round(100 + normalizedRatio * 900);
  const baseScore = Math.max(100, Math.min(1000, rawBaseScore));

  // Determine Tier
  const tier = getTierFromScore(baseScore);

  // Calculate normalized category scores (100 to 1000 each)
  const categoryScores: Record<string, number> = {};
  for (const [cat, data] of Object.entries(categoryTotals)) {
    const catRatio = data.max > 0 ? data.points / data.max : 0;
    categoryScores[cat] = Math.round(100 + catRatio * 900);
  }

  return {
    score: baseScore,
    tier,
    tierInfo: STRESS_TIERS[tier],
    categoryScores,
  };
}

export function getTierFromScore(score: number): StressTier {
  if (score <= 250) return 'ZEN';
  if (score <= 450) return 'BALANCED';
  if (score <= 650) return 'MODERATE';
  if (score <= 850) return 'HIGH';
  return 'CRITICAL';
}

/**
 * Refines a base stress score by factoring in the user's daily mood check-in
 */
export function calculateRefinedScore(
  baseScore: number,
  moodRecord?: DailyMoodRecord | null,
  lang: Language = 'en'
): {
  refinedScore: number;
  modifier: number;
  tier: StressTier;
  tierInfo: StressTierInfo;
  explanation: string;
} {
  const modifier = moodRecord ? moodRecord.stressModifier : 0;
  const refinedScore = Math.min(1000, Math.max(100, Math.round(baseScore + modifier)));
  const tier = getTierFromScore(refinedScore);
  const tierInfo = STRESS_TIERS[tier];

  let explanation = '';
  if (moodRecord) {
    const moodDef = MOOD_DEFINITIONS[moodRecord.mood];
    const moodName = moodDef ? moodDef.label[lang] : moodRecord.label;
    if (modifier < 0) {
      explanation = lang === 'hi'
        ? `दैनिक मनोदशा द्वारा परिष्कृत (${moodRecord.emoji} ${moodName}: ${modifier} अंक शांत प्रभाव)`
        : `Refined by today's mood (${moodRecord.emoji} ${moodName}: ${modifier} pts calming effect)`;
    } else if (modifier > 0) {
      explanation = lang === 'hi'
        ? `दैनिक मनोदशा द्वारा परिष्कृत (${moodRecord.emoji} ${moodName}: +${modifier} अंक तनाव वृद्धि)`
        : `Refined by today's mood (${moodRecord.emoji} ${moodName}: +${modifier} pts strain elevation)`;
    } else {
      explanation = lang === 'hi'
        ? `दैनिक मनोदशा के साथ स्थिर सामंजस्य (${moodRecord.emoji} ${moodName})`
        : `Stable alignment with today's mood (${moodRecord.emoji} ${moodName})`;
    }
  }

  return {
    refinedScore,
    modifier,
    tier,
    tierInfo,
    explanation,
  };
}

export function getDefaultRecommendations(
  score: number,
  tier: StressTier,
  dailyMood?: DailyMoodRecord | null,
  lang: Language = 'en'
): WellnessRecommendation {
  const info = STRESS_TIERS[tier];
  const moodContext = dailyMood
    ? lang === 'hi'
      ? `(आज की मनोदशा: ${dailyMood.emoji} ${MOOD_DEFINITIONS[dailyMood.mood]?.label[lang] || dailyMood.label}${dailyMood.note ? ` - "${dailyMood.note}"` : ''})`
      : `(Today's Mood: ${dailyMood.emoji} ${MOOD_DEFINITIONS[dailyMood.mood]?.label[lang] || dailyMood.label}${dailyMood.note ? ` - "${dailyMood.note}"` : ''})`
    : '';

  if (lang === 'hi') {
    if (tier === 'ZEN' || tier === 'BALANCED') {
      return {
        summary: `आपका तनाव स्कोर ${score}/1000 तंत्रिका तंत्र के उत्कृष्ट लचीलेपन और मानसिक संतुलन को दर्शाता है। ${moodContext} आप वर्तमान में एक शांत और स्वस्थ स्थिति में हैं।`,
        stressTier: 'संतुलित एवं शांत स्थिति',
        keyTriggers: ['निवारक देखभाल', 'अनावश्यक नए दायित्वों से बचना', 'विश्राम की सीमाओं को बनाए रखना'],
        immediateGrounding: {
          title: 'शारीरिक आह (फिजियोलॉजिकल साई)',
          duration: '2 मिनट',
          steps: [
            'नाक से लगातार दो बार साँस अंदर लें (एक गहरी साँस, फिर एक छोटी साँस)।',
            'मुँह से धीमी, लंबी और सुकून भरी आह के साथ साँस छोड़ें।',
            'तंत्रिका तंत्र को तुरंत शांत रखने के लिए इसे 3 से 5 बार दोहराएं।',
          ],
        },
        dailyMicroHabits: [
          {
            title: 'प्रातःकालीन धूप और जल संतुलन',
            timeOfDay: 'सुबह',
            description: 'मोबाइल या समाचार देखने से पहले 5-10 मिनट प्राकृतिक धूप में बैठें और एक गिलास पानी पिएं।',
            benefit: 'शरीर की जैविक घड़ी को संतुलित करता है और शाम को अच्छी नींद में मदद करता है।',
          },
          {
            title: 'कार्यों के बीच 3 मिनट का विराम',
            timeOfDay: 'दोपहर',
            description: 'लगातार दो बैठकों या कार्यों के बीच 3 मिनट का विराम लेकर आँखों और मन को विश्राम दें।',
            benefit: 'मानसिक थकान को जमा होने से रोकता है।',
          },
          {
            title: 'डिजिटल सूर्यास्त',
            timeOfDay: 'शाम',
            description: 'सोने से 45 मिनट पहले स्क्रीन बंद करें और हल्की रोशनी में बैठें।',
            benefit: 'गहरी नींद और मस्तिष्क की मरम्मत में सहायक।',
          },
        ],
        cognitiveReframes: [
          {
            stressThought: 'मैं सब कुछ संभाल सकता हूँ, इसलिए और काम ले लेता हूँ।',
            empoweringReframe: 'मेरी मानसिक शांति मेरी सबसे बड़ी संपत्ति है, इसे अनावश्यक कार्यों से बचाना जरूरी है।',
          },
        ],
        restorativePlan: {
          sleepAdvice: 'प्रतिदिन 7.5 - 8 घंटे की नियमित नींद का लक्ष्य रखें।',
          nervousSystemReset: 'शाम को बिना मोबाइल के शांत टहलना या हल्का खिंचाव करें।',
          boundaryTip: 'उन अनुरोधों को विनम्रता से अस्वीकार करें जो आपकी शांति भंग कर सकते हैं।',
        },
        affirmation: 'मैं अपनी आंतरिक शांति की रक्षा करता हूँ; यही मेरी शक्ति का आधार है।',
      };
    }

    if (tier === 'MODERATE') {
      return {
        summary: `आपका तनाव स्कोर ${score}/1000 बढ़े हुए मानसिक और शारीरिक खिंचाव को दर्शाता है। ${moodContext} यद्यपि आप काम कर रहे हैं, लेकिन आपकी सहनशीलता की सीमा समाप्त हो रही है।`,
        stressTier: 'मध्यम तनाव खिंचाव',
        keyTriggers: ['एक साथ कई कार्य करने का दबाव', 'शारीरिक थकान का संचय', 'विश्राम में विलंब'],
        immediateGrounding: {
          title: '4-7-8 प्राणायाम तकनीक',
          duration: '3 मिनट',
          steps: [
            'नाक से 4 सेकंड तक गहरी साँस अंदर लें।',
            'सहजता से 7 सेकंड तक साँस रोकें।',
            'मुँह से 8 सेकंड तक धीरे-धीरे साँस बाहर छोड़ें।',
            'हृदय गति को स्थिर करने और वेगस नर्व को सक्रिय करने के लिए 4 चक्र पूरे करें।',
          ],
        },
        dailyMicroHabits: [
          {
            title: 'कार्यों की स्पष्ट प्राथमिकता',
            timeOfDay: 'सुबह',
            description: 'केवल 1 आवश्यक कार्य चुनें और गैर-जरूरी कार्यों को कल के लिए टाल दें।',
            benefit: 'मानसिक भ्रम और निर्णय थकान को आधा करता है।',
          },
          {
            title: 'जबड़ा और कंधा ढीला छोड़ें',
            timeOfDay: 'दोपहर',
            description: 'जागरूक होकर अपने जबड़े और कंधों को 2 इंच नीचे ढीला छोड़ें।',
            benefit: 'तनाव के दौरान होने वाली मांसपेशियों की जकड़न को तोड़ता है।',
          },
          {
            title: 'विचारों को डायरी में उतारें',
            timeOfDay: 'रात',
            description: 'सोने से पहले अपनी सभी चिंताओं को एक कागज पर लिख लें और डायरी बंद कर दें।',
            benefit: 'मस्तिष्क को यह संदेश देता है कि आज का काम पूरा हो चुका है।',
          },
        ],
        cognitiveReframes: [
          {
            stressThought: 'यदि मैं रुका तो सब कुछ बिखर जाएगा।',
            empoweringReframe: 'विश्राम कोई पुरस्कार नहीं बल्कि ऊर्जावान बने रहने के लिए अनिवार्य आवश्यकता है।',
          },
        ],
        restorativePlan: {
          sleepAdvice: 'सोने से 1 घंटा पहले स्क्रीन बंद करें और गर्म पानी या हर्बल चाय पिएं।',
          nervousSystemReset: 'दीवार के सहारे पैर ऊपर करके (विपरीत करणी) 5 मिनट विश्राम करें।',
          boundaryTip: 'कल के कैलेंडर में 45 मिनट का "स्वयं के लिए समय" आरक्षित करें।',
        },
        affirmation: 'मैं खुद को धीमा होने और गहरी साँस लेने की अनुमति देता हूँ।',
      };
    }

    // HIGH or CRITICAL in Hindi
    return {
      summary: `आपका तनाव स्कोर ${score}/1000 अत्यधिक मानसिक एवं शारीरिक अधिभार को दर्शाता है। ${moodContext} आपका तंत्रिका तंत्र अत्यधिक सक्रिय है। तुरंत आत्म-करुणा और शांति को प्राथमिकता दें।`,
      stressTier: 'गंभीर तनाव एवं अधिभार',
      keyTriggers: ['अनुकंपी तंत्रिका तंत्र का अतिसक्रिय होना', 'गंभीर शारीरिक थकावट', 'मानसिक अधिभार'],
      immediateGrounding: {
        title: '5-4-3-2-1 संवेदी ग्राउंडिंग तकनीक',
        duration: '4 मिनट',
        steps: [
          'कमरे में 5 ऐसी चीजें देखें जिन पर आपका ध्यान जाए।',
          '4 विभिन्न सतहों को छुएं और उनकी बनावट महसूस करें।',
          '3 अलग-अलग आवाजों को ध्यान से सुनें।',
          '2 सुगंधों को महसूस करें या दो गहरी साँसें लें।',
          '1 सकारात्मक सत्य कहें: "मैं इस समय सुरक्षित हूँ, और मैं एक-एक पल करके इसे संभाल सकता हूँ।"',
        ],
      },
      dailyMicroHabits: [
        {
          title: 'सूचनाओं से दूरी',
          timeOfDay: 'तुरंत',
          description: 'अगले 2 घंटे के लिए गैर-जरूरी फोन नोटिफिकेशन म्यूट करें।',
          benefit: 'मस्तिष्क के तनाव केंद्र (एमिग्डाला) को शांत होने का समय मिलता है।',
        },
        {
          title: 'ठंडे पानी से चेहरे पर छींटे',
          timeOfDay: 'दोपहर',
          description: 'चेहरे पर ठंडे पानी के छींटे मारें या 30 सेकंड के लिए बर्फ हाथ में पकड़ें।',
          benefit: 'बढ़ी हुई हृदय गति को तुरंत कम करता है।',
        },
        {
          title: 'एक काम को रद्द या स्थगित करें',
          timeOfDay: 'शाम',
          description: 'आज के किसी एक गैर-महत्वपूर्ण काम या बैठक को विनम्रता से स्थगित करें।',
          benefit: 'आपके तंत्रिका तंत्र को आवश्यक विश्राम देता है।',
        },
      ],
      cognitiveReframes: [
        {
          stressThought: 'सब कुछ संकट में है और मैं यह दबाव नहीं झेल सकता।',
          empoweringReframe: 'मेरा शरीर खतरे का संकेत दे रहा है, लेकिन हर बात आपातकालीन नहीं है। मुझे बस अगले 10 मिनट संभालने हैं।',
        },
      ],
      restorativePlan: {
        sleepAdvice: 'यदि नींद न भी आए तो अंधेरे कमरे में शांति से लेटकर विश्राम करें।',
        nervousSystemReset: 'अपने दिल पर हाथ रखें, उसकी गर्मी महसूस करें और धीमी साँसें छोड़ें।',
        boundaryTip: 'कहें: "आज मुझमें इसके लिए ऊर्जा नहीं है, मैं आपसे बाद में बात करूँगा।"',
      },
      affirmation: 'मैं इस क्षण सुरक्षित हूँ। जो मेरे नियंत्रण में नहीं है, उसे मैं मुक्त करता हूँ।',
    };
  }

  // English fallback / default
  if (tier === 'ZEN' || tier === 'BALANCED') {
    return {
      summary: `Your stress score of ${score}/1000 reflects solid nervous system resilience and mental equilibrium. ${moodContext} You are currently operating in a restorative, functional state.`,
      stressTier: info.label,
      keyTriggers: ['Preventive maintenance', 'Avoiding creeping micro-commitments', 'Maintaining restful boundaries'],
      immediateGrounding: {
        title: 'Parasympathetic Anchoring (Physiological Sigh)',
        duration: '2 Minutes',
        steps: [
          'Take two quick successive inhalations through your nose (deep inhale, then a top-off inhale).',
          'Release with a slow, extended, audible sigh through your mouth.',
          'Repeat 3 to 5 times to immediately maintain baseline parasympathetic tone.',
        ],
      },
      dailyMicroHabits: [
        {
          title: 'Morning Light & Hydration Anchor',
          timeOfDay: 'Morning',
          description: 'Step into natural daylight for 5-10 minutes with a glass of water before looking at stressful news or emails.',
          benefit: 'Anchors your circadian cortisol peak naturally so evening melatonin can release on time.',
        },
        {
          title: 'Conscious Transition Buffers',
          timeOfDay: 'Midday',
          description: 'Insert a 3-minute gap between consecutive tasks or meetings to close mental tabs.',
          benefit: 'Prevents insidious cognitive backlog from accumulating quietly.',
        },
        {
          title: 'Digital Sunset Wind-down',
          timeOfDay: 'Evening',
          description: 'Dim ambient lighting and put devices into do-not-disturb mode 45 minutes prior to sleep.',
          benefit: 'Protects REM and deep stage-3 restoration.',
        },
      ],
      cognitiveReframes: [
        {
          stressThought: 'I am doing well, so I can take on five more responsibilities right now.',
          empoweringReframe: 'My calm is an asset to protect, not spare capacity to immediately crowd out.',
        },
      ],
      restorativePlan: {
        sleepAdvice: 'Aim for consistent 7.5 - 8 hour sleep windows; your recovery score is already strong.',
        nervousSystemReset: 'Gentle walk or light stretching without headphones to let your brain daydream.',
        boundaryTip: 'Practice polite, proactive "No" to low-priority requests that could compromise your calm.',
      },
      affirmation: 'I protect my inner peace as the foundation of everything I do.',
    };
  }

  if (tier === 'MODERATE') {
    return {
      summary: `Your stress score of ${score}/1000 indicates elevated strain. ${moodContext} While you are functioning, your cognitive and somatic margins are beginning to wear thin.`,
      stressTier: info.label,
      keyTriggers: ['Multitasking friction', 'Accumulated physical fatigue', 'Deferred boundaries'],
      immediateGrounding: {
        title: '4-7-8 Parasympathetic Reset',
        duration: '3 Minutes',
        steps: [
          'Inhale quietly through your nose for a count of 4.',
          'Hold your breath comfortably for a count of 7.',
          'Exhale completely through your mouth making a gentle whoosh sound for a count of 8.',
          'Complete 4 full cycles to slow heart rate variability and signal safety to the vagus nerve.',
        ],
      },
      dailyMicroHabits: [
        {
          title: 'The "Must / Should / Could" Triage',
          timeOfDay: 'Morning',
          description: 'Write down only 1 non-negotiable priority (Must) and ruthlessly defer 2 Shoulds to tomorrow.',
          benefit: 'Instantly cuts decision fatigue in half.',
        },
        {
          title: 'Somatic Jaw & Shoulder Drop',
          timeOfDay: 'Midday',
          description: 'Set a quiet chime: consciously drop your tongue from the roof of your mouth and lower your shoulders 2 inches.',
          benefit: 'Breaks the unconscious bracing posture common in moderate stress.',
        },
        {
          title: 'Brain Dump Unloading',
          timeOfDay: 'Evening',
          description: 'Spend 4 minutes handwriting every unfinished worry onto scrap paper, then close the notebook.',
          benefit: 'Clears working memory so your brain does not rehearse problems in bed.',
        },
      ],
      cognitiveReframes: [
        {
          stressThought: 'If I pause or slow down, things will fall apart.',
          empoweringReframe: 'Rest is not a reward I earn after exhaustion; it is maintenance required to finish effectively.',
        },
      ],
      restorativePlan: {
        sleepAdvice: 'Eliminate screens 60 minutes before bed and replace with warm tea or gentle fiction.',
        nervousSystemReset: 'Legs-up-the-wall pose (Viparita Karani) for 5 minutes before dinner.',
        boundaryTip: 'Block 45 minutes on your calendar tomorrow labeled "Focus & Regroup" and do not schedule over it.',
      },
      affirmation: 'I give myself permission to slow down and breathe before responding.',
    };
  }

  // HIGH or CRITICAL
  return {
    summary: `Your stress score of ${score}/1000 reflects intense allostatic overload. ${moodContext} Your sympathetic fight-or-flight system is heavily engaged. Prioritize immediate nervous system decompression.`,
    stressTier: info.label,
    keyTriggers: ['Sympathetic nervous overdrive', 'High somatic exhaustion', 'Severe cognitive overload'],
    immediateGrounding: {
      title: '5-4-3-2-1 Sensory Grounding & Body Anchor',
      duration: '4 Minutes',
      steps: [
        'Notice 5 things you can see around the room (look for textures, specific colors).',
        'Touch 4 physical textures (your clothing fabric, table grain, cool cup).',
        'Listen for 3 distinct ambient sounds (fan hum, distant car, your breath).',
        'Identify 2 scents or take two deep sensory breaths.',
        'Name 1 compassionate truth about yourself: "I am safe right now, and I can take this one minute at a time."',
      ],
    },
    dailyMicroHabits: [
      {
        title: 'Emergency Stimulus Reduction',
        timeOfDay: 'Immediate',
        description: 'Mute all non-emergency push notifications for 3 hours and step away from high-noise environments.',
        benefit: 'Reduces sensory input to allow the amygdala to settle.',
      },
      {
        title: 'Cold Water Vagal Stimulation',
        timeOfDay: 'Midday',
        description: 'Splash cold water onto your face or hold an ice cube in your palm for 30 seconds.',
        benefit: 'Triggers the mammalian dive reflex to rapidly down-shift an elevated heart rate.',
      },
      {
        title: 'Non-Negotiable Task Cancellation',
        timeOfDay: 'Afternoon',
        description: 'Cancel or reschedule at least one meeting or chore today with a simple polite notice.',
        benefit: 'Reclaims physical breathing room when your system is red-lining.',
      },
    ],
    cognitiveReframes: [
      {
        stressThought: 'Everything is an emergency and I cannot handle this pressure.',
        empoweringReframe: 'My nervous system is sounding an alarm, but not everything requires an instant reaction. I only need to handle the next 10 minutes.',
      },
    ],
    restorativePlan: {
      sleepAdvice: 'Prioritize physical rest even if sleep is fitful; lie horizontally in dark quiet without demanding sleep from yourself.',
      nervousSystemReset: 'Place your hand over your heart, feel its warmth, and practice deep diaphragmatic exhales.',
      boundaryTip: 'Say: "I do not have the bandwidth for this today; let me get back to you next week."',
    },
    affirmation: 'I am safe in this moment. I release what is beyond my control.',
  };
}
