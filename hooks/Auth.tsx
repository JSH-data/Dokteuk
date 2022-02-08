import { createContext, useEffect, useContext, useState } from 'react';
import { getAuth, User } from 'firebase/auth';
import Loading from '@components/Loading';
import Login from '@components/Login';
import nookies from 'nookies';
const AuthContext = createContext({});

type Props = {
  children?: any;
};

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    return auth.onIdTokenChanged(async (user) => {
      if (!user) {
        console.log('no user');
        setCurrentUser(null);
        setLoading(false);
        nookies.set(undefined, 'token', '', {});
        return;
      }
      const token = await user.getIdToken();
      console.log('token', token);
      console.log('user', user);
      setCurrentUser(user);
      setLoading(false);
      nookies.set(undefined, 'token', token, {});
    });
  }, []);

  //   useEffect(() => {
  //     const handle = setInterval(async () => {
  //       const user = firebaseClient.auth().currentUser;
  //       if (user) await user.getIdToken(true);
  //     }, 10 * 60 * 1000);
  //     // clean up setInterval
  //     return () => clearInterval(handle);
  //   }, []);

  if (loading) {
    return <Loading type="spin" color="skyblue" />;
  }
  if (!currentUser) {
    return <Login />;
  } else {
    return (
      <AuthContext.Provider value={{ currentUser }}>
        {children}
      </AuthContext.Provider>
    );
  }
};
export const useAuth = () => useContext(AuthContext);
