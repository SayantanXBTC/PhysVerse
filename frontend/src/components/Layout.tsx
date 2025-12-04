import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { LogOut, Home, LayoutDashboard, Globe } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Red glow background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <nav className="relative bg-black/80 border-b-2 border-red-500/30 backdrop-blur-xl shadow-lg shadow-red-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-lg shadow-lg shadow-red-500/50 group-hover:scale-110 transition-transform" />
                <span className="text-2xl font-black bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent">PhysVerse</span>
              </Link>
              
              <div className="flex space-x-2">
                <Link to="/" className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-red-950/40 border border-transparent hover:border-red-500/30 transition-all duration-300 hover:scale-105 text-gray-300 hover:text-white">
                  <Home size={18} />
                  <span className="font-semibold">Home</span>
                </Link>
                <Link to="/dashboard" className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-red-950/40 border border-transparent hover:border-red-500/30 transition-all duration-300 hover:scale-105 text-gray-300 hover:text-white">
                  <LayoutDashboard size={18} />
                  <span className="font-semibold">Dashboard</span>
                </Link>
                <Link to="/gallery" className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-red-950/40 border border-transparent hover:border-red-500/30 transition-all duration-300 hover:scale-105 text-gray-300 hover:text-white">
                  <Globe size={18} />
                  <span className="font-semibold">Gallery</span>
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <Link 
                    to="/profile"
                    className="text-gray-300 hover:text-red-400 font-semibold transition-colors"
                  >
                    Welcome, <span className="text-red-400">{user.name}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border-2 border-red-500/30 hover:border-red-500/60 transition-all duration-300 hover:scale-105 font-semibold"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="relative">
        <Outlet />
      </main>
    </div>
  );
}
