import { RoungePost, TopicPost } from '@interface/CardInterface';

export interface ValidRounge {
  title: string;
  url: string;
}

export interface UserInfo {
  nickname: string;
  jobSector: string;
  validRounges: Array<ValidRounge>;
  hasNewNotification: boolean;
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
