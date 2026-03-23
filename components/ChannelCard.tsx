import { Heart, Play, Star } from 'lucide-react';
import { ChannelWithStreams } from '@/types';
import { useFavoritesStore } from '@/stores/channelStore';
import { usePlayerStore } from '@/stores/playerStore';

interface ChannelCardProps {
  channel: ChannelWithStreams;
}

export default function ChannelCard({ channel }: ChannelCardProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const { setCurrentChannel } = usePlayerStore();
  const favorite = isFavorite(channel.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorite) {
      removeFavorite(channel.id);
    } else {
      addFavorite(channel.id);
    }
  };

  const handlePlay = () => {
    setCurrentChannel(channel);
  };

  const countryFlag = getCountryFlag(channel.country);

  return (
    <div className="channel-card" onClick={handlePlay}>
      <div className="channel-logo-container">
        <div className="channel-logo">
          <span className="channel-initial">{channel.name.charAt(0)}</span>
        </div>
        <div className="play-overlay">
          <Play size={32} />
        </div>
        {favorite && (
          <div className="favorite-indicator">
            <Star size={16} fill="#FFD700" color="#FFD700" />
          </div>
        )}
      </div>
      
      <div className="channel-info">
        <h3 className="channel-name">{channel.name}</h3>
        <div className="channel-meta">
          <span className="country">{countryFlag} {channel.country}</span>
          {channel.categories[0] && (
            <span className="category">{channel.categories[0]}</span>
          )}
        </div>
      </div>

      <button 
        className={`favorite-btn ${favorite ? 'active' : ''}`}
        onClick={handleFavorite}
      >
        <Heart size={18} fill={favorite ? '#FFD700' : 'none'} />
      </button>
    </div>
  );
}

function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌍';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}