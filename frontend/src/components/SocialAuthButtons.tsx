import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

interface Props {
  mode: 'login' | 'signup';
}

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (opts: {
            client_id: string;
            callback: (resp: { credential?: string }) => void;
            ux_mode?: string;
            auto_select?: boolean;
          }) => void;
          prompt: (cb?: (notif: any) => void) => void;
          disableAutoSelect: () => void;
          cancel: () => void;
        };
      };
    };
  }
}

export default function SocialAuthButtons({ mode }: Props) {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const [ready, setReady] = useState(false);
  const initedRef = useRef(false);

  const googleMutation = useMutation({
    mutationFn: (credential: string) => authService.googleLogin(credential),
    onSuccess: (data) => {
      setUser(data.user);
      toast.success(mode === 'signup' ? 'Welcome to PhysVerse!' : `Welcome back, ${data.user.name}!`);
      const target = mode === 'signup' && !data.user.onboardingCompleted ? '/onboarding' : '/dashboard';
      navigate(target, { replace: true });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || 'Google sign-in failed');
    }
  });

  useEffect(() => {
    if (!clientId) return;
    const check = () => {
      if (window.google?.accounts?.id) {
        if (!initedRef.current) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (resp) => {
              if (resp.credential) googleMutation.mutate(resp.credential);
              else toast.error('No Google credential received');
            },
            auto_select: false
          });
          initedRef.current = true;
        }
        setReady(true);
      } else {
        setTimeout(check, 200);
      }
    };
    check();
    return () => {
      window.google?.accounts?.id?.cancel?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  const handleClick = () => {
    if (!ready || !window.google?.accounts?.id) {
      toast.error('Google sign-in not ready');
      return;
    }
    window.google.accounts.id.prompt((notif: any) => {
      if (notif?.isNotDisplayed?.() || notif?.isSkippedMoment?.()) {
        toast.error('Google prompt blocked. Allow third-party cookies and try again.');
      }
    });
  };

  if (!clientId) {
    return (
      <div className="text-center text-[11px] text-gray-500 py-2 px-3 rounded-lg border border-dashed border-gray-700/50">
        Social sign-in unavailable (VITE_GOOGLE_CLIENT_ID not configured)
      </div>
    );
  }

  const label = mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google';

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={googleMutation.isPending || !ready}
      className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-red-500/20 hover:border-red-500/50 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={label}
    >
      {googleMutation.isPending ? (
        <>
          <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          <span>Verifying…</span>
        </>
      ) : (
        <>
          <GoogleG />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

function GoogleG() {
  return (
    <svg viewBox="0 0 48 48" width="16" height="16" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}
