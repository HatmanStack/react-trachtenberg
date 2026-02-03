import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { paperTheme } from './src/theme/paperTheme';
import Navigation from './src/navigation';
import { ErrorBoundary } from './src/components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <PaperProvider theme={paperTheme}>
        <Navigation />
        <StatusBar style="auto" />
      </PaperProvider>
    </ErrorBoundary>
  );
}
