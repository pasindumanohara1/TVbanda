import { Search, Settings, Menu, X } from 'lucide-react';
import { useChannelStore } from '@/stores/channelStore';
import { useState } from 'react';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { searchQuery, setSearchQuery } = useChannelStore();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <button className="menu-btn" onClick={onMenuClick}>
            <Menu size={24} />
          </button>
          <div className="logo">
            <span className="logo-icon">📺</span>
            <span className="logo-text">TVbanda</span>
          </div>
        </div>

        <div className={`search-container ${showSearch ? 'show' : ''}`}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button 
              className="clear-search"
              onClick={() => setSearchQuery('')}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="header-right">
          <button 
            className="search-toggle"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search size={20} />
          </button>
          <button className="settings-btn">
            <Settings size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}