'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Hls from 'hls.js';
import Link from 'next/link';
import { 
  ArrowLeft, Heart, Share2, Volume2, VolumeX, 
  Maximize, SkipBack, SkipForward, Tv, Play, Pause,
  Settings, PictureInPicture2, Rewind, FastForward, Check
} from 'lucide-react';
import { useChannelStore, useFavoritesStore } from '@/stores/channelStore';
import { Loader2 } from 'lucide-react';

function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌍';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

interface QualityLevel {
  height: number;
  index: number;
  bitrate: number;
  label: string;
}

export default function WatchPageContent() {
  const params = useParams();
  const router = useRouter();
  const channelId = params.id as string;
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { channels, isLoading } = useChannelStore();
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();

  const [streamIndex, setStreamIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingStream, setIsLoadingStream] = useState(true);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [qualities, setQualities] = useState<QualityLevel[]>([]);
  const [currentQuality, setCurrentQuality] = useState(-1);

  const channel = channels.find(c => c.id === channelId);
  const currentStream = channel?.streams[streamIndex];
  const favorite = channel ? isFavorite(channel.id) : false;

  const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentStream) return;

    setIsLoadingStream(true);
    setError(null);

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: 30,
      });

      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        setIsLoadingStream(false);
        const levels = data.levels.map((level, index) => ({
          height: level.height,
          index,
          bitrate: level.bitrate,
          label: level.height ? `${level.height}p` : `${Math.round(level.bitrate/1000)}kbps`
        }));
        setQualities(levels);
        if (levels.length > 0) {
          hls.currentLevel = -1;
        }
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        setCurrentQuality(data.level);
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setError('Stream failed to load. Try another stream.');
          setIsLoadingStream(false);
        }
      });

      hls.loadSource(currentStream.url);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = currentStream.url;
      video.addEventListener('loadedmetadata', () => setIsLoadingStream(false));
    }

    return () => {
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [currentStream]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.duration) {
        setDuration(video.duration);
      }
    };

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.play().catch(() => setIsPlaying(false));
    } else {
      video.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    showControlsTemporarily();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    showControlsTemporarily();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
    if (parseFloat(e.target.value) > 0) setIsMuted(false);
    showControlsTemporarily();
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await containerRef.current.requestFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
    showControlsTemporarily();
  };

  const togglePiP = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch (err) {
      console.error('PiP error:', err);
    }
    showControlsTemporarily();
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, duration));
    }
    showControlsTemporarily();
  };

  const changeQuality = (qualityIndex: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = qualityIndex;
    }
    setShowQualityMenu(false);
    showControlsTemporarily();
  };

  const toggleFavorite = () => {
    if (!channel) return;
    if (favorite) {
      removeFavorite(channel.id);
    } else {
      addFavorite(channel.id);
    }
  };

  const handleStreamChange = (newIndex: number) => {
    setStreamIndex(newIndex);
    setIsPlaying(false);
  };

  const formatTime = (time: number) => {
    if (!isFinite(time)) return 'LIVE';
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="loading-page">
        <Loader2 size={48} className="animate-spin" />
        <p>Loading channel...</p>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <p>Channel not found</p>
          <Link href="/" className="primary-btn">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="watch-page">
      <div className="watch-header">
        <button className="back-btn" onClick={() => router.back()}>
          <ArrowLeft size={20} />
        </button>
        <h1>{channel.name}</h1>
        <div className="header-actions">
          <button className={`icon-btn ${favorite ? 'active' : ''}`} onClick={toggleFavorite}>
            <Heart size={20} fill={favorite ? '#FFD700' : 'none'} />
          </button>
          <button className="icon-btn">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <div className="ad-banner-top desktop-only">
        <ins className="adsbygoogle" style={{display: 'inline-block', width: '728px', height: '90px'}} data-ad-slot="13f611862530e5d2b1733b67657704e5"></ins>
      </div>
      <div className="ad-banner-top mobile-only">
        <ins className="adsbygoogle" style={{display: 'inline-block', width: '320px', height: '50px'}} data-ad-slot="201267a221c3333b3423fd09173a2f19"></ins>
      </div>

      <div 
        className="video-container" 
        ref={containerRef}
        onMouseMove={showControlsTemporarily}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        <video
          ref={videoRef}
          className="video-player"
          onClick={togglePlay}
          playsInline
        />

        {isLoadingStream && (
          <div className="player-overlay">
            <Loader2 size={40} className="animate-spin" />
            <p>Loading stream...</p>
          </div>
        )}

        {error && (
          <div className="player-overlay error">
            <p>{error}</p>
          </div>
        )}

        <div className={`player-controls-container ${showControls ? 'visible' : ''}`}>
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div 
                className="progress-buffered" 
                style={{ width: `${(buffered / duration) * 100}%` }}
              />
              <div 
                className="progress-played" 
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
          </div>

          <div className="player-controls-main">
            <div className="controls-left">
              <button className="control-btn" onClick={() => skip(-10)} title="Rewind 10s">
                <Rewind size={20} />
              </button>
              <button className="control-btn big" onClick={togglePlay} title={isPlaying ? 'Pause' : 'Play'}>
                {isPlaying ? <Pause size={28} /> : <Play size={28} />}
              </button>
              <button className="control-btn" onClick={() => skip(10)} title="Forward 10s">
                <FastForward size={20} />
              </button>
            </div>

            <div className="controls-center">
              <span className="time-display">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="controls-right">
              <div className="volume-control">
                <button className="control-btn" onClick={toggleMute} title={isMuted ? 'Unmute' : 'Mute'}>
                  {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <input
                  type="range"
                  className="volume-slider"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                />
              </div>

              <div className="speed-control">
                <button 
                  className="control-btn" 
                  onClick={() => { setShowSpeedMenu(!showSpeedMenu); setShowQualityMenu(false); }}
                  title="Playback Speed"
                >
                  <span className="speed-label">{playbackRate}x</span>
                </button>
                {showSpeedMenu && (
                  <div className="speed-menu">
                    {speedOptions.map(speed => (
                      <button
                        key={speed}
                        className={`speed-option ${playbackRate === speed ? 'active' : ''}`}
                        onClick={() => { setPlaybackRate(speed); setShowSpeedMenu(false); }}
                      >
                        {speed}x {playbackRate === speed && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {qualities.length > 0 && (
                <div className="quality-control">
                  <button 
                    className="control-btn" 
                    onClick={() => { setShowQualityMenu(!showQualityMenu); setShowSpeedMenu(false); }}
                    title="Quality"
                  >
                    <Settings size={20} />
                  </button>
                  {showQualityMenu && (
                    <div className="quality-menu">
                      <button
                        className={`quality-option ${currentQuality === -1 ? 'active' : ''}`}
                        onClick={() => { changeQuality(-1); }}
                      >
                        Auto {currentQuality === -1 && <Check size={14} />}
                      </button>
                      {qualities.map(q => (
                        <button
                          key={q.index}
                          className={`quality-option ${currentQuality === q.index ? 'active' : ''}`}
                          onClick={() => { changeQuality(q.index); }}
                        >
                          {q.label} {currentQuality === q.index && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button className="control-btn" onClick={togglePiP} title="Picture-in-Picture">
                <PictureInPicture2 size={20} />
              </button>

              <button className="control-btn" onClick={toggleFullscreen} title="Fullscreen">
                <Maximize size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="ad-banner-mid desktop-only">
        <ins className="adsbygoogle" style={{display: 'inline-block', width: '728px', height: '90px'}} data-ad-slot="13f611862530e5d2b1733b67657704e5"></ins>
      </div>
      <div className="ad-banner-mid mobile-only">
        <ins className="adsbygoogle" style={{display: 'inline-block', width: '320px', height: '50px'}} data-ad-slot="201267a221c3333b3423fd09173a2f19"></ins>
      </div>

      <div className="channel-info-section">
        <div className="info-header">
          {channel.logo ? (
            <img src={channel.logo} alt={channel.name} className="channel-logo-large" />
          ) : (
            <div className="channel-logo-large">{channel.name.charAt(0)}</div>
          )}
          <div className="channel-meta">
            <h2>{channel.name}</h2>
            <p>{getCountryFlag(channel.country)} {channel.country} • {channel.categories.join(', ')}</p>
            {channel.network && <p className="network">Network: {channel.network}</p>}
          </div>
        </div>

        {channel.website && (
          <a href={channel.website} target="_blank" rel="noopener noreferrer" className="website-btn">
            Visit Website
          </a>
        )}
      </div>

      <div className="ad-banner-bottom desktop-only">
        <ins className="adsbygoogle" style={{display: 'inline-block', width: '728px', height: '90px'}} data-ad-slot="13f611862530e5d2b1733b67657704e5"></ins>
      </div>
      <div className="ad-banner-bottom mobile-only">
        <ins className="adsbygoogle" style={{display: 'inline-block', width: '320px', height: '50px'}} data-ad-slot="201267a221c3333b3423fd09173a2f19"></ins>
      </div>

      <div className="streams-section">
        <h3>Available Streams ({channel.streams.length})</h3>
        <div className="streams-list">
          {channel.streams.map((stream, idx) => (
            <button
              key={idx}
              className={`stream-item ${idx === streamIndex ? 'active' : ''}`}
              onClick={() => handleStreamChange(idx)}
            >
              <Tv size={16} />
              <span>Stream {idx + 1}</span>
              {stream.quality && <span className="quality">{stream.quality}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="ad-banner-footer desktop-only">
        <ins className="adsbygoogle" style={{display: 'inline-block', width: '728px', height: '90px'}} data-ad-slot="13f611862530e5d2b1733b67657704e5"></ins>
      </div>
      <div className="ad-banner-footer mobile-only">
        <ins className="adsbygoogle" style={{display: 'inline-block', width: '320px', height: '50px'}} data-ad-slot="201267a221c3333b3423fd09173a2f19"></ins>
      </div>
    </div>
  );
}