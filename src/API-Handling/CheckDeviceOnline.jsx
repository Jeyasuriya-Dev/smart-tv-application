import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const DeviceStatusPoller = () => {
	const [isOnline, setIsOnline] = useState(navigator.onLine);
	const [apiReachable, setApiReachable] = useState(true);
	const isOnlineURL = import.meta.env.VITE_DEVICEONLINE_CHECK_URL;

	const checkInternet = async () => {
		// Step 1: Local device check
		setIsOnline(navigator.onLine);

		// Step 2: Backend API check
		try {
			const response = await axios.get(isOnlineURL, {
				params: {
					adrid: '0461dbdd0ce43fd2',
					clientname: 'ridsysc',
				},
				timeout: 3000,
			});
			setApiReachable(response.status === 200);
		} catch (err) {
			setApiReachable(false);
		}
	};

	useEffect(() => {
		checkInternet(); // Initial check

		const interval = setInterval(checkInternet, 5000); // Every 5 seconds

		// Browser-level events
		const handleOnline = () => setIsOnline(true);
		const handleOffline = () => setIsOnline(false);
		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		return () => {
			clearInterval(interval);
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
		};
	}, [isOnlineURL]);

	return (
		<div
			style={{
				position: 'fixed',
				bottom: 10,
				left: 10,
				backgroundColor: isOnline && apiReachable ? 'rgba(0,255,0,0.2)' : 'rgba(255,0,0,0.2)',
				color: isOnline && apiReachable ? '#0f0' : '#f00',
				padding: '6px 12px',
				borderRadius: '6px',
				fontWeight: 600,
				fontSize: '14px',
				zIndex: 9999,
				fontFamily: 'monospace',
			}}
		>
			{isOnline && apiReachable ? '🟢 Online' : isOnline ? '🟡 Local Only' : '🔴 Offline'}
		</div>
	);
};

export default DeviceStatusPoller;
