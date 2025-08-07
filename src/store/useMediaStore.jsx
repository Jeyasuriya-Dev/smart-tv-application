// src/store/useMediaStore.jsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import customStorage from '../utils/customZustandStorage';

const useMediaStore = create(
  persist(
    (set, get) => ({
      mediaFiles: [],
      mediaUrls: [],       // separate URL variable
      updatedTime: null,
      loading: false,
      error: null,

      setMediaFiles: (files) => set({ mediaFiles: files }),

      setUpdatedTime: (time) => set({ updatedTime: time }),

      addMediaFile: (file) =>
        set((state) => ({
          mediaFiles: [...state.mediaFiles, file],
        })),

      removeMediaFile: (id) =>
        set((state) => ({
          mediaFiles: state.mediaFiles.filter((f) => f.id !== id),
        })),

      clearMediaFiles: () => set({ mediaFiles: [] }),

      setMediaUrls: (urls) => set({ mediaUrls: urls }),

      addMediaUrl: (url) =>
        set((state) => {
          if (!state.mediaUrls.includes(url)) {
            return { mediaUrls: [...state.mediaUrls, url] };
          }
          return {};
        }),

      clearMediaUrls: () => set({ mediaUrls: [] }),

      updateMediaUrls: (newUrls) => {
        const current = get().mediaUrls;
        const updated = [...new Set([...current, ...newUrls])];
        set({ mediaUrls: updated });
      },
    }),
    {
      name: 'media-files-storage',
      storage: customStorage,
    }
  )
);

export default useMediaStore;
