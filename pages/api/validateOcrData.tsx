import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const MY_VALIDATE_API_URL = process.env.NEXT_PUBLIC_MY_VALIDATE_API_URL;

  const headers = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const data = await axios.post(
      MY_VALIDATE_API_URL as string,
      req.body,
      headers,
    );

    return res.status(200).json({ message: data.data.data[0].status });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e });
  }
}
