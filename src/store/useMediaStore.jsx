// src/store/useMediaStore.jsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import customStorage from '../utils/customZustandStorage';

const useMediaStore = create(persist(
  (set) => ({
    mediaFiles: [],
    updatedTime: null,
    loading: false,
    error: null,
    setMediaFiles: (data) => set({ mediaFiles: data }),
    setUpdatedTime: (time) => set({ updatedTime: time }),
    addMediaFile: (file) => set((state) => ({ mediaFiles: [...state.mediaFiles, file] })),
    removeMediaFile: (id) => set((state) => ({ mediaFiles: state.mediaFiles.filter(f => f.id !== id) })),
    clearMediaFiles: () => set({ mediaFiles: [] }),
  }),
  {
    name: 'media-files-storage',
    storage: customStorage,
  }
));

export default useMediaStore;
