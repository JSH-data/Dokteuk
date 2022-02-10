import { Ref } from 'react';

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
}

export interface UserState {
  user: UserInfo;
  status: 'loading' | 'success' | 'error' | 'standby';
  error: string | undefined;
}
export interface ViewPosts {
  view: [];
}
export interface StoreState {
  user: UserState;
  view: ViewPosts;
  scroll: { scrollY: number };
}
