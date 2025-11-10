import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';
import LearnScreen from '@screens/LearnScreen';
import PracticeScreen from '@screens/PracticeScreen';
import SettingsScreen from '@screens/SettingsScreen';

const Stack = createStackNavigator();

export const StackNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
      initialRouteName="Learn"
    >
      <Stack.Screen
        name="Learn"
        component={LearnScreen}
        options={{ title: 'Trachtenberg Tutorial' }}
      />
      <Stack.Screen
        name="Practice"
        component={PracticeScreen}
        options={{ title: 'Practice' }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
};
