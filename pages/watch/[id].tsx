'use client';

import dynamic from 'next/dynamic';

const WatchPage = dynamic(() => import('@/components/WatchPageContent'), { 
  ssr: false,
  loading: () => <div className="loading-page">Loading...</div>
});

export default WatchPage;