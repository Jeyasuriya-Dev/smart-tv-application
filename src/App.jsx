// src/App.jsx

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import SplashScreen from './components/VideoLoader';
import RegistrationPage from './components/RegistrationPage'; //  Your existing component
import useDeviceDetails from './API-Handling/userDeviceDetails';
import AndroidIDFetcher from './components/AndroidIDFetcher';
import RemoteControlHandler from './components/RemoteControlHandler';
import DeviceStatusPoller from './API-Handling/CheckDeviceOnline';
import StreamingPage from './components/StreamingPage';

export const Home = () => {
	useDeviceDetails(); // Call polling here

	return (
		<>
			<DeviceStatusPoller />
			{/* <div style={{ color: 'white', background: 'black', width: '100hw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
				<h1>🏠 Home - Streaming Mode</h1>
			</div> */}
			<StreamingPage/>
		</>
	);
};

const App = () => {
	const [showSplash, setShowSplash] = useState(true);

	return (
		<>
			<RemoteControlHandler />
			<Router>
				<AndroidIDFetcher />

				{showSplash ? (
					<SplashScreen onComplete={() => setShowSplash(false)} />
				) : (
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/register" element={<RegistrationPage />} />
						<Route path='/streaming' element={<SplashScreen />} />
					</Routes>
				)}
			</Router>
		</>
	);
};

export default App;
