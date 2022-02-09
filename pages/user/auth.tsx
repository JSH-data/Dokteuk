import { createContext, useEffect, useState } from 'react';
import { firebase } from '@firebase/firebaseClient';
import { getAuth } from 'firebase/auth';
import nookies from 'nookies';
import { auth } from '@firebase/firebase';

const AuthContext = createContext<{ loginuser: any }>({
  loginuser: null,
});

export function AuthProvider({ children }: any) {
  const [loginuser, setLoginUser] = useState<any>(null);
  useEffect(() => {
    return auth.onIdTokenChanged(async (user) => {
      if (!user) {
        setLoginUser(null);
        nookies.set(undefined, 'token', '', { path: '/' });
      } else {
        const token = await user.getIdToken();
        setLoginUser(user);
        nookies.set(undefined, 'token', token, { path: '/' });
      }
    });
  }, []);
  // force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      const user = getAuth().currentUser;
      if (user) await user.getIdToken(true);
    }, 10 * 60 * 1000);

    // clean up setInterval
    return () => clearInterval(handle);
  }, []);
  return (
    <AuthContext.Provider value={{ loginuser }}>
      {children}
    </AuthContext.Provider>
  );
}
