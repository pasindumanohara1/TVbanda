import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChannelWithStreams, Category, Country } from '@/types';

interface ChannelState {
  channels: ChannelWithStreams[];
  categories: Category[];
  countries: Country[];
  isLoading: boolean;
  error: string | null;
  selectedCategory: string | null;
  selectedCountry: string | null;
  searchQuery: string;
  showFavoritesOnly: boolean;
  hideNSFW: boolean;
  setChannels: (channels: ChannelWithStreams[]) => void;
  setCategories: (categories: Category[]) => void;
  setCountries: (countries: Country[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCategory: (category: string | null) => void;
  setCountry: (country: string | null) => void;
  setSearchQuery: (query: string) => void;
  toggleFavoritesOnly: () => void;
  toggleNSFW: () => void;
  filteredChannels: () => ChannelWithStreams[];
}

export const useChannelStore = create<ChannelState>()(
  persist(
    (set, get) => ({
      channels: [],
      categories: [],
      countries: [],
      isLoading: false,
      error: null,
      selectedCategory: null,
      selectedCountry: null,
      searchQuery: '',
      showFavoritesOnly: false,
      hideNSFW: true,

      setChannels: (channels) => set({ channels }),
      setCategories: (categories) => set({ categories }),
      setCountries: (countries) => set({ countries }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setCategory: (selectedCategory) => set({ selectedCategory }),
      setCountry: (selectedCountry) => set({ selectedCountry }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      toggleFavoritesOnly: () => set(state => ({ 
        showFavoritesOnly: !state.showFavoritesOnly 
      })),
      toggleNSFW: () => set(state => ({ hideNSFW: !state.hideNSFW })),

      filteredChannels: () => {
        const state = get();
        return state.channels.filter(channel => {
          if (state.selectedCategory && 
              !channel.categories.includes(state.selectedCategory)) {
            return false;
          }
          if (state.selectedCountry && channel.country !== state.selectedCountry) {
            return false;
          }
          if (state.searchQuery) {
            const query = state.searchQuery.toLowerCase();
            const nameMatch = channel.name.toLowerCase().includes(query);
            const altMatch = channel.alt_names?.some(n => n.toLowerCase().includes(query));
            if (!nameMatch && !altMatch) return false;
          }
          if (state.hideNSFW && channel.is_nsfw) return false;
          return true;
        });
      }
    }),
    {
      name: 'tvbanda-channels',
      partialize: (state) => ({ 
        channels: state.channels,
        categories: state.categories,
        countries: state.countries,
        selectedCategory: state.selectedCategory,
        selectedCountry: state.selectedCountry,
        hideNSFW: state.hideNSFW
      })
    }
  )
);

interface FavoritesState {
  favorites: string[];
  addFavorite: (channelId: string) => void;
  removeFavorite: (channelId: string) => void;
  isFavorite: (channelId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (channelId) => set(state => ({
        favorites: [...state.favorites, channelId]
      })),
      removeFavorite: (channelId) => set(state => ({
        favorites: state.favorites.filter(id => id !== channelId)
      })),
      isFavorite: (channelId) => get().favorites.includes(channelId)
    }),
    { name: 'tvbanda-favorites' }
  )
);