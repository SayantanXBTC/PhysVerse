import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { LogOut, Home, LayoutDashboard, Globe, Trophy, BookOpen, Award, Menu, X, User } from 'lucide-react';

const NAV = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/gallery', label: 'Gallery', icon: Globe },
  { to: '/challenges', label: 'Challenges', icon: Trophy },
  { to: '/formulas', label: 'Formulas', icon: BookOpen },
  { to: '/leaderboard', label: 'Leaderboard', icon: Award }
];

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    // Hard reload so all cached queries + subscribers reset cleanly
    window.location.assign('/');
  };

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [menuOpen]);

  const initials = (user?.name || 'U')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-black">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <nav className="relative bg-black/70 border-b border-red-500/20 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 gap-4">
            <div className="flex items-center gap-6 min-w-0">
              <Link to="/" className="flex items-center gap-2 group shrink-0">
                <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-red-500/30 to-red-900/60 border border-red-400/40 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_4px_12px_rgba(229,72,77,0.35)] group-hover:scale-105 transition-transform overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                  <svg viewBox="0 0 32 32" className="relative w-full h-full" aria-hidden="true">
                    <g fill="none" stroke="currentColor" strokeWidth="1.4" className="text-red-200">
                      <ellipse cx="16" cy="16" rx="10" ry="4" />
                      <ellipse cx="16" cy="16" rx="10" ry="4" transform="rotate(60 16 16)" />
                      <ellipse cx="16" cy="16" rx="10" ry="4" transform="rotate(-60 16 16)" />
                    </g>
                    <circle cx="16" cy="16" r="2" className="fill-red-300" />
                  </svg>
                </div>
                <span className="text-lg font-black bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent tracking-tight">
                  PhysVerse
                </span>
              </Link>

              {/* Desktop nav */}
              <div className="hidden md:flex items-center gap-1">
                {NAV.map((item) => {
                  const active = item.to === '/' ? pathname === '/' : pathname.startsWith(item.to);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        active
                          ? 'text-white bg-red-500/10'
                          : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <item.icon size={15} />
                      <span>{item.label}</span>
                      {active && (
                        <span className="absolute -bottom-[13px] left-2 right-2 h-[2px] bg-gradient-to-r from-red-500 to-rose-400 rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Desktop user area */}
            {user && (
              <div className="hidden md:flex items-center gap-2 shrink-0">
                <Link
                  to="/profile"
                  className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-white/[0.04] transition-colors group max-w-[220px]"
                  aria-label="Open profile"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-md shadow-red-950/50">
                    {user.avatar ? (
                      <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      initials
                    )}
                  </div>
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors truncate">
                    {user.name}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/[0.03] hover:bg-red-500/10 border border-white/10 hover:border-red-500/40 text-gray-300 hover:text-white text-sm font-medium transition-colors"
                  aria-label="Logout"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-md bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-white transition-colors"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu backdrop"
            onClick={() => setMenuOpen(false)}
            className="md:hidden fixed inset-0 top-14 bg-black/70 backdrop-blur-sm z-40"
          />
          <div
            className="md:hidden fixed left-0 right-0 top-14 z-40 bg-[#0a0a0c] border-b border-red-500/20 shadow-2xl shadow-red-950/40 max-h-[calc(100vh-3.5rem)] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
          >
            {user && (
              <Link
                to="/profile"
                className="flex items-center gap-3 p-4 border-b border-white/[0.06] hover:bg-white/[0.03] transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-md shadow-red-950/50">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                  <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                </div>
                <User size={14} className="text-gray-500" />
              </Link>
            )}

            <div className="p-2 space-y-0.5">
              {NAV.map((item) => {
                const active = item.to === '/' ? pathname === '/' : pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'text-white bg-red-500/15 border border-red-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-white/[0.04] border border-transparent'
                    }`}
                  >
                    <item.icon size={16} />
                    <span>{item.label}</span>
                    {active && (
                      <span className="ml-auto text-[10px] font-mono uppercase tracking-widest text-red-400">
                        Active
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {user && (
              <div className="p-2 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full inline-flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-red-300 hover:text-white bg-white/[0.03] hover:bg-red-500/15 border border-white/10 hover:border-red-500/40 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <main className="relative">
        <Outlet />
      </main>
    </div>
  );
}
