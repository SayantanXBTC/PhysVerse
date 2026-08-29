import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import { warmBackend } from './lib/api';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000
    }
  }
});

// Warm backend on app load to reduce cold-start latency (Render free tier)
warmBackend();

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const AppTree = (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: 'rgba(15, 15, 15, 0.92)',
            color: '#fff',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 10px 40px rgba(239, 68, 68, 0.25)',
            borderRadius: '14px',
            padding: '12px 16px',
            fontWeight: 500
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: '#fff' }
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
            style: {
              background: 'rgba(15, 15, 15, 0.92)',
              color: '#fff',
              border: '1px solid rgba(239, 68, 68, 0.6)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 10px 40px rgba(239, 68, 68, 0.35)',
              borderRadius: '14px'
            }
          },
          loading: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' }
          }
        }}
      />
    </QueryClientProvider>
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  googleClientId
    ? <GoogleOAuthProvider clientId={googleClientId}>{AppTree}</GoogleOAuthProvider>
    : AppTree
);
