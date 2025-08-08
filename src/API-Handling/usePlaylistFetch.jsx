import useMediaStore from '../store/useMediaStore';
import axios from 'axios';
import { downloadFile } from '../utils/fileDownloader';

const extractMediaUrls = (playlist) => {
	const urls = [];
	playlist?.layout_list?.forEach((layout) => {
		layout.zonelist?.forEach((zone) => {
			zone.media_list?.forEach((media) => {
				const url = media.Url || media.url;
				if (url) urls.push(url);
			});
		});
	});
	return urls;
};

const fetchAndDownloadMedia = async () => {
	const { setMediaFiles, setUpdatedTime, updatedTime, setMediaUrls } = useMediaStore.getState();

	try {
		const response = await axios.get('http://192.168.70.100:8585/iqworld/api/v1/playlist/mediafilebyclientforsplit', {
			params: {
				clientname: 'dfgdf',
				state_id: 2,
				city_id: 300,
				androidid: 'ABCDEFGHIJ',
				deviceid: 'IQW0000061',
				vertical: true
			}
		});

		const playlist = response.data;
		const currentUpdatedTime = playlist.updated_time;

		console.log('=== Media API Response ===');
		console.log(JSON.stringify(playlist, null, 2));

		if (updatedTime && updatedTime === currentUpdatedTime) {
			setMediaFiles(playlist);
			setMediaUrls(extractMediaUrls(playlist)); // ✅ Store URLs in Zustand
			return false;
		} else {
			setUpdatedTime(currentUpdatedTime);
			setMediaFiles(playlist);
			setMediaUrls(extractMediaUrls(playlist)); // ✅ Store URLs
		}

		return true;
	} catch (err) {
		console.error('❌ Error fetching media:', err);
		return false;
	}
};

export default fetchAndDownloadMedia;
