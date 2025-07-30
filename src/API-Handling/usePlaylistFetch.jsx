// src/utils/fetchAndDownloadMedia.js
import useMediaStore from '../store/useMediaStore';
import axios from 'axios';
import { downloadFile } from '../utils/fileDownloader';

const fetchAndDownloadMedia = async () => {
  const setMediaFiles = useMediaStore.getState().setMediaFiles;

  try {

    // clientname=ARIHANTDUGGAD&state_id=7&city_id=2482&androidid=a7b235567dbd7528&deviceid=IQW0004251&vertical=false
    const response = await axios.get('https://ds.iqtv.in:8080/iqworld/api/v1/playlist/mediafilebyclientforsplit', {
      params: {
        clientname: 'ridsysc',
        state_id: 2,
        city_id: 65,
        androidid: '0461dbdd0ce43fd2',
        deviceid: 'IQW0000014',
        vertical: true
      }
    });

    const playlist = response.data;
    setMediaFiles(playlist);

    // ✅ Auto download each file
    for (const layout of playlist.layout_list) {
      for (const zone of layout.zonelist) {
        for (const media of zone.media_list) {
          const url = media.Url || media.url;
          const fileName = url?.split('/').pop();
          if (url && fileName) {
            await downloadFile(url, fileName); // Optional: await to ensure all files downloaded
          }
        }
      }
    }

    return true; // Success
  } catch (err) {
    console.error('❌ Error fetching media:', err);
    return false;
  }
};

export default fetchAndDownloadMedia;
