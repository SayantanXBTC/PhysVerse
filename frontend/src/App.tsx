import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { authService } from './services/authService';
import { gamificationService } from './services/gamificationService';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import KeyboardShortcutsOverlay from './components/KeyboardShortcutsOverlay';
import FPSCounter from './components/FPSCounter';
import ScrollToTop from './components/ScrollToTop';
import CommandPalette from './components/CommandPalette';
import PageLoader from './components/PageLoader';
import PageTransition from './components/PageTransition';
import LevelUpModal from './components/LevelUpModal';
import { useLevelUp } from './hooks/useLevelUp';

// Lazy-load all routes — massive bundle size win
const LandingPage = lazy(() => import('./pages/LandingPage'));
const EnhancedLoginPage = lazy(() => import('./pages/EnhancedLoginPage'));
const EnhancedSignupPage = lazy(() => import('./pages/EnhancedSignupPage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const SimulationEditorPage = lazy(() => import('./pages/SimulationEditorPage'));
const PublicGalleryPage = lazy(() => import('./pages/PublicGalleryPage'));
const SimulationPreviewPage = lazy(() => import('./pages/SimulationPreviewPage'));
const PhysicistDetailPage = lazy(() => import('./pages/PhysicistDetailPage'));
const SimulationDetailPage = lazy(() => import('./pages/SimulationDetailPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const EnhancedProfilePage = lazy(() => import('./pages/EnhancedProfilePage'));
const CompleteChallengesPage = lazy(() => import('./pages/CompleteChallengesPage'));
const FormulasPage = lazy(() => import('./pages/FormulasPage'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));

function AnimatedRoutes() {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />} key={location.pathname}>
        <PageTransition>
          <Routes location={location}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<EnhancedLoginPage />} />
            <Route path="/signup" element={<EnhancedSignupPage />} />
            <Route path="/onboarding" element={isAuthenticated ? <OnboardingPage /> : <Navigate to="/login" />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/preview" element={<SimulationPreviewPage />} />
            <Route path="/physicist/:id" element={<PhysicistDetailPage />} />
            <Route path="/simulation-info/:id" element={<SimulationDetailPage />} />

            <Route element={<Layout />}>
              <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} />
              <Route path="/profile" element={isAuthenticated ? <EnhancedProfilePage /> : <Navigate to="/login" />} />
              <Route path="/simulation/:id" element={isAuthenticated ? <SimulationEditorPage /> : <Navigate to="/login" />} />
              <Route path="/simulation/new" element={isAuthenticated ? <SimulationEditorPage /> : <Navigate to="/login" />} />
              <Route path="/gallery" element={<PublicGalleryPage />} />
              <Route path="/challenges" element={<CompleteChallengesPage />} />
              <Route path="/formulas" element={<FormulasPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
            </Route>
          </Routes>
        </PageTransition>
      </Suspense>
    </AnimatePresence>
  );
}

function App() {
  const [showFPS, setShowFPS] = useState(false);
  const { setUser, isAuthenticated, logout } = useAuthStore();
  const levelUp = useLevelUp();

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

  const { data: user, isError } = useQuery({
    queryKey: ['me'],
    queryFn: authService.getMe,
    enabled: isAuthenticated,
    retry: false,
    staleTime: 5 * 60 * 1000
  });

  useEffect(() => {
    if (user) setUser(user);
    else if (isError && isAuthenticated) logout();
  }, [user, isError, setUser, logout, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && user) {
      gamificationService.startAchievementMonitoring();
    }
  }, [isAuthenticated, user]);

  return (
    <BrowserRouter>
      <KeyboardShortcutsOverlay />
      <FPSCounter show={showFPS} />
      <ScrollToTop />
      <CommandPalette />
      <LevelUpModal open={levelUp.open} level={levelUp.level} onClose={levelUp.close} />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
