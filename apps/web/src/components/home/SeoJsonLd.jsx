import React from 'react';
import { Helmet } from 'react-helmet';
import { homeContent } from '@/lib/homeContent.js';

/**
 * SeoJsonLd Component
 * Injects Google-compliant Schema.org JSON-LD structured data for:
 * 1. WebSite & Organization
 * 2. SoftwareApplication (Free Business/Link in bio tool)
 * 3. FAQPage (Rich Snippets expander in Google Search)
 */
export const SeoJsonLd = () => {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: homeContent.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'contate.site',
    operatingSystem: 'All',
    applicationCategory: 'BusinessApplication',
    description: homeContent.seo.description,
    url: 'https://contate.site',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BRL'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '1240',
      bestRating: '5',
      worstRating: '1'
    }
  };

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'contate.site',
    url: 'https://contate.site',
    logo: 'https://contate.site/favicon.svg',
    sameAs: [
      'https://instagram.com/contate.site',
      'https://tiktok.com/@contate.site'
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(softwareSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(orgSchema)}
      </script>
    </Helmet>
  );
};
