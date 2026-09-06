import { Language, MoodType, StressTier } from '../types';

export const TRANSLATIONS = {
  en: {
    appTitle: 'MindPulse',
    appSubtitle: 'Mental Wellness & Stress Intelligence',
    syncing: 'Syncing to Cloud...',
    cloudSynced: 'Cloud Synced',
    offlineVault: 'Local Vault (Offline)',
    guestMode: 'Guest Vault',
    verifiedUser: 'Verified User',
    
    // Tabs
    tabAssessment: 'Assessment',
    tabDailyMood: 'Daily Mood',
    tabJournal: 'Mindful Journal',
    tabBreathing: 'Somatic Breathing',
    tabTrends: 'Trends & Vault',
    
    // Daily Mood Check-In
    dailyMoodTitle: 'Daily Emotional Pulse Check-In',
    dailyMoodSubtitle: 'Select your prevailing emotional state and optionally jot down a note to calibrate your stress score and tailor your restorative recommendations.',
    selectMoodPrompt: 'How does your mind and nervous system feel right now?',
    moodOptionalNote: 'Personal reflection or triggering context (optional)',
    moodNotePlaceholder: 'E.g., High-pressure project deadline at work, peaceful morning stroll, family dinner...',
    btnSaveMood: 'Log Daily Mood',
    btnUpdateMood: 'Update Today’s Mood',
    moodLoggedSuccess: 'Daily mood logged! Your stress score and wellness plan are dynamically calibrated.',
    todayMoodRecorded: 'Today’s Logged Mood',
    stressAdjustmentEffect: 'Stress Impact Calibration',
    ptsAdjustment: 'pts',
    calmingEffect: 'Calming balance (lowers stress level)',
    elevatingEffect: 'Heightened strain (increases stress sensitivity)',
    neutralEffect: 'Balanced stability',
    noMoodsYet: 'No daily moods logged yet. Check in daily to track emotional shifts!',
    recentMoods: 'Recent Emotional History',

    // Mood Labels & Descriptions
    mood_happy: 'Happy & Joyful',
    mood_calm: 'Calm & Serene',
    mood_grateful: 'Grateful & Grounded',
    mood_energetic: 'Energetic & Driven',
    mood_tired: 'Tired & Drained',
    mood_sad: 'Sad & Heavy',
    mood_anxious: 'Anxious & Restless',
    mood_overwhelmed: 'Overwhelmed & Frayed',

    mood_desc_happy: 'High vitality, positive emotional resonance.',
    mood_desc_calm: 'Parasympathetic balance, tranquil mind and body.',
    mood_desc_grateful: 'Warm perspective, grounded appreciation.',
    mood_desc_energetic: 'Motivated focus, active sympathetic drive.',
    mood_desc_tired: 'Low battery, physical or sleep depletion.',
    mood_desc_sad: 'Low mood, emotional ache, longing for comfort.',
    mood_desc_anxious: 'Racing thoughts, anticipatory tension, uneasy gut.',
    mood_desc_overwhelmed: 'Excess cognitive input, boundary collapse.',

    // Assessment Questions Intro
    assessmentHeroTitle: 'Clinical Neuro-Stress Spectrum Assessment',
    assessmentHeroSub: 'Evaluate 10 somatic, cognitive, and emotional dimensions to calculate your precise stress score between 100 and 1000.',
    questionCounter: 'Question',
    of: 'of',
    nextQuestion: 'Next Question',
    previousQuestion: 'Previous',
    completeAssessment: 'Calculate Stress Score',
    submittingAssessment: 'Analyzing with Gemini Neuro-AI...',
    addAssessmentNotes: 'Optional Personal Context / Stress Triggers',
    notesPlaceholder: 'Mention anything unique happening currently (e.g. sleep issues, exam week, relationship tension)...',

    // Results View
    resultsTitle: 'Neuro-Stress Diagnostic Results',
    resultsSubtitle: 'Evaluated across 10 somatic and psychological markers.',
    scoreOut1000: 'out of 1000',
    baseAssessmentScore: 'Questionnaire Base Score',
    dailyMoodRefinement: 'Daily Mood Calibration',
    refinedFinalScore: 'Calibrated Stress Score',
    refinedExplanation: 'Adjusted by today’s mood check-in',
    recalibrateMood: 'Calibrate with Daily Mood',
    spectrumBarTitle: 'Continuous 100 - 1000 Stress Spectrum',
    factorBreakdown: 'Primary Stress Drivers & Vulnerabilities',
    recommendationsHeader: 'Personalized Neuro-Wellness & Recovery Protocol',
    retakeAssessment: 'Retake Assessment',
    discussWithAI: 'Reflect in Mindful Journal',
    startBreathing: 'Begin Somatic Breathing',

    // Breathing
    breathingTitle: 'Physiological Somatic Breathing Reset',
    breathingSubtitle: 'Guided 4-7-8 and box diaphragmatic pacing to downregulate the autonomic nervous system and stimulate vagal tone.',
    breatheIn: 'Inhale slowly through your nose...',
    breatheHold: 'Hold gently and soften your shoulders...',
    breatheOut: 'Exhale fully through your mouth with a soft sigh...',
    breathePause: 'Rest in quiet presence...',
    startSession: 'Start Breathing Exercise',
    stopSession: 'Pause Session',
    cyclesCompleted: 'Cycles Completed',

    // Journaling / AI Chat
    journalTitle: 'AI Mindful Journal & Safe Reflection Space',
    journalSubtitle: 'A judgment-free space to unpack worries, practice cognitive reframing, and receive gentle grounding prompts.',
    journalPlaceholder: 'What is resting heavily on your mind right now? Share your thoughts freely...',
    btnSend: 'Share Thought',
    btnSaveJournal: 'Save to Vault',
    savedToVault: 'Saved to Vault',

    // History & Trends
    historyTitle: 'Personal Stress Trends & Vault',
    historySubtitle: 'Isolated Firestore vault tracking your mental health scores, emoji states, daily moods, and journal reflections over time.',
    totalCheckins: 'Total Check-Ins',
    avgScore: 'Average Stress Score',
    latestScore: 'Latest Score',
    tabAssessmentsList: 'Assessment Records',
    tabJournalsList: 'Saved Journal Reflections',
    tabMoodsList: 'Daily Mood Logs',
    btnStartFirstCheckin: 'Take First Assessment',
    viewBreakdown: 'View Breakdown',
    cloudStatusSynced: 'Cloud Synced',
    cloudStatusLocal: 'Local Vault',

    // Auth
    authTitle: 'Profile & Vault Security',
    authSubtitle: 'Sign in with Firebase to isolate your mental health assessments and synchronize offline logs automatically.',
    signInWithGoogle: 'Sign In with Google',
    continueAsGuest: 'Continue as Guest Explorer',
    signOut: 'Sign Out of Session',
    zeroLeakageGuarantee: 'Zero Cross-User Data Leakage',
    privacyNote: 'Your assessments, daily moods, and journals are strictly quarantined to your private Firestore namespace.',

    // Language Toggle
    langToggle: 'Language / भाषा',

    // Assessment flow navigation
    completeStatus: 'Complete',
    prevQuestion: 'Previous',
    calculateScoreBtn: 'Calculate Stress Score',
    resetAnswers: 'Reset Assessment',

    // Mindful chat
    chatTitle: 'MindPulse AI Reflection Journal',
    savedNotification: 'Saved to Vault',
    saveJournalBtn: 'Save Journal',

    // Results
    resultHeader: 'Neuro-Stress Diagnostic Results',
    stressLevelScore: 'Stress Level Score',
    status: 'Status',
    groundingTitle: 'Immediate Grounding',
    affirmation: 'Restorative Affirmation',
    breathingExercise: 'Somatic Breathing',
    recommendationsTitle: 'Personalized Neuro-Wellness & Recovery Protocol',
    habitsTitle: 'Daily Micro-Habits',
    reframingTitle: 'Cognitive Reframing',
    recoveryTitle: 'Restorative Protocol',
    disclaimerTitle: 'Clinical & Safety Notice',
    disclaimerText: 'MindPulse provides educational wellness insights and emotional intelligence calibration. It does not replace professional diagnosis or treatment.',
  },
  hi: {
    appTitle: 'माइंडपल्स',
    appSubtitle: 'मानसिक स्वास्थ्य एवं तनाव विश्लेषण',
    syncing: 'क्लाउड में सिंक हो रहा है...',
    cloudSynced: 'क्लाउड सिंक संपन्न',
    offlineVault: 'स्थानीय वॉल्ट (ऑफ़लाइन)',
    guestMode: 'अतिथि वॉल्ट',
    verifiedUser: 'सत्यापित उपयोगकर्ता',

    // Tabs
    tabAssessment: 'मूल्यांकन',
    tabDailyMood: 'दैनिक मनोदशा',
    tabJournal: 'माइंडफुल डायरी',
    tabBreathing: 'प्राणायाम और श्वास',
    tabTrends: 'रुझान और तिजोरी',

    // Daily Mood Check-In
    dailyMoodTitle: 'दैनिक मनोदशा और भावनात्मक जाँच',
    dailyMoodSubtitle: 'अपनी वर्तमान भावनात्मक स्थिति चुनें और अपने तनाव स्कोर को परिष्कृत करने तथा व्यक्तिगत कल्याण सुझाव प्राप्त करने के लिए टिप्पणी जोड़ें।',
    selectMoodPrompt: 'इस समय आपका मन और शरीर कैसा महसूस कर रहा है?',
    moodOptionalNote: 'व्यक्तिगत विचार या तनाव का कारण (वैकल्पिक)',
    moodNotePlaceholder: 'उदा. काम की अंतिम समय सीमा, सुबह की सुखद सैर, पारिवारिक बातचीत...',
    btnSaveMood: 'आज की मनोदशा दर्ज करें',
    btnUpdateMood: 'मनोदशा अपडेट करें',
    moodLoggedSuccess: 'मनोदशा सफलतापूर्वक दर्ज हुई! आपका तनाव स्कोर और कल्याण योजना तदनुसार समायोजित हो गए हैं।',
    todayMoodRecorded: 'आज दर्ज की गई मनोदशा',
    stressAdjustmentEffect: 'तनाव प्रभाव समायोजन',
    ptsAdjustment: 'अंक',
    calmingEffect: 'शांतिकारी प्रभाव (तनाव कम करता है)',
    elevatingEffect: 'तनाव संवेदनशीलता में वृद्धि',
    neutralEffect: 'संतुलित एवं स्थिर',
    noMoodsYet: 'अभी तक कोई दैनिक मनोदशा दर्ज नहीं की गई। दैनिक रूप से जाँच करें!',
    recentMoods: 'हाल का भावनात्मक इतिहास',

    // Mood Labels & Descriptions
    mood_happy: 'प्रसन्न एवं आनंदित',
    mood_calm: 'शांत एवं स्थिर',
    mood_grateful: 'आभारी एवं कृतज्ञ',
    mood_energetic: 'ऊर्जावान एवं सक्रिय',
    mood_tired: 'थका हुआ एवं शिथिल',
    mood_sad: 'उदास एवं भारी मन',
    mood_anxious: 'चिंतित एवं व्यग्र',
    mood_overwhelmed: 'अति-तनावग्रस्त एवं व्याकुल',

    mood_desc_happy: 'उच्च ऊर्जा, सकारात्मक भावनात्मक उत्साह।',
    mood_desc_calm: 'तंत्रिका तंत्र में स्थिरता, शांत मन और शरीर।',
    mood_desc_grateful: 'सकारात्मक दृष्टिकोण और गहरी कृतज्ञता।',
    mood_desc_energetic: 'प्रेरित ध्यान और सक्रिय उत्साह।',
    mood_desc_tired: 'कम ऊर्जा, शारीरिक थकान या नींद की कमी।',
    mood_desc_sad: 'उदास मन, भावनात्मक बोझ, विश्राम की आवश्यकता।',
    mood_desc_anxious: 'तेज विचार, अनजाना डर और आंतरिक बेचैनी।',
    mood_desc_overwhelmed: 'अत्यधिक मानसिक भार और सीमाओं का टूटना।',

    // Assessment Questions Intro
    assessmentHeroTitle: 'वैज्ञानिक मानसिक तनाव स्पेक्ट्रम मूल्यांकन',
    assessmentHeroSub: '100 से 1000 के पैमाने पर अपने सटीक तनाव स्तर को जानने के लिए 10 शारीरिक, संज्ञानात्मक और भावनात्मक पहलुओं का मूल्यांकन करें।',
    questionCounter: 'प्रश्न',
    of: 'का',
    nextQuestion: 'अगला प्रश्न',
    previousQuestion: 'पिछला प्रश्न',
    completeAssessment: 'तनाव स्कोर की गणना करें',
    submittingAssessment: 'जेमिनी न्यूरो-एआई द्वारा विश्लेषण जारी...',
    addAssessmentNotes: 'वैकल्पिक व्यक्तिगत संदर्भ / तनाव के कारण',
    notesPlaceholder: 'इस समय हो रही किसी विशेष बात का उल्लेख करें (उदा. नींद की समस्या, परीक्षा का दबाव, पारिवारिक चिंता)...',

    // Results View
    resultsTitle: 'मानसिक तनाव विश्लेषण परिणाम',
    resultsSubtitle: '10 शारीरिक और मनोवैज्ञानिक संकेतकों के आधार पर मूल्यांकन।',
    scoreOut1000: '1000 में से',
    baseAssessmentScore: 'प्रश्नावली मूल स्कोर',
    dailyMoodRefinement: 'दैनिक मनोदशा समायोजन',
    refinedFinalScore: 'परिष्कृत तनाव स्कोर',
    refinedExplanation: 'आज की मनोदशा जाँच द्वारा समायोजित',
    recalibrateMood: 'दैनिक मनोदशा से पुनर्निर्धारित करें',
    spectrumBarTitle: 'निरंतर 100 - 1000 तनाव स्पेक्ट्रम',
    factorBreakdown: 'प्रमुख तनाव कारक एवं संवेदनशीलता',
    recommendationsHeader: 'व्यक्तिगत मानसिक कल्याण एवं पुनर्प्राप्ति प्रोटोकॉल',
    retakeAssessment: 'पुनः मूल्यांकन करें',
    discussWithAI: 'माइंडफुल डायरी में चर्चा करें',
    startBreathing: 'प्राणायाम शुरू करें',

    // Breathing
    breathingTitle: 'कायिक प्राणायाम एवं तंत्रिका तंत्र विश्राम',
    breathingSubtitle: 'स्वायत्त तंत्रिका तंत्र को शांत करने और वेगस नर्व को सक्रिय करने के लिए 4-7-8 श्वास अभ्यास।',
    breatheIn: 'नाक से धीरे-धीरे गहरी साँस अंदर लें...',
    breatheHold: 'सहजता से साँस रोकें और कंधों को ढीला छोड़ें...',
    breatheOut: 'मुँह से धीरे-धीरे पूरी साँस बाहर छोड़ें...',
    breathePause: 'शांत उपस्थिति में विश्राम करें...',
    startSession: 'श्वास अभ्यास शुरू करें',
    stopSession: 'अभ्यास रोकें',
    cyclesCompleted: 'पूरे किए गए चक्र',

    // Journaling / AI Chat
    journalTitle: 'एआई माइंडफुल डायरी और सुरक्षित विचार मंच',
    journalSubtitle: 'चिंताओं को साझा करने, सकारात्मक सोच विकसित करने और सौम्य मानसिक मार्गदर्शन पाने का सुरक्षित स्थान।',
    journalPlaceholder: 'इस समय आपके मन में क्या चल रहा है? बेझिझक अपने विचार साझा करें...',
    btnSend: 'विचार साझा करें',
    btnSaveJournal: 'तिजोरी में सहेजें',
    savedToVault: 'तिजोरी में सुरक्षित',

    // History & Trends
    historyTitle: 'व्यक्तिगत तनाव रुझान एवं तिजोरी',
    historySubtitle: 'आपके मानसिक स्वास्थ्य स्कोर, इमोजी स्थिति, दैनिक मनोदशा और डायरी को सुरक्षित रखने वाला फ़ायरबेस वॉल्ट।',
    totalCheckins: 'कुल जाँचें',
    avgScore: 'औसत तनाव स्कोर',
    latestScore: 'नवीनतम स्कोर',
    tabAssessmentsList: 'मूल्यांकन अभिलेख',
    tabJournalsList: 'सहेजी गई डायरियाँ',
    tabMoodsList: 'दैनिक मनोदशा लॉग',
    btnStartFirstCheckin: 'पहला मूल्यांकन शुरू करें',
    viewBreakdown: 'विस्तार से देखें',
    cloudStatusSynced: 'क्लाउड सिंक संपन्न',
    cloudStatusLocal: 'स्थानीय वॉल्ट',

    // Auth
    authTitle: 'प्रोफ़ाइल एवं वॉल्ट सुरक्षा',
    authSubtitle: 'अपने मानसिक स्वास्थ्य मूल्यांकनों को सुरक्षित रखने और स्वचालित रूप से सिंक करने के लिए फ़ायरबेस से साइन इन करें।',
    signInWithGoogle: 'गूगल से साइन इन करें',
    continueAsGuest: 'अतिथि एक्सप्लोरर के रूप में जारी रखें',
    signOut: 'सत्र से साइन आउट करें',
    zeroLeakageGuarantee: 'शून्य डेटा रिसाव की गारंटी',
    privacyNote: 'आपके मूल्यांकन, दैनिक मनोदशा और डायरी प्रविष्टियाँ आपके निजी फ़ायरबेस स्थान में पूर्णतः सुरक्षित हैं।',

    // Language Toggle
    langToggle: 'Language / भाषा',

    // Assessment flow navigation
    completeStatus: 'पूर्ण',
    prevQuestion: 'पिछला प्रश्न',
    calculateScoreBtn: 'तनाव स्कोर की गणना करें',
    resetAnswers: 'मूल्यांकन पुनः आरंभ करें',

    // Mindful chat
    chatTitle: 'माइंडपल्स एआई चिंतन डायरी',
    savedNotification: 'तिजोरी में सुरक्षित',
    saveJournalBtn: 'डायरी सहेजें',

    // Results
    resultHeader: 'मानसिक तनाव विश्लेषण परिणाम',
    stressLevelScore: 'तनाव स्तर स्कोर',
    status: 'स्थिति',
    groundingTitle: 'त्वरित शांति तकनीक',
    affirmation: 'सकारात्मक आत्म-पुष्टि',
    breathingExercise: 'प्राणायाम और श्वास',
    recommendationsTitle: 'व्यक्तिगत मानसिक कल्याण एवं पुनर्प्राप्ति प्रोटोकॉल',
    habitsTitle: 'दैनिक सूक्ष्म-आदतें',
    reframingTitle: 'सकारात्मक दृष्टिकोण परिवर्तन',
    recoveryTitle: 'पुनर्प्राप्ति योजना',
    disclaimerTitle: 'चिकित्सीय एवं सुरक्षा सूचना',
    disclaimerText: 'माइंडपल्स केवल शैक्षिक कल्याण और आत्म-जागरूकता के लिए है। यह किसी पेशेवर चिकित्सा या मनोचिकित्सकीय सलाह का विकल्प नहीं है।',
  },
};

