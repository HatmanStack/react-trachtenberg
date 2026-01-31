import { Tabs } from 'expo-router';
import { PaperProvider, useTheme } from 'react-native-paper';
import { paperTheme } from '../src/theme/paperTheme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Platform, useWindowDimensions, View, StyleSheet } from 'react-native';

function TabLayout() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#757575',
        tabBarShowLabel: isLargeScreen,
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
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="school" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: 'Trachtenberg',
          tabBarLabel: 'Practice',
          tabBarAccessibilityLabel: 'Navigate to Practice',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="pencil" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Trachtenberg',
          tabBarLabel: 'Settings',
          tabBarAccessibilityLabel: 'Navigate to Settings',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog" size={24} color={color} />
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
        <View style={styles.container}>
          <TabLayout />
        </View>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: paperTheme.colors.background,
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 900,
  },
});
