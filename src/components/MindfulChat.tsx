import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, BookOpen, User, Bot, RotateCcw, Copy, Check, Save, Cloud, CornerDownLeft, Heart } from 'lucide-react';
import { ChatMessage, DailyMoodRecord, JournalSession, Language } from '../types';
import { saveLocalJournal } from '../lib/offlineSync';
import { saveJournalSessionToFirestore } from '../lib/firebase';
import { getTranslation } from '../lib/i18n';
import { MOOD_DEFINITIONS } from '../lib/scoring';

interface MindfulChatProps {
  userId?: string;
  currentStressScore?: number;
  dominantFactor?: string;
  dailyMood?: DailyMoodRecord | null;
  lang?: Language;
  onSaveSession?: (session: JournalSession) => void;
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
}) => {
  const starterPrompts = lang === 'hi' ? STARTER_PROMPTS_HI : STARTER_PROMPTS_EN;
  const moodDef = dailyMood ? MOOD_DEFINITIONS[dailyMood.mood] : null;

  const initialWelcome = lang === 'hi'
    ? `नमस्ते। मैं आपका माइंडपल्स (MindPulse) साथी हूँ। चाहे आप अपनी चिंताएं साझा करना चाहें, तनाव के कारणों को समझना चाहें, या मानसिक शांति के लिए छोटे कदम खोजना चाहें, मैं आपके साथ हूँ। ${
        currentStressScore
          ? `आपका हालिया तनाव स्कोर ${currentStressScore}/1000 है${dominantFactor ? ` (मुख्य कारण: ${dominantFactor})` : ''}।`
          : ''
      }${dailyMood ? ` आज आपका मूड "${moodDef?.label.hi || dailyMood.label}" ${dailyMood.emoji} दर्ज है।` : ''} आज आपके मन में क्या चल रहा है?`
    : `Hello. I am your MindPulse companion. Whether you want to unload mental clutter, explore what is driving your stress, or brainstorm micro-actions for peace of mind, I am here with you. ${
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
  const [sessionSaved, setSessionSaved] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

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
          dailyMood: dailyMood ? {
            mood: dailyMood.mood,
            label: dailyMood.label,
            emoji: dailyMood.emoji,
            stressModifier: dailyMood.stressModifier,
            notes: dailyMood.notes,
          } : undefined,
          language: lang,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || (lang === 'hi' ? 'एआई से प्रतिक्रिया प्राप्त करने में विफल।' : 'Failed to receive response from Gemini AI.'));
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: data.reply || (lang === 'hi' ? 'मैं सुन रहा हूँ। आइए एक गहरी सांस लें।' : 'I am here listening. Let us take a deep breath together.'),
        timestamp: Date.now(),
      };

      const finalMessages = [...updatedMessages, assistantMsg];
      setMessages(finalMessages);

      // Automatically preserve locally
      if (userId) {
        const session: JournalSession = {
          id: `journal-${Date.now()}`,
          userId,
          title: text.slice(0, 45) + '...',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          messages: finalMessages,
          associatedScore: currentStressScore,
          syncedToCloud: false,
        };
        saveLocalJournal(session);
        if (navigator.onLine) {
          saveJournalSessionToFirestore(userId, session).catch((e) =>
            console.warn('Firestore journal background sync deferred:', e)
          );
        }
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMessage(err.message || (lang === 'hi' ? 'माइंडपल्स एआई से जुड़ने में असमर्थ। कृपया पुनः प्रयास करें।' : 'Unable to connect to MindPulse AI. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        text: lang === 'hi' ? 'नया पृष्ठ तैयार है। अब आप किस विषय पर चिंतन करना चाहते हैं?' : 'Clean page ready. What would you like to reflect on now?',
        timestamp: Date.now(),
      },
    ]);
    setErrorMessage(null);
  };

  const handleManualSave = async () => {
    if (!userId || messages.length <= 1) return;
    const session: JournalSession = {
      id: `journal-${Date.now()}`,
      userId,
      title: messages[1]?.text.slice(0, 45) || (lang === 'hi' ? 'माइंडफुल चिंतन' : 'Mindful Reflection'),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages,
      associatedScore: currentStressScore,
      syncedToCloud: false,
    };
    saveLocalJournal(session);
    if (navigator.onLine) {
      try {
        await saveJournalSessionToFirestore(userId, session);
        session.syncedToCloud = true;
      } catch (e) {
        console.warn('Deferred offline save:', e);
      }
    }
    if (onSaveSession) onSaveSession(session);
    setSessionSaved(true);
    setTimeout(() => setSessionSaved(false), 2500);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 flex flex-col h-[calc(100vh-140px)] min-h-[580px] font-serif">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#e0e0d5]">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#5A5A40]" />
            <h2 className="text-xl font-bold tracking-tight text-[#4a4a3a]">
              {getTranslation('chatTitle', lang)}
            </h2>
          </div>
          <p className="text-xs italic text-[#7a7a6a] mt-0.5">
            {lang === 'hi'
              ? 'संज्ञानात्मक सुधार, भावनात्मक मुक्ति और विचारशील आत्मचिंतन के लिए जेमिनी एआई के साथ बहु-चरणीय संवाद।'
              : 'Real multi-turn conversation with Gemini AI for cognitive reframing, emotional release, and thoughtful unpacking.'}
          </p>
        </div>

        <div className="flex items-center gap-2 font-sans">
          {dailyMood && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#ecece4] rounded-full text-xs text-[#5A5A40] border border-[#d8d8cc]">
              <span>{dailyMood.emoji}</span>
              <span className="font-semibold">{moodDef?.label[lang] || dailyMood.label}</span>
            </div>
          )}

          {userId && (
            <button
              id="btn-save-journal"
              onClick={handleManualSave}
              disabled={messages.length <= 1}
              className="flex items-center gap-1.5 rounded-full border border-[#d8d8cc] bg-white px-4 py-1.5 text-xs font-medium text-[#4a4a3a] shadow-2xs hover:bg-[#ecece4] transition"
            >
              {sessionSaved ? (
                <>
                  <Check className="h-3.5 w-3.5 text-[#5A5A40]" />
                  <span>{getTranslation('savedNotification', lang)}</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5 text-[#7a7a6a]" />
                  <span>{getTranslation('saveJournalBtn', lang)}</span>
                </>
              )}
            </button>
          )}

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

      {/* Quick Starter Prompts (shown when only 1 or 2 messages) */}
      {messages.length <= 2 && (
        <div className="py-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#8a8a7a] font-sans font-medium mb-3">
            {lang === 'hi' ? 'विचारशील संवाद सुझाव' : 'Mindful Conversation Starters'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {starterPrompts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(item.prompt)}
                className="flex items-start gap-3 rounded-2xl border border-[#e0e0d5] bg-white p-3.5 text-left text-xs text-[#4a4a3a] hover:border-[#5A5A40] hover:bg-[#f5f5f0] transition shadow-2xs"
              >
                <Sparkles className="h-4 w-4 text-[#5A5A40] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-sm text-[#4a4a3a]">
                    {item.title}
                  </span>
                  <span className="text-[11px] italic text-[#7a7a6a] line-clamp-1">{item.prompt}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
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
                  className={`mt-2 text-[10px] font-sans ${
                    isAi ? 'text-[#8a8a7a]' : 'text-white/70'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
              <span>MindPulse is thoughtfully reflecting...</span>
            </div>
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
            placeholder={lang === 'hi' ? 'अपने विचार, चिंताएं लिखें या मार्गदर्शन मांगें...' : 'Type your thoughts, worries, or ask for guidance...'}
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
          <span>{lang === 'hi' ? 'सुरक्षित क्लाइंट वॉल्ट एवं अलग-अलग उपयोगकर्ता डेटा पृथक्करण।' : 'Encrypted client vault & Firestore persistence with zero cross-user leakage.'}</span>
          <span className="italic">Powered by Gemini 2.5 Flash</span>
        </div>
      </div>
    </div>
  );
};
