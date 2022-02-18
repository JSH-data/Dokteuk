import { UserInputData } from '@interface/constants';
import { reg_email } from '@interface/constants';

export const userInputChangeValidation = (
  name: string,
  value: string,
  state: UserInputData,
) => {
  if (name === 'email') {
    if (!reg_email.test(value)) return '이메일 형식에 맞춰 입력해 주세요!';
  } else if (name === 'password') {
    if (value.length < 6) {
      return '6자리 이상 입력해 주세요!';
    }
  } else if (name === 'checkPassword') {
    if (value.length < 6) {
      return '6자리 이상 입력해 주세요!';
    }
    if (value !== state.password.value) {
      return '비밀번호가 다릅니다!';
    }
  } else if (name === 'nickname') {
    if (value.length < 3) return '3자리 이상 입력해 주세요!';
  } else if (name === 'jobSector') {
    if (value.length <= 0) return '직종을 선택해 주세요!';
  }

  return '';
};

export function userFormValidation(state: UserInputData) {
  const result = Object.values(state).filter((v) => {
    if (v.error) return true;
  });

  return result;
}
