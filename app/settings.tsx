import Head from 'expo-router/head';
import SettingsScreen from '../src/screens/SettingsScreen';

export default function SettingsPage() {
  return (
    <>
      <Head>
        <title>Settings | Trachtenberg Multiplication App</title>
        <meta
          name="description"
          content="Customize your Trachtenberg multiplication learning experience. Toggle hints and adjust practice settings."
        />
        <link
          rel="canonical"
          href="https://trachtenberg.hatstack.fun/settings"
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <SettingsScreen />
    </>
  );
}
