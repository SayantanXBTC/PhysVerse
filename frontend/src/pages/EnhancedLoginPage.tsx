import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import SocialAuthButtons from '@/components/SocialAuthButtons';
import { AuthCard } from '@/components/ui/auth-card';

export default function EnhancedLoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [slowBackend, setSlowBackend] = useState(false);

  const loginMutation = useMutation({
    mutationFn: (v: { email: string; password: string; rememberMe: boolean }) =>
      authService.login(v.email, v.password, v.rememberMe),
    onSuccess: (data) => {
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate('/dashboard', { replace: true });
    },
    onError: (err: any) => {
      const status = err?.response?.status;
      const msg =
        err?.response?.data?.error ||
        (err?.code === 'ECONNABORTED' ? 'Server took too long to respond. Try again.' : null) ||
        (!status ? 'Cannot reach server. Check your connection.' : 'Login failed');
      toast.error(msg);
    }
  });

  useEffect(() => {
    if (!loginMutation.isPending) {
      setSlowBackend(false);
      return;
    }
    const t = setTimeout(() => setSlowBackend(true), 3000);
    return () => clearTimeout(t);
  }, [loginMutation.isPending]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      <Link
        to="/"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-black/50 hover:bg-black/70 border border-red-500/30 hover:border-red-500/60 rounded-xl text-gray-400 hover:text-white transition-all group backdrop-blur-sm"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back</span>
      </Link>

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <AuthCard
        mode="login"
        isLoading={loginMutation.isPending}
        slowBackend={slowBackend}
        onSubmit={(v) => loginMutation.mutate({ email: v.email, password: v.password, rememberMe: v.rememberMe })}
        googleSlot={<SocialAuthButtons mode="login" />}
      />
    </div>
  );
}
