import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DeviceStatusPoller = () => {
	const [isOnline, setIsOnline] = useState(true);
	const isOnlineURL = import.meta.env.VITE_DEVICEONLINE_CHECK_URL;

	const checkAPI = async () => {
		try {
			const response = await axios.get(isOnlineURL, {
				params: {
					adrid: '0461dbdd0ce43fd2',
					clientname: 'ridsysc',
				},
				timeout: 3000,
			});
			setIsOnline(response.status === 200);
		} catch (err) {
			setIsOnline(false);
		}
	};

	useEffect(() => {
		checkAPI(); // Initial check
		const interval = setInterval(checkAPI, 1000); // Check every Sec
		return () => clearInterval(interval);
	}, [isOnlineURL]);

	return (
		<>
			{/* Status icon in top-left corner */}
			<div
				style={{
					position: 'fixed',
					top: 5,
					left: 5,
					backgroundColor: isOnline ? 'rgba(0,255,0,0.2)' : 'rgba(255,0,0,0.2)',
					color: isOnline ? '#0f0' : '#f00',
					padding: '6px 12px',
					borderRadius: '6px',
					fontWeight: 600,
					fontSize: '14px',
					zIndex: 9999,
					fontFamily: 'monospace',
				}}
			>
				{isOnline ? '🟢 Online' : '🔴 Offline'}
			</div>

			{/* Full-screen offline UI */}
			{!isOnline && (
				<div
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						width: '100vw',
						height: '100vh',
						backgroundColor: '#f8f8f8',
						color: '#333',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						fontFamily: 'Arial, sans-serif',
						zIndex: 9998,
					}}
				>
					<div style={{ fontSize: 80, marginBottom: 20 }}>📡</div>
					<h2>No Internet Connection</h2>
					<p style={{ maxWidth: 300, textAlign: 'center' }}>
						Check your connection and try again. This app requires internet access.
					</p>
				</div>
			)}
		</>
	);
};

export default DeviceStatusPoller;
