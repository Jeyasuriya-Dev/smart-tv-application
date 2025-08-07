import useMediaStore from '../store/useMediaStore';
import axios from 'axios';
import { downloadFile } from '../utils/fileDownloader';



const downloadMediaFromPlaylist = async (playlist) => {
	if (!playlist?.layout_list) return;

	for (const layout of playlist.layout_list) {
		for (const zone of layout.zonelist || []) {
			for (const media of zone.media_list || []) {
				const url = media.Url || media.url;
				const fileName = url?.split('/').pop();
				if (url && fileName) {
					await downloadFile(url, fileName);
				}
			}
		}
	}
};



const fetchAndDownloadMedia = async () => {
	const {
		setMediaFiles,
		setUpdatedTime,
		updatedTime
	} = useMediaStore.getState();

	try {
		const response = await axios.get('https://ds.iqtv.in:8080/iqworld/api/v1/playlist/mediafilebyclientforsplit', {
			params: {
				clientname: 'ridsysc', //  ARIHANTDUGGAD
				state_id: 2, // 7
				city_id: 65,  // 2482
				androidid: '0461dbdd0ce43fd2', // a7b235567dbd7528
				deviceid: 'IQW0000014', // IQW0004251
				vertical: true  // false
			}
		});

		const playlist = response.data;
		const currentUpdatedTime = playlist.updated_time;
		const mediaType = playlist.media_type;

		console.log('=== Media Content API Response ===');
		console.log(JSON.stringify(playlist, null, 2));

		if (updatedTime && updatedTime === currentUpdatedTime) {
			console.log('🔄 No update detected. Skipping download.');
			console.log(`Media Type : ${mediaType}`);
			setMediaFiles(playlist);
			return false;
		}
		else {
			console.log('✅ Update detected. Downloading new media.');
			setUpdatedTime(currentUpdatedTime);
			setMediaFiles(playlist);

			console.log(`Media Type : ${mediaType}`);
			if(mediaType === 'both'){
				console.log('From playlist');
				await downloadMediaFromPlaylist(playlist);
				
			}
			else if(mediaType === 'defaultMedia') {
				console.log('From Default Content!');
				await downloadMediaFromPlaylist(playlist);
				
			}
			else{
				console.log("From Server Content!");
				await downloadMediaFromPlaylist(playlist);
			}

		}

		//Download Media components or function Call
		// for (const layout of playlist.layout_list) {
		// 	for (const zone of layout.zonelist) {
		// 		for (const media of zone.media_list) {
		// 			const url = media.Url || media.url;
		// 			const fileName = url?.split('/').pop();
		// 			if (url && fileName) {
		// 				await downloadFile(url, fileName); //Download Function or Component 
		// 			}
		// 		}
		// 	}
		// }



		return true;
	} catch (err) {
		console.error('❌ Error fetching media:', err);
		return false;
	}


};

export default fetchAndDownloadMedia;
