/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // Add other env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Global type declarations for better TypeScript support
declare global {
  interface Window {
    // Add any global window properties here
  }
}

export {};