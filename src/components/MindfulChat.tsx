import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  BookOpen,
  User,
  Bot,
  RotateCcw,
  Check,
  Save,
  MapPin,
  FileText,
  Lightbulb,
  AlertTriangle,
  RefreshCw,
  Clock,
  X,
} from 'lucide-react';
import {
  ChatMessage,
  DailyMoodRecord,
  JournalSession,
  Language,
  UserInteraction,
  MindfulLocation,
} from '../types';
import {
  saveLocalJournal,
  saveLocalInteraction,
} from '../lib/offlineSync';
import {
  saveJournalSessionToFirestore,
  saveInteractionToFirestore,
} from '../lib/firebase';
import { getTranslation } from '../lib/i18n';
import { MOOD_DEFINITIONS } from '../lib/scoring';

interface MindfulChatProps {
  userId?: string;
  currentStressScore?: number;
  dominantFactor?: string;
  dailyMood?: DailyMoodRecord | null;
  lang?: Language;
  onSaveSession?: (session: JournalSession) => void;
  selectedLocation?: MindfulLocation | null;
  onClearLocation?: () => void;
}

const STARTER_PROMPTS_EN = [
  {
    title: '🧠 Work Overwhelm Breakdown',
    prompt: "I am feeling overwhelmed with deadlines and responsibilities. Help me brainstorm 3 manageable micro-steps to regain my composure.",
  },
  {
    title: '🧘 Somatic Tension Relief',
    prompt: "I notice physical tightness in my shoulders and shallow breathing. Can you talk me through immediate somatic grounding?",
  },
  {
    title: '🔄 Thought Reframing',
    prompt: "I keep worrying that I'm falling behind and not doing enough. Can you help me reframe this thought with self-compassion?",
  },
  {
    title: '🌙 Evening Unwind Journal',
    prompt: "Guide me through a 3-question mindful evening journal reflection to disconnect from the day's mental clutter.",
  },
];

const STARTER_PROMPTS_HI = [
  {
    title: '🧠 कार्य का अत्यधिक दबाव',
    prompt: "मैं काम और जिम्मेदारियों के दबाव से व्याकुल महसूस कर रहा हूं। मानसिक संतुलन पाने के लिए मुझे 3 छोटे उपाय बताएं।",
  },
  {
    title: '🧘 शारीरिक तनाव से राहत',
    prompt: "मेरे कंधों में जकड़न और सांसें उथली महसूस हो रही हैं। क्या आप मुझे त्वरित दैहिक विश्राम (Somatic Grounding) करा सकते हैं?",
  },
  {
    title: '🔄 सकारात्मक दृष्टिकोण',
    prompt: "मुझे चिंता रहती है कि मैं पीछे छूट रहा हूं और पर्याप्त नहीं कर रहा हूं। कृपया आत्म-सहानुभूति के साथ इस विचार को सकारात्मक बनाएं।",
  },
  {
    title: '🌙 सायंकालीन शांति चिंतन',
    prompt: "दिन भर की मानसिक थकान को दूर करने के लिए मुझे 3 प्रश्नों वाली ध्यानमग्न सायंकालीन डायरी का मार्गदर्शन दें।",
  },
];

