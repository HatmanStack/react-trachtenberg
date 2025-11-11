import React from 'react';
import { ScrollView, StyleSheet, View, Dimensions } from 'react-native';
import { List, Switch, Divider } from 'react-native-paper';
import { useAppStore } from '../store/appStore';
import { COLORS, SPACING } from '../theme/constants';

const { width } = Dimensions.get('window');
const isLargeScreen = width > 768;

/**
 * Settings Screen
 *
 * Provides app configuration options:
 * - Hint toggle: Enable/disable step-by-step calculation hints
 */

export default function SettingsScreen() {
  const hintsEnabled = useAppStore((state) => state.hintsEnabled);
  const setHintsEnabled = useAppStore((state) => state.setHintsEnabled);

  const handleHintToggle = () => {
    setHintsEnabled(!hintsEnabled);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={isLargeScreen && styles.contentLarge}>
      <View style={isLargeScreen ? styles.innerContainer : undefined}>
      <List.Section>
        <List.Subheader>Practice Settings</List.Subheader>
        <List.Item
          title="Show Hints"
          description="Display step-by-step calculation hints during practice"
          left={(props) => <List.Icon {...props} icon="lightbulb-outline" />}
          right={() => (
            <Switch
              value={hintsEnabled}
              onValueChange={handleHintToggle}
            />
          )}
        />
        <Divider />
      </List.Section>

        {/* Future settings can be added here */}
        <List.Section style={styles.section}>
          <List.Subheader>About</List.Subheader>
          <List.Item
            title="Version"
            description="1.0.0"
            left={(props) => <List.Icon {...props} icon="information-outline" />}
          />
        </List.Section>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentLarge: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  innerContainer: {
    maxWidth: 800,
    width: '100%',
  },
  section: {
    marginTop: SPACING.md,
  },
});
