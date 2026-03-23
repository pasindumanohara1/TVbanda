'use client';

import dynamic from 'next/dynamic';

const CategoryPage = dynamic(() => import('@/components/CategoryPageContent'), { 
  ssr: false,
  loading: () => <div className="loading-page">Loading...</div>
});

export default CategoryPage;