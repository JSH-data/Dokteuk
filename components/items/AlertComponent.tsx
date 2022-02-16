import Alert from '@mui/material/Alert';
import { AlertColor } from '@mui/material';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const AlertOpen = keyframes`
  0% {
    opacity: 0;
    transform: translate3d(-50%, 7%, 0);
  }
  10% {
    opacity: 1;
    transform: translate3d(-50%, 0%, 0);
  }
  80% {
    opacity: 1;
    transform: translate3d(-50%, 0%, 0);
  }
  100% {
    transform: translate3d(-50%, 0%, 0);
    opacity: 0;
  }
`;

const AlertDiv = styled(Alert)`
  position: fixed;
  background-color: white;
  left: 50%;
  opacity: 0;
  bottom: 20px;
  animation: ${AlertOpen} 2s ease;
`;
const AlertComponent = ({
  alerMessage,
  alerType,
}: {
  alerMessage: string;
  alerType: AlertColor | undefined;
}) => {
  return (
    <AlertDiv variant="outlined" severity={alerType}>
      {alerMessage}
    </AlertDiv>
  );
};

export default AlertComponent;
