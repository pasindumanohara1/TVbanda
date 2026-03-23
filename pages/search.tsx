'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search as SearchIcon, X } from 'lucide-react';
import { useChannelStore, useFavoritesStore } from '@/stores/channelStore';
import { ChannelWithStreams } from '@/types';

function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌍';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

function AdBanner({ id }: { id: string }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://pl28963431.profitablecpmratenetwork.com/7d4f7bc93926bde082b869a4c0ee1a1c/invoke.js';
    script.async = true;
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="ad-banner-top" style={{ marginBottom: '20px' }}>
      <div className="desktop-only" style={{ width: '728px', height: '90px', margin: '0 auto' }}>
        <ins data-zone={id}></ins>
      </div>
      <div className="mobile-only" style={{ width: '420px', height: '60px', margin: '0 auto' }}>
        <ins data-zone={id}></ins>
      </div>
    </div>
  );
}

export default function SearchPage() {
  const { channels } = useChannelStore();
  const { isFavorite } = useFavoritesStore();
  const [query, setQuery] = useState('');

  const results = query.length > 1
    ? channels.filter(ch => 
        ch.name.toLowerCase().includes(query.toLowerCase()) ||
        ch.alt_names?.some(n => n.toLowerCase().includes(query.toLowerCase())) ||
        ch.categories.some(c => c.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 50)
    : [];

  const groupedResults = results.reduce((acc, ch) => {
    if (!acc[ch.country]) acc[ch.country] = [];
    acc[ch.country].push(ch);
    return acc;
  }, {} as Record<string, ChannelWithStreams[]>);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🔍 Search</h1>
        <p>Find channels from around the world</p>
      </div>

      <AdBanner id="13f611862530e5d2b1733b67657704e5" />

      <div className="search-box">
        <SearchIcon size={20} className="search-icon" />
        <input
          type="text"
          placeholder="Search channels, categories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        {query && (
          <button className="clear-btn" onClick={() => setQuery('')}>
            <X size={18} />
          </button>
        )}
      </div>

      {query.length > 1 && (
        <div className="search-results">
          <p className="results-count">{results.length} results found</p>

          {Object.entries(groupedResults).map(([country, chs]) => (
            <div key={country} className="result-group">
              <h3>{getCountryFlag(country)} {country}</h3>
              <div className="channel-list">
                {chs.map(channel => (
                  <Link
                    key={channel.id}
                    href={`/watch/${channel.id}`}
                    className="channel-item"
                  >
                    {channel.logo ? (
                      <img src={channel.logo} alt={channel.name} className="channel-logo-img" />
                    ) : (
                      <div className="channel-icon">
                        {channel.name.charAt(0)}
                      </div>
                    )}
                    <div className="channel-details">
                      <h3>{channel.name}</h3>
                      <div className="channel-tags">
                        {channel.categories.slice(0, 2).map(cat => (
                          <span key={cat} className="tag">{cat}</span>
                        ))}
                      </div>
                    </div>
                    {isFavorite(channel.id) && <span className="favorite-badge">★</span>}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {query.length <= 1 && (
        <div className="search-tips">
          <h3>Search Tips</h3>
          <ul>
            <li>Try searching for country names like "Sri Lanka", "USA", "India"</li>
            <li>Search categories like "News", "Sports", "Movies"</li>
            <li>Search channel names like "BBC", "CNN", "Star Sports"</li>
          </ul>
        </div>
      )}
    </div>
  );
}