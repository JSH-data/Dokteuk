import { TopicPost, RoungePost } from '../interface/CardInterface';
import delay from '@utils/delay';

export const getMyInfo = async () => {
  // console.log('getMyInfo Called!');
  await delay(0);
  // return null;
  return {
    nickname: '닉네임입니다',
    jobSector: '외식·음료',
    validRounges: [
      { title: '타임라인', url: 'timeline' },
      { title: '토픽', url: 'topic' },
      { title: '외식·음료', url: 'food-service' },
      { title: '매장관리·판매', url: 'store-service' },
    ],
  };
};
export const searchInfiniteFunction = async (
  searchValue: string,
  pageParam: number,
) => {
  const value = searchValue;
  console.log(searchValue, pageParam);
  if (!value) {
    return { result: [], nextPage: 1 };
  }
  await delay(800);
  const dummyRoungePost: RoungePost = {
    postId: 'r8q394uf90q23urq89pd3oil',
    postType: 'rounge',
    rounge: '외식·음료',
    title: '라운지 글 제목',
    content:
      searchValue +
      '블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 ',
    commentsCount: Math.floor(Math.random() * 5),
    author: { nickname: '닉네임', jobSector: '외식·음료' },
    likeCount: Math.floor(Math.random() * 5),
    createdAt: Date.now().toString(),
  };
  const dummyTopicPost: TopicPost = {
    postId: 'r8qur390wjfioajwfeio394uf90q23urq89pd3oil',
    postType: 'topic',
    topic: '블라블라블라블라',
    title: '토픽 글 제목',
    content:
      searchValue +
      '블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 ',
    commentsCount: Math.floor(Math.random() * 5),
    author: { nickname: '닉네임', jobSector: '외식·음료' },
    likeCount: Math.floor(Math.random() * 5),
    createdAt: Date.now().toString(),
  };
  const dummyTopicPosts = [];
  const dummyRoungePosts = [];

  for (let i = 0; i < 10; i++) {
    const newTopicPost: TopicPost = {
      ...dummyTopicPost,
      postId: dummyTopicPost.postId + Math.floor(Math.random() * 1000000),
      createdAt: (
        parseInt(dummyTopicPost.createdAt) -
        Math.floor(Math.random() * 30000) * 1000
      ).toString(),
    };
    dummyTopicPosts.push(newTopicPost);

    const newRoungePost: RoungePost = {
      ...dummyRoungePost,
      postId: dummyTopicPost.postId + Math.floor(Math.random() * 1000000),
      createdAt: (
        parseInt(dummyRoungePost.createdAt) -
        Math.floor(Math.random() * 30000) * 1000
      ).toString(),
    };
    dummyRoungePosts.push(newRoungePost);
  }
  const dummyPosts: Array<TopicPost | RoungePost> = [...dummyTopicPosts];
  for (let i = 0; i < 10; i++) {
    dummyPosts.splice(Math.floor(Math.random() * 10), 0, dummyRoungePosts[i]);
  }
  // console.log(lastIndex);
  return { result: dummyPosts, nextPage: pageParam + 1 };
};

export const searchFunction = async (
  value: string,
  lastIndex: number | undefined,
) => {
  await delay(0);
  // console.log(value);
  const dummyRoungePost: RoungePost = {
    postId: 'r8q394uf90q23urq89pd3oil',
    postType: 'rounge',
    rounge: '외식·음료',
    title: '라운지 글 제목',
    content: '블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 ',
    commentsCount: 0,
    author: { nickname: '닉네임', jobSector: '외식·음료' },
    likeCount: 0,
    createdAt: Date.now().toString(),
  };
  const dummyTopicPost: TopicPost = {
    postId: 'r8qur390wjfioajwfeio394uf90q23urq89pd3oil',
    postType: 'topic',
    topic: '블라블라블라블라',
    title: '토픽 글 제목',
    content: '블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 ',
    commentsCount: 0,
    author: { nickname: '닉네임', jobSector: '외식·음료' },
    likeCount: 0,
    createdAt: Date.now().toString(),
  };
  const dummyTopicPosts = [];
  const dummyRoungePosts = [];

  for (let i = 0; i < 10; i++) {
    const newTopicPost: TopicPost = {
      ...dummyTopicPost,
      postId: dummyTopicPost.postId + Math.floor(Math.random() * 1000000),
      createdAt: (
        parseInt(dummyTopicPost.createdAt) -
        Math.floor(Math.random() * 30000) * 1000
      ).toString(),
    };
    dummyTopicPosts.push(newTopicPost);

    const newRoungePost: RoungePost = {
      ...dummyRoungePost,
      postId: dummyTopicPost.postId + Math.floor(Math.random() * 1000000),
      createdAt: (
        parseInt(dummyRoungePost.createdAt) -
        Math.floor(Math.random() * 30000) * 1000
      ).toString(),
    };
    dummyRoungePosts.push(newRoungePost);
  }
  const dummyPosts: Array<TopicPost | RoungePost> = [...dummyTopicPosts];
  for (let i = 0; i < 10; i++) {
    dummyPosts.splice(Math.floor(Math.random() * 10), 0, dummyRoungePosts[i]);
  }
  // console.log(lastIndex);
  return dummyPosts;
};

export const getDateTime = (dateNumberString: string): string => {
  // 1분 이내: 방금 전
  // 1시간 이전: x분전
  // 1시간 이후: x시간 전
  // 전날인 경우: 어제
  // 이틀 전 이후: x일 전
  // 7일 이후: 날짜 표시(올해가 아닌경우 년-월-일, 올해인 경우: 월-일)
  let dateDiff = (Date.now() - parseInt(dateNumberString)) / 1000; // 초단위 변환
  if (dateDiff < 60) return '방금 전'; // 60초 이내
  dateDiff = Math.floor(dateDiff / 60); // 분단위 변환
  if (dateDiff < 60) return `${dateDiff}분 전`; // 60분 이내
  dateDiff = Math.floor(dateDiff / 60); // 시간단위 변환
  if (dateDiff < 24) return `${dateDiff}시간 전`;
  dateDiff = Math.floor(dateDiff / 24); // 일단위 변환
  if (dateDiff === 1) return `어제`;
  if (dateDiff <= 7) return `${dateDiff}일 전`;
  if (dateDiff > 7) {
    const nowYear = new Date(Date.now()).getFullYear();
    const dateObject = new Date(parseInt(dateNumberString, 10));
    if (nowYear !== dateObject.getFullYear()) {
      return `${dateObject.getFullYear()}.${
        dateObject.getMonth() + 1
      }.${dateObject.getDate()}`;
    }
    return `${dateObject.getMonth() + 1}.${dateObject.getDate()}`;
  }
  return '';
};