// src/utils/fileDownloader.jsx

const FOLDER_NAME = 'IQMediaFiles';
const CACHE_KEY = 'downloadedMediaFiles_IQMediaFiles';

export const downloadFile = async (url, fileName, onSuccess = () => {}) => {
  const downloaded = JSON.parse(localStorage.getItem(CACHE_KEY) || '[]');


  //  Skip download if already marked
  if (downloaded.includes(fileName)) {
    console.log(` Already downloaded: ${fileName}`);
    onSuccess(fileName); // Still call onSuccess
    return;
  }

  const saveToCache = () => {
    if (!downloaded.includes(fileName)) {
      downloaded.push(fileName);
      localStorage.setItem(CACHE_KEY, JSON.stringify(downloaded));
    }
  };

  const removeFromCache = () => {
    const index = downloaded.indexOf(fileName);
    if (index !== -1) {
      downloaded.splice(index, 1);
      localStorage.setItem(CACHE_KEY, JSON.stringify(downloaded));
    }
  };

  try {
    const response = await fetch(url);
    const blob = await response.blob();

    // ==== For webOS ====
    if (window.webOS && window.webOS.filesystem) {
      const saveToWebOS = (dir) => {
        dir.resolve(fileName,
          (existingFile) => {
            console.log(` Already exists on webOS: ${fileName}`);
            onSuccess(existingFile.fullPath);
          },
          () => {
            removeFromCache();
            dir.createFile(fileName, false, (fileEntry) => {
              fileEntry.createWriter((writer) => {
                writer.write(blob);
                saveToCache();
                console.log(` Downloaded to webOS: ${fileName}`);
                onSuccess(fileEntry.fullPath);
              }, (err) => console.error(' Writer error (webOS)', err));
            }, (err) => console.error(' Create file error (webOS)', err));
          }
        );
      };

      window.webOS.filesystem.resolve(
        FOLDER_NAME,
        saveToWebOS,
        () => {
          console.warn(' Folder not found on webOS, creating...');
          window.webOS.filesystem.resolve(
            'downloads',
            (root) => {
              root.createDirectory(FOLDER_NAME, (newDir) => {
                saveToWebOS(newDir);
              }, (err) => console.error(' Failed to create folder (webOS)', err));
            },
            (err) => console.error(' Root resolve error (webOS)', err)
          );
        }
      );

    // ==== For Tizen ====
    } else if (window.tizen && window.tizen.filesystem) {
      const saveToTizen = (dir) => {
        try {
          dir.resolve(fileName);
          console.log(` Already exists on Tizen: ${fileName}`);
          onSuccess(`${dir.toURI()}/${fileName}`);
        } catch (e) {
          removeFromCache();
          try {
            const file = dir.createFile(fileName);
            const stream = file.openStream('w');
            stream.write(blob);
            stream.close();
            saveToCache();
            console.log(` Downloaded to Tizen: ${fileName}`);
            onSuccess(file.toURI());
          } catch (err) {
            console.error('Stream/File error (Tizen):', err);
          }
        }
      };

      tizen.filesystem.resolve(
        `downloads/${FOLDER_NAME}`,
        saveToTizen,
        () => {
          console.warn(' Folder not found on Tizen, creating...');
          tizen.filesystem.resolve('downloads', (root) => {
            try {
              root.createDirectory(FOLDER_NAME);
              tizen.filesystem.resolve(`downloads/${FOLDER_NAME}`, saveToTizen);
            } catch (err) {
              console.error(' Failed to create folder (Tizen):', err);
            }
          }, (err) => console.error(' Root resolve error (Tizen):', err));
        },
        'rw'
      );

    // ==== For Browser ====
    } else {
      if (downloaded.includes(fileName)) {
        console.log(` Already marked downloaded in browser: ${fileName}`);
        return;
      }

      const browserFileName = `${FOLDER_NAME}_${fileName}`;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = browserFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      saveToCache();
      console.log(` Downloaded to browser: ${browserFileName}`);
      onSuccess(browserFileName);
    }

  } catch (err) {
    console.error(' Download error:', err);
    removeFromCache();
  }
};
