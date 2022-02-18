import axios from 'axios';

type OcrData = {
  b_no: string;
  start_dt: string;
  p_nm: string;
};
export const getOcrData = async (imageUrl: string, imageExt: string) => {
  const timestamp = new Date().getTime();
  let getOcrResult;
  try {
    const data = {
      images: [
        {
          format: imageExt,
          name: 'medium',
          data: imageUrl.split(',')[1],
          url: null,
        },
      ],
      lang: 'ko',
      requestId: 'string',
      resultType: 'string',
      timestamp: timestamp,
      version: 'V1',
    };
    const response = await axios.post('/api/ocr', data);
    getOcrResult = resultTxt(response.data.message);
  } catch (e) {
    console.error(e);
  }

  return getOcrResult;
};

const resultTxt = (data: any) => {
  const regNum = /([0-9]{3})-([0-9]{2})-([0-9]{5})/;
  const regex = /[^0-9]/g;
  const regDate = /([0-9]{4})년([0-1][0-9])월([0-3][0-9])일/;
  let startDTFilter;
  let nameFilterIdx;
  let p_nm: string;

  const filteredText: any = [];
  data.forEach((el: any, idx: number) => {
    filteredText.push(el.inferText);
  });
  const res = filteredText.join().replaceAll(',', '').replaceAll(' ', '');

  if (!res.match(regNum)) {
    return false;
  }
  const b_no: string = res.match(regNum)[0].replaceAll('-', '');

  if (res.indexOf('개업연월일:') > 0) {
    startDTFilter = res.substr(res.indexOf('개업연월일:'));
  } else if (res.indexOf('개업년월일:') > 0) {
    startDTFilter = res.substr(res.indexOf('개업년월일:'));
  } else {
    return false;
  }
  if (!startDTFilter.match(regDate)) {
    return false;
  }
  const start_dt: string = startDTFilter.match(regDate)[0].replace(regex, '');

  if (res.indexOf('성명:') > 0) {
    nameFilterIdx = res.indexOf('성명:');
    p_nm = res.substr(nameFilterIdx + 3, 3);
  } else if (res.indexOf('대표자:') > 0) {
    nameFilterIdx = res.indexOf('대표자:');
    p_nm = res.substr(nameFilterIdx + 4, 3);
  } else {
    return false;
  }

  return { b_no, start_dt, p_nm } as OcrData;
};

export const validateData = async (ocrData: OcrData) => {
  const validateData = {
    businesses: [ocrData],
  };

  try {
    const data = await axios.post('/api/validateOcrData', validateData);
    if (data.data.message) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.error(e);
  }
};
