import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Trachtenberg Multiplication',
    url: 'https://trachtenberg.hatstack.fun',
    description:
      'Learn the Trachtenberg system of rapid mental multiplication with interactive tutorials and practice exercises',
  };

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Trachtenberg Multiplication',
    url: 'https://trachtenberg.hatstack.fun',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    browserRequirements: 'Requires JavaScript',
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        {/* Default meta tags (overridden by route-specific Head) */}
        <title>Trachtenberg Multiplication - Learn Mental Math</title>
        <meta
          name="description"
          content="Learn the Trachtenberg system of rapid mental multiplication. Free interactive tutorial and practice exercises."
        />
        <meta
          name="keywords"
          content="Trachtenberg method, mental math, multiplication, rapid calculation, math tutorial, mental multiplication"
        />

        {/* Theme and app colors */}
        <meta name="theme-color" content="#9fa8da" />
        <meta name="msapplication-TileColor" content="#9fa8da" />

        {/* Favicon and icons */}
        <link rel="icon" href="/assets/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/assets/icon.png" />

        {/* Open Graph defaults */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Trachtenberg Multiplication" />
        <meta
          property="og:image"
          content="https://trachtenberg.hatstack.fun/og-image.jpg"
        />
        <meta property="og:image:width" content="1600" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card defaults */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="https://trachtenberg.hatstack.fun/og-image.jpg"
        />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
        />

        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: `
          html, body, #root {
            height: 100%;
            overflow: hidden;
          }
        `}} />
      </head>
      <body>{children}</body>
    </html>
  );
}
