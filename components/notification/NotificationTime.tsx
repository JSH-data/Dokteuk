import styled from '@emotion/styled';

const NotificationTimeText = styled.div`
  min-width: 48px;
`;

const NotificationTime = ({ time }: { time: string }) => {
  return <NotificationTimeText>{time}</NotificationTimeText>;
};

export default NotificationTime;
