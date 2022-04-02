export type Crop = {
  x: number,
  y: number,
  width: number,
  height: number,
};

/**
 * @param {HTMLImageElement} image - Image File Object
 * @param {Object} crop - crop Object
 * @param {String} fileName - Name of the returned file in Promise
 */
export const getCroppedImg = (image: HTMLImageElement, crop: Crop, fileName): Promise<File> => {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height,
  );

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob: Blob) => {
        resolve(
          new File([blob], fileName, {
            type: 'image/jpeg',
          }),
        );
      },
      'image/jpeg',
      1,
    );
  });
};
