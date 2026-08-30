import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from 'lucide-react';
import { cn } from '@/lib/utils';

function Input({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'flex h-10 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base outline-none transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className
      )}
      {...props}
    />
  );
}

export interface AuthCardProps {
  mode: 'login' | 'signup';
  isLoading?: boolean;
  onSubmit: (values: { name?: string; email: string; password: string; rememberMe: boolean }) => void;
  googleSlot?: ReactNode;
  slowBackend?: boolean;
}

/**
 * Premium dual-mode auth card. Red palette. 3D tilt, animated border beams,
 * glow halo. Reused by both login + signup pages.
 */
export function AuthCard({ mode, isLoading = false, onSubmit, googleSlot, slowBackend = false }: AuthCardProps) {
  const isSignup = mode === 'signup';
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focused, setFocused] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [8, -8]);
  const rotateY = useTransform(mouseX, [-300, 300], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name: isSignup ? name : undefined, email, password, rememberMe });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-sm relative z-10"
      style={{ perspective: 1500 }}
    >
      <motion.div
        className="relative"
        style={{ rotateX, rotateY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative group">
          <motion.div
            className="absolute -inset-[1px] rounded-2xl opacity-70"
            animate={{
              boxShadow: [
                '0 0 20px 2px rgba(229,72,77,0.15)',
                '0 0 40px 8px rgba(229,72,77,0.30)',
                '0 0 20px 2px rgba(229,72,77,0.15)'
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
          />

          <div className="absolute -inset-[1px] rounded-2xl overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-[2px] w-[45%] bg-gradient-to-r from-transparent via-red-400 to-transparent"
              initial={{ filter: 'blur(2px)' }}
              animate={{ left: ['-45%', '100%'], opacity: [0.4, 0.9, 0.4] }}
              transition={{ left: { duration: 3, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.8 }, opacity: { duration: 1.2, repeat: Infinity, repeatType: 'mirror' } }}
            />
            <motion.div
              className="absolute top-0 right-0 h-[45%] w-[2px] bg-gradient-to-b from-transparent via-red-400 to-transparent"
              animate={{ top: ['-45%', '100%'], opacity: [0.4, 0.9, 0.4] }}
              transition={{ top: { duration: 3, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.8, delay: 0.75 }, opacity: { duration: 1.2, repeat: Infinity, repeatType: 'mirror', delay: 0.75 } }}
            />
            <motion.div
              className="absolute bottom-0 right-0 h-[2px] w-[45%] bg-gradient-to-r from-transparent via-red-400 to-transparent"
              animate={{ right: ['-45%', '100%'], opacity: [0.4, 0.9, 0.4] }}
              transition={{ right: { duration: 3, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.8, delay: 1.5 }, opacity: { duration: 1.2, repeat: Infinity, repeatType: 'mirror', delay: 1.5 } }}
            />
            <motion.div
              className="absolute bottom-0 left-0 h-[45%] w-[2px] bg-gradient-to-b from-transparent via-red-400 to-transparent"
              animate={{ bottom: ['-45%', '100%'], opacity: [0.4, 0.9, 0.4] }}
              transition={{ bottom: { duration: 3, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.8, delay: 2.25 }, opacity: { duration: 1.2, repeat: Infinity, repeatType: 'mirror', delay: 2.25 } }}
            />
          </div>

          <div className="relative bg-black/60 backdrop-blur-xl rounded-2xl p-7 border border-red-500/20 shadow-2xl shadow-red-950/50 overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, rgba(229,72,77,1) 0.5px, transparent 0.5px), linear-gradient(45deg, rgba(229,72,77,1) 0.5px, transparent 0.5px)',
                backgroundSize: '30px 30px'
              }}
            />

            <div className="text-center space-y-1 mb-6 relative">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white via-red-100 to-red-400"
              >
                {isSignup ? 'Join PhysVerse' : 'Welcome Back'}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-white/60 text-xs"
              >
                {isSignup ? 'Create your lab. Save experiments. Track progress.' : 'Sign in to your lab.'}
              </motion.p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5 relative">
              {isSignup && (
                <motion.div className={`relative ${focused === 'name' ? 'z-10' : ''}`}>
                  <div className="relative flex items-center overflow-hidden rounded-lg">
                    <User className={`absolute left-3 w-4 h-4 transition-colors ${focused === 'name' ? 'text-red-400' : 'text-white/40'}`} />
                    <Input
                      type="text"
                      autoComplete="name"
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setFocused('name')}
                      onBlur={() => setFocused(null)}
                      className="w-full bg-white/[0.04] border-red-500/20 focus:border-red-500/60 text-white placeholder:text-white/30 h-10 pl-10 pr-3 focus:bg-white/[0.07]"
                      required
                    />
                  </div>
                </motion.div>
              )}

              <motion.div className={`relative ${focused === 'email' ? 'z-10' : ''}`}>
                <div className="relative flex items-center overflow-hidden rounded-lg">
                  <Mail className={`absolute left-3 w-4 h-4 transition-colors ${focused === 'email' ? 'text-red-400' : 'text-white/40'}`} />
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    className="w-full bg-white/[0.04] border-red-500/20 focus:border-red-500/60 text-white placeholder:text-white/30 h-10 pl-10 pr-3 focus:bg-white/[0.07]"
                    required
                  />
                </div>
              </motion.div>

              <motion.div className={`relative ${focused === 'password' ? 'z-10' : ''}`}>
                <div className="relative flex items-center overflow-hidden rounded-lg">
                  <Lock className={`absolute left-3 w-4 h-4 transition-colors ${focused === 'password' ? 'text-red-400' : 'text-white/40'}`} />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isSignup ? 'new-password' : 'current-password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                    className="w-full bg-white/[0.04] border-red-500/20 focus:border-red-500/60 text-white placeholder:text-white/30 h-10 pl-10 pr-10 focus:bg-white/[0.07]"
                    required
                    minLength={isSignup ? 6 : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-white/40 hover:text-white transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>

              {!isSignup && (
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="appearance-none h-4 w-4 rounded border border-red-500/40 bg-white/5 checked:bg-red-500 checked:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-all"
                    />
                    <span className="text-xs text-white/60 hover:text-white/80 transition-colors">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-xs text-red-400 hover:text-red-300 transition-colors font-medium">
                    Forgot password?
                  </Link>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full relative group/button mt-2"
              >
                <div className="absolute inset-0 bg-red-500/40 rounded-lg blur-lg opacity-0 group-hover/button:opacity-70 transition-opacity duration-300" />
                <div className="relative overflow-hidden bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold h-10 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg shadow-red-950/50">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 }}
                    style={{ opacity: isLoading ? 1 : 0 }}
                  />
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                      </motion.div>
                    ) : (
                      <motion.span
                        key="text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-1.5 text-sm"
                      >
                        {isSignup ? 'Create account' : 'Sign in'}
                        <ArrowRight className="w-3.5 h-3.5 group-hover/button:translate-x-1 transition-transform" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>

              {slowBackend && (
                <p className="text-[11px] text-center text-amber-400/90 animate-pulse">
                  Still working — server may be waking up.
                </p>
              )}

              {googleSlot && (
                <>
                  <div className="relative mt-4 mb-3 flex items-center">
                    <div className="flex-grow border-t border-white/10" />
                    <span className="mx-3 text-[10px] text-white/40 uppercase tracking-widest">or</span>
                    <div className="flex-grow border-t border-white/10" />
                  </div>
                  {googleSlot}
                </>
              )}

              <motion.p
                className="text-center text-xs text-white/60 mt-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {isSignup ? 'Already have an account? ' : "Don't have an account? "}
                <Link to={isSignup ? '/login' : '/signup'} className="relative inline-block group/link">
                  <span className="relative z-10 text-red-400 hover:text-red-300 transition-colors font-semibold">
                    {isSignup ? 'Sign in' : 'Sign up'}
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-red-400 group-hover/link:w-full transition-all duration-300" />
                </Link>
              </motion.p>
            </form>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default AuthCard;
