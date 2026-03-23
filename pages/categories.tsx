'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useChannelStore } from '@/stores/channelStore';
import { ChevronRight } from 'lucide-react';
import { Loader2 } from 'lucide-react';

function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌍';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

interface CountrySection {
  code: string;
  name: string;
  flag: string;
  channels: any[];
}

const COUNTRIES_PER_BATCH = 5;

export default function CategoriesPage() {
  const { channels, countries, isLoading, setChannels, setCategories, setCountries, setLoading, setError } = useChannelStore();
  const [countrySections, setCountrySections] = useState<CountrySection[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (channels.length > 0) return;
    
    const loadData = async () => {
      setLoading(true);
      try {
        const [chs, cats, conts] = await Promise.all([
          import('@/services/iptvService').then(m => m.iptvService.getChannelsWithStreams()),
          import('@/services/iptvService').then(m => m.iptvService.getCategories()),
          import('@/services/iptvService').then(m => m.iptvService.getCountries())
        ]);
        setChannels(chs);
        setCategories(cats);
        setCountries(conts);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (channels.length === 0) return;

    const countryChannelMap = new Map<string, typeof channels>();
    channels.forEach(ch => {
      if (!countryChannelMap.has(ch.country)) {
        countryChannelMap.set(ch.country, []);
      }
      countryChannelMap.get(ch.country)!.push(ch);
    });

    const sorted = Array.from(countryChannelMap.entries())
      .map(([code, chs]) => ({
        code,
        name: code,
        flag: getCountryFlag(code),
        channels: chs.slice(0, 4)
      }))
      .sort((a, b) => b.channels.length - a.channels.length);

    setCountrySections(sorted);
    setHasMore(sorted.length > COUNTRIES_PER_BATCH);
  }, [channels]);

  const loadMore = useCallback(() => {
    if (!hasMore || isLoading) return;
    setLoadedCount(prev => {
      const newCount = prev + COUNTRIES_PER_BATCH;
      setHasMore(newCount < countrySections.length);
      return newCount;
    });
  }, [hasMore, isLoading, countrySections.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore]);

  const visibleCountries = countrySections.slice(0, loadedCount + COUNTRIES_PER_BATCH);

  if (isLoading && countrySections.length === 0) {
    return (
      <div className="loading-page">
        <Loader2 size={48} className="animate-spin" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📡 TV Channels by Country</h1>
        <p>Browse channels from countries around the world</p>
      </div>

      <div className="ad-banner-top desktop-only">
        <ins className="adsbygoogle" style={{display: 'inline-block', width: '728px', height: '90px'}} data-ad-slot="13f611862530e5d2b1733b67657704e5"></ins>
      </div>
      <div className="ad-banner-top mobile-only">
        <ins className="adsbygoogle" style={{display: 'inline-block', width: '320px', height: '50px'}} data-ad-slot="201267a221c3333b3423fd09173a2f19"></ins>
      </div>

      <section className="section">
        {visibleCountries.map(country => (
          <div key={country.code} className="country-channels-section">
            <div className="country-section-header">
              <Link href={`/country/${country.code}`} className="country-section-title">
                <span className="flag">{country.flag}</span>
                <span>{country.name}</span>
                <span className="channel-count">({country.channels.length}+)</span>
              </Link>
              <Link href={`/country/${country.code}`} className="see-all-btn">
                See All <ChevronRight size={16} />
              </Link>
            </div>
            <div className="country-channels-grid">
              {country.channels.map(channel => (
                <Link key={channel.id} href={`/watch/${channel.id}`} className="channel-card-mini">
                  {channel.logo ? (
                    <img src={channel.logo} alt={channel.name} className="channel-card-logo" />
                  ) : (
                    <div className="channel-card-icon">{channel.name.charAt(0)}</div>
                  )}
                  <span className="channel-card-name">{channel.name}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
        
        {hasMore && (
          <div ref={loaderRef} className="load-more-trigger">
            <Loader2 size={24} className="animate-spin" />
            <span>Loading more...</span>
          </div>
        )}
      </section>
    </div>
  );
}