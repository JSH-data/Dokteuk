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

export const isValidSize = (fileSize: number): boolean => 1048487 > fileSize;

export const encodeFile = (
  file: Blob,
  setFileSrc: Dispatch<SetStateAction<FileType | null>>,
) => {
  if (isValidType(file.type) && isValidSize(file.size)) {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const { result } = reader;
      setFileSrc((current) => {
        return {
          type: 'upload',
          file: [...current!.file, file],
          src: [...current!.src, result],
        };
      });
    };
  } else if (isValidSize(file.size)) {
    alert('업로드는 이미지만 가능합니다.');
    setFileSrc(null);
  } else {
    alert('1Mb 이하로만 올릴 수 있습니다.');
    setFileSrc(null);
  }
};
