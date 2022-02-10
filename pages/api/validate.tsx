import { firebaseAdmin } from '@firebase/firebaseAdmin';

const validate = async (token: string) => {
  // Check that the user has a valid token
  const decodedToken = await firebaseAdmin.auth().verifyIdToken(token, true);
  // console.log(decodedToken);
  let userData;
  //Get user Firebase data from token

  const user = await firebaseAdmin.auth().getUser(decodedToken.uid);
  // Get any additional user data from the Firebase DB
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
  // Assign the user result that will be passed to your _app.js file with populated data from the getUser and db functions
  const result = {
    user: {
      uid: user.uid,
      email: user.email,
      // username: userData.username,
      emailVerified: user.emailVerified,
      userData: userData,
    },
  };
  return result;
};

export default async (req: any, res: any) => {
  try {
    // Check if there is a token and if not return undefined.
    const { token } = JSON.parse(req.headers.authorization || '{}');
    if (!token) {
      return res.status(403).send({
        errorCode: 403,
        message: 'Auth token missing.',
      });
    }
    // Call the validate function above that gets the user data.
    const result = await validate(token);
    // console.log(result, 'zzzzzz'); // 요기!
    return res.status(200).json({
      data: result.user,
    });
  } catch (err) {
    // Return undefined if there is no user. You may also send a different status or handle the error in any way that you wish.
    console.log(err);
    const result = undefined;
    return res.status(200).send(result);
  }
};
