import styled from '@emotion/styled';

const NotificationOriginContentWrapper = styled.div`
  font-size: 0.7rem;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  height: calc(0.7rem + 5px);
  -webkit-line-clamp: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  opacity: 0.8;
`;
const NotificationOriginContentText = styled.span``;

const NotificationOriginContent = ({
  originContent,
  postType,
}: {
  originContent: string;
  postType: string;
}) => {
  return (
    <NotificationOriginContentWrapper>
      {postType} {' • '}{' '}
      <NotificationOriginContentText>
        {originContent}
      </NotificationOriginContentText>
    </NotificationOriginContentWrapper>
  );
};

export default NotificationOriginContent;
