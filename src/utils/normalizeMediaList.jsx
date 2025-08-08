// utils/normalizeMediaList.js
export const normalizeMediaList = (mediaList) => {
  const result = [];
  let expectVideo = true;

  for (let i = 0; i < mediaList.length; i++) {
    const file = mediaList[i];
    const isVideo = /\.(mp4|webm|ogg)$/i.test(file.url);
    const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file.url);

    if (expectVideo && isVideo) {
      result.push(file);
      expectVideo = false;
    } else if (!expectVideo && isImage) {
      result.push(file);
      expectVideo = true;
    }
  }
  return result;
};
