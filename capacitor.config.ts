import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.d974261e56034298bdb1b51f0ec8ca3a',
  appName: 'SpotifyNoads',
  webDir: 'dist',
  server: {
    url: 'https://d974261e-5603-4298-bdb1-b51f0ec8ca3a.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    Filesystem: {
      // Allow access to external storage on Android
    },
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#121212',
  },
  ios: {
    backgroundColor: '#121212',
    contentInset: 'automatic',
  },
};

export default config;
