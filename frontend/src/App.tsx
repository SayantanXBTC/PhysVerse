import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { authService } from './services/authService';
import { useAuthStore } from './store/authStore';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import SimulationEditorPage from './pages/SimulationEditorPage';
import PublicGalleryPage from './pages/PublicGalleryPage';
import SimulationPreviewPage from './pages/SimulationPreviewPage';
import PhysicistDetailPage from './pages/PhysicistDetailPage';
import SimulationDetailPage from './pages/SimulationDetailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import Layout from './components/Layout';
import KeyboardShortcutsOverlay from './components/KeyboardShortcutsOverlay';
import FPSCounter from './components/FPSCounter';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const [showFPS, setShowFPS] = useState(false);

  // Toggle FPS counter with F key
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'f' && e.ctrlKey) {
        e.preventDefault();
        setShowFPS(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);
  const { setUser, isAuthenticated, logout } = useAuthStore();

  const { data: user, isError } = useQuery({
    queryKey: ['me'],
    queryFn: authService.getMe,
    enabled: isAuthenticated,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (user) {
      setUser(user);
    } else if (isError && isAuthenticated) {
      logout();
    }
  }, [user, isError, setUser, logout, isAuthenticated]);

  return (
    <BrowserRouter>
      {/* Premium Features */}
      <KeyboardShortcutsOverlay />
      <FPSCounter show={showFPS} />
      <ScrollToTop />
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/preview" element={<SimulationPreviewPage />} />
        <Route path="/physicist/:id" element={<PhysicistDetailPage />} />
        <Route path="/simulation-info/:id" element={<SimulationDetailPage />} />
        
        <Route element={<Layout />}>
          <Route
            path="/dashboard"
            element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/simulation/:id"
            element={isAuthenticated ? <SimulationEditorPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/simulation/new"
            element={isAuthenticated ? <SimulationEditorPage /> : <Navigate to="/login" />}
          />
          <Route path="/gallery" element={<PublicGalleryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
