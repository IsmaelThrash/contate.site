import React from 'react';
import { Helmet } from 'react-helmet';
import { homeContent } from '@/lib/homeContent.js';
import { Navbar } from '@/components/home/Navbar.jsx';
import { Footer } from '@/components/home/Footer.jsx';

import { MouseSpotlight } from '@/components/common/MouseSpotlight.jsx';
import { ScrollProgressBar } from '@/components/common/ScrollProgressBar.jsx';
import { GoogleAdSlot } from '@/components/common/GoogleAdSlot.jsx';
import { SeoJsonLd } from '@/components/home/SeoJsonLd.jsx';
import { Hero } from '@/components/home/Hero.jsx';
import { SegmentsBar } from '@/components/home/SegmentsBar.jsx';
import { HowItWorks } from '@/components/home/HowItWorks.jsx';
import { ShowcaseTabs } from '@/components/home/ShowcaseTabs.jsx';
import { FeaturesGrid } from '@/components/home/FeaturesGrid.jsx';
import { ComparisonTable } from '@/components/home/ComparisonTable.jsx';
import { PricingSection } from '@/components/home/PricingSection.jsx';
import { FaqSection } from '@/components/home/FaqSection.jsx';
import { FinalCta } from '@/components/home/FinalCta.jsx';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#080A0F] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500/20 selection:text-indigo-700 dark:selection:text-indigo-300 overflow-x-hidden relative">
      
      {/* Super Metatags de SEO para o Google */}
      <Helmet>
        <title>{homeContent.seo.title}</title>
        <meta name="description" content={homeContent.seo.description} />
        <meta name="keywords" content={homeContent.seo.keywords} />
        <link rel="canonical" href={homeContent.seo.canonical} />

        {/* Open Graph / Facebook / WhatsApp */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://contate.site/" />
        <meta property="og:title" content={homeContent.seo.title} />
        <meta property="og:description" content={homeContent.seo.description} />
        <meta property="og:image" content="https://contate.site/brand/og-image.jpg" />
        <meta property="og:site_name" content="contate.site" />
        <meta property="og:locale" content="pt_BR" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={homeContent.seo.title} />
        <meta name="twitter:description" content={homeContent.seo.description} />
        <meta name="twitter:image" content="https://contate.site/brand/og-image.jpg" />
      </Helmet>

      {/* Structured Data (Schema.org JSON-LD para FAQ, Software e Org) */}
      <SeoJsonLd />

      {/* Barra de Leitura Conduzida por Rolagem */}
      <ScrollProgressBar />

      {/* Lanterna / Iluminação Dinâmica Seguindo o Mouse */}
      <MouseSpotlight />

      {/* Navegação Superior */}
      <Navbar />

      {/* Conteúdo Principal Otimizado */}
      <main className="relative z-10">
        <Hero />
        <SegmentsBar />
        <HowItWorks />
        <ShowcaseTabs />
        <FeaturesGrid />
        
        {/* Espaço Estratégico de Google Ads */}
        <GoogleAdSlot variant="landing" />
        
        <ComparisonTable />
        <PricingSection />
        <FaqSection />
        <FinalCta />
      </main>

      {/* Rodapé Institucional com Badge de Versão Obrigatório */}
      <Footer />
    </div>
  );
};

export default HomePage;