export type TranslationKey = keyof typeof TRANSLATIONS.en;

/**
 * Helper to get translation string by key
 */
export function getTranslation(key: string, lang: string = 'en'): string {
  const dict = TRANSLATIONS[lang as Language] || TRANSLATIONS.en;
  return (dict as Record<string, string>)[key] || (TRANSLATIONS.en as Record<string, string>)[key] || key;
}

/**
 * Helper to get question translation for Hindi
 */
export function getQuestionTranslation(questionId: string, lang: string = 'en') {
  if (lang === 'hi' && HINDI_QUESTIONS[questionId]) {
    return HINDI_QUESTIONS[questionId];
  }
  return null;
}

/**
 * Hindi translations for the 10 Assessment Questions and options
 */
export const HINDI_QUESTIONS: Record<
  string,
  {
    categoryLabel: string;
    text: string;
    subtext: string;
    options: { label: string; hint: string }[];
  }
> = {
  q_sleep: {
    categoryLabel: 'नींद एवं शारीरिक ऊर्जा',
    text: 'दिन की शुरुआत करते समय आप शारीरिक रूप से कितना तरोताजा और ऊर्जावान महसूस करते हैं?',
    subtext: 'हाल के दिनों में अपनी नींद की निरंतरता और सुबह की शारीरिक थकान पर विचार करें।',
    options: [
      { label: 'पूर्णतः तरोताजा और ऊर्जावान', hint: 'गहरी एवं पुनर्स्थापनात्मक नींद चक्र' },
      { label: 'सामान्यतः ठीक, आसानी से जाग जाता हूँ', hint: 'पर्याप्त विश्राम' },
      { label: 'हल्की सुस्ती, सक्रिय होने के लिए समय/कैफीन चाहिए', hint: 'हल्की नींद की कमी' },
      { label: 'अक्सर थका हुआ और सुस्त महसूस करता हूँ', hint: 'पुरानी नींद का कर्ज' },
      { label: 'अत्यधिक थकावट, अनिद्रा या सुबह उठने का भय', hint: 'गंभीर शारीरिक थकावट' },
    ],
  },
  q_racing_thoughts: {
    categoryLabel: 'संज्ञानात्मक भार एवं एकाग्रता',
    text: 'तेज विचार, मानसिक उलझन या लगातार चिंताएँ आपको कितनी बार विचलित करती हैं?',
    subtext: 'अनावश्यक मानसिक विचारों को शांत करने या एक काम पर ध्यान केंद्रित करने में कठिनाई।',
    options: [
      { label: 'शायद ही कभी — मन शांत और वर्तमान में रहता है', hint: 'उच्च एकाग्रता' },
      { label: 'कभी-कभार व्यस्त पलों में', hint: 'प्रबंधनीय भार' },
      { label: 'अक्सर कई विचारों के बीच कूदता रहता है', hint: 'मध्यम मानसिक घर्षण' },
      { label: 'बहुत बार, मन ऐसा लगता है जैसे 50 टैब खुले हों', hint: 'उच्च संज्ञानात्मक अधिभार' },
      { label: 'लगातार मानसिक उथल-पुथल, विचारों को शांत नहीं कर पाता', hint: 'अतिसक्रिय मानसिक तनाव' },
    ],
  },
  q_emotional_reactivity: {
    categoryLabel: 'भावनात्मक नियंत्रण',
    text: 'आप कितनी जल्दी चिड़चिड़ा, चिंतित या धैर्य खोते हुए महसूस करते हैं?',
    subtext: 'छोटी-मोटी असुविधाओं, अचानक मिजाज बदलने या अचानक चिंता के प्रति सहनशीलता।',
    options: [
      { label: 'धैर्यवान, शांत और जमीन से जुड़ा हुआ', hint: 'उच्च भावनात्मक सहनशीलता' },
      { label: 'अधिकतर धैर्यवान, कभी-कभार हल्की झुंझलाहट', hint: 'सामान्य प्रतिक्रिया' },
      { label: 'अपेक्षा से अधिक जल्दी चिड़चिड़ा हो जाता हूँ', hint: 'कम भावनात्मक सहनशीलता' },
      { label: 'अक्सर गुस्सा आना, चिंतित होना या तनाव में रहना', hint: 'तनावपूर्ण भावनात्मक स्थिति' },
      { label: 'भावनात्मक रूप से अस्थिर, अत्यधिक तनावग्रस्त', hint: 'भावनात्मक ऊर्जा की समाप्ति' },
    ],
  },
  q_somatic_tension: {
    categoryLabel: 'शारीरिक एवं कायिक तनाव',
    text: 'क्या आप तनाव के शारीरिक लक्षण महसूस करते हैं (जबड़ा भींचना, कंधों में अकड़न, उथली साँसें, पेट में ऐंठन)?',
    subtext: 'हमारा शरीर चेतन मन से पहले ही तनाव को संजोने लगता है।',
    options: [
      { label: 'शरीर लचीला, सहज और मांसपेशियों में तनावमुक्त है', hint: 'शारीरिक विश्राम' },
      { label: 'काम के लंबे घंटों के बाद कभी-कभार हल्की अकड़न', hint: 'क्षणिक तनाव' },
      { label: 'नियमित गर्दन/कंधे का खिंचाव या उथली साँसें', hint: 'मध्यम शारीरिक तनाव' },
      { label: 'अक्सर सिरदर्द, जबड़े का तनाव या पेट की परेशानी', hint: 'गंभीर शारीरिक प्रतिक्रिया' },
      { label: 'लगातार शारीरिक जकड़न, घबराहट या थकावट', hint: 'गंभीर तंत्रिका तंत्र तनाव' },
    ],
  },
  q_work_overload: {
    categoryLabel: 'पर्यावरण एवं कार्यभार',
    text: 'आपकी वर्तमान जिम्मेदारियाँ और काम का बोझ आपकी क्षमता की तुलना में कैसा लगता है?',
    subtext: 'पेशेवर, पारिवारिक या सामाजिक अपेक्षाओं की मात्रा और तीव्रता।',
    options: [
      { label: 'पूरी तरह से संतुलित और स्पष्ट प्राथमिकताओं के साथ', hint: 'संतुलित कार्यभार' },
      { label: 'कभी-कभी व्यस्त, लेकिन समय सीमा नियंत्रण में रहती है', hint: 'प्रबंधनीय दबाव' },
      { label: 'अक्सर समय की कमी और लगातार काम का दबाव', hint: 'बढ़ता हुआ दबाव' },
      { label: 'काम से दबे हुए, लगातार पीछे छूटने का अहसास', hint: 'उच्च कार्यभार' },
      { label: 'पूर्ण अधिभार, बिना किसी राहत के लगातार संकट', hint: 'कार्य-जीवन का गंभीर असंतुलन' },
    ],
  },
  q_autonomic_regulation: {
    categoryLabel: 'स्वायत्त तंत्रिका तंत्र संतुलन',
    text: 'अचानक तनाव की स्थिति के बाद आपका शरीर कितनी जल्दी शांत और स्थिर हो जाता है?',
    subtext: 'हृदय गति में बदलाव, एड्रेनालाईन का बढ़ना और विश्राम की स्थिति में लौटना।',
    options: [
      { label: 'बहुत जल्दी — कुछ ही मिनटों में सामान्य हो जाता हूँ', hint: 'मजबूत वेगस तंत्र' },
      { label: 'थोड़ा समय लगता है, लेकिन स्थिर हो जाता हूँ', hint: 'स्वस्थ स्वायत्त प्रतिक्रिया' },
      { label: 'तनाव के बाद घंटों तक चिंता या शारीरिक घबराहट बनी रहती है', hint: 'धीमी पुनर्प्राप्ति' },
      { label: 'लगातार सतर्कता, छोटी-छोटी बातों पर चौंकना', hint: 'अतिसक्रिय अनुकंपी तंत्र' },
      { label: 'लगातार सुन्न या घबराहट की स्थिति, शांत होने में असमर्थ', hint: 'गंभीर स्वायत्त असंतुलन' },
    ],
  },
  q_perceived_control: {
    categoryLabel: 'जीवन पर नियंत्रण का अहसास',
    text: 'आपको अपने दैनिक कार्यक्रम और महत्वपूर्ण निर्णयों पर कितना नियंत्रण महसूस होता है?',
    subtext: 'अपनी प्राथमिकताओं को चुनने की स्वायत्तता बनाम परिस्थितियों का शिकार महसूस करना।',
    options: [
      { label: 'मजबूत नियंत्रण और स्पष्ट दिशा', hint: 'उच्च स्वायत्तता' },
      { label: 'सामान्यतः नियंत्रण में, कुछ चीजें बाहर की हैं', hint: 'संतुलित दृष्टिकोण' },
      { label: 'अक्सर दूसरों की मांगों और आपात स्थितियों के अनुसार चलना पड़ता है', hint: 'कम होती स्वायत्तता' },
      { label: 'असहाय महसूस करना, जैसे जीवन की कमान किसी और के हाथ में हो', hint: 'नियंत्रण की कमी' },
      { label: 'पूर्ण रूप से लाचार और फंसा हुआ महसूस करना', hint: 'गंभीर निराशा' },
    ],
  },
  q_social_bandwidth: {
    categoryLabel: 'सामाजिक एवं संबंध क्षमता',
    text: 'दोस्तों, सहकर्मियों या प्रियजनों के साथ बातचीत करने की आपकी भावनात्मक क्षमता कैसी है?',
    subtext: 'दूसरों से जुड़ने की इच्छा बनाम सामाजिक बातचीत से दूर भागने का मन।',
    options: [
      { label: 'उत्साही, दूसरों से जुड़कर ऊर्जा मिलती है', hint: 'स्वस्थ सामाजिक जुड़ाव' },
      { label: 'संतुलित — समय मिलने पर बातचीत का आनंद लेता हूँ', hint: 'सामान्य सामाजिक ऊर्जा' },
      { label: 'दूसरों के संदेशों या बातचीत से जल्दी थक जाता हूँ', hint: 'सामाजिक थकान' },
      { label: 'अक्सर अकेला रहना चाहता हूँ, बातचीत बोझ लगती है', hint: 'सामाजिक अलगाव' },
      { label: 'लोगों से पूरी तरह कट चुका हूँ, संपर्क से डर लगता है', hint: 'गंभीर भावनात्मक अलगाव' },
    ],
  },
  q_recovery_joy: {
    categoryLabel: 'विश्राम एवं आनंद की क्षमता',
    text: 'आप कितनी बार शौक, विश्राम, हँसी या बिना किसी अपराधबोध के खाली समय का आनंद लेते हैं?',
    subtext: 'उत्पादकता के दबाव के बिना विश्राम करने और खुशी महसूस करने की क्षमता।',
    options: [
      { label: 'नियमित रूप से शौक और शांति का पूरा आनंद लेता हूँ', hint: 'स्वस्थ पुनर्प्राप्ति' },
      { label: 'सप्ताहांत पर विश्राम कर पाता हूँ', hint: 'पर्याप्त राहत' },
      { label: 'खाली बैठने पर बेचैनी या काम छूटने का अपराधबोध होता है', hint: 'विश्राम में कठिनाई' },
      { label: 'आनंद की कमी, शायद ही कभी पूरी तरह आराम कर पाता हूँ', hint: 'सुखानुभूति में कमी' },
      { label: 'लंबे समय से कोई खुशी या वास्तविक विश्राम महसूस नहीं हुआ', hint: 'गंभीर मानसिक थकावट' },
    ],
  },
  q_burnout_horizon: {
    categoryLabel: 'बर्नआउट एवं मानसिक थकावट',
    text: 'यदि आपकी वर्तमान जीवनशैली और तनाव ऐसे ही जारी रहे, तो आप कब तक इसे संभाल सकते हैं?',
    subtext: 'दीर्घकालिक सहनशीलता और आंतरिक ऊर्जा का आकलन।',
    options: [
      { label: 'मेरी जीवनशैली टिकाऊ और संतुलित है', hint: 'दीर्घकालिक स्थिरता' },
      { label: 'काफी समय तक संभाल सकता हूँ, कुछ सुधार चाहिए', hint: 'प्रबंधनीय स्थिति' },
      { label: 'कुछ महीनों तक, फिर मुझे बड़ा ब्रेक चाहिए होगा', hint: 'मध्यम चेतावनी' },
      { label: 'बस कुछ ही हफ्तों में हिम्मत जवाब दे देगी', hint: 'आसन्न बर्नआउट' },
      { label: 'मैं पहले ही चरम सीमा पार कर चुका हूँ और खाली हूँ', hint: 'गंभीर बर्नआउट की स्थिति' },
    ],
  },
};
