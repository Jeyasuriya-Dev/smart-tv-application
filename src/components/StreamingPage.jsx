// import React, { useEffect, useState } from 'react';
// import useMediaStore from '../store/useMediaStore';
// import useDownloadOnce from '../hooks/useDownloadOnce';
// import { useDeviceStatus } from '../context/DeviceStatusPollerContext';
// import fetchAndDownloadMedia from '../API-Handling/usePlaylistFetch';
// import ReactPlayer from 'react-player';
// import Spinner from 'react-bootstrap/Spinner';

// const FOLDER_NAME = 'IQMediaFiles';

// const isVideo = (f) => /\.(mp4|webm|ogg)$/i.test(f) || /^(mp4|webm|ogg)$/i.test(f);
// const isImage = (f) => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(f) || /^(jpg|jpeg|png|gif|bmp|webp)$/i.test(f);



// //when the user Offline Get the Local URl
// const getLocalPath = (filename) => {
// 	if (window.webOS) return `file:///media/developer/${FOLDER_NAME}/${filename}`;
// 	if (window.tizen) return `/opt/usr/home/owner/Downloads/${FOLDER_NAME}/${filename}`;
// 	return `/downloads/${FOLDER_NAME}/${filename}`; // fallback
// };

// const StreamingPage = () => {
// 	const isOnline = useDeviceStatus();
// 	const downloadOnce = useDownloadOnce();
// 	const [index, setIndex] = useState(0);
// 	const mediaUrls = useMediaStore((state) => state.mediaUrls);

// 	useEffect(() => {
// 		const fetchAndUpdateMedia = async () => {
// 			if (isOnline) {
// 				await fetchAndDownloadMedia();
// 				await downloadOnce();
// 			} else {
// 				const cached = JSON.parse(localStorage.getItem('downloadedMediaFiles_IQMediaFiles') || '[]');
// 				const offlineList = cached.map((filename) => getLocalPath(filename));
// 				useMediaStore.getState().setMediaUrls(offlineList);
// 			}
// 		};

// 		fetchAndUpdateMedia();
// 		const interval = setInterval(fetchAndUpdateMedia, 3000); // fetch every sec
// 		return () => clearInterval(interval);
// 	}, [isOnline]);

// 	useEffect(() => {
// 		if (!mediaUrls.length) return;

// 		const currentUrl = mediaUrls[index];

// 		// Only run timer for images
// 		if (!isVideo(currentUrl)) {
// 			const timer = setTimeout(() => {
// 				setIndex((i) => (i + 1) % mediaUrls.length);
// 			}, 5000);

// 			return () => clearTimeout(timer);
// 		}

// 		// For videos, do nothing here — rely entirely on onEnded
// 	}, [index, mediaUrls]);

// 	const handleVideoEnd = () => {
// 		setIndex((i) => (i + 1) % mediaUrls.length);
// 	};


// 	const currentUrl = mediaUrls[index];
// 	// const handleVideoEnd = () => setIndex((i) => (i + 1) % mediaUrls.length);

// 	return (
// 		<div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#000' }}>
// 			{isVideo(currentUrl) ? (
// 				<video
// 					src={currentUrl}
// 					autoPlay
// 					//   loop
// 					controls={false}
// 					muted
// 					onEnded={handleVideoEnd}
// 					style={{ width: '100%', height: '100%', objectFit: 'cover' }}
// 				/>
// 			) : (
// 				<img
// 					src={currentUrl}
// 					alt="media"
// 					style={{ width: '100%', height: '100%', objectFit: 'cover' }}
// 				/>
// 			)}
// 		</div>
// 	);
// };


// export default StreamingPage;

// ///yufgvbeoiauuuuuuufgbvhn




// import React, { useEffect, useState } from 'react';
// import useMediaStore from '../store/useMediaStore';
// import useDownloadOnce from '../hooks/useDownloadOnce';
// import { useDeviceStatus } from '../context/DeviceStatusPollerContext';
// import fetchAndDownloadMedia from '../API-Handling/usePlaylistFetch';
// import Spinner from 'react-bootstrap/Spinner';

