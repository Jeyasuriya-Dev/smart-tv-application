// src/components/DownloadProgressBar.jsx
import React from 'react';
import useMediaStore from '../store/useMediaStore';

const DownloadProgressBar = () => {
  const downloadProgress = useMediaStore((state) => state.downloadProgress);

  return (
    <div style={{ padding: 10 }}>
      {Object.entries(downloadProgress).map(([file, percent]) => (
        <div key={file} style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 14 }}>{file} - {percent}%</div>
          <div style={{ background: '#ccc', width: '100%', height: 6, borderRadius: 3 }}>
            <div style={{
              width: `${percent}%`,
              height: '100%',
              background: percent === 100 ? 'green' : 'blue',
              transition: 'width 0.2s ease'
            }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DownloadProgressBar;
