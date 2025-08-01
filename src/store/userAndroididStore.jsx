// src/store/useDeviceStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import customStorage from '../utils/customZustandStorage';

const userAndroidIDStore = create(persist(
  (set) => ({
    androidId: '',
    setAndroidId: (id) => set({ androidId: id }),
  }),
  {
    name: 'android-id-store',
    storage: customStorage,
  }
));

export default userAndroidIDStore;
