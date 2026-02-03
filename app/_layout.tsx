import { Tabs } from 'expo-router';
import { PaperProvider, useTheme } from 'react-native-paper';
import { paperTheme } from '../src/theme/paperTheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform, View, StyleSheet, useWindowDimensions } from 'react-native';

function TabLayout() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const showLabels = width > 500;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#757575',
        tabBarShowLabel: showLabels,
        tabBarLabelPosition: 'beside-icon',
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          height: Platform.OS === 'web' ? 60 : undefined,
          paddingTop: 0,
          paddingBottom: 4,
        },
        tabBarLabelStyle: {
          fontSize: 22,
          fontWeight: '600',
          textTransform: 'none',
        },
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trachtenberg',
          tabBarLabel: 'Learn',
          tabBarAccessibilityLabel: 'Navigate to Tutorial',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? 'school' : 'school-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: 'Trachtenberg',
          tabBarLabel: 'Practice',
          tabBarAccessibilityLabel: 'Navigate to Practice',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? 'pencil' : 'pencil-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Trachtenberg',
          tabBarLabel: 'Settings',
          tabBarAccessibilityLabel: 'Navigate to Settings',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? 'cog' : 'cog-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="+not-found"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

export default function RootLayout() {
  return (
    <PaperProvider theme={paperTheme}>
      <View style={styles.outer}>
        <TabLayout />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: paperTheme.colors.background,
  },
});
