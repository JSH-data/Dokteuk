import { RoungePost, TopicPost } from '@interface/CardInterface';
import { HomeListUrlString, TopicsUrlString } from './GetPostsInterface';

export interface ValidRounge {
  title: string;
  url: HomeListUrlString;
}
export type ValidPage =
  | Rounge
  | { title: '타임라인'; url: 'timeline' }
  | { title: '토픽'; url: 'topic' };

export type Topic =
  | { title: '연말정산'; url: 'yunmal' }
  | { title: '자유시장'; url: 'market' }
  | { title: '블라블라'; url: 'blabla' }
  | { title: '주식투자'; url: 'stock' };
export type Rounge =
  | { title: '외식·음료'; url: 'food-service' }
  | { title: '매장관리·판매'; url: 'store' }
  | { title: '서비스'; url: 'service' }
  | { title: '사무직'; url: 'white-collar' }
  | { title: '고객상담·리서치·영업'; url: 'sales-research' }
  | { title: '생산·건설·노무'; url: 'blue-collar' }
  | { title: 'IT·기술'; url: 'it-tech' }
  | { title: '디자인'; url: 'design' }
  | { title: '미디어'; url: 'media' }
  | { title: '운전·배달'; url: 'drive' }
  | { title: '병원·간호·연구'; url: 'hospital' }
  | { title: '교육·강사'; url: 'education' };

export interface UserInfo {
  nickname: string;
  jobSector: string;
  validRounges: Array<ValidPage>;
  hasNewNotification: boolean;
  hasNewChatNotification: boolean;
  id: string;
  posts: Array<string>;
  email: string;
}

export interface UserState {
  user: UserInfo;
  status: 'loading' | 'success' | 'error' | 'standby';
  error: string | undefined;
}
export interface ViewPosts {
  view: Array<SearchResult>;
  searchValue: string;
}
export interface StoreState {
  user: UserState;
  view: ViewPosts;
  scroll: { scrollY: number };
  // data: any;
}
export interface SearchResult {
  result: Array<TopicPost | RoungePost>;
  nextPage: number;
}
