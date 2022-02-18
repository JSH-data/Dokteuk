import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const MY_OCR_API_URL = process.env.NEXT_PUBLIC_MY_OCR_API_URL;
  const MY_OCR_SECRET_KEY = process.env.NEXT_PUBLIC_MY_OCR_SECRET_KEY;

  const headers = {
    headers: {
      'Content-Type': 'application/json',
      'X-OCR-SECRET': MY_OCR_SECRET_KEY as string,
    },
  };
  try {
    const data = await axios.post(MY_OCR_API_URL as string, req.body, headers);

    return res.status(200).json({ message: data.data.images[0].fields });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e });
  }
}
