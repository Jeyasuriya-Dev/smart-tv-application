import { useEffect } from 'react';
import useMediaStore from '../store/useMediaStore';
import axios from 'axios';
import { downloadFile } from '../utils/fileDownloader';

const MediaFetcher = () => {
  const setMediaFiles = useMediaStore((state) => state.setMediaFiles);
  const mediaFiles = useMediaStore((state) => state.mediaFiles);
  // const media = useMediaStore.getState().mediaFiles;




  useEffect(() => {
    if (mediaFiles.length === 0) return; // Prevent logging on empty

    const timeoutId = setTimeout(() => {
      console.log('=== Zustand Media Files (After 2 sec) ===');
      console.log(JSON.stringify(mediaFiles, null, 2));
    }, 2000); // ⏲ .5 seconds delay

    return () => clearTimeout(timeoutId); // Cleanup on unmount
  }, [mediaFiles]);

  useEffect(() => {
    const fetchData = async () => {
      try {

        // clientname=ridsysc&state_id=2&city_id=65&androidid=0461dbdd0ce43fd2&deviceid=IQW0000014&vertical=true
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
        setMediaFiles(playlist);  //Here Media files or details Store into Zustand Store using setMediaFiles()


        // console.log('✅ API Response:', response.data); //User Device Details log without JSON format
        
        // console.log('Media outside React:', media);


        // ✅ Trigger auto-download for each media file
        playlist.layout_list.forEach((layout) => {
          layout.zonelist.forEach((zone) => {
            zone.media_list.forEach((media) => {
              const url = media.Url || media.url;
              const fileName = url?.split('/').pop();
              if (url && fileName) {
                downloadFile(url, fileName);
              }
            });
          });
        });

      } catch (err) {
        console.error('❌ API Error:', err);
      }
    };

    fetchData();
  }, [setMediaFiles]);

  return null; // No UI needed
};

export default MediaFetcher;