export const MindfulChat: React.FC<MindfulChatProps> = ({
  userId,
  currentStressScore,
  dominantFactor,
  dailyMood,
  lang = 'en',
  onSaveSession,
  selectedLocation,
  onClearLocation,
}) => {
  const starterPrompts = lang === 'hi' ? STARTER_PROMPTS_HI : STARTER_PROMPTS_EN;
  const moodDef = dailyMood ? MOOD_DEFINITIONS[dailyMood.mood] : null;

  const locationIntro = selectedLocation
    ? lang === 'hi'
      ? ` [स्थान: ${selectedLocation.title}]`
      : ` [Reflecting at: ${selectedLocation.title}]`
    : '';

  const initialWelcome =
    lang === 'hi'
      ? `नमस्ते। मैं आपका माइंडपल्स (MindPulse) साथी हूँ। चाहे आप अपने विचारों को लिखना चाहें, तनाव के कारणों को समझना चाहें, या मानसिक शांति के लिए विचार-मंथन करना चाहें, मैं आपके साथ हूँ।${locationIntro} ${
          currentStressScore
            ? `आपका हालिया तनाव स्कोर ${currentStressScore}/1000 है${dominantFactor ? ` (मुख्य कारण: ${dominantFactor})` : ''}।`
            : ''
        }${dailyMood ? ` आज आपका मूड "${moodDef?.label.hi || dailyMood.label}" ${dailyMood.emoji} दर्ज है।` : ''} आज आपके मन में क्या चल रहा है?`
      : `Hello. I am your MindPulse companion. Whether you want to write a mindful journal entry, unpack inner tension, brainstorm micro-steps, or request a calm reflection summary, I am here with you.${locationIntro} ${
          currentStressScore
            ? `I see your recent stress score is ${currentStressScore}/1000${dominantFactor ? ` (primary focus: ${dominantFactor})` : ''}.`
            : ''
        }${dailyMood ? ` Your mood today is recorded as "${moodDef?.label.en || dailyMood.label}" ${dailyMood.emoji}.` : ''} What is on your heart or mind today?`;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      text: initialWelcome,
      timestamp: Date.now(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<{ message: string; retryPayload?: any } | null>(null);
  const [sessionSaved, setSessionSaved] = useState(false);

  // Summaries and Brainstorming State
  const [activeSummary, setActiveSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [brainstormIdeas, setBrainstormIdeas] = useState<string | null>(null);
  const [isBrainstorming, setIsBrainstorming] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, activeSummary, brainstormIdeas]);

  // Guaranteed Transaction Verification Helper
  const persistSessionAndInteraction = async (
    userMsgText: string,
    assistantReplyText: string,
    allMsgs: ChatMessage[]
  ) => {
    if (!userId) return;

    const interactionId = `interaction-${Date.now()}`;
    const sessionId = `journal-${Date.now()}`;

    const newInteraction: UserInteraction = {
      id: interactionId,
      userId,
      createdAt: Date.now(),
      type: 'journal',
      prompt: userMsgText,
      response: assistantReplyText,
      summary: activeSummary || undefined,
      brainstormIdeas: brainstormIdeas || undefined,
      location: selectedLocation
        ? {
            lat: selectedLocation.lat,
            lng: selectedLocation.lng,
            title: selectedLocation.title,
            category: selectedLocation.category,
          }
        : undefined,
      syncedToCloud: false,
    };

    const session: JournalSession = {
      id: sessionId,
      userId,
      title: userMsgText.slice(0, 45) + '...',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: allMsgs,
      associatedScore: currentStressScore,
      summary: activeSummary || undefined,
      location: selectedLocation || undefined,
      syncedToCloud: false,
    };

    // Save locally first for zero-data loss offline safety
    saveLocalInteraction(newInteraction);
    saveLocalJournal(session);

    // Save to Firestore with guaranteed error escalation
    if (navigator.onLine) {
      try {
        await Promise.all([
          saveInteractionToFirestore(userId, newInteraction),
          saveJournalSessionToFirestore(userId, session),
        ]);
        newInteraction.syncedToCloud = true;
        session.syncedToCloud = true;
        setSaveError(null);
      } catch (dbErr: any) {
        console.error('Firestore write rejected:', dbErr);
        setSaveError({
          message:
            lang === 'hi'
              ? 'क्लाउड डेटाबेस में सुरक्षित करने में समस्या। स्थानीय रूप से सुरक्षित किया गया है।'
              : 'Firestore synchronization failed. Your entry is saved locally.',
          retryPayload: { newInteraction, session },
        });
      }
    }

    if (onSaveSession) {
      onSaveSession(session);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setErrorMessage(null);
    setSaveError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            text: m.text,
          })),
          stressScore: currentStressScore,
          dominantFactor,
          dailyMood: dailyMood
            ? {
                mood: dailyMood.mood,
                label: dailyMood.label,
                emoji: dailyMood.emoji,
                stressModifier: dailyMood.stressModifier,
                note: dailyMood.note,
              }
            : undefined,
          locationContext: selectedLocation
            ? {
                title: selectedLocation.title,
                category: selectedLocation.category,
              }
            : undefined,
          language: lang,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Retain input buffer if failure occurred
        setInputText(text);
        throw new Error(
          errorData.error ||
            (lang === 'hi'
              ? 'एआई से प्रतिक्रिया प्राप्त करने में विफल।'
              : 'Failed to receive response from Gemini AI.')
        );
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text:
          data.reply ||
          (lang === 'hi'
            ? 'मैं सुन रहा हूँ। आइए एक गहरी सांस लें।'
            : 'I am here listening. Let us take a deep breath together.'),
        timestamp: Date.now(),
      };

      const finalMessages = [...updatedMessages, assistantMsg];
      setMessages(finalMessages);

      // Guaranteed transaction verification to Firestore & local cache
      await persistSessionAndInteraction(text, assistantMsg.text, finalMessages);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMessage(
        err.message ||
          (lang === 'hi'
            ? 'माइंडपल्स एआई से जुड़ने में असमर्थ। कृपया पुनः प्रयास करें।'
            : 'Unable to connect to MindPulse AI. Please try again.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Summarize the current reflection session with Gemini
  const handleGenerateSummary = async () => {
    if (messages.length <= 1 || isSummarizing) return;
    setIsSummarizing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/gemini/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.slice(1),
          language: lang,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary with Gemini.');
      }

      const data = await response.json();
      setActiveSummary(data.summary);

      // Persist summary interaction
      if (userId) {
        const summaryInteraction: UserInteraction = {
          id: `summary-${Date.now()}`,
          userId,
          createdAt: Date.now(),
          type: 'summary',
          prompt: 'Generate mindful reflection summary',
          response: data.summary,
          summary: data.summary,
          syncedToCloud: false,
        };
        saveLocalInteraction(summaryInteraction);
        if (navigator.onLine) {
          saveInteractionToFirestore(userId, summaryInteraction).catch((e) =>
            console.warn('Deferred summary save:', e)
          );
        }
      }
    } catch (err: any) {
      console.error('Summary error:', err);
      setErrorMessage(err.message || 'Failed to generate summary.');
    } finally {
      setIsSummarizing(false);
    }
  };

  // Brainstorm actionable ideas with Gemini
  const handleBrainstormIdeas = async () => {
    if (isBrainstorming) return;
    const latestTopic =
      messages[messages.length - 1]?.text || 'Mindfulness and somatic decompression';
    setIsBrainstorming(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/gemini/brainstorm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: latestTopic,
          context: `Stress score: ${currentStressScore || 'unrated'}, Mood: ${dailyMood?.label || 'calm'}`,
          language: lang,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to brainstorm ideas with Gemini.');
      }

      const data = await response.json();
      setBrainstormIdeas(data.ideas);

      // Persist brainstorm interaction
      if (userId) {
        const brainstormInteraction: UserInteraction = {
          id: `brainstorm-${Date.now()}`,
          userId,
          createdAt: Date.now(),
          type: 'brainstorm',
          prompt: latestTopic,
          response: data.ideas,
          brainstormIdeas: data.ideas,
          syncedToCloud: false,
        };
        saveLocalInteraction(brainstormInteraction);
        if (navigator.onLine) {
          saveInteractionToFirestore(userId, brainstormInteraction).catch((e) =>
            console.warn('Deferred brainstorm save:', e)
          );
        }
      }
    } catch (err: any) {
      console.error('Brainstorm error:', err);
      setErrorMessage(err.message || 'Failed to brainstorm ideas.');
    } finally {
      setIsBrainstorming(false);
    }
  };

  const handleRetrySave = async () => {
    if (!saveError?.retryPayload || !userId) return;
    const { newInteraction, session } = saveError.retryPayload;
    try {
      await Promise.all([
        saveInteractionToFirestore(userId, newInteraction),
        saveJournalSessionToFirestore(userId, session),
      ]);
      setSaveError(null);
      setSessionSaved(true);
      setTimeout(() => setSessionSaved(false), 2000);
    } catch (err: any) {
      setSaveError({
        message: 'Retry failed. Connection may still be unstable.',
        retryPayload: saveError.retryPayload,
      });
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        text:
          lang === 'hi'
            ? 'नया पृष्ठ तैयार है। अब आप किस विषय पर चिंतन करना चाहते हैं?'
            : 'Clean page ready. What would you like to reflect on now?',
        timestamp: Date.now(),
      },
    ]);
    setActiveSummary(null);
    setBrainstormIdeas(null);
    setErrorMessage(null);
    setSaveError(null);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 flex flex-col h-[calc(100vh-140px)] min-h-[620px] font-serif">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#e0e0d5] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#5A5A40]" />
            <h2 className="text-xl font-bold tracking-tight text-[#4a4a3a]">
              {getTranslation('chatTitle', lang)}
            </h2>
          </div>
          <p className="text-xs italic text-[#7a7a6a] mt-0.5">
            {lang === 'hi'
              ? 'जेमिनी 3.6 फ्लैश के साथ बहु-चरणीय चिंतन, सारांश और विचार-मंथन संवाद।'
              : 'Multi-turn mindful reflections, summaries, and somatic brainstorming with Gemini 3.6 Flash.'}
          </p>
        </div>

        {/* Action Controls & Tags */}
        <div className="flex flex-wrap items-center gap-2 font-sans text-xs">
          {/* Geotagged Location Badge */}
          {selectedLocation && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#ecece4] rounded-full text-[#5A5A40] border border-[#d8d8cc]">
              <MapPin className="h-3.5 w-3.5" />
              <span className="font-semibold">{selectedLocation.title}</span>
              {onClearLocation && (
                <button onClick={onClearLocation} className="hover:text-rose-600 ml-1">
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          )}

          {dailyMood && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#ecece4] rounded-full text-[#5A5A40] border border-[#d8d8cc]">
              <span>{dailyMood.emoji}</span>
              <span className="font-semibold">{moodDef?.label[lang] || dailyMood.label}</span>
            </div>
          )}

          {/* Summarize Reflection Button */}
          <button
            id="btn-summarize-reflection"
            onClick={handleGenerateSummary}
            disabled={messages.length <= 1 || isSummarizing}
            className="flex items-center gap-1.5 rounded-full border border-[#d8d8cc] bg-white px-3.5 py-1.5 text-[#4a4a3a] shadow-2xs hover:bg-[#ecece4] transition disabled:opacity-40"
            title="Generate mindful summary with Gemini"
          >
            <FileText className="h-3.5 w-3.5 text-[#5A5A40]" />
            <span>{isSummarizing ? 'Summarizing...' : lang === 'hi' ? 'सारांश बनाएं' : 'Summarize'}</span>
          </button>

          {/* Brainstorm Ideas Button */}
          <button
            id="btn-brainstorm-ideas"
            onClick={handleBrainstormIdeas}
            disabled={isBrainstorming}
            className="flex items-center gap-1.5 rounded-full border border-[#d8d8cc] bg-white px-3.5 py-1.5 text-[#4a4a3a] shadow-2xs hover:bg-[#ecece4] transition disabled:opacity-40"
            title="Brainstorm micro-habits and somatic practices"
          >
            <Lightbulb className="h-3.5 w-3.5 text-amber-600" />
            <span>{isBrainstorming ? 'Brainstorming...' : lang === 'hi' ? 'विचार-मंथन' : 'Brainstorm'}</span>
          </button>

          {/* Clear Session */}
          <button
            id="btn-clear-chat"
            onClick={handleClear}
            className="rounded-full border border-[#d8d8cc] p-2 text-[#7a7a6a] hover:text-[#4a4a3a] hover:bg-[#ecece4] transition"
            title="Clear and start new conversation"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Starter Prompts (shown when 1-2 messages) */}
      {messages.length <= 2 && (
        <div className="py-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#8a8a7a] font-sans font-medium mb-2.5">
            {lang === 'hi' ? 'विचारशील संवाद सुझाव' : 'Mindful Reflection Prompts'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {starterPrompts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(item.prompt)}
                className="flex items-start gap-3 rounded-2xl border border-[#e0e0d5] bg-white p-3 text-left text-xs text-[#4a4a3a] hover:border-[#5A5A40] hover:bg-[#f5f5f0] transition shadow-2xs"
              >
                <Sparkles className="h-4 w-4 text-[#5A5A40] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-sm text-[#4a4a3a]">{item.title}</span>
                  <span className="text-[11px] italic text-[#7a7a6a] line-clamp-1">{item.prompt}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Mindful Summary Card (if generated) */}
      {activeSummary && (
        <div className="my-2 rounded-2xl border border-[#5A5A40]/30 bg-[#fafaf7] p-4 text-xs leading-relaxed text-[#4a4a3a] shadow-xs relative">
          <div className="flex items-center justify-between pb-2 border-b border-[#e0e0d5] mb-2 font-sans font-bold text-[#5A5A40]">
            <span className="flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              {lang === 'hi' ? 'चिंतन सारांश (जेमिनी 3.6 फ्लैश)' : 'Mindful Reflection Summary (Gemini 3.6 Flash)'}
            </span>
            <button
              onClick={() => setActiveSummary(null)}
              className="text-[#7a7a6a] hover:text-[#4a4a3a]"
            >
              ✕
            </button>
          </div>
          <div className="whitespace-pre-wrap">{activeSummary}</div>
        </div>
      )}

      {/* Active Brainstorming Ideas Card (if generated) */}
      {brainstormIdeas && (
        <div className="my-2 rounded-2xl border border-amber-300 bg-amber-50/70 p-4 text-xs leading-relaxed text-amber-950 shadow-xs relative">
          <div className="flex items-center justify-between pb-2 border-b border-amber-200 mb-2 font-sans font-bold text-amber-800">
            <span className="flex items-center gap-1.5">
              <Lightbulb className="h-4 w-4" />
              {lang === 'hi' ? 'कार्यवाही विचार-मंथन' : 'Somatic & Cognitive Brainstorming Ideas'}
            </span>
            <button
              onClick={() => setBrainstormIdeas(null)}
              className="text-amber-700 hover:text-amber-950"
            >
              ✕
            </button>
          </div>
          <div className="whitespace-pre-wrap">{brainstormIdeas}</div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
        {messages.map((msg) => {
          const isAi = msg.role === 'assistant';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
            >
              {isAi && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#5A5A40] text-[#f5f5f0] shadow-xs text-xs font-serif font-bold">
                  AI
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-[28px] p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
                  isAi
                    ? 'border border-[#e0e0d5] bg-white text-[#4a4a3a] shadow-xs'
                    : 'bg-[#5A5A40] text-[#f5f5f0] shadow-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div
                  className={`mt-2 flex items-center justify-between text-[10px] font-sans ${
                    isAi ? 'text-[#8a8a7a]' : 'text-white/70'
                  }`}
                >
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {isAi && <span className="italic">Gemini 3.6 Flash</span>}
                </div>
              </div>

              {!isAi && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ecece4] text-[#5A5A40] border border-[#d8d8cc]">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5A5A40] text-white">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-[24px] border border-[#e0e0d5] bg-white p-4 text-xs text-[#7a7a6a] italic flex items-center gap-2">
              <Sparkles className="h-4 w-4 animate-spin text-[#5A5A40]" />
              <span>Gemini 3.6 Flash is thoughtfully reflecting...</span>
            </div>
          </div>
        )}

        {/* Database Write Error Banner with Retry Save Option */}
        {saveError && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-3.5 text-xs text-amber-900 font-sans flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0" />
              <span>{saveError.message}</span>
            </div>
            <button
              id="btn-retry-save"
              onClick={handleRetrySave}
              className="flex items-center gap-1 rounded-full bg-amber-700 px-3 py-1 text-white font-semibold hover:bg-amber-800 transition shrink-0"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Retry Save</span>
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
            {errorMessage}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="pt-3 border-t border-[#e0e0d5]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            id="chat-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder={
              lang === 'hi'
                ? 'अपने विचार लिखें, मार्गदर्शन मांगें या सारांश का अनुरोध करें...'
                : 'Write your thoughts, ask for guidance, or request a summary...'
            }
            className="flex-1 rounded-full border border-[#d8d8cc] bg-white px-5 py-3 text-xs sm:text-sm text-[#4a4a3a] placeholder-[#8a8a7a] focus:border-[#5A5A40] focus:outline-none focus:ring-1 focus:ring-[#5A5A40] shadow-2xs"
          />

          <button
            id="btn-send-message"
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-xs transition ${
              !inputText.trim() || isLoading
                ? 'cursor-not-allowed bg-[#d8d8cc] text-white'
                : 'bg-[#5A5A40] text-white hover:bg-[#484833]'
            }`}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#8a8a7a] font-sans">
          <span>
            {lang === 'hi'
              ? 'क्लाउड फायरस्टोर में पृथक प्रविष्टियां • उपयोगकर्ता-स्तरीय सुरक्षा नियम'
              : 'User-isolated Cloud Firestore storage • Strict owner-bound security'}
          </span>
          <span className="italic">Powered by Gemini 3.6 Flash (Resilient Fallback Ladder)</span>
        </div>
      </div>
    </div>
  );
};
