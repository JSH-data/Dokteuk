import imageCompression from 'browser-image-compression';
import { Dispatch, SetStateAction } from 'react';

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

interface A {
  dataUrl: string;
  filename: string;
  lastModified?: number;
}

export const encodeFile = async (
  file: File,
  setImgData: Dispatch<SetStateAction<FileType | null>>,
) => {
  const options = {
    maxSizeMB: 1,
  };

  try {
    if (isValidType(file.type)) {
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);

      reader.onload = () => {
        const { result } = reader;
        setImgData((current) => ({
          type: 'upload',
          file: [...current!.file, compressedFile],
          src: [...current!.src, result],
        }));
      };
    } else {
      alert('업로드는 이미지만 가능합니다.');
      setImgData(null);
    }
  } catch (error) {
    console.log(error);
  }
};
