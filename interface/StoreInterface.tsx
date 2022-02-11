import { RoungePost, TopicPost } from '@interface/CardInterface';

export interface ValidRounge {
  title: string;
  url: string;
}

export interface MyChatting {
  roomName: string;
  roomId: string;
  isGroup: true;
  lastMessage: { content: string; updatedAt: string };
  unreadCount: number;
}

export interface UserInfo {
  nickname: string;
  jobSector: string;
  validRounges: Array<ValidRounge>;
  myChattings: Array<MyChatting>;
  hasNewNotification: boolean;
  id: string;
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
}
export interface SearchResult {
  result: Array<TopicPost | RoungePost>;
  nextPage: number;
}
