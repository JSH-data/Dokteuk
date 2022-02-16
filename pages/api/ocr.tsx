import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const MY_OCR_API_URL =
    'https://bq2wquile8.apigw.ntruss.com/custom/v1/14231/6c9f7f0b6570661d9c230c35c51c19657e4b6bc82af76a6a2e4f77bdcc58e6cb/general';
  const MY_OCR_SECRET_KEY = 'VXRIRnhOYlJtd2dQck5TUkpodXNRTGdPUkFoeGpyTFI=';

  const headers = {
    headers: {
      'Content-Type': 'application/json',
      'X-OCR-SECRET': MY_OCR_SECRET_KEY,
    },
  };
  try {
    const data = await axios.post(MY_OCR_API_URL, req.body, headers);
    const txt = data.data.images;
    console.log('=================');
    console.log('=================');
    console.log('=================');
    console.log('=================');
    console.log('=================');
    console.log('=================');
    console.log(txt[0].fields);
    console.log('=================');
    console.log('=================');
    console.log('=================');
    console.log('=================');
    console.log('=================');
    return res.status(200).json({ message: data.data.images[0].fields });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e });
  }
}
