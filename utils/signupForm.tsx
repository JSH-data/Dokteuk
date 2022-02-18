import { getStorage, ref, uploadString } from 'firebase/storage';

export const uploadImg = async (
  uid: string,
  imageExt: string,
  imageUrl: string,
) => {
  const storage = getStorage();
  const imageName = `${uid}.${imageExt}`;
  const imgRef = ref(storage, 'users/' + imageName);
  try {
    await uploadString(imgRef, imageUrl, 'data_url');
  } catch (e: any) {
    console.error(e);
  }
};
