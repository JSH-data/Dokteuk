import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  //api.odcloud.kr/api/nts-businessman/v1/validate?serviceKey=[서비스키]&returnType=XML

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

// req data format
// {
//     "businesses": [
//         {
//      "b_no": "8290700318",
//      "start_dt": "20160401",
//      "p_nm": "백봉"
//         }
//     ]
// }

// 인증 실패 response
// {
//     "request_cnt": 1,
//     "status_code": "OK",
//     "data": [
//         {
//             "b_no": "8290700318",
//             "valid": "02",
//             "valid_msg": "확인할 수 없습니다.",
//             "request_param": {
//                 "b_no": "8290700318",
//                 "start_dt": "20160401",
//                 "p_nm": "백봉"
//             }
//         }
//     ]
// }
