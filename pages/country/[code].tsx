'use client';

import dynamic from 'next/dynamic';

const CountryPage = dynamic(() => import('@/components/CountryPageContent'), { 
  ssr: false,
  loading: () => <div className="loading-page">Loading...</div>
});

export default CountryPage;