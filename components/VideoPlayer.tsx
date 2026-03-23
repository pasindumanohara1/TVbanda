'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, 
  SkipBack, SkipForward, X, Settings 
} from 'lucide-react';
import { usePlayerStore } from '@/stores/playerStore';

export default function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { 
    currentChannel, 
    currentStreamIndex, 
    isPlaying, 
    setIsPlaying,
    volume, 
    isMuted,
    toggleMute,
    setVolume,
    toggleFullscreen,
    nextStream,
    previousStream,
    isFullscreen
  } = usePlayerStore();

  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentStream = currentChannel?.streams[currentStreamIndex];

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentStream) return;

    setIsLoading(true);

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: 30,
        manifestLoadingTimeOut: 10000,
        manifestLoadingMaxRetry: 3
      });

      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          console.error('HLS Fatal Error:', data.type);
          setIsLoading(false);
        }
      });

      hls.loadSource(currentStream.url);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = currentStream.url;
      video.addEventListener('loadedmetadata', () => setIsLoading(false));
    }

    return () => {
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [currentStream]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch(() => setIsPlaying(false));
    } else {
      video.pause();
    }
  }, [isPlaying, setIsPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      toggleMute();
    }
  };

  if (!currentChannel) return null;

  return (
    <div 
      ref={containerRef}
      className={`video-player ${isFullscreen ? 'fullscreen' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="video-element"
        onClick={() => setIsPlaying(!isPlaying)}
        playsInline
      />

      {isLoading && (
        <div className="player-loading">
          <div className="loading-spinner" />
          <span>Loading stream...</span>
        </div>
      )}

      <button 
        className="close-player"
        onClick={() => usePlayerStore.getState().setCurrentChannel(null)}
      >
        <X size={24} />
      </button>

      <div className={`player-controls ${showControls ? 'show' : ''}`}>
        <div className="now-playing">
          <span className="now-playing-title">{currentChannel.name}</span>
          <span className="now-playing-stream">
            Stream {currentStreamIndex + 1} of {currentChannel.streams.length}
          </span>
        </div>

        <div className="controls-row">
          <div className="controls-left">
            <button 
              className="control-btn"
              onClick={previousStream}
              disabled={currentChannel.streams.length <= 1}
            >
              <SkipBack size={20} />
            </button>

            <button 
              className="control-btn play-btn"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>

            <button 
              className="control-btn"
              onClick={nextStream}
              disabled={currentChannel.streams.length <= 1}
            >
              <SkipForward size={20} />
            </button>
          </div>

          <div className="controls-center">
            {currentStream?.quality && (
              <span className="quality-badge">{currentStream.quality}</span>
            )}
          </div>

          <div className="controls-right">
            <div className="volume-control">
              <button className="control-btn" onClick={toggleMute}>
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
            </div>

            <button className="control-btn">
              <Settings size={20} />
            </button>

            <button className="control-btn" onClick={toggleFullscreen}>
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}