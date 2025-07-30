import React, { useEffect, useState } from 'react';
import useMediaStore from '../store/useMediaStore';

const isVideoFile = (filename) => {
  return /\.(mp4|webm|ogg)$/i.test(filename);
};

const isImageFile = (filename) => {
  return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(filename);
};

const StreamingPage = () => {
  const mediaFiles = useMediaStore((state) => state.mediaFiles);
  const [mediaList, setMediaList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!mediaFiles.layout_list) return;

    const list = [];

    mediaFiles.layout_list.forEach((layout) => {
      layout.zonelist.forEach((zone) => {
        zone.media_list.forEach((media) => {
          const url = media.Url || media.url;
          const fileName = url?.split('/').pop();
          if (fileName) {
            list.push({ url: `/downloads/${fileName}`, type: fileName }); // Use correct local path
          }
        });
      });
    });

    setMediaList(list);
  }, [mediaFiles]);

  useEffect(() => {
    if (mediaList.length === 0) return;

    let timer;

    const currentMedia = mediaList[currentIndex];
    if (currentMedia && isImageFile(currentMedia.type)) {
      // Set timer for image duration (e.g., 5 sec)
      timer = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % mediaList.length);
      }, 5000);
    }

    return () => clearTimeout(timer);
  }, [currentIndex, mediaList]);

  const handleVideoEnd = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaList.length);
  };

  const currentMedia = mediaList[currentIndex];

  if (!currentMedia) return <div>Loading media...</div>;

  return (
    <div className="streaming-container" style={{ textAlign: 'center', paddingTop: '2rem' }}>
      <h1 style={{ fontSize: '2rem' }}>📺 Streaming Page</h1>
      <div style={{ maxWidth: '90vw', maxHeight: '80vh', margin: 'auto' }}>
        {isVideoFile(currentMedia.type) ? (
          <video
            src={currentMedia.url}
            controls
            autoPlay
            onEnded={handleVideoEnd}
            style={{ maxWidth: '100%', maxHeight: '100%' }}
          />
        ) : (
          <img
            src={currentMedia.url}
            alt="Media"
            style={{ maxWidth: '100%', maxHeight: '100%' }}
          />
        )}
      </div>
    </div>
  );
};

export default StreamingPage;
