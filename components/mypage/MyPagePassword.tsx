import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '@layouts/Layout';
import ButtonComponent from '@components/items/ButtonComponent';
import InputComponent from '@components/items/InputComponent';
import { Container } from '@mui/material';
import { MyPageChangeCom } from './MyPageChangeComponent';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { passwordUpdate, logOut } from '@utils/userUpdate';

const MyPagePassword: React.FC = () => {
  const [pw, setPw] = useState<string>('');
  const [pwCheck, setPwCheck] = useState<string>('');
  const [pwError, setPwError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');
  const [pwCheckError, setPwCheckError] = useState<boolean>(false);
  const [pwCheckErrorText, setPwCheckErrorText] = useState<string>('');
  const router = useRouter();
  const passwordChange = async () => {
    if (pw === pwCheck && pw !== '' && pw.length >= 6) {
      const message = await passwordUpdate(pw);

      if (message != 'true') {
        setPwError(true);
        setPwCheckError(true);
        setErrorText(message);
        setPwCheckErrorText(message);
      } else {
        logOut();
        router.push('/user/login');
      }
    } else {
      setPwError(true);
      setPwCheckError(true);
      setErrorText('다시 입력해주세요');
      setPwCheckErrorText('다시 입력해주세요');
    }
  };

  return (
    <>
      <Head>
        <title>비밀번호 변경하기</title>
        <meta name="description" content="Generate by elice Team 5" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Container>
          <MyPageChangeCom>
            <header>
              <Link href={'/mypage'} passHref>
                <ArrowBackIosNewIcon />
              </Link>
              <h1>비밀번호 변경</h1>
            </header>
            <div>
              <h3>비밀번호</h3>
              <InputComponent
                type="password"
                placeholder="비밀번호"
                changeFn={setPw}
                error={pwError}
                errorText={errorText}
              ></InputComponent>
              <h3>비밀번호 확인</h3>
              <InputComponent
                type="password"
                placeholder="비밀번호 확인"
                changeFn={setPwCheck}
                error={pwCheckError}
                errorText={pwCheckErrorText}
              ></InputComponent>
              <ButtonComponent
                text="비밀번호 변경하기"
                activeFn={passwordChange}
              ></ButtonComponent>
            </div>
          </MyPageChangeCom>
        </Container>
      </Layout>
    </>
  );
};

export default MyPagePassword;
