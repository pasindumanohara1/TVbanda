import { Channel, Stream, ChannelWithStreams, Category, Country } from '@/types';

const API_BASE = 'https://iptv-org.github.io/api';

interface LogoEntry {
  channel: string;
  url: string;
}

class IPTVService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheDuration = 24 * 60 * 60 * 1000;

  private getCached<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data as T;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async getChannels(): Promise<Channel[]> {
    const cached = this.getCached<Channel[]>('channels');
    if (cached) return cached;

    try {
      const response = await fetch(`${API_BASE}/channels.json`);
      const data = await response.json();
      this.setCache('channels', data);
      return data;
    } catch (error) {
      console.error('Failed to fetch channels:', error);
      return [];
    }
  }

  async getStreams(): Promise<Stream[]> {
    const cached = this.getCached<Stream[]>('streams');
    if (cached) return cached;

    try {
      const response = await fetch(`${API_BASE}/streams.json`);
      const data = await response.json();
      this.setCache('streams', data);
      return data;
    } catch (error) {
      console.error('Failed to fetch streams:', error);
      return [];
    }
  }

  async getCategories(): Promise<Category[]> {
    const cached = this.getCached<Category[]>('categories');
    if (cached) return cached;

    try {
      const response = await fetch(`${API_BASE}/categories.json`);
      const data = await response.json();
      this.setCache('categories', data);
      return data;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return [];
    }
  }

  async getCountries(): Promise<Country[]> {
    const cached = this.getCached<Country[]>('countries');
    if (cached) return cached;

    try {
      const response = await fetch(`${API_BASE}/countries.json`);
      const data = await response.json();
      const countries = data.map((c: any) => ({
        code: c.code,
        name: c.name,
        flag: c.flag
      }));
      this.setCache('countries', countries);
      return countries;
    } catch (error) {
      console.error('Failed to fetch countries:', error);
      return [];
    }
  }

  async getLogos(): Promise<Map<string, string>> {
    const cached = this.getCached<LogoEntry[]>('logos');
    let logos: LogoEntry[];
    
    if (cached) {
      logos = cached;
    } else {
      try {
        const response = await fetch(`${API_BASE}/logos.json`);
        logos = await response.json();
        this.setCache('logos', logos);
      } catch (error) {
        console.error('Failed to fetch logos:', error);
        return new Map();
      }
    }

    const logoMap = new Map<string, string>();
    logos.forEach((entry: LogoEntry) => {
      logoMap.set(entry.channel, entry.url);
    });
    return logoMap;
  }

  async getChannelsWithStreams(): Promise<ChannelWithStreams[]> {
    const [channels, streams, logoMap] = await Promise.all([
      this.getChannels(),
      this.getStreams(),
      this.getLogos()
    ]);

    const streamsByChannel = streams.reduce((acc, stream) => {
      if (stream.channel) {
        if (!acc[stream.channel]) acc[stream.channel] = [];
        acc[stream.channel].push(stream);
      }
      return acc;
    }, {} as Record<string, Stream[]>);

    return channels
      .map(channel => ({
        ...channel,
        streams: streamsByChannel[channel.id] || [],
        logo: logoMap.get(channel.id) || undefined
      }))
      .filter(c => c.streams.length > 0) as ChannelWithStreams[];
  }
}

export const iptvService = new IPTVService();