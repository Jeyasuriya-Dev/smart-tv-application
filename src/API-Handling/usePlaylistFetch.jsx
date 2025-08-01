import useMediaStore from '../store/useMediaStore';
import axios from 'axios';
import { downloadFile } from '../utils/fileDownloader';

const fetchAndDownloadMedia = async () => {
	const {
		setMediaFiles,
		setUpdatedTime,
		updatedTime
	} = useMediaStore.getState();

	try {
		const response = await axios.get('https://ds.iqtv.in:8080/iqworld/api/v1/playlist/mediafilebyclientforsplit', {
			params: {
				clientname: 'ARIHANTDUGGAD', //  ARIHANTDUGGAD
				state_id: 7, // 7
				city_id: 2482,  // 2482
				androidid: 'a7b235567dbd7528', // a7b235567dbd7528
				deviceid: 'IQW0004251', // IQW0004251
				vertical: false  // false
			}
		});

		const playlist = response.data;
		const currentUpdatedTime = playlist.updated_time;

		console.log('=== Media API Response ===');
		console.log(JSON.stringify(playlist, null, 2));

		if (updatedTime && updatedTime === currentUpdatedTime) {
			console.log('🔄 No update detected. Skipping download.');
			return false;
		}

		console.log('✅ Update detected. Downloading new media.');
		setUpdatedTime(currentUpdatedTime);
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

		return true;
	} catch (err) {
		console.error('❌ Error fetching media:', err);
		return false;
	}
};

export default fetchAndDownloadMedia;
