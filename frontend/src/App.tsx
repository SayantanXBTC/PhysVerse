import { useEffect } from 'react';
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
import Layout from './components/Layout';

function App() {
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
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/preview" element={<SimulationPreviewPage />} />
        
        <Route element={<Layout />}>
          <Route
            path="/dashboard"
            element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />}
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
