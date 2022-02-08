import { Button, Grid } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import React from 'react';
import ReactLoading from 'react-loading';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '@firebase/firebase';

type LoginProps = {
  type?: any;
  color?: any;
};

const Login: React.FC<LoginProps> = ({ type, color }) => {
  const loginWithGoogle = () => {
    signInWithPopup(auth, provider);
  };
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh' }}
    >
      <ReactLoading type={type} color={color} height={'20%'} width={'20%'} />
      <Button
        variant="contained"
        startIcon={<GoogleIcon />}
        onClick={loginWithGoogle}
      >
        sign in google
      </Button>
    </Grid>
  );
};

export default Login;
