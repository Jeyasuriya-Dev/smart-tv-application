// src/utils/fetchAndDownloadMedia.js
import useMediaStore from '../store/useMediaStore';
import axios from 'axios';
import { downloadFile } from '../utils/fileDownloader';

let hasFetchedMedia = false;

const fetchAndDownloadMedia = async () => {
	if (hasFetchedMedia) return;
	hasFetchedMedia = true;

	const setMediaFiles = useMediaStore.getState().setMediaFiles;

	try {
		const response = await axios.get('https://ds.iqtv.in:8080/iqworld/api/v1/playlist/mediafilebyclientforsplit', {
			params: {
				clientname: 'ridsysc', //ARIHANTDUGGAD ridsysc
				state_id: 2, // 7 2
				city_id: 65, // 2482 65
				androidid: '0461dbdd0ce43fd2', // a7b235567dbd7528 0461dbdd0ce43fd2
				deviceid: 'IQW0000014', // IQW0004251  IQW0000014
				vertical: true //false true
			}
		});

		const playlist = response.data;
		setMediaFiles(playlist);
		console.log('=== Media API Response ===');
				console.log(JSON.stringify(playlist, null, 2));

		//  Loop media and download only once
		for (const layout of playlist.layout_list) {
			for (const zone of layout.zonelist) {
				for (const media of zone.media_list) {
					const url = media.Url || media.url;
					const fileName = url?.split('/').pop();
					if (url && fileName) {
						await downloadFile(url, fileName); // Now avoids duplicate
					}
				}
			}
		}

		return true;
	} catch (err) {
		console.error(' Error fetching media:', err);
		return false;
	}
};

export default fetchAndDownloadMedia;
