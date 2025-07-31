// src/hooks/useDownloadOnce.js
import useMediaStore from '../store/useMediaStore';
import { downloadFile } from '../utils/fileDownloader';
import axios from 'axios';

const useDownloadOnce = () => {
	const setMediaFiles = useMediaStore((state) => state.setMediaFiles);
	const downloadedFlagKey = 'media_downloaded_once_v1';

	const downloadOnce = async () => {
		if (localStorage.getItem(downloadedFlagKey) === 'true') {
			console.log(' Media already downloaded.');
			return;
		}

		try {
			const response = await axios.get('https://ds.iqtv.in:8080/iqworld/api/v1/playlist/mediafilebyclientforsplit', {
				params: {
					clientname: 'ridsysc',
					state_id: 2,
					city_id: 65,
					androidid: '0461dbdd0ce43fd2',
					deviceid: 'IQW0000014',
					vertical: true,
				},
			});

			const playlist = response.data;
			setMediaFiles(playlist);

			for (const layout of playlist.layout_list) {
				for (const zone of layout.zonelist) {
					for (const media of zone.media_list) {
						const url = media.Url || media.url;
						const fileName = url?.split('/').pop();
						if (url && fileName) {
							await downloadFile(url, fileName);
						}
					}
				}
			}

			localStorage.setItem(downloadedFlagKey, 'true');
			console.log(' Media downloaded successfully.');
		} catch (err) {
			console.error(' Failed to download media:', err);
		}
	};

	return downloadOnce;
};

export default useDownloadOnce;
