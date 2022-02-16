import { db, auth } from '@firebase/firebase';
import {
  doc,
  setDoc,
  getDocs,
  getDoc,
  collection,
  query,
  where,
} from 'firebase/firestore';
import { UserInputData } from 'pages/user/constants';

export const userInputValidation = (name: string, value: string) => {
  if (name === 'email') {
    const reg_email =
      /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    // .test => 주어진 정규표현식 만족하는지에 따라 T/F 반환
    if (!reg_email.test(value)) return '이메일 형식에 맞춰 입력해 주세요!';
  } else if (name === 'password' || name === 'checkPassword') {
    if (value.length < 6) {
      return '6자리 이상 입력해 주세요!';
    }
  } else if (name === 'nickname') {
    if (value.length < 3) return '3자리 이상 입력해 주세요!';
  } else if (name === 'jobSector') {
    if (value.length <= 0) return '직종을 선택해 주세요!';
  }

  return '';
};

export const inputErrorCheck = (state: UserInputData) => {
  const { email, password, checkPassword, nickname, jobSector } = state;

  if (email.error) {
    alert('이메일이 잘못 입력되었습니다!');
    return false;
  } else if (password.error || checkPassword.error) {
    alert('비밀번호가 잘못 입력되었습니다!');
    return false;
  } else if (nickname.error) {
    alert('닉네임이 잘못 입력되었습니다!');
    return false;
  } else if (jobSector.error) {
    alert('직종을 선택하지 않았습니다!');
    return false;
  }

  return true;
};
