import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'genwise',
  slug: 'genwise',
  version: '1.0.0',
  plugins: [
    ...(config.plugins || []),
    'expo-web-browser',
  ],
  extra: {
    ...config.extra,
    EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
    eas: {
      projectId: '62951c5d-bb0c-4e3b-8e61-f01d2a0e076b',
    },
  },
});