// src/store/userDeviceStore.jsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import customStorage from '../utils/customZustandStorage';

const userDeviceStore = create(persist(
  (set, get) => ({
    deviceDetails: null,
    isRegistered: false,
    setDeviceDetails: (data) => set({ deviceDetails: data }),
    setIsRegistered: (status) => set({ isRegistered: status }),
    updateDeviceField: (key, value) =>
      set((state) => ({
        deviceDetails: {
          ...state.deviceDetails,
          [key]: value,
        },
      })),
    removeDeviceField: (key) =>
      set((state) => {
        const updatedDetails = { ...state.deviceDetails };
        delete updatedDetails[key];
        return { deviceDetails: updatedDetails };
      }),
    clearDeviceDetails: () => set({ deviceDetails: null }),
    getDeviceDetails: () => get().deviceDetails,
  }),
  {
    name: 'device-info-store',
    storage: customStorage,
  }
));

export default userDeviceStore;
