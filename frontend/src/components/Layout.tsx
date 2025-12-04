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
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg" />
                <span className="text-xl font-bold">PhysVerse</span>
              </Link>
              
              <div className="flex space-x-4">
                <Link to="/" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-700 transition">
                  <Home size={18} />
                  <span>Home</span>
                </Link>
                <Link to="/dashboard" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-700 transition">
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </Link>
                <Link to="/gallery" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-700 transition">
                  <Globe size={18} />
                  <span>Gallery</span>
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <span className="text-gray-300">Welcome, {user.name}</span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-700 transition"
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

      <main>
        <Outlet />
      </main>
    </div>
  );
}
