import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useMediaStore = create(persist(
  (set) => ({
    mediaFiles: [],
    loading: false,
    error: null,

    setMediaFiles: (data) => set({ mediaFiles: data }),
    addMediaFile: (file) => set((state) => ({ mediaFiles: [...state.mediaFiles, file] })),
    removeMediaFile: (id) => set((state) => ({ mediaFiles: state.mediaFiles.filter(f => f.id !== id) })),
    clearMediaFiles: () => set({ mediaFiles: [] })
  }),
  { name: 'media-files-storage' } // Stores in localStorage automatically
));

export default useMediaStore;
