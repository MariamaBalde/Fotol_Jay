import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fotoljay.app',
  appName: 'FOTOLJAY',
  webDir: 'dist/fotoljay-frontend/browser',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Camera: {
      permissionType: 'camera',
      androidScaleType: 'centerCrop'
    }
  }
};

export default config;
