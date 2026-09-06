import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  BookOpen,
  MapPin,
  Heart,
  ArrowRight,
  Lock,
  Globe,
  CheckCircle2,
  Brain,
  MessageSquare,
  Compass,
} from 'lucide-react';
import { signInWithGoogle, signInAsGuest } from '../lib/firebase';
import { Language } from '../types';

interface LandingPageProps {
  onAuthenticated: () => void;
  lang: Language;
  setLang: (l: Language) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onAuthenticated, lang, setLang }) => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setErrorMsg(null);
    try {
      await signInWithGoogle();
      onAuthenticated();
    } catch (err: any) {
      console.error('Google Sign In failed:', err);
      // If popup was blocked or user closed it, provide helpful guidance
      if (err.code === 'auth/popup-blocked') {
        setErrorMsg(
          lang === 'hi'
            ? 'पॉपअप ब्लॉक हो गया था। कृपया ब्राउज़र सेटिंग्स में पॉपअप की अनुमति दें या डेमो देखें।'
            : 'Sign-in popup was blocked by browser. Please enable popups or try guest preview.'
        );
      } else if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(err.message || 'Authentication error. Please try again.');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGuestAccess = async () => {
    setIsSigningIn(true);
    setErrorMsg(null);
    try {
      await signInAsGuest();
      onAuthenticated();
    } catch (err: any) {
      console.error('Guest sign-in failed:', err);
      setErrorMsg('Failed to initialize guest preview session.');
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#4a4a3a] flex flex-col font-serif">
      {/* Top Bar */}
      <header className="w-full border-b border-[#e0e0d5] bg-[#ecece4]/90 backdrop-blur-md px-4 py-3 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5A5A40] text-[#f5f5f0] shadow-xs text-lg font-bold">
              M
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#4a4a3a]">MindPulse</span>
              <span className="hidden sm:inline-block ml-2 text-xs italic text-[#7a7a6a]">
                {lang === 'hi' ? 'मानसिक शांति व चिंतन स्टूडियो' : 'Mindful Journal & Reflection Studio'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switch */}
            <div className="flex items-center rounded-full bg-white/80 p-0.5 border border-[#d8d8cc]">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-full text-xs font-sans transition-all ${
                  lang === 'en'
                    ? 'bg-[#5A5A40] text-white font-semibold shadow-2xs'
                    : 'text-[#7a7a6a] hover:text-[#4a4a3a]'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`px-3 py-1 rounded-full text-xs font-sans transition-all ${
                  lang === 'hi'
                    ? 'bg-[#5A5A40] text-white font-semibold shadow-2xs'
                    : 'text-[#7a7a6a] hover:text-[#4a4a3a]'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero & Sign-In Section */}
      <main className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-8">
        <div className="mx-auto max-w-4xl w-full">
          {/* Main Card */}
          <div className="rounded-[32px] border border-[#d8d8cc] bg-white p-6 sm:p-12 shadow-sm relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#ecece4]/60 rounded-full blur-3xl -z-0 pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>

            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#5A5A40]/30 bg-[#f5f5f0] px-3.5 py-1 text-xs text-[#5A5A40] font-sans font-medium mb-6">
                <Lock className="h-3.5 w-3.5" />
                <span>
                  {lang === 'hi'
                    ? 'उपयोगकर्ता-प्रमाणीकृत निजी डेटा पृथक्करण'
                    : 'User-Isolated Private Document Storage'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#4a4a3a] leading-tight">
                {lang === 'hi'
                  ? 'अपने विचारों को गहराई से समझें और मानसिक शांति पाएं।'
                  : 'A quiet sanctuary for mindful reflections & AI conversations.'}
              </h1>

              <p className="mt-4 text-base sm:text-lg text-[#6a6a5a] leading-relaxed">
                {lang === 'hi'
                  ? 'माइंडपल्स आपके व्यक्तिगत चिंतन, दैनिक मनोदशा और तनाव के स्तर को जेमिनी 3.6 फ्लैश एआई और क्लाउड फायरस्टोर के साथ सुरक्षित रखता है।'
                  : 'Write multi-turn journal entries, converse with Gemini 3.6 Flash for compassionate reflections, and explore geotagged mindful sanctuaries with Google Maps.'}
              </p>

              {/* Error Notice */}
              {errorMsg && (
                <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-sans text-rose-800">
                  {errorMsg}
                </div>
              )}

              {/* Primary Call to Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 font-sans">
                <button
                  id="btn-landing-google-signin"
                  onClick={handleGoogleSignIn}
                  disabled={isSigningIn}
                  className="flex items-center justify-center gap-3 rounded-full bg-[#5A5A40] px-7 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-[#484833] transition disabled:opacity-60"
                >
                  {isSigningIn ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 animate-spin" />
                      <span>{lang === 'hi' ? 'प्रमाणीकरण हो रहा है...' : 'Authenticating...'}</span>
                    </span>
                  ) : (
                    <>
                      {/* Google G icon */}
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                      </svg>
                      <span>{lang === 'hi' ? 'गूगल से साइन इन करें' : 'Sign In with Google'}</span>
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </button>

                <button
                  id="btn-landing-guest-preview"
                  onClick={handleGuestAccess}
                  disabled={isSigningIn}
                  className="flex items-center justify-center gap-2 rounded-full border border-[#d8d8cc] bg-white px-6 py-3.5 text-sm font-medium text-[#5A5A40] hover:bg-[#ecece4] transition"
                >
                  <span>{lang === 'hi' ? 'अतिथि के रूप में अन्वेषण करें' : 'Explore Guest Preview'}</span>
                </button>
              </div>

              {/* Pillars Highlights */}
              <div className="mt-10 pt-8 border-t border-[#e8e8df] grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#5A5A40] font-sans">
                    <ShieldCheck className="h-4 w-4" />
                    <span>{lang === 'hi' ? 'शून्य डेटा रिसाव' : 'Isolated Firestore'}</span>
                  </div>
                  <p className="text-xs text-[#7a7a6a] leading-relaxed">
                    {lang === 'hi'
                      ? 'प्रत्येक उपयोगकर्ता की प्रविष्टियां केवल उन्हीं के खाते तक सीमित हैं।'
                      : 'Security rules enforce request.auth.uid == userId across all collections.'}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#5A5A40] font-sans">
                    <Brain className="h-4 w-4" />
                    <span>{lang === 'hi' ? 'जेमिनी 3.6 फ्लैश' : 'Gemini 3.6 Flash'}</span>
                  </div>
                  <p className="text-xs text-[#7a7a6a] leading-relaxed">
                    {lang === 'hi'
                      ? 'बहु-चरणीय चिंतन, सारांश और विचार-मंथन के लिए उन्नत सहायक।'
                      : 'Multi-turn reflection, mindful summarization, and somatic brainstorming.'}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#5A5A40] font-sans">
                    <Compass className="h-4 w-4" />
                    <span>{lang === 'hi' ? 'गूगल मैप्स प्लेटफॉर्म' : 'Google Maps Platform'}</span>
                  </div>
                  <p className="text-xs text-[#7a7a6a] leading-relaxed">
                    {lang === 'hi'
                      ? 'शांतिपूर्ण स्थानों को जियोटैग करें और ध्यान केंद्र खोजें।'
                      : 'Geotag mindful reflections and explore serene nature sanctuaries.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#e0e0d5] bg-[#ecece4]/60 py-4 px-4 text-center text-xs text-[#7a7a6a] font-sans">
        <p>MindPulse &copy; {new Date().getFullYear()} &bull; Google AI Studio &bull; Firebase Auth &bull; Cloud Firestore &bull; Google Maps Platform</p>
      </footer>
    </div>
  );
};
