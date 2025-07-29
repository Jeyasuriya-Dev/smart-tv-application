// src/store/useDeviceStore.js
import { create } from 'zustand';

const userAndroidIDStore = create((set) => ({
  androidId: '',
  setAndroidId: (id) => set({ androidId: id }),
}));

export default userAndroidIDStore;
