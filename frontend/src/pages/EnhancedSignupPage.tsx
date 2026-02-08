import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { Eye, EyeOff, Rocket, Sparkles, Check, X, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EnhancedSignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  // Password strength indicators
  const passwordChecks = {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

  const signupMutation = useMutation({
    mutationFn: () => authService.register(name, email, password),
    onSuccess: (data) => {
      setUser(data.user);
      toast.success('Welcome to PhysVerse! 🎉');
      navigate('/onboarding', { replace: true }); // Replace history for better back button behavior
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || 'Registration failed');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordStrength < 2) {
      toast.error('Please use a stronger password');
      return;
    }
    signupMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center py-12">
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
            Join PhysVerse
          </h1>
          <p className="text-gray-400 text-lg">Start your physics adventure today</p>
        </div>

        {/* Signup Card */}
        <div className="glass-red p-8 rounded-3xl border-2 border-red-500/30 shadow-2xl shadow-red-900/50 animate-scaleIn">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-200">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border-2 border-gray-700/50 rounded-xl focus:outline-none focus:border-red-500/50 text-white placeholder-gray-500 transition-all"
                placeholder="John Doe"
                required
                minLength={2}
                maxLength={50}
              />
            </div>

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
              <label htmlFor="password" className="block text-sm font-semibold text-gray-200">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-black/50 border-2 border-gray-700/50 rounded-xl focus:outline-none focus:border-red-500/50 text-white placeholder-gray-500 transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Password Strength */}
              {password && (
                <div className="space-y-2 mt-3">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((index) => (
                      <div
                        key={index}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          index < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">
                    Password strength: <span className={`font-semibold ${passwordStrength >= 3 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {strengthLabels[passwordStrength - 1] || 'Too weak'}
                    </span>
                  </p>
                  <div className="space-y-1">
                    {Object.entries({
                      'At least 6 characters': passwordChecks.length,
                      'One uppercase letter': passwordChecks.uppercase,
                      'One lowercase letter': passwordChecks.lowercase,
                      'One number': passwordChecks.number,
                    }).map(([label, met]) => (
                      <div key={label} className="flex items-center gap-2 text-xs">
                        {met ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <X size={14} className="text-gray-600" />
                        )}
                        <span className={met ? 'text-green-400' : 'text-gray-500'}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="text-xs text-gray-400">
              By signing up, you agree to our{' '}
              <Link to="/terms" className="text-red-400 hover:text-red-300">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-red-400 hover:text-red-300">Privacy Policy</Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={signupMutation.isPending || passwordStrength < 2}
              className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg shadow-red-500/50 hover:shadow-red-500/70 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {signupMutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating account...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-red-400 hover:text-red-300 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <div className="glass-red p-4 rounded-xl">
            <div className="text-2xl mb-1">🚀</div>
            <div className="text-xs text-gray-400">Free Forever</div>
          </div>
          <div className="glass-red p-4 rounded-xl">
            <div className="text-2xl mb-1">⚡</div>
            <div className="text-xs text-gray-400">Instant Access</div>
          </div>
          <div className="glass-red p-4 rounded-xl">
            <div className="text-2xl mb-1">🎓</div>
            <div className="text-xs text-gray-400">Learn & Grow</div>
          </div>
        </div>
      </div>
    </div>
  );
}
