import styled from '@emotion/styled';
const NotificationContentText = styled.div`
  font-size: 1rem;
  margin-bottom: 5px;
  overflow: hidden;
  font-weight: 600;
  text-overflow: ellipsis;
  word-break: break-all;
  height: calc(1rem + 5px);
  -webkit-line-clamp: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
`;

const NotificationContent = ({ content }: { content: string }) => {
  return <NotificationContentText>{content}</NotificationContentText>;
};

export default NotificationContent;
