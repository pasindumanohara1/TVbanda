'use client';

import { X, Globe, Film, Star, Eye, EyeOff } from 'lucide-react';
import { useChannelStore, useFavoritesStore } from '@/stores/channelStore';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { 
    categories, 
    countries,
    selectedCategory, 
    selectedCountry,
    setCategory,
    setCountry,
    showFavoritesOnly,
    toggleFavoritesOnly,
    hideNSFW,
    toggleNSFW
  } = useChannelStore();
  
  const { favorites } = useFavoritesStore();

  const popularCountries = countries.slice(0, 20);

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'show' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Filters</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-section">
          <h3>
            <Star size={16} />
            Favorites
          </h3>
          <button 
            className={`filter-btn ${showFavoritesOnly ? 'active' : ''}`}
            onClick={toggleFavoritesOnly}
          >
            <Star size={16} />
            Show Favorites ({favorites.length})
          </button>
        </div>

        <div className="sidebar-section">
          <h3>
            <EyeOff size={16} />
            Content
          </h3>
          <button 
            className={`filter-btn ${hideNSFW ? 'active' : ''}`}
            onClick={toggleNSFW}
          >
            {hideNSFW ? <EyeOff size={16} /> : <Eye size={16} />}
            {hideNSFW ? 'NSFW Hidden' : 'Show NSFW'}
          </button>
        </div>

        <div className="sidebar-section">
          <h3>
            <Film size={16} />
            Categories
          </h3>
          <div className="filter-list">
            <button 
              className={`filter-chip ${!selectedCategory ? 'active' : ''}`}
              onClick={() => setCategory(null)}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`filter-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-section">
          <h3>
            <Globe size={16} />
            Countries
          </h3>
          <div className="filter-list">
            <button 
              className={`filter-chip ${!selectedCountry ? 'active' : ''}`}
              onClick={() => setCountry(null)}
            >
              All
            </button>
            {popularCountries.map(country => (
              <button
                key={country.code}
                className={`filter-chip ${selectedCountry === country.code ? 'active' : ''}`}
                onClick={() => setCountry(country.code)}
              >
                {country.flag} {country.name}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}