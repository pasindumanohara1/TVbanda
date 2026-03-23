'use client';

import { useChannelStore, useFavoritesStore } from '@/stores/channelStore';
import ChannelCard from './ChannelCard';
import { Loader2 } from 'lucide-react';

export default function ChannelGrid() {
  const { isLoading, filteredChannels } = useChannelStore();
  const { favorites } = useFavoritesStore();
  const { showFavoritesOnly } = useChannelStore();

  const channels = filteredChannels();

  const displayChannels = showFavoritesOnly 
    ? channels.filter(c => favorites.includes(c.id))
    : channels;

  if (isLoading) {
    return (
      <div className="loading-container">
        <Loader2 size={48} className="animate-spin" />
        <p>Loading channels...</p>
      </div>
    );
  }

  if (displayChannels.length === 0) {
    return (
      <div className="empty-state">
        <p>No channels found</p>
        <span>Try adjusting your filters or search query</span>
      </div>
    );
  }

  return (
    <div className="channel-grid">
      {displayChannels.map(channel => (
        <ChannelCard key={channel.id} channel={channel} />
      ))}
    </div>
  );
}