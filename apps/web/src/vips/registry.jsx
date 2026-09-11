import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy load VIP components to avoid bloating the main bundle
const ExemploVip = React.lazy(() => import('./exemplo-vip/index.jsx'));

export const vipRegistry = {
  'exemplo-vip': ExemploVip,
};

export const isVip = (slug) => {
  if (!slug || typeof slug !== 'string') return false;
  return Object.hasOwn(vipRegistry, slug);
};

export const renderVip = (slug) => {
  if (!isVip(slug)) return null;
  const VipComponent = vipRegistry[slug];
  if (!VipComponent) return null;
  
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    }>
      <VipComponent />
    </Suspense>
  );
};

