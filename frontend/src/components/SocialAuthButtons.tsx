import { useMutation } from '@tanstack/react-query';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

interface Props {
  mode: 'login' | 'signup';
}

export default function SocialAuthButtons({ mode }: Props) {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const googleMutation = useMutation({
    mutationFn: (credential: string) => authService.googleLogin(credential),
    onSuccess: (data) => {
      setUser(data.user);
      toast.success(mode === 'signup' ? 'Welcome to PhysVerse! 🎉' : `Welcome back, ${data.user.name}!`);
      const target = mode === 'signup' && !data.user.onboardingCompleted ? '/onboarding' : '/dashboard';
      navigate(target, { replace: true });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || 'Google sign-in failed');
    }
  });

  const handleSuccess = (resp: CredentialResponse) => {
    if (!resp.credential) {
      toast.error('No Google credential received');
      return;
    }
    googleMutation.mutate(resp.credential);
  };

  if (!clientId) {
    return (
      <div className="text-center text-xs text-gray-500 py-2 px-3 rounded-lg border border-dashed border-gray-700/50">
        Social sign-in unavailable (VITE_GOOGLE_CLIENT_ID not configured)
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        className="flex justify-center [color-scheme:dark] [&>*]:!w-full [&_iframe]:!w-full"
        aria-busy={googleMutation.isPending}
      >
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => toast.error('Google sign-in failed')}
          theme="filled_black"
          shape="rectangular"
          size="large"
          text={mode === 'signup' ? 'signup_with' : 'signin_with'}
          logo_alignment="center"
          width="280"
        />
      </div>
      {googleMutation.isPending && (
        <p className="text-[11px] text-center text-gray-400">Verifying Google credentials…</p>
      )}
    </div>
  );
}
