import { Link, useLocation } from 'react-router-dom';
import { Home, Trophy, BookOpen, User, Zap } from 'lucide-react';

export default function MobileNavigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/simulations', icon: Zap, label: 'Sims' },
    { path: '/leaderboard', icon: Trophy, label: 'Ranks' },
    { path: '/formulas', icon: BookOpen, label: 'Formulas' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="mobile-nav">
      <div className="flex justify-around items-center py-2 px-4">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-1 touch-target transition-colors duration-200 ${
                isActive 
                  ? 'text-red-400' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon 
                size={20} 
                className={`transition-transform duration-200 ${
                  isActive ? 'scale-110' : ''
                }`} 
              />
              <span className="text-xs font-medium">{label}</span>
              {isActive && (
                <div className="w-1 h-1 bg-red-400 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}