import { create } from 'zustand';

const userDeviceStore = create((set, get) => ({
	deviceDetails: null,
	isRegistered: false,

	// Create / Set Device Details (Store Full Object)
	setDeviceDetails: (data) => set({ deviceDetails: data }),

	setIsRegistered: (status) => set({ isRegistered: status }),

	// Update specific field (Modify one detail)
	updateDeviceField: (key, value) =>
		set((state) => ({
			deviceDetails: {
				...state.deviceDetails,
				[key]: value,
			},
		})),

	// Delete specific field
	removeDeviceField: (key) =>
		set((state) => {
			const updatedDetails = { ...state.deviceDetails };
			delete updatedDetails[key];
			return { deviceDetails: updatedDetails };
		}),

	// Clear entire device details (Reset to null)
	clearDeviceDetails: () => set({ deviceDetails: null }),

	// Get current device details (direct call without hook)
	getDeviceDetails: () => get().deviceDetails,
}));

export default userDeviceStore;
