import styled from '@emotion/styled';
import { useRouter } from 'next/router';
const ErrorPageWrapperDiv = styled.div`
  margin-top: 80vh;
  text-align: center;
`;
const ErrorPageContentWrapperDiv = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
`;
const ErrorPageStrongStyled = styled.strong`
  display: block;
  margin: 20px 0 16px 0;
  font-weight: 0;
  font-size: 30px;
  line-height: 38px;
`;
const ErrorPagePTagSteyld = styled.p`
  color: #777;
  fontsize: 14px;
  lineheight: 20px;
  padding: 0 1rem 0 1rem;
`;
const ErrorPageButtonWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;
const ErrorPageHomeButtonStyled = styled.div`
  display: block;
  width: 130px;
  height: 50px;
  margin: 40px auto 5px;
  background-color: black;
  color: #fff;
  border-radius: 6px;
  font-size: 14px;
  line-height: 50px;
  font-weight: bold;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
`;
const ErrorPagePrevPageButtonStyled = styled.div`
  display: block;
  width: 130px;
  height: 50px;
  margin: 0 auto;
  background-color: #fff;
  color: black;
  border-radius: 6px;
  border: 1px solid #b0b0b0;
  opacity: 0.6;
  font-size: 14px;
  line-height: 50px;
  font-weight: bold;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
`;
const TitleH2Styled = styled.h2`
  margin-top: -5vh;
  margin-bottom: 5vh;
`;

export default function NotFoundPage(): JSX.Element {
  const router = useRouter();
  return (
    <>
      <ErrorPageWrapperDiv>
        <ErrorPageContentWrapperDiv>
          <h2>DokTeuk</h2>
          <div>
            <svg
              viewBox="64 64 896 896"
              focusable="false"
              data-icon="warning"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
              fontSize={72}
              color="#faad14"
            >
              <path d="M955.7 856l-416-720c-6.2-10.7-16.9-16-27.7-16s-21.6 5.3-27.7 16l-416 720C56 877.4 71.4 904 96 904h832c24.6 0 40-26.6 27.7-48zM480 416c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v184c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V416zm32 352a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"></path>
            </svg>
            <div>
              <ErrorPageStrongStyled>
                페이지를 찾을 수<br />
                없습니다
              </ErrorPageStrongStyled>
              <ErrorPagePTagSteyld>
                페이지의 주소가 잘못 입력되었거나,
                <br />
                변경 혹은 삭제되어 요청하신 페이지를 찾을 수 없습니다.
                <br />
                입력하신 페이지 주소를 다시 한번 확인해 주세요.
              </ErrorPagePTagSteyld>
              <ErrorPageButtonWrapperStyled>
                <ErrorPageHomeButtonStyled
                  onClick={() => {
                    router.push('/');
                  }}
                >
                  Home
                </ErrorPageHomeButtonStyled>
                <ErrorPagePrevPageButtonStyled
                  onClick={() => {
                    router.back();
                  }}
                >
                  이전 페이지
                </ErrorPagePrevPageButtonStyled>
              </ErrorPageButtonWrapperStyled>
            </div>
          </div>
        </ErrorPageContentWrapperDiv>
      </ErrorPageWrapperDiv>
    </>
  );
}
