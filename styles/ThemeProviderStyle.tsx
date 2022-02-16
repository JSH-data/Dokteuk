import { ThemeProvider, createTheme } from '@mui/material/styles';
import { FunctionComponent } from 'react';

const theme_ = createTheme(
  {},
  {
    mainColorViolet: '#8946A6',
    mainColorVioletLight: '#9165e2',
    mainColorPink: '#b762c1',
    mainColorRed: '#db3239',
    mainColorBlue: '#4C78C1',
    mainColorBlack: '#1c1c1e',
    blackGray: '#232325',
    darkGray: '#5d5d5fe6',
    middleGray: '#919192',
    lightGray: '#c8c8c8bf',
    whiteGray: '#EAEAEA',
  },
);

const ThemeProviderStyle: FunctionComponent = ({ children }) => {
  return <ThemeProvider theme={theme_}>{children}</ThemeProvider>;
};

export default ThemeProviderStyle;
