'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import { useChannelStore, useFavoritesStore } from '@/stores/channelStore';
import { ChannelWithStreams } from '@/types';
import { Loader2 } from 'lucide-react';

function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌍';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export default function CountryPageContent() {
  const params = useParams();
  const router = useRouter();
  const countryCode = params.code as string;
  const { channels, countries, isLoading } = useChannelStore();
  const { isFavorite } = useFavoritesStore();
  const [filteredChannels, setFilteredChannels] = useState<ChannelWithStreams[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const country = countries.find(c => c.code === countryCode);

  useEffect(() => {
    if (!isLoading && channels.length > 0) {
      const filtered = channels.filter(ch => ch.country === countryCode);
      setFilteredChannels(filtered);
    }
  }, [isLoading, channels, countryCode]);

  const displayChannels = searchQuery
    ? filteredChannels.filter(ch => 
        ch.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredChannels;

  if (isLoading) {
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
        <button className="back-btn" onClick={() => router.back()}>
          <ArrowLeft size={20} />
        </button>
        <div className="header-content">
          <h1>
            {country?.flag || getCountryFlag(countryCode)} {country?.name || countryCode}
          </h1>
          <p>{filteredChannels.length} channels available</p>
        </div>
      </div>

      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search channels..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="channel-list">
        {displayChannels.map(channel => (
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

      {displayChannels.length === 0 && (
        <div className="empty-state">
          <p>No channels found</p>
        </div>
      )}
    </div>
  );
}