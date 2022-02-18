import styled from '@emotion/styled';
const NotificationInfoText = styled.div`
  font-size: 0.75rem;
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  height: calc(0.75rem + 5px);
  -webkit-line-clamp: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
`;

const NotificationInfo = ({ type }: { type: string }) => {
  return (
    <NotificationInfoText>
      {type === 'comment'
        ? '내가 작성한 댓글에 답글이 달렸습니다'
        : '내가 작성한 게시글에 댓글이 달렸습니다'}
    </NotificationInfoText>
  );
};

export default NotificationInfo;
