'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Globe, Film, Search, Heart, Tv, Sun, Moon, ExternalLink } from 'lucide-react';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/countries', icon: Globe, label: 'Countries' },
  { href: '/categories', icon: Film, label: 'Categories' },
  { href: '/search', icon: Search, label: 'Search' },
  { href: '/favorites', icon: Heart, label: 'Favorites' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isDesktop, setIsDesktop] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className={`app-layout ${isDesktop ? 'has-header' : ''}`}>
      {isDesktop && (
        <header className="desktop-header">
          <div className="desktop-header-content">
            <Link href="/" className="desktop-logo">
              <img src="/without-background-main-logo.png" alt="TVbanda" className="header-logo-img" />
              <span className="header-logo-text">TVbanda</span>
            </Link>
            <nav className="desktop-nav">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`desktop-nav-item ${pathname === item.href ? 'active' : ''}`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              ))}
              <a 
                href="https://www.vidbanda.duckdns.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="desktop-nav-item movies-btn"
              >
                <Tv size={18} />
                <span>Movies</span>
                <ExternalLink size={14} className="external-icon" />
              </a>
            </nav>
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>
      )}
      {!isDesktop && (
        <>
          <header className="mobile-header">
            <Link href="/" className="mobile-logo">
              <img src="/without-background-main-logo.png" alt="TVbanda" className="mobile-logo-img" />
            </Link>
            <a 
              href="https://www.vidbanda.duckdns.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mobile-movies-btn"
            >
              <Tv size={16} />
              <span>Movies</span>
            </a>
          </header>
          <nav className="bottom-nav">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${pathname === item.href ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
          </nav>
        </>
      )}
      <div className="nav-content">
        {children}
      </div>
    </div>
  );
}