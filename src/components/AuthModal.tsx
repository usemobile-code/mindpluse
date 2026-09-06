import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { X, ShieldCheck, LogOut, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { signInWithGoogle, signInAsGuest, logOut } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, currentUser }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      console.error('Sign-in error:', err);
      // If popup blocked or cancelled
      setErrorMsg(err.message || 'Failed to sign in with Google. You can use Guest mode.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      await signInAsGuest();
      onClose();
    } catch (err: any) {
      console.error('Guest sign-in error:', err);
      setErrorMsg(err.message || 'Failed to initialize guest session.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      await logOut();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Sign out failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs font-serif">
      <div
        id="auth-modal-container"
        className="w-full max-w-md rounded-[32px] border border-[#e0e0d5] bg-white p-6 sm:p-8 shadow-xl"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#e0e0d5]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#5A5A40]" />
            <h3 className="text-xl font-bold tracking-tight text-[#4a4a3a]">
              {currentUser ? 'Profile & Vault Security' : 'User Authentication'}
            </h3>
          </div>
          <button
            id="btn-close-auth-modal"
            onClick={onClose}
            className="rounded-full p-1.5 text-[#7a7a6a] hover:bg-[#ecece4] hover:text-[#4a4a3a] transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {currentUser ? (
          <div className="mt-5 space-y-4">
            <div className="flex items-center gap-3.5 rounded-2xl border border-[#e0e0d5] bg-[#f5f5f0] p-4">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User'}
                  className="h-12 w-12 rounded-full object-cover border border-[#d8d8cc]"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#5A5A40] text-white text-lg font-bold">
                  {(currentUser.displayName || currentUser.email || 'G')[0].toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-bold text-[#4a4a3a] truncate text-base">
                  {currentUser.displayName || (currentUser.isAnonymous ? 'Guest Explorer' : 'Signed-in User')}
                </p>
                <p className="text-xs italic text-[#7a7a6a] truncate">
                  {currentUser.email || `Anonymous ID: ${currentUser.uid.slice(0, 10)}...`}
                </p>
                <span className="inline-flex items-center gap-1 mt-1 text-[11px] text-[#5A5A40] font-sans font-medium">
                  <CheckCircle2 className="h-3 w-3" />
                  Isolated Firestore Vault Active
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-[#d8d8cc] bg-[#ecece4]/60 p-4 text-xs text-[#4a4a3a]">
              <div className="flex items-center gap-1.5 font-bold text-[#5A5A40] mb-1">
                <Lock className="h-3.5 w-3.5" />
                Zero Cross-User Data Leakage
              </div>
              <p className="italic text-[#7a7a6a]">
                Your stress assessments and journal sessions are strictly quarantined to your private Firestore namespace (
                <code className="text-[#5A5A40] font-mono not-italic text-[10px]">users/{currentUser.uid}</code>
                ). Nobody else can access or view your logs.
              </p>
            </div>

            {currentUser.isAnonymous && (
              <div className="space-y-2 pt-2">
                <p className="text-xs italic text-[#7a7a6a]">
                  You are currently using an anonymous guest session. Connect Google to keep your assessments synced across devices forever.
                </p>
                <button
                  id="btn-upgrade-google"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-[#d8d8cc] bg-white py-2.5 text-xs font-semibold text-[#4a4a3a] shadow-xs hover:bg-[#ecece4] transition font-sans"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  Connect Google Account
                </button>
              </div>
            )}

            <button
              id="btn-signout"
              onClick={handleSignOut}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-rose-200 bg-rose-50 py-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition font-sans"
            >
              <LogOut className="h-4 w-4" />
              Sign Out of Session
            </button>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <p className="text-xs italic text-[#7a7a6a]">
              Sign in with Firebase to isolate your mental health assessments, track stress score trajectories over time, and synchronize offline logs automatically.
            </p>

            <div className="space-y-3 font-sans">
              <button
                id="btn-google-signin"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2.5 rounded-full border border-[#d8d8cc] bg-white py-3 text-sm font-semibold text-[#4a4a3a] shadow-xs hover:bg-[#ecece4] transition"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                {loading ? 'Authenticating...' : 'Sign In with Google'}
              </button>

              <div className="relative flex items-center justify-center py-1">
                <div className="w-full border-t border-[#e0e0d5]"></div>
                <span className="absolute bg-white px-2 text-[11px] text-[#8a8a7a]">
                  or explore instantly
                </span>
              </div>

              <button
                id="btn-guest-signin"
                onClick={handleGuestSignIn}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-[#d8d8cc] bg-[#f5f5f0] py-2.5 text-xs font-semibold text-[#5A5A40] hover:bg-[#ecece4] transition"
              >
                <span>Continue as Guest Explorer</span>
              </button>
            </div>

            <div className="rounded-2xl bg-[#ecece4]/70 p-3.5 text-[11px] italic text-[#7a7a6a]">
              🔒 Privacy First: All data is saved directly in your isolated Firestore user namespace. No marketing trackers or external profiling.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
