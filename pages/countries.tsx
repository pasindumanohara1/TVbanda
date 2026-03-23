'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useChannelStore } from '@/stores/channelStore';
import { Loader2 } from 'lucide-react';

function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌍';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export default function CountriesPage() {
  const { channels, countries, isLoading } = useChannelStore();
  const [countryData, setCountryData] = useState<{code: string; name: string; flag: string; count: number}[]>([]);

  useEffect(() => {
    if (countries.length > 0 && channels.length > 0) {
      const counts: Record<string, number> = {};
      channels.forEach(ch => {
        counts[ch.country] = (counts[ch.country] || 0) + 1;
      });

      const data = countries
        .filter(c => counts[c.code])
        .map(c => ({
          code: c.code,
          name: c.name,
          flag: c.flag || getCountryFlag(c.code),
          count: counts[c.code] || 0
        }))
        .sort((a, b) => b.count - a.count);

      setCountryData(data);
    }
  }, [countries, channels]);

  if (isLoading) {
    return (
      <div className="loading-page">
        <Loader2 size={48} className="animate-spin" />
        <p>Loading countries...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🌍 Countries</h1>
        <p>Select a country to view all available channels</p>
      </div>

      <div className="ad-banner-top desktop-only">
        <ins className="adsbygoogle" style={{display: 'inline-block', width: '728px', height: '90px'}} data-ad-slot="13f611862530e5d2b1733b67657704e5"></ins>
      </div>
      <div className="ad-banner-top mobile-only">
        <ins className="adsbygoogle" style={{display: 'inline-block', width: '320px', height: '50px'}} data-ad-slot="201267a221c3333b3423fd09173a2f19"></ins>
      </div>

      <div className="country-grid">
        {countryData.map(country => (
          <Link
            key={country.code}
            href={`/country/${country.code}`}
            className="country-card"
          >
            <span className="country-flag">{country.flag}</span>
            <span className="country-name">{country.name}</span>
            <span className="channel-count">{country.count} channels</span>
          </Link>
        ))}
      </div>
    </div>
  );
}