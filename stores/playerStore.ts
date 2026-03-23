import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChannelWithStreams } from '@/types';

interface PlayerState {
  currentChannel: ChannelWithStreams | null;
  currentStreamIndex: number;
  isFullscreen: boolean;
  volume: number;
  isMuted: boolean;
  isPlaying: boolean;
  setCurrentChannel: (channel: ChannelWithStreams | null) => void;
  setCurrentStreamIndex: (index: number) => void;
  toggleFullscreen: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setIsPlaying: (playing: boolean) => void;
  nextStream: () => void;
  previousStream: () => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      currentChannel: null,
      currentStreamIndex: 0,
      isFullscreen: false,
      volume: 1,
      isMuted: false,
      isPlaying: false,

      setCurrentChannel: (channel) => set({ 
        currentChannel: channel,
        currentStreamIndex: 0,
        isPlaying: false
      }),

      setCurrentStreamIndex: (index) => set({ currentStreamIndex: index }),

      toggleFullscreen: () => set(state => ({ isFullscreen: !state.isFullscreen })),

      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),

      toggleMute: () => set(state => ({ isMuted: !state.isMuted })),

      setIsPlaying: (isPlaying) => set({ isPlaying }),

      nextStream: () => {
        const { currentChannel, currentStreamIndex } = get();
        if (!currentChannel || currentChannel.streams.length <= 1) return;
        const nextIndex = (currentStreamIndex + 1) % currentChannel.streams.length;
        set({ currentStreamIndex: nextIndex, isPlaying: false });
      },

      previousStream: () => {
        const { currentChannel, currentStreamIndex } = get();
        if (!currentChannel || currentChannel.streams.length <= 1) return;
        const prevIndex = currentStreamIndex === 0 
          ? currentChannel.streams.length - 1 
          : currentStreamIndex - 1;
        set({ currentStreamIndex: prevIndex, isPlaying: false });
      }
    }),
    {
      name: 'tvbanda-player',
      partialize: (state) => ({ volume: state.volume, isMuted: state.isMuted })
    }
  )
);