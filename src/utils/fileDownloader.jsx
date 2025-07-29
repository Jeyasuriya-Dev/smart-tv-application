
// src/utils/fileDownloader.jsx

export const downloadFile = async (url, fileName, onSuccess = () => {}) => {
  // Read already downloaded file names from localStorage
  const downloaded = JSON.parse(localStorage.getItem('downloadedMediaFiles') || '[]');

  // Add file to localStorage cache
  const saveToCache = () => {
    if (!downloaded.includes(fileName)) {
      downloaded.push(fileName);
      localStorage.setItem('downloadedMediaFiles', JSON.stringify(downloaded));
    }
  };

  // Remove file from cache (in case it was deleted manually)
  const removeFromCache = () => {
    const index = downloaded.indexOf(fileName);
    if (index !== -1) {
      downloaded.splice(index, 1);
      localStorage.setItem('downloadedMediaFiles', JSON.stringify(downloaded));
    }
  };

  try {
    // Fetch the file from the provided URL
    const response = await fetch(url);
    const blob = await response.blob();

    // ==== For webOS Platform ====
    if (window.webOS && window.webOS.filesystem) {
      window.webOS.filesystem.resolve(
        'downloads', // Folder to save in
        (dir) => {
          // Check if file already exists
          dir.resolve(fileName,
            (existingFile) => {
              console.log(`🟡 Already exists on webOS: ${fileName}`);
              // File exists → skip download
            },
            () => {
              // File does not exist → download it
              removeFromCache(); // Cleanup if wrongly marked
              dir.createFile(fileName, false, (fileEntry) => {
                fileEntry.createWriter((writer) => {
                  writer.write(blob); // Save file content
                  saveToCache(); // Save to localStorage
                  console.log(`✅ Downloaded to webOS: ${fileName}`);
                  onSuccess(fileEntry.fullPath);
                }, (err) => console.error('❌ Writer error (webOS)', err));
              }, (err) => console.error('❌ Create file error (webOS)', err));
            }
          );
        },
        (err) => console.error('❌ webOS directory error:', err)
      );

    // ==== For Tizen Platform ====
    } else if (window.tizen && window.tizen.filesystem) {
      tizen.filesystem.resolve('downloads', (dir) => {
        try {
          dir.resolve(fileName); // Throws if file doesn't exist
          console.log(`🟡 Already exists on Tizen: ${fileName}`);
          // File exists → skip download
        } catch (e) {
          // File does not exist → create and write
          removeFromCache(); // Cleanup if wrongly marked
          const file = dir.createFile(fileName);
          const stream = file.openStream('w'); // Open write stream
          stream.write(blob);
          stream.close();
          saveToCache(); // Mark as downloaded
          console.log(`✅ Downloaded to Tizen: ${fileName}`);
          onSuccess(file.fullPath);
        }
      }, (err) => console.error('❌ Tizen directory error:', err));

    // ==== For Web Browsers ====
    } else {
      // Optional: You can use File System Access API to verify file existence

      // Check if file was marked downloaded already
      if (downloaded.includes(fileName)) {
        console.log(`🟡 Already marked downloaded in browser: ${fileName}`);
        // You can choose to re-download if needed
        return;
      }

      // Create an anchor tag to trigger download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click(); // Simulate user click
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href); // Free memory

      saveToCache(); // Save to localStorage
      console.log(`✅ Downloaded to browser: ${fileName}`);
      onSuccess(fileName);
    }

  } catch (err) {
    // Handle network or writing errors
    console.error('⛔ Download error:', err);
    removeFromCache(); // Clean stale cache entry
  }
};
