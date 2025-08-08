import React, { useEffect, useState } from 'react';
import useMediaStore from '../store/useMediaStore';
import useDownloadOnce from '../hooks/useDownloadOnce';
import { useDeviceStatus } from '../context/DeviceStatusPollerContext';
import fetchAndDownloadMedia from '../API-Handling/usePlaylistFetch';
import ReactPlayer from 'react-player';
import Spinner from 'react-bootstrap/Spinner';

const FOLDER_NAME = 'IQMediaFiles';

const isVideo = (f) => /\.(mp4|webm|ogg)$/i.test(f) || /^(mp4|webm|ogg)$/i.test(f);
const isImage = (f) => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(f) || /^(jpg|jpeg|png|gif|bmp|webp)$/i.test(f);



//when the user Offline Get the Local URl
const getLocalPath = (filename) => {
	if (window.webOS) return `file:///media/developer/${FOLDER_NAME}/${filename}`;
	if (window.tizen) return `/opt/usr/home/owner/Downloads/${FOLDER_NAME}/${filename}`;
	return `/downloads/${FOLDER_NAME}/${filename}`; // fallback
};

const StreamingPage = () => {
	const isOnline = useDeviceStatus();
	const downloadOnce = useDownloadOnce();
	const [index, setIndex] = useState(0);
	const mediaUrls = useMediaStore((state) => state.mediaUrls);

	useEffect(() => {
		const fetchAndUpdateMedia = async () => {
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
		const interval = setInterval(fetchAndUpdateMedia, 3000); // fetch every sec
		return () => clearInterval(interval);
	}, [isOnline]);

	useEffect(() => {
	if (!mediaUrls.length) return;

	const currentUrl = mediaUrls[index];

	// Only run timer for images
	if (!isVideo(currentUrl)) {
		const timer = setTimeout(() => {
			setIndex((i) => (i + 1) % mediaUrls.length);
		}, 5000);

		return () => clearTimeout(timer);
	}

	// For videos, do nothing here — rely entirely on onEnded
}, [index, mediaUrls]);

const handleVideoEnd = () => {
	setIndex((i) => (i + 1) % mediaUrls.length);
};
	

	const currentUrl = mediaUrls[index];
	// const handleVideoEnd = () => setIndex((i) => (i + 1) % mediaUrls.length);

	return (
		<div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#000' }}>
			{isVideo(currentUrl) ? (
				<video
					src={currentUrl}
					autoPlay
					//   loop
					controls={false}
					muted
					onEnded={handleVideoEnd}
					style={{ width: '100%', height: '100%', objectFit: 'cover' }}
				/>
			) : (
				<img
					src={currentUrl}
					alt="media"
					style={{ width: '100%', height: '100%', objectFit: 'cover' }}
				/>
			)}
		</div>
	);
};


export default StreamingPage;
