import styled from '@emotion/styled';
import Footer from '@layouts/Footer';
import Header from '@layouts/Header';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';

export const ChildrenWrapperDivStyled = styled(motion.div)`
  padding-top: 60px;
  // height: 100vh;
  // overflow-y: scroll;
  // -webkit-overflow-scrolling: touch;
`;
const Layout: React.FC = ({ children }) => {
  const router = useRouter();
  return (
    <>
      <Header />
      <AnimatePresence key={router.asPath} exitBeforeEnter>
        <ChildrenWrapperDivStyled
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.4,
          }}
          id="main-content"
        >
          {children}
        </ChildrenWrapperDivStyled>
      </AnimatePresence>
      <Footer />
    </>
  );
};
export default Layout;
