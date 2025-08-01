import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useMediaStore = create(persist(
  (set) => ({
    mediaFiles: [],
    updatedTime: null, // <-- NEW
    loading: false,
    error: null,

    setMediaFiles: (data) => set({ mediaFiles: data }),
    setUpdatedTime: (time) => set({ updatedTime: time }), // <-- NEW
    addMediaFile: (file) => set((state) => ({ mediaFiles: [...state.mediaFiles, file] })),
    removeMediaFile: (id) => set((state) => ({ mediaFiles: state.mediaFiles.filter(f => f.id !== id) })),
    clearMediaFiles: () => set({ mediaFiles: [] })
  }),
  { name: 'media-files-storage' }
));

export default useMediaStore;
