import React, { useEffect, useState } from 'react';
import useMediaStore from '../store/useMediaStore';
import useDownloadOnce from '../hooks/useDownloadOnce';
import { useDeviceStatus } from '../context/DeviceStatusPollerContext';

const FOLDER_NAME = 'IQMediaFiles';

const isVideo = (f) => /\.(mp4|webm|ogg)$/i.test(f);
const isImage = (f) => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(f);

const getLocalPath = (filename) => {
	if (window.webOS) return `file:///media/developer/${FOLDER_NAME}/${filename}`;
	if (window.tizen) return `/opt/usr/home/owner/Downloads/${FOLDER_NAME}/${filename}`;
	return `/downloads/${FOLDER_NAME}/${filename}`; // fallback
};

const StreamingPage = () => {
	const isOnline = useDeviceStatus();
	const downloadOnce = useDownloadOnce();
	const mediaFiles = useMediaStore((state) => state.mediaFiles);

	const [mediaList, setMediaList] = useState([]);
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const loadMedia = async () => {
			if (isOnline) {
				await downloadOnce(); // one-time download
				const list = [];

				mediaFiles?.layout_list?.forEach((layout) => {
					layout.zonelist.forEach((zone) => {
						zone.media_list.forEach((media) => {
							const url = media.Url || media.url;
							const filename = url?.split('/').pop();
							const extension = filename?.split('.').pop().toLowerCase();
							const type = isVideo(extension) ? 'video' : 'image';
							list.push({ url, type });
						});
					});
				});

				setMediaList(list);
			} else {
				const cached = JSON.parse(localStorage.getItem('downloadedMediaFiles_IQMediaFiles') || '[]');
				const offlineList = cached.map((filename) => {
					const path = getLocalPath(filename);
					const extension = filename?.split('.').pop().toLowerCase();
					const type = isVideo(extension) ? 'video' : 'image';
					return { url: path, type };
				});
				setMediaList(offlineList);
			}
		};

		loadMedia();
	}, [isOnline]);

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
	if (!current) return <p>Loading media...</p>;

	return (
		<div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
			{current.type === 'video' ? (
				<video
					src={current.url}
					autoPlay
					controls={false}
					onEnded={onVideoEnd}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
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
	);
};

export default StreamingPage;
