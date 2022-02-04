interface Person {
  nickName: string;
  job: string;
}

interface ChatRoom {
  id?: string;
  users?: person[];
  other?: person;
  lastChat: string;
  createAt?: Timestamp;
  updateAt: Timestamp;
  lastVisited: Timestamp;
}

interface ChatText {
  id?: string;
  user: string;
  msg: string;
  createAt: Timestamp;
}
