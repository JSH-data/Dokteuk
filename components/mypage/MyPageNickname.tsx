import { useState } from 'react';
import Head from 'next/head';
import Layout from '@layouts/Layout';
import ButtonComponent from '@components/items/ButtonComponent';
import InputComponent from '@components/items/InputComponent';
import Container from '@mui/material/Container';
import { MyPageChangeCom } from './MyPageChangeComponent';

const MyPageNickName: React.FC = () => {
  const [nickname, setNickname] = useState<string>('');

  const nicknameChange = () => {
    console.log('닉네임 변경', nickname);
  };

  return (
    <>
      <Head>
        <title>닉네임 변경하기</title>
        <meta name="description" content="Generate by elice Team 5" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Container>
          <MyPageChangeCom>
            <h1>닉네임 변경</h1>
            <div>
              <InputComponent
                placeholder="닉네임을 입력해주세요"
                changeFn={setNickname}
                type={'text'}
              ></InputComponent>
              <ButtonComponent
                text="변경하기"
                activeFn={nicknameChange}
              ></ButtonComponent>
            </div>
          </MyPageChangeCom>
        </Container>
      </Layout>
    </>
  );
};

export default MyPageNickName;
