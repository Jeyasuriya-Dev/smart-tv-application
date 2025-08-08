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
	const [mediaList, setMediaList] = useState([]);
	const [index, setIndex] = useState(0);
	const mediaFiles = useMediaStore((state) => state.mediaFiles);

	useEffect(() => {
		let intervalId; //  NEW: to store the interval ID for clearing later

		const fetchAndUpdateMedia = async () => {
			if (isOnline) {
				await fetchAndDownloadMedia(); // Triggers updated_time check + download
				await downloadOnce();          // Still needed to cache local paths

				const onlinelist = [];

				mediaFiles?.layout_list?.forEach((layout) => {
					layout.zonelist.forEach((zone) => {
						zone.media_list.forEach((media) => {
							const url = media.Url || media.url;
							const filename = url?.split('/').pop();
							const ext = filename?.split('.').pop().toLowerCase();
							const type = isVideo(ext) ? 'video' : 'image';
							onlinelist.push({ url, type });
						});
					});
				});
				console.log(onlinelist);

				setMediaList(onlinelist);
			} else {
				const cached = JSON.parse(localStorage.getItem('downloadedMediaFiles_IQMediaFiles') || '[]');
				const offlineList = cached.map((filename) => {
					const path = getLocalPath(filename);
					const ext = filename?.split('.').pop().toLowerCase();
					const type = isVideo(ext) ? 'video' : 'image';
					return { url: path, type };
				});
				setMediaList(offlineList);
			}
		};

		// Call immediately on entry
		fetchAndUpdateMedia(); //  NEW

		// Set interval every second
		intervalId = setInterval(fetchAndUpdateMedia, 1000); //  NEW: Call every 1s

		// Cleanup on unmount
		return () => clearInterval(intervalId); //  NEW
	}, [isOnline, mediaFiles]); //  NEW: mediaFiles dependency to re-check layout

	useEffect(() => {
		if (mediaList.length === 0) return;

		let timer;
		const current = mediaList[index];

		if (current.type === 'image') {
			timer = setTimeout(() => setIndex((i) => (i + 1) % mediaList.length), 5000);
		}

		return () => clearTimeout(timer);
	}, [index, mediaList]);

	const onVideoEnd = () => setIndex((i) => (i + 1) % mediaList.length);
	const current = mediaList[index];


	// Before Video Load Show Loading Spinner
	if (!current) {
		return (
			<div style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				width: '100vw',
				height: '100vh',
				backgroundColor: '#000',
				color: '#fff'
			}}>
				<Spinner animation="border" variant="success" />
			</div>
		);
	}


	return (
		<div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
			{current.type === 'video' ? (

				//using REACT PLAYER for load videos
				<ReactPlayer
					url={current.url}
					playing
					controls={false}
					loop = {false}
					onEnded={onVideoEnd}
					style={{
						objectFit: 'cover',
						width: "100%",
						height: "100%"
					}}
				/>


			) : (


				<img
					src={current.url}
					alt="media"
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
					}}
				/>
			)}
		</div>

		// Fun Loader
		// <ReactPlayer
		// 	src='videos/ilamai_thirumbuthe.mp4' // videos/ilamai_thirumbuthe.mp4
		// 	autoPlay
		// 	controls={false}
		// 	loop
		// 	muted
		// 	onEnded={onVideoEnd}
		// 	style={{
		// 		objectFit: 'cover',
		// 		width: "100vw",
		// 		height: "100vh"
		// 	}}
		// />




	);
};

export default StreamingPage;
