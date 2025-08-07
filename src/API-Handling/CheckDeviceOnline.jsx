import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DeviceStatusPoller = () => {
	const [isOnline, setIsOnline] = useState(true);
	const [imagesrc, setImagesrc] = useState('');
	const isOnlineURL = import.meta.env.VITE_DEVICEONLINE_CHECK_URL;

	const checkAPI = async () => {
		try {
			const response = await axios.get(isOnlineURL, {
				params: {
					adrid: 'a7b235567dbd7528',
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
		const interval = setInterval(checkAPI, 1000); // Check every second
		return () => clearInterval(interval);
	}, [isOnlineURL]);

	//No Internet image Load Located for the Device Orientation and image shows even if the user rotates the device later.
	useEffect(() => {
		const updateImageBasedOnOrientation = () => {
			const { innerWidth, innerHeight } = window;
			if (innerWidth > innerHeight) {
				setImagesrc('assets/nointernet-landscape.jpeg');
			} else {
				setImagesrc('assets/noInternet-portrait.jpeg');
			}
		};

		updateImageBasedOnOrientation();

		window.addEventListener('resize', updateImageBasedOnOrientation);
		window.addEventListener('orientationchange', updateImageBasedOnOrientation);

		return () => {
			window.removeEventListener('resize', updateImageBasedOnOrientation);
			window.removeEventListener('orientationchange', updateImageBasedOnOrientation);
		};
	}, []);


	return (
		<>
			{/* icon in bottom-right with green or red color */}
			<div
				style={{
					position: 'fixed',
					bottom: 5,
					right: 5,
					// background: isOnline ? '#000FF00' : '#FF0000', // Green if online, Red if offline
					fontSize: '30px',
					zIndex: 9999,
					width: '30px',
					height: '30px',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',


				}}
			>
				{
					isOnline ?
						<img src="/Tower/sucTower-removebg-preview.png" alt="tower.."
							style={{
								width: '30px',
								height: '30px',
								borderRadius: '5px'
							}} />
						:
						<img src="/Tower/failTower-removebg-preview.png" alt="tower.."
							style={{
								width: '30px',
								height: '30px',
								borderRadius: '5px'
							}} />
				}
			</div>

			{/* Optional full-screen offline UI */}
			{!isOnline && (
				<div
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						width: '100vw',
						height: '100vh',
						alignItems: 'center',
						justifyContent: 'center',
						zIndex: 9998,
					}}
				>

					{/* Here Load The No internet Image Based On Orientation */}
					<img
						src={imagesrc}
						alt="No Internet..."
						style={{
							width: '100%',
							height: '100%',
						}}
					/>
				</div>
			)}
		</>
	);
};

export default DeviceStatusPoller;
