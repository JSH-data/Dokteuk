import { useState } from 'react';
import Head from 'next/head';
import Layout from '@layouts/Layout';
import ButtonComponent from '@components/items/ButtonComponent';
import InputComponent from '@components/items/InputComponent';
import { Container } from '@mui/material';
import { MyPageChangeCom } from './MyPageChangeComponent';

const MyPagePassword: React.FC = () => {
  const [pw, setPw] = useState<string>('');
  const [pwCheck, setPwCheck] = useState<string>('');
  const [pwError, setPwError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');
  const [pwCheckError, setPwCheckError] = useState<boolean>(false);
  const [pwCheckErrorText, setPwCheckErrorText] = useState<string>('');

  const passwordChange = () => {
    if (pw === pwCheck && pw !== '') {
      console.log('비밀번호가 동일하네!');
    } else {
      console.log('비밀번호가 동일하지 않네!');
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
            <h1>비밀번호 변경</h1>
            <div>
              <InputComponent
                type="password"
                placeholder="비밀번호"
                changeFn={setPw}
                error={pwError}
                errorText={errorText}
              ></InputComponent>
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
