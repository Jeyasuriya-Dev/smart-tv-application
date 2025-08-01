import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import SplashScreen from './components/VideoLoader';
import RegistrationPage from './components/RegistrationPage';
import useDeviceDetails from './API-Handling/userDeviceDetails';
import AndroidIDFetcher from './components/AndroidIDFetcher';
import RemoteControlHandler from './components/RemoteControlHandler';
import DeviceStatusPoller from './API-Handling/CheckDeviceOnline';
import StreamingPage from './components/StreamingPage';
import checkDeviceOnline from './API-Handling/useOnlineStatusCheck';

import useMediaStore from './store/useMediaStore';

export const Home = () => {
	useDeviceDetails(); // starts polling device info
	return (
		<>
			<DeviceStatusPoller />
			<StreamingPage />
		</>
	);
};

const App = () => {
	const [showSplash, setShowSplash] = useState(true);
	const [isDeviceOnline, setIsDeviceOnline] = useState(null); // null = loading

	const mediaFiles = useMediaStore((state) => state.mediaFiles);

	useEffect(() => {
		const checkOnlineStatus = async () => {
			const result = await checkDeviceOnline();
			setIsDeviceOnline(result);
		};

		checkOnlineStatus();

		const interval = setInterval(checkOnlineStatus, 1000); // every 1 sec
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (mediaFiles.length > 0) {
			downloadMediaFilesOnce(mediaFiles);
		}
	}, [mediaFiles]);

	return (
		<>
			<RemoteControlHandler />
			<Router>
				<AndroidIDFetcher />
				{isDeviceOnline === null ? (
					<p style={{ color: 'white', background: 'black', padding: 20 }}>Checking device status...</p>
				) : !isDeviceOnline ? (
					<div style={{ color: 'white', background: 'black', padding: 20 }}>
						<h1>Device is offline</h1>
					</div>
				) : showSplash ? (
					<SplashScreen onComplete={() => setShowSplash(false)} />
				) : (
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/register" element={<RegistrationPage />} />
						<Route path="/streaming" element={<SplashScreen />} />
					</Routes>
				)}
			</Router>
		</>
	);
};

export default App;