// const FOLDER_NAME = 'IQMediaFiles';

// const isVideo = (f) => /\.(mp4|webm|ogg)$/i.test(f);
// const isImage = (f) => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(f);

// const getLocalPath = (filename) => {
// 	if (window.webOS) return `file:///media/developer/${FOLDER_NAME}/${filename}`;
// 	if (window.tizen) return `/opt/usr/home/owner/Downloads/${FOLDER_NAME}/${filename}`;
// 	return `/downloads/${FOLDER_NAME}/${filename}`;
// };

// const StreamingPage = () => {
// 	const isOnline = useDeviceStatus();
// 	const downloadOnce = useDownloadOnce();

// 	const [index, setIndex] = useState(0);
// 	const [loading, setLoading] = useState(true);
// 	const [hasLoadedOnce, setHasLoadedOnce] = useState(false); // track first load
// 	const mediaUrls = useMediaStore((state) => state.mediaUrls);

// 	// Fetch media list
// 	useEffect(() => {
// 		const fetchAndUpdateMedia = async () => {
// 			if (!hasLoadedOnce) setLoading(true);

// 			if (isOnline) {
// 				await fetchAndDownloadMedia();
// 				await downloadOnce();
// 			} else {
// 				const cached = JSON.parse(localStorage.getItem('downloadedMediaFiles_IQMediaFiles') || '[]');
// 				const offlineList = cached.map((filename) => getLocalPath(filename));
// 				useMediaStore.getState().setMediaUrls(offlineList);
// 			}
// 		};

// 		fetchAndUpdateMedia();
// 		const interval = setInterval(fetchAndUpdateMedia, 3000);
// 		return () => clearInterval(interval);
// 	}, [isOnline, hasLoadedOnce]);

// 	// Image timer
// 	useEffect(() => {
// 		if (!mediaUrls.length) return;

// 		const currentUrl = mediaUrls[index];
// 		if (!isVideo(currentUrl)) {
// 			const timer = setTimeout(() => {
// 				setIndex((i) => (i + 1) % mediaUrls.length);
// 			}, 5000);
// 			return () => clearTimeout(timer);
// 		}
// 	}, [index, mediaUrls]);

// 	const handleVideoEnd = () => setIndex((i) => (i + 1) % mediaUrls.length);

// 	// Once first media is ready
// 	const handleFirstMediaReady = () => {
// 		if (!hasLoadedOnce) {
// 			setLoading(false);
// 			setHasLoadedOnce(true);
// 		}
// 	};

// 	const currentUrl = mediaUrls[index];

// 	return (
// 		<div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#000', position: 'relative' }}>
// 			{/* Spinner only before first media */}
// 			{loading && !hasLoadedOnce && (
// 				<div
// 					style={{
// 						position: 'absolute',
// 						top: 0,
// 						left: 0,
// 						width: '100%',
// 						height: '100%',
// 						background: 'rgba(0,0,0,0.6)',
// 						display: 'flex',
// 						alignItems: 'center',
// 						justifyContent: 'center',
// 						zIndex: 99999,
// 					}}
// 				>
// 					<h1 style={{ color: 'white', position: 'absolute', zIndex: 99999 }}>LOADING...</h1>
// 					<Spinner animation="border" variant="danger" />
// 				</div>
// 			)}

// 			{/* Media */}
// 			{isVideo(currentUrl) ? (
// 				<video
// 					key={currentUrl}
// 					src={currentUrl}
// 					autoPlay
// 					muted
// 					controls={false}
// 					onCanPlay={handleFirstMediaReady}
// 					onEnded={handleVideoEnd}
// 					style={{ width: '100%', height: '100%', objectFit: 'cover' }}
// 				/>
// 			) : (
// 				<img
// 					key={currentUrl}
// 					src={currentUrl}
// 					alt="media"
// 					onLoad={handleFirstMediaReady}
// 					style={{ width: '100%', height: '100%', objectFit: 'cover' }}
// 				/>
// 			)}
// 		</div>
// 	);
// };

