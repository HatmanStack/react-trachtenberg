import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { paperTheme } from './src/theme/paperTheme';
import Navigation from './src/navigation';

export default function App() {
  return (
    <PaperProvider theme={paperTheme}>
      <Navigation />
      <StatusBar style="auto" />
    </PaperProvider>
  );
}
