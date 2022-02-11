export const ImgTypes = [
  'image/apng',
  'image/bmp',
  'image/jpeg',
  'image/pjpeg',
  'image/png',
  'image/tiff',
  'image/webp',
];

export const isValidType = (imgType: string): boolean =>
  ImgTypes.includes(imgType);

export const isValidSize = (fileSize: number): boolean => 1048487 > fileSize;
