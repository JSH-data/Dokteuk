export type UserInputData = {
  email: string;
  password: string;
  checkPassword: string;
  nickname: string;
  jobSector: string;
};

export type InputHelperText = {
  email: string;
  password: string;
  checkPassword: string;
  nickname: string;
  jobSector: string;
};

export const userInputInitialState: UserInputData = {
  email: '',
  password: '',
  checkPassword: '',
  nickname: '',
  jobSector: '',
};

export const jobSectors = [
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