// export default StreamingPage;


import React, { useEffect, useState } from 'react';
import useMediaStore from '../store/useMediaStore';
import useDownloadOnce from '../hooks/useDownloadOnce';
import { useDeviceStatus } from '../context/DeviceStatusPollerContext';
import fetchAndDownloadMedia from '../API-Handling/usePlaylistFetch';
import Spinner from 'react-bootstrap/Spinner';
import OfflineScreen from './OfflineScreen'; //  separate import

const FOLDER_NAME = 'IQMediaFiles';

const isVideo = (f) => /\.(mp4|webm|ogg)$/i.test(f);
const isImage = (f) => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(f);

const getLocalPath = (filename) => {
	if (window.webOS) return `file:///media/developer/${FOLDER_NAME}/${filename}`;
	if (window.tizen) return `/opt/usr/home/owner/Downloads/${FOLDER_NAME}/${filename}`;
	return `/downloads/${FOLDER_NAME}/${filename}`;
};

const StreamingPage = () => {
	const isOnline = useDeviceStatus();
	const downloadOnce = useDownloadOnce();

	const [index, setIndex] = useState(0);
	const [loading, setLoading] = useState(true);
	const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
	const mediaUrls = useMediaStore((state) => state.mediaUrls);

	useEffect(() => {
		const fetchAndUpdateMedia = async () => {
			if (!hasLoadedOnce) setLoading(true);

			if (isOnline) {
				await fetchAndDownloadMedia();
				await downloadOnce();
			} else {
				const cached = JSON.parse(localStorage.getItem('downloadedMediaFiles_IQMediaFiles') || '[]');
				const offlineList = cached.map((filename) => getLocalPath(filename));
				useMediaStore.getState().setMediaUrls(offlineList);
			}
		};

		fetchAndUpdateMedia();
		const interval = setInterval(fetchAndUpdateMedia, 3000);
		return () => clearInterval(interval);
	}, [isOnline, hasLoadedOnce]);

	useEffect(() => {
		if (!mediaUrls.length) return;

		const currentUrl = mediaUrls[index];
		if (!isVideo(currentUrl)) {
			const timer = setTimeout(() => {
				setIndex((i) => (i + 1) % mediaUrls.length);
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [index, mediaUrls]);

	const handleVideoEnd = () => setIndex((i) => (i + 1) % mediaUrls.length);

	const handleFirstMediaReady = () => {
		if (!hasLoadedOnce) {
			setLoading(false);
			setHasLoadedOnce(true);
		}
	};

	const currentUrl = mediaUrls[index];

	// If offline, show OfflineScreen
	if (!isOnline) {
		return <OfflineScreen />;
	}

	return (
		<div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#000', position: 'relative' }}>
			{loading && !hasLoadedOnce && (
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						background: 'rgba(0,0,0,0.6)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						zIndex: 99999,
					}}
				>
					<h1 style={{ color: 'white', position: 'absolute', zIndex: 99999 }}>LOADING...</h1>
					<Spinner animation="border" variant="danger" />
				</div>
			)}

			{isVideo(currentUrl) ? (
				<video
					key={currentUrl}
					src={currentUrl}
					autoPlay
					// muted
					controls={false}
					onCanPlay={handleFirstMediaReady}
					onEnded={handleVideoEnd}
					style={{ width: '100%', height: '100%', objectFit: 'cover' }}
				/>
			) : (
				<img
					key={currentUrl}
					src={currentUrl}
					alt="media"
					onLoad={handleFirstMediaReady}
					style={{ width: '100%', height: '100%', objectFit: 'cover' }}
				/>
			)}
		</div>
	);
};

export default StreamingPage;
