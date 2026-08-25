import React from 'react';
import { Helmet } from 'react-helmet';
import { homeContent } from '@/lib/homeContent.js';
import { Navbar } from '@/components/home/Navbar.jsx';
import { Hero } from '@/components/home/Hero.jsx';
import { SegmentsBar } from '@/components/home/SegmentsBar.jsx';
import { HowItWorks } from '@/components/home/HowItWorks.jsx';
import { ShowcaseTabs } from '@/components/home/ShowcaseTabs.jsx';
import { FeaturesGrid } from '@/components/home/FeaturesGrid.jsx';
import { ComparisonTable } from '@/components/home/ComparisonTable.jsx';
import { PricingSection } from '@/components/home/PricingSection.jsx';
import { FaqSection } from '@/components/home/FaqSection.jsx';
import { FinalCta } from '@/components/home/FinalCta.jsx';
import { Footer } from '@/components/home/Footer.jsx';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] text-slate-900 dark:text-slate-100 font-sans selection:bg-violet-500/20 selection:text-violet-700 dark:selection:text-violet-300 overflow-x-hidden">
      <Helmet>
        <title>{homeContent.seo.title}</title>
        <meta name="description" content={homeContent.seo.description} />
      </Helmet>

      {/* Navegação Superior */}
      <Navbar />

      {/* Conteúdo Principal Modularizado */}
      <main>
        <Hero />
        <SegmentsBar />
        <HowItWorks />
        <ShowcaseTabs />
        <FeaturesGrid />
        <ComparisonTable />
        <PricingSection />
        <FaqSection />
        <FinalCta />
      </main>

      {/* Rodapé Institucional */}
      <Footer />
    </div>
  );
};

export default HomePage;
