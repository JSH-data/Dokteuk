import { Rounge, Topic, ValidRounge } from './StoreInterface';

export type HomeListUrlString = RoungeUrlString | 'timeline' | 'topic';
export type RoungeUrlString =
  | 'food-service'
  | 'store'
  | 'service'
  | 'white-collar'
  | 'sales-research'
  | 'blue-collar'
  | 'it-tech'
  | 'design'
  | 'media'
  | 'drive'
  | 'hospital'
  | 'education';
export type RoungeTitleString =
  | '외식·음료'
  | '매장관리·판매'
  | '서비스'
  | '사무직'
  | '고객상담·리서치·영업'
  | '생산·건설·노무'
  | 'IT·기술'
  | '디자인'
  | '미디어'
  | '운전·배달'
  | '병원·간호·연구'
  | '교육·강사';
export type TopicsUrlString = 'yunmal' | 'market' | 'blabla' | 'stock';

export const DefaultListsAndTopics: {
  rounges: Array<Rounge>;
  topics: Array<Topic>;
} = {
  rounges: [
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
  ],

  topics: [
    { title: '연말정산', url: 'yunmal' },
    { title: '자유시장', url: 'market' },
    { title: '블라블라', url: 'blabla' },
    { title: '주식투자', url: 'stock' },
  ],
};
