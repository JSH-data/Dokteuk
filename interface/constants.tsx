import { Rounge } from '@interface/StoreInterface';

export type UserInputData = {
  email: { value: string; error: string };
  password: { value: string; error: string };
  checkPassword: { value: string; error: string };
  nickname: { value: string; error: string };
  jobSector: { value: string; error: string };
};

export type OcrData = {
  b_no: string;
  start_dt: string;
  p_nm: string;
};

export type UserInputDataAction = {
  type: string;
  payload: {
    value: string;
    error: string;
  };
};

export const userInputInitialState: UserInputData = {
  email: { value: '', error: '' },
  password: { value: '', error: '' },
  checkPassword: { value: '', error: '' },
  nickname: { value: '', error: '' },
  jobSector: { value: '', error: '직종을 선택해 주세요' },
};

export const jobSectors: Array<Rounge> = [
  { title: '외식·음료', url: 'food-service' },
  { title: '매장관리·판매', url: 'store' },
  { title: '서비스', url: 'service' },
  { title: '사무직', url: 'white-collar' },
  { title: '고객상담·리서치·영업', url: 'sales-research' },
  { title: '생산·건설·노무', url: 'blue-collar' },
  { title: 'IT·기술', url: 'it-tech' },
  { title: '디자인', url: 'design' },
  { title: '미디어', url: 'media' },
  { title: '운전·배달', url: 'drive' },
  { title: '병원·간호·연구', url: 'hospital' },
  { title: '교육·강사', url: 'education' },
];

export const reg_email =
  /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
