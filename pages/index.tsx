'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Loader2, Tv, Globe, Film, ChevronRight, Download, Play, Star, Heart, Share2 } from 'lucide-react';
import { useChannelStore, useFavoritesStore } from '@/stores/channelStore';
import { iptvService } from '@/services/iptvService';
import { ChannelWithStreams } from '@/types';

function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌍';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

interface CategorySection {
  id: string;
  name: string;
  channels: ChannelWithStreams[];
}

const CATEGORIES_TO_SHOW = 8;

export default function Home() {
  const [categorySections, setCategorySections] = useState<CategorySection[]>([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  
  const { 
    channels, categories, countries, isLoading, setChannels, 
    setCategories, setCountries, setLoading, setError 
  } = useChannelStore();
  const { favorites } = useFavoritesStore();

  useEffect(() => {
    const script1 = document.createElement('script');
    script1.src = 'https://pl28963431.profitablecpmratenetwork.com/7d4f7bc93926bde082b869a4c0ee1a1c/invoke.js';
    script1.async = true;
    document.head.appendChild(script1);

    (window as any).atOptions = {
      'key': '13f611862530e5d2b1733b67657704e5',
      'format': 'iframe',
      'height': 90,
      'width': 728,
      'params': {}
    };
    const script2 = document.createElement('script');
    script2.src = 'https://www.highperformanceformat.com/13f611862530e5d2b1733b67657704e5/invoke.js';
    script2.async = true;
    document.head.appendChild(script2);

    (window as any).atOptions2 = {
      'key': '201267a221c3333b3423fd09173a2f19',
      'format': 'iframe',
      'height': 60,
      'width': 468,
      'params': {}
    };
    const script3 = document.createElement('script');
    script3.src = 'https://www.highperformanceformat.com/201267a221c3333b3423fd09173a2f19/invoke.js';
    script3.async = true;
    document.head.appendChild(script3);

    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
      document.head.removeChild(script3);
    };
  }, []);

  useEffect(() => {
    
    const loadData = async () => {
      setLoading(true);
      try {
        const [chs, cats, conts] = await Promise.all([
          iptvService.getChannelsWithStreams(),
          iptvService.getCategories(),
          iptvService.getCountries()
        ]);
        setChannels(chs);
        setCategories(cats);
        setCountries(conts);
      } catch (err) {
        setError('Failed to load channels');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (channels.length === 0 || categories.length === 0) return;

    const categoryChannelMap = new Map<string, ChannelWithStreams[]>();
    channels.forEach(ch => {
      ch.categories.forEach(cat => {
        if (!categoryChannelMap.has(cat)) {
          categoryChannelMap.set(cat, []);
        }
        categoryChannelMap.get(cat)!.push(ch);
      });
    });

    const sortedCategories = categories
      .map(c => ({
        id: c.id,
        name: c.name,
        channels: (categoryChannelMap.get(c.id) || []).slice(0, 8)
      }))
      .filter(c => c.channels.length > 0)
      .sort((a, b) => b.channels.length - a.channels.length);

    setCategorySections(sortedCategories);
  }, [channels, categories]);

  const favoriteChannels = channels.filter(ch => favorites.includes(ch.id));
  
  const displayCategories = showAllCategories 
    ? categorySections 
    : categorySections.slice(0, CATEGORIES_TO_SHOW);

  if (isLoading && channels.length === 0) {
    return (
      <div className="loading-page">
        <Loader2 size={48} className="animate-spin" />
        <p>Loading TVbanda...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="ad-banner-top">
        <div id="container-7d4f7bc93926bde082b869a4c0ee1a1c"></div>
      </div>

      <section className="hero-section">
        <img src="/without-background-main-logo.png" alt="TVbanda" className="hero-logo" />
        <p>Watch live TV from around the world</p>
        <div className="stats">
          <span><Tv size={16} /> {channels.length}+ Channels</span>
          <span><Globe size={16} /> {countries.length}+ Countries</span>
          <span><Film size={16} /> {categories.length} Categories</span>
        </div>
      </section>

      <section className="download-section">
        <h2>📲 Get Our App</h2>
        <p>Download our app for a better experience</p>
        <div className="download-buttons">
          <a href="https://omg10.com/4/9060184" target="_blank" rel="noopener noreferrer" className="download-btn primary">
            <Download size={20} />
            <div>
              <span className="btn-title">Download APK</span>
              <span className="btn-subtitle">Latest Version</span>
            </div>
          </a>
          <a href="https://omg10.com/4/9060184" target="_blank" rel="noopener noreferrer" className="download-btn secondary">
            <Play size={20} />
            <div>
              <span className="btn-title">Watch Demo</span>
              <span className="btn-subtitle">See in action</span>
            </div>
          </a>
        </div>
        <div className="app-features">
          <span><Star size={14} /> 4.8 Rating</span>
          <span><Download size={14} /> 100K+ Downloads</span>
          <span><Heart size={14} /> 50K+ Likes</span>
        </div>
        <a href="https://omg10.com/4/9060184" target="_blank" rel="noopener noreferrer" className="share-link">
          <Share2 size={16} /> Share with friends
        </a>
      </section>

      <div className="ad-banner-mid desktop-only">
        <ins className="adsbygoogle" style={{display: 'inline-block', width: '728px', height: '90px'}} data-ad-slot="13f611862530e5d2b1733b67657704e5"></ins>
      </div>
      <div className="ad-banner-mid mobile-only">
        <ins className="adsbygoogle" style={{display: 'inline-block', width: '468px', height: '60px'}} data-ad-slot="201267a221c3333b3423fd09173a2f19"></ins>
      </div>

      {favoriteChannels.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h2>❤️ Your Favorites</h2>
            <Link href="/favorites" className="see-all">See All</Link>
          </div>
          <div className="horizontal-scroll">
            {favoriteChannels.slice(0, 6).map(channel => (
              <Link key={channel.id} href={`/watch/${channel.id}`} className="mini-card">
                {channel.logo ? (
                  <img src={channel.logo} alt={channel.name} className="mini-logo" />
                ) : (
                  <div className="mini-icon">{channel.name.charAt(0)}</div>
                )}
                <span>{channel.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="ad-banner-mid desktop-only">
        <ins className="adsbygoogle" style={{display: 'inline-block', width: '728px', height: '90px'}} data-ad-slot="13f611862530e5d2b1733b67657704e5"></ins>
      </div>
      <div className="ad-banner-mid mobile-only">
        <ins className="adsbygoogle" style={{display: 'inline-block', width: '320px', height: '50px'}} data-ad-slot="201267a221c3333b3423fd09173a2f19"></ins>
      </div>

      <section className="section">
        <div className="section-header">
          <h2>📺 Popular TV Channels</h2>
          <Link href="/categories" className="see-all">See All</Link>
        </div>
        
        <div className="quick-links">
          <Link href="/countries" className="quick-link-card">
            <span className="quick-link-icon">🌍</span>
            <span className="quick-link-text">Browse by Country</span>
          </Link>
          <Link href="/categories" className="quick-link-card">
            <span className="quick-link-icon">📺</span>
            <span className="quick-link-text">Browse by Category</span>
          </Link>
        </div>

        <div className="section-header" style={{ marginTop: '20px' }}>
          <h2>🎬 Channels by Category</h2>
        </div>
        
        {displayCategories.map(category => (
          <div key={category.id} className="country-channels-section">
            <div className="country-section-header">
              <Link href={`/category/${category.id}`} className="country-section-title">
                <span>{category.name}</span>
                <span className="channel-count">({category.channels.length}+ channels)</span>
              </Link>
              <Link href={`/category/${category.id}`} className="see-all-btn">
                See All <ChevronRight size={16} />
              </Link>
            </div>
            <div className="country-channels-grid">
              {category.channels.map(channel => (
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

        {categorySections.length > CATEGORIES_TO_SHOW && !showAllCategories && (
          <div className="load-more-trigger" onClick={() => setShowAllCategories(true)}>
            <span>View All Categories ({categorySections.length})</span>
            <ChevronRight size={20} />
          </div>
        )}
      </section>

      <div className="ad-banner-footer">
        <div id="social-bar-container"></div>
      </div>
    </div>
  );
}