import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAppUrlStore = create(persist(
	(set) => ({
		appUrl: '',

		// Set or Update the App URL
		setAppUrl: (url) => set({ appUrl: url }),

		// Append a query string or modify (Example of edit logic)
		appendToAppUrl: (suffix) =>
			set((state) => ({ appUrl: state.appUrl + suffix })),

		// Clear App URL
		clearAppUrl: () => set({ appUrl: '' }),
	}),
	{
		name: 'app-url-storage', // LocalStorage key
	}
));

export default useAppUrlStore;