import { useState } from 'react';
import { nicknameUpdate, checkNickname } from '@utils/userUpdate';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@layouts/Layout';
import ButtonComponent from '@components/items/ButtonComponent';
import InputComponent from '@components/items/InputComponent';
import Container from '@mui/material/Container';
import { MyPageChangeCom } from './MyPageChangeComponent';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useRouter } from 'next/router';

type MyPageNickNameProps = {
  userId: string;
};

const MyPageNickName: React.FC<MyPageNickNameProps> = ({ userId }) => {
  const [nickname, setNickname] = useState<string>('');
  const [errorText, setErrorText] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();

  const nicknameChange = async () => {
    const isDuplicated = await checkNickname(nickname);
    if (nickname.length < 3) {
      setError(true);
      setErrorText('닉네임을 3글자 이상으로 작성해주세요');
      return;
    } else if (isDuplicated) {
      setError(true);
      setErrorText('사용할 수 없는 닉네임입니다.');
      return;
    } else {
      setError(false);
      setErrorText('');

      await nicknameUpdate(nickname, userId);
      router.push('/mypage');
    }
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
            <header>
              <Link href={'/mypage'} passHref>
                <ArrowBackIosNewIcon />
              </Link>
              <h1>닉네임 변경</h1>
            </header>

            <InputComponent
              placeholder="닉네임을 입력해주세요"
              changeFn={setNickname}
              type={'text'}
              error={error}
              errorText={errorText}
            ></InputComponent>
            <ButtonComponent
              text="변경하기"
              activeFn={nicknameChange}
            ></ButtonComponent>
          </MyPageChangeCom>
        </Container>
      </Layout>
    </>
  );
};

export default MyPageNickName;
