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
  state: UserInfo;
  user: UserInfo;
  status: 'loading' | 'success' | 'error' | 'standby';
  error: string;
}
