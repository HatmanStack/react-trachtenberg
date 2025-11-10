import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { TabNavigator } from './TabNavigator';
import { StackNavigator } from './StackNavigator';
import { linking } from './linking';

const Navigation: React.FC = () => {
  const theme = useTheme();
  const isWeb = Platform.OS === 'web';

  return (
    <NavigationContainer
      linking={linking}
      theme={{
        dark: false,
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.onSurface,
          border: theme.colors.outline,
          notification: theme.colors.error,
        },
        fonts: {
          regular: {
            fontFamily: 'System',
            fontWeight: '400',
          },
          medium: {
            fontFamily: 'System',
            fontWeight: '500',
          },
          bold: {
            fontFamily: 'System',
            fontWeight: '700',
          },
          heavy: {
            fontFamily: 'System',
            fontWeight: '900',
          },
        },
      }}
    >
      {isWeb ? <TabNavigator /> : <StackNavigator />}
    </NavigationContainer>
  );
};

export default Navigation;
