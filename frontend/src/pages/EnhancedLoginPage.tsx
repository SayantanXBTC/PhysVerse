import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { Eye, EyeOff, Rocket, Sparkles, Zap, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import SocialAuthButtons from '@/components/SocialAuthButtons';
import AuthDivider from '@/components/AuthDivider';

export default function EnhancedLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const [slowBackend, setSlowBackend] = useState(false);

  const loginMutation = useMutation({
    mutationFn: () => authService.login(email, password, rememberMe),
    onSuccess: (data) => {
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate('/dashboard', { replace: true });
    },
    onError: (err: any) => {
      const status = err?.response?.status;
      const msg = err?.response?.data?.error
        || (err?.code === 'ECONNABORTED' ? 'Server took too long to respond. Try again.' : null)
        || (!status ? 'Cannot reach server. Check your connection.' : 'Login failed');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* Back Button - Fixed Top Left */}
      <Link
        to="/"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-black/50 hover:bg-black/70 border border-gray-700/50 hover:border-red-500/50 rounded-xl text-gray-400 hover:text-white transition-all group backdrop-blur-sm"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-semibold">Back to Home</span>
      </Link>

      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Particle Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(239, 68, 68, 0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-4">

        {/* Logo/Brand */}
        <div className="text-center mb-8 animate-fadeInUp">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl shadow-2xl shadow-red-500/50 mb-4 animate-bounce">
            <Rocket className="text-white" size={40} />
          </div>
          <h1 className="text-5xl font-black mb-2 bg-gradient-to-r from-red-400 via-rose-400 to-red-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-lg">Sign in to continue your physics journey</p>
        </div>

        {/* Login Card */}
        <div className="glass-red p-8 rounded-3xl border-2 border-red-500/30 shadow-2xl shadow-red-900/50 animate-scaleIn">
          <SocialAuthButtons mode="login" />
          <AuthDivider />
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-200">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border-2 border-gray-700/50 rounded-xl focus:outline-none focus:border-red-500/50 text-white placeholder-gray-500 transition-all"
                placeholder="your@email.com"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-200">
                  Password
                </label>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-red-400 hover:text-red-300 transition-colors font-semibold"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-black/50 border-2 border-gray-700/50 rounded-xl focus:outline-none focus:border-red-500/50 text-white placeholder-gray-500 transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-700 bg-black/50 text-red-600 focus:ring-red-500 focus:ring-offset-0"
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-gray-300">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg shadow-red-500/50 hover:shadow-red-500/70 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loginMutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <Zap size={20} />
                  Sign In
                </>
              )}
            </button>
            {slowBackend && (
              <p className="text-xs text-center text-yellow-400/90 -mt-2 animate-pulse">
                Still working… server may be waking up.
              </p>
            )}
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-red-400 hover:text-red-300 font-semibold transition-colors inline-flex items-center gap-1">
                Sign up <Sparkles size={16} />
              </Link>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <div className="glass-red p-4 rounded-xl">
            <div className="text-2xl mb-1">🎯</div>
            <div className="text-xs text-gray-400">30+ Simulations</div>
          </div>
          <div className="glass-red p-4 rounded-xl">
            <div className="text-2xl mb-1">🏆</div>
            <div className="text-xs text-gray-400">Achievements</div>
          </div>
          <div className="glass-red p-4 rounded-xl">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-xs text-gray-400">Progress Tracking</div>
          </div>
        </div>
      </div>
    </div>
  );
}
