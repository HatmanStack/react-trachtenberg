import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LearnScreen from '@screens/LearnScreen';
import PracticeScreen from '@screens/PracticeScreen';
import SettingsScreen from '@screens/SettingsScreen';

const Tab = createMaterialTopTabNavigator();

export const TabNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#757575',
        tabBarIndicatorStyle: {
          backgroundColor: theme.colors.primary,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
          textTransform: 'none',
        },
      }}
      initialRouteName="Learn"
    >
      <Tab.Screen
        name="Learn"
        component={LearnScreen}
        options={{
          tabBarAccessibilityLabel: 'Navigate to Tutorial',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="school" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Practice"
        component={PracticeScreen}
        options={{
          tabBarAccessibilityLabel: 'Navigate to Practice',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="pencil" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarAccessibilityLabel: 'Navigate to Settings',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
