import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { LogOut, Home, LayoutDashboard, Globe, Trophy, BookOpen, Award } from 'lucide-react';

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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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

      <nav className="relative bg-black/70 border-b border-red-500/20 backdrop-blur-xl">
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

            {user && (
              <div className="flex items-center gap-2 shrink-0">
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
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="relative">
        <Outlet />
      </main>
    </div>
  );
}
