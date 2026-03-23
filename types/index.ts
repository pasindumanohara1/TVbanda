export interface Channel {
  id: string;
  name: string;
  alt_names?: string[];
  network?: string;
  owners?: string[];
  country: string;
  categories: string[];
  is_nsfw: boolean;
  launched?: string;
  closed?: string;
  replaced_by?: string;
  website?: string;
}

export interface Stream {
  channel?: string;
  feed?: string;
  title: string;
  url: string;
  referrer?: string;
  user_agent?: string;
  quality?: string;
}

export interface ChannelWithStreams extends Channel {
  streams: Stream[];
  logo?: string;
  isFavorite?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export interface UserPreferences {
  favorites: string[];
  recentChannels: string[];
  volume: number;
  autoPlay: boolean;
  preferredQuality: 'auto' | '1080p' | '720p' | '480p';
  hideNSFW: boolean;
}