import Head from 'expo-router/head';
import PracticeScreen from '../src/screens/PracticeScreen';

const practiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'LearningResource',
  name: 'Trachtenberg Multiplication Practice',
  description:
    'Interactive practice exercises for the Trachtenberg multiplication method with random problems and step-by-step hints',
  url: 'https://trachtenberg.hatstack.fun/practice',
  learningResourceType: 'Practice',
  educationalLevel: 'Beginner to Intermediate',
  interactivityType: 'active',
  isAccessibleForFree: true,
  inLanguage: 'en',
};

export default function PracticePage() {
  return (
    <>
      <Head>
        <title>
          Practice Trachtenberg Multiplication | Interactive Exercises
        </title>
        <meta
          name="description"
          content="Practice the Trachtenberg multiplication method with randomly generated problems. Get step-by-step hints and immediate feedback on your answers."
        />
        <link
          rel="canonical"
          href="https://trachtenberg.hatstack.fun/practice"
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Practice Trachtenberg Multiplication | Interactive Exercises"
        />
        <meta
          property="og:description"
          content="Test your mental math skills with interactive practice exercises. Random 4-digit by 3-digit multiplication problems with step-by-step hints."
        />
        <meta
          property="og:url"
          content="https://trachtenberg.hatstack.fun/practice"
        />

        {/* Twitter */}
        <meta
          name="twitter:title"
          content="Practice Trachtenberg Multiplication"
        />
        <meta
          name="twitter:description"
          content="Interactive practice exercises for the Trachtenberg multiplication method."
        />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(practiceSchema) }}
        />
      </Head>
      <PracticeScreen />
    </>
  );
}
