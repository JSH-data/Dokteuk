import { firebaseAdmin } from '@firebase/firebaseAdmin';
import type { NextApiRequest, NextApiResponse } from 'next';

const validate = async (token: string) => {
  const decodedToken = await firebaseAdmin.auth().verifyIdToken(token, true);

  let userData;

  const user = await firebaseAdmin.auth().getUser(decodedToken.uid);

  const [UserInfo] = user.providerData;
  await firebaseAdmin
    .firestore()
    .collection('user')
    .doc(decodedToken.uid)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData = { ...doc.data() };
      }
    })
    .catch((error) => {
      console.log('Error getting document:', error);
    });

  const result = {
    user: {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      userData: userData,
      providerId: UserInfo.providerId,
    },
  };
  return result;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { token } = JSON.parse(req.headers.authorization || '{}');
    if (!token) {
      return res.status(403).send({
        errorCode: 403,
        message: 'Auth token missing.',
      });
    }

    const result = await validate(token);
    return res.status(200).json({
      data: result.user,
    });
  } catch (err) {
    const result = undefined;
    return res.status(200).send(result);
  }
}
