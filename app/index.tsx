import Head from 'expo-router/head';
import LearnScreen from '../src/screens/LearnScreen';

const learningResourceSchema = {
  '@context': 'https://schema.org',
  '@type': 'LearningResource',
  name: 'Trachtenberg Multiplication Tutorial',
  description:
    'A 21-step interactive tutorial teaching the Trachtenberg system of rapid mental multiplication',
  url: 'https://trachtenberg.hatstack.fun/',
  learningResourceType: 'Tutorial',
  educationalLevel: 'Beginner',
  teaches: 'Trachtenberg multiplication method',
  isAccessibleForFree: true,
  inLanguage: 'en',
  about: {
    '@type': 'Thing',
    name: 'Trachtenberg system',
    sameAs: 'https://en.wikipedia.org/wiki/Trachtenberg_system',
  },
};

export default function LearnPage() {
  return (
    <>
      <Head>
        <title>Learn Trachtenberg Multiplication | Mental Math System</title>
        <meta
          name="description"
          content="Master the Trachtenberg system of rapid mental multiplication. Interactive 21-step tutorial teaches you to multiply large numbers in your head."
        />
        <link rel="canonical" href="https://trachtenberg.hatstack.fun/" />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Learn Trachtenberg Multiplication | Mental Math System"
        />
        <meta
          property="og:description"
          content="Master rapid mental multiplication with our interactive 21-step tutorial. Learn the system developed by Jakow Trachtenberg."
        />
        <meta property="og:url" content="https://trachtenberg.hatstack.fun/" />

        {/* Twitter */}
        <meta
          name="twitter:title"
          content="Learn Trachtenberg Multiplication"
        />
        <meta
          name="twitter:description"
          content="Master rapid mental multiplication with our interactive 21-step tutorial."
        />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(learningResourceSchema),
          }}
        />
      </Head>
      <LearnScreen />
    </>
  );
}
