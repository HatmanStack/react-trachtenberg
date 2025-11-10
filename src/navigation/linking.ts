import { LinkingOptions } from '@react-navigation/native';

/**
 * Deep Linking Configuration
 *
 * Enables navigation via URLs on web and custom schemes on mobile.
 *
 * Web URLs:
 * - http://localhost:19006/learn
 * - http://localhost:19006/practice
 * - http://localhost:19006/settings
 *
 * Mobile schemes:
 * - trachtenberg://learn
 * - trachtenberg://practice
 * - trachtenberg://settings
 */

export const linking: LinkingOptions<any> = {
  prefixes: ['trachtenberg://', 'https://trachtenberg.app'],
  config: {
    screens: {
      Learn: 'learn',
      Practice: 'practice',
      Settings: 'settings',
    },
  },
};
