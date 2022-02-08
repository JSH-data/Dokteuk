import styled from '@emotion/styled';

const SkeletonStyled = styled.div`
  background-color: rgba(28, 28, 30, 1);
  height: 60px;
  width: 100%;
`;
const HeaderSkeleton: React.FC = () => {
  return <SkeletonStyled />;
};
export default HeaderSkeleton;
