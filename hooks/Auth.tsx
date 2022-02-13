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
        setCurrentUser(null);

        nookies.set(undefined, 'token', '', {});
        return;
      }
      const token = await user.getIdToken();

      setCurrentUser(user);

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
