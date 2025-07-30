import React from 'react';
import './DownloadProgressBar.css';

const DownloadProgressBar = ({ filename, progress }) => {
  return (
    <div className="download-bar">
      <span>{filename}</span>
      <div className="bar">
        <div className="fill" style={{ width: `${progress}%` }}></div>
      </div>
      <span>{progress}%</span>
    </div>
  );
};

export default DownloadProgressBar;
