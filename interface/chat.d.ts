type queryType = string | string[] | undefined;

interface Person {
  nickname: string;
  job: string;
}

interface ChatRoom {
  id?: string;
  users?: person[];
  other?: person;
  last_chat: string | undefined;
  create_at?: Timestamp;
  update_at: Timestamp;
  last_visited: {
    [k: string]: Timestamp;
  };
}

interface ChatText {
  id?: string;
  from: string;
  msg: string;
  create_at: Timestamp;
}

interface ImgProps {
  src: string;
  alt: string;
}
