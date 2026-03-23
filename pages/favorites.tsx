'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Trash2 } from 'lucide-react';
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

export default function FavoritesPage() {
  const router = useRouter();
  const { channels, isLoading } = useChannelStore();
  const { favorites, removeFavorite } = useFavoritesStore();
  const [favoriteChannels, setFavoriteChannels] = useState<ChannelWithStreams[]>([]);

  useEffect(() => {
    if (!isLoading && channels.length > 0) {
      const favs = channels.filter(ch => favorites.includes(ch.id));
      setFavoriteChannels(favs);
    }
  }, [isLoading, channels, favorites]);

  const handleRemove = (e: React.MouseEvent, channelId: string) => {
    e.preventDefault();
    e.stopPropagation();
    removeFavorite(channelId);
  };

  if (isLoading) {
    return (
      <div className="loading-page">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>❤️ Favorites</h1>
        <p>{favoriteChannels.length} saved channels</p>
      </div>

      <AdBanner id="13f611862530e5d2b1733b67657704e5" />

      {favoriteChannels.length > 0 ? (
        <div className="channel-list">
          {favoriteChannels.map(channel => (
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
                  <span className="tag">{getCountryFlag(channel.country)} {channel.country}</span>
                  {channel.categories[0] && (
                    <span className="tag">{channel.categories[0]}</span>
                  )}
                </div>
              </div>
              <button 
                className="remove-btn"
                onClick={(e) => handleRemove(e, channel.id)}
              >
                <Trash2 size={18} />
              </button>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Heart size={48} className="empty-icon" />
          <h2>No favorites yet</h2>
          <p>Tap the heart icon on any channel to add it to your favorites</p>
          <button className="primary-btn" onClick={() => router.push('/countries')}>
            Browse Channels
          </button>
        </div>
      )}
    </div>
  );
}