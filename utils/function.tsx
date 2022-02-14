import { db } from '@firebase/firebase';
import { TopicPost, RoungePost } from '@interface/CardInterface';
import {
  DefaultListsAndTopics,
  HomeListUrlString,
} from '@interface/GetPostsInterface';
import { UserInfo } from '@interface/StoreInterface';
import delay from '@utils/delay';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  startAt,
  startAfter,
} from 'firebase/firestore';
import { faker } from '@faker-js/faker';

export const getMyInfo = async (result: any) => {
  //await delay(3000);
  // await delay(0);
  // return null;

  parseInt(Date.now().toString()) - Math.floor(Math.random() * 30000) * 1000;
  return {
    nickname: result.nickname,
    jobSector: result.jobSector,
    validRounges: result.validRounges,
    // myChattings: result.myChatting,
    hasNewNotification: result.hasNewNotification,
    id: result.id,
    // nickname: '닉네임입니다',
    // jobSector: '외식·음료',
    // validRounges: [
    //   { title: '타임라인', url: 'timeline' },
    //   { title: '토픽', url: 'topic' },
    //   { title: '외식·음료', url: 'food-service' },
    //   { title: '매장관리·판매', url: 'store-service' },
    // ],
    // myChattings: [
    //   {
    //     roomName: '채팅방1',
    //     roomId: 'r8qur390wjfioajwfeio399r3q4esrtscw',
    //     isGroup: true,
    //     lastMessage: { content: '푸하하', updatedAt: '' },
    //     unreadCount: 0,
    //   },
    //   {
    //     roomName: '채팅방2',
    //     roomId: 'r8qur390wjfioajwfeio399qr23rqr23ew',
    //     isGroup: true,
    //     lastMessage: { content: '호호', updatedAt: '' },
    //     unreadCount: 10,
    //   },
    //   {
    //     roomName: '채팅방3',
    //     roomId: 'r8qur390wjfioajwfeio399t78t7u7yfyh',
    //     isGroup: false,
    //     lastMessage: { content: '헤응', updatedAt: '' },
    //     unreadCount: 4,
    //   },
    // ],
    // hasNewNotification: true,
  } as UserInfo;
};

export const getTopics = (list: string, pageParam: string) => {
  const dummyTopicPost: TopicPost = {
    postId: 'r8qur390wjfioajwfeio394uf90q23urq89pd3oil',
    postType: 'topic',
    topic: { title: '블라블라', url: 'blabla' },
    title: '토픽 글 제목',
    content:
      `조회하고 있는 list는 ${list}이고` +
      `전달된 pageParam은 ${pageParam}입니다` +
      '블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 ',
    commentsCount: Math.floor(Math.random() * 5),
    author: { nickname: '닉네임', jobSector: '외식·음료' },
    likeCount: Math.floor(Math.random() * 5),
    createdAt: Date.now().toString(),
    images: [],
  };

  const generateTenTopicPosts = () => {
    const dummyTopicPosts = [];
    for (let i = 0; i < 10; i++) {
      if (i % 2 === 0) {
        const newTopicPost: TopicPost = {
          ...dummyTopicPost,
          postId: dummyTopicPost.postId + Math.floor(Math.random() * 1000000),
          createdAt: (
            parseInt(dummyTopicPost.createdAt) -
            Math.floor(Math.random() * 30000) * 1000
          ).toString(),
        };
        dummyTopicPosts.push(newTopicPost);
      } else {
        const newTopicPost: TopicPost = {
          ...dummyTopicPost,
          images: ['https://i.ibb.co/VJXmhFt/asdasd.jpg'],
          postId: dummyTopicPost.postId + Math.floor(Math.random() * 1000000),
          createdAt: (
            parseInt(dummyTopicPost.createdAt) -
            Math.floor(Math.random() * 30000) * 1000
          ).toString(),
        };
        dummyTopicPosts.push(newTopicPost);
      }
    }
    return dummyTopicPosts;
  };
  return generateTenTopicPosts();
};

export const getHomePostsInfiniteFunction = async (
  list: HomeListUrlString,
  pageParam: number,
  validRounges?: Array<HomeListUrlString>,
) => {
  // for (let i = 0; i < 20; i++) {
  //   const collectionRef = collection(db, 'posts');
  //   const { id: newId } = await addDoc(collectionRef, {
  //     title: faker.lorem.sentence(),
  //     content: faker.lorem.paragraph(4),
  //     pressPerson: [],
  //     postId: '',
  //     postType: 'rounge',
  //     topic: '',
  //     updatedAt: serverTimestamp(),
  //     userId: 'jf4RswnBDeQAV3DPtzcHlDJbxTL92',
  //     job: '매장관리·판매',
  //     nickname: '닉네임2222222222',
  //     rounge: '매장관리·판매',
  //     createdAt: serverTimestamp(),
  //     images: [],
  //   });
  //   const wroteDocRef = doc(db, 'posts', newId);
  //   await updateDoc(wroteDocRef, { postId: newId });
  // }
  // for (let i = 0; i < 20; i++) {
  //   const collectionRef = collection(db, 'posts');
  //   const { id: newId } = await addDoc(collectionRef, {
  //     title: faker.lorem.sentence(),
  //     content: faker.lorem.paragraph(4),
  //     pressPerson: [],
  //     postId: '',
  //     postType: 'topic',
  //     topic: { title: '블라블라', url: 'blabla' },
  //     updatedAt: serverTimestamp(),
  //     userId: 'jf22GhSujbZtWDPtzcHlDJbxTL92',
  //     job: '서비스',
  //     nickname: '닉네임',
  //     rounge: '',
  //     createdAt: serverTimestamp(),
  //     images: [],
  //   });
  //   const wroteDocRef = doc(db, 'posts', newId);
  //   await updateDoc(wroteDocRef, { postId: newId });
  // }

  // 로그인 된 사용자가 topic에 접근 => topic만 반환
  // 비로그인 or 비인증 사용자 => topic만 반환
  if (
    !validRounges ||
    (validRounges &&
      validRounges.length === 1 &&
      validRounges[0] === 'topic') ||
    list === 'topic'
  ) {
    const postsRef = collection(db, 'posts');
    const returnArr: Array<TopicPost> = [];
    let q_topic;
    if (pageParam > 0) {
      const q_topicCurrent = query(
        postsRef,
        where('postType', '==', 'topic'),
        orderBy('createdAt', 'desc'),
        limit(pageParam * 20),
      );
      const currentSnapShot = await getDocs(q_topicCurrent);
      const lastVisible = currentSnapShot.docs[currentSnapShot.docs.length - 1];
      q_topic = query(
        postsRef,
        where('postType', '==', 'topic'),
        orderBy('createdAt', 'desc'),
        startAfter(lastVisible),
        limit(20),
      );
    } else
      q_topic = query(
        postsRef,
        where('postType', '==', 'topic'),
        orderBy('createdAt', 'desc'),
        limit(20),
      );
    const snap = await getDocs(q_topic);
    snap.forEach((doc) => {
      const docData = doc.data();
      const returnData: TopicPost = {
        author: { nickname: docData.nickname, jobSector: docData.job },
        content: docData.content,
        commentsCount: docData.commentsCount || 0,
        createdAt: docData.createdAt.seconds
          .toString()
          .padEnd(13, 0)
          .toString(),
        images: docData.images,
        likeCount: docData.pressPerson.length,
        postId: docData.postId,
        postType: docData.postType,
        title: docData.title,
        topic: docData.topic,
      };
      returnArr.push(returnData);
    });
    if (returnArr.length === 0) return { result: returnArr, nextPage: -1 };
    return { result: returnArr, nextPage: pageParam + 1 };
  }

  // 로그인 된 사용자가 timeline에 접근
  if (list === 'timeline') {
    const myValidRounges = validRounges ? [...validRounges] : [];
    const myInvalidRounges = DefaultListsAndTopics.rounges.filter((rounge) => {
      for (const myRoungeUrl of myValidRounges)
        if (rounge.url === myRoungeUrl) return false; // url은 unique하므로 비교값으로 사용
      return true;
    });
    const myInvalidRoungesUrls = myInvalidRounges.map((v) => v.url);
    myInvalidRoungesUrls.pop(); // not-in 은 10개의 엘리먼트까지만 지원
    const postsRef = collection(db, 'posts');
    const returnArr: Array<TopicPost | RoungePost> = [];
    //
    //
    //
    // console.log(
    //   (
    //     await getDocs(
    //       query(
    //         postsRef,
    //         where('postType', 'in', ['rounge', 'topic']),
    //         where('rounge.url', 'in', myValidRounges),
    //         limit(20),
    //       ),
    //     )
    //   ).docs.length,
    // );
    // ).docs.forEach((v) => {
    //   console.log(v.data().postType);
    // });
    //
    //
    //
    let q_rounge;
    if (pageParam > 0) {
      const q_roungeCurrent = query(
        postsRef,
        where('rounge.url', 'not-in', myInvalidRoungesUrls),
        orderBy('rounge.url', 'asc'),
        orderBy('createdAt', 'desc'),
        limit(pageParam * 20),
      );
      const currentSnapShot = await getDocs(q_roungeCurrent);
      const lastVisible = currentSnapShot.docs[currentSnapShot.docs.length - 1];
      q_rounge = query(
        postsRef,
        where('rounge.url', 'not-in', myInvalidRoungesUrls),
        orderBy('rounge.url', 'asc'),
        orderBy('createdAt', 'desc'),
        startAfter(lastVisible),
        limit(20),
      );
    } else
      q_rounge = query(
        postsRef,
        where('rounge.url', 'not-in', myInvalidRoungesUrls),
        orderBy('rounge.url', 'asc'),
        orderBy('createdAt', 'desc'),
        limit(20),
      );
    const snap = await getDocs(q_rounge);
    snap.forEach((doc) => {
      const docData = doc.data();
      if (docData.postType === 'topic') {
        const returnData: TopicPost = {
          author: { nickname: docData.nickname, jobSector: docData.job },
          content: docData.content,
          commentsCount: docData.commentsCount || 0,
          createdAt: docData.createdAt.seconds
            .toString()
            .padEnd(13, 0)
            .toString(),
          images: docData.images,
          likeCount: docData.pressPerson.length,
          postId: docData.postId,
          postType: docData.postType,
          title: docData.title,
          topic: docData.topic,
        };
        returnArr.push(returnData);
      } else if (docData.postType === 'rounge') {
        const returnData: RoungePost = {
          author: { nickname: docData.nickname, jobSector: docData.job },
          content: docData.content,
          commentsCount: docData.commentsCount || 0,
          createdAt: docData.createdAt.seconds
            .toString()
            .padEnd(13, 0)
            .toString(),
          images: docData.images,
          likeCount: docData.pressPerson.length,
          postId: docData.postId,
          postType: docData.postType,
          title: docData.title,
          rounge: docData.rounge,
        };
        returnArr.push(returnData);
      }
    });
    if (returnArr.length === 0) return { result: returnArr, nextPage: -1 };
    return { result: returnArr, nextPage: pageParam + 1 };

    // return;
  }

  // 이외의 경우는 rounge페이지에 접근
  // 허용되지 않은 라운지에 접근
  if (validRounges?.indexOf(list) === -1) {
    // return;
  }
  // 허용된 라운지에 접근중일 경우
  const postsRef = collection(db, 'posts');
  const returnArr: Array<TopicPost> = [];
  let q_rounge;
  if (pageParam > 0) {
    const q_roungeCurrent = query(
      postsRef,
      where('rounge.url', '==', list),
      orderBy('createdAt', 'desc'),
      limit(pageParam * 20),
    );
    const currentSnapShot = await getDocs(q_roungeCurrent);
    const lastVisible = currentSnapShot.docs[currentSnapShot.docs.length - 1];
    q_rounge = query(
      postsRef,
      where('rounge.url', '==', list),
      orderBy('createdAt', 'desc'),
      startAfter(lastVisible),
      limit(20),
    );
  } else
    q_rounge = query(
      postsRef,
      where('rounge.url', '==', list),
      orderBy('createdAt', 'desc'),
      limit(20),
    );
  const snap = await getDocs(q_rounge);
  console.log(snap.docs.length);
  snap.forEach((doc) => {
    const docData = doc.data();
    const returnData: TopicPost = {
      author: { nickname: docData.nickname, jobSector: docData.job },
      content: docData.content,
      commentsCount: docData.commentsCount || 0,
      createdAt: docData.createdAt.seconds.toString().padEnd(13, 0).toString(),
      images: docData.images,
      likeCount: docData.pressPerson.length,
      postId: docData.postId,
      postType: docData.postType,
      title: docData.title,
      topic: docData.topic,
    };
    returnArr.push(returnData);
  });
  if (returnArr.length === 0) return { result: returnArr, nextPage: -1 };
  return { result: returnArr, nextPage: pageParam + 1 };

  // const q = query(postsRef, where('postType', 'not-in', ['Topic', 'Rounge']));
  // DefaultListsAndTopics;

  // DefaultListsAndTopics: 현재 존재하는 rounges와 topics가 key로 담겨있는 Object
  // validRounges: user 정보에 존재하는 validRounges(Array<ValidRounge>)

  // 테스트
  // const myValidRounges = [
  //   { title: '외식·음료', url: 'food-service' },
  //   { title: '매장관리·판매', url: 'store' },
  // ];
  // const myInvalidRounges = DefaultListsAndTopics.rounges.filter((rounge) => {
  //   for (const myRounge of myValidRounges)
  //     if (rounge.url === myRounge.url) return false; // url은 unique하므로 비교값으로 사용
  //   return true;
  // });
  // const myInvalidRoungesUrl = myInvalidRounges.map((v) => v.url);
  // console.log(myInvalidRoungesUrl);

  // const inValidTopics = DefaultListsAndTopics.topics.filter((v) => v !== myTopic);
  // console.log(inValidTopics);
  // const q_timeline = query(
  //   postsRef,
  //   where('topic', 'not-in', inValidTopics),
  //   orderBy('topic', 'desc'),
  //   orderBy('createdAt', 'desc'),
  //   limit(3),
  // );
  // // const q = query(postsRef);
  // const snap_timeline = await getDocs(q_timeline);
  // snap_timeline.forEach((doc) => {
  //   console.log(doc.data().postType, doc.data().topic, doc.data().rounge);
  // });
  // const myRounges = ['education'];
  // const inValidRounges = topics.filter((v) => {
  //   for (const myRounge of myRounges) {
  //     if (v === myRounge) return true;
  //   }
  // });
  // const q_rounge = query(
  //   postsRef,
  //   where('rounge', 'not-in', inValidRounges),
  //   orderBy('topic', 'desc'),
  //   orderBy('createdAt', 'desc'),
  //   limit(3),
  // );
  // // const q = query(postsRef);
  // const snap_rounge = await getDocs(q_rounge);
  // snap_rounge.forEach((doc) => {
  //   console.log(doc.data().postType, doc.data().topic, doc.data().rounge);
  // });

  // const q_topic = query(
  //   postsRef,
  //   where('topic', 'not-in', inValidTopics),
  //   orderBy('topic', 'desc'),
  //   orderBy('createdAt', 'desc'),
  //   limit(3),
  // );
  // // const q = query(postsRef);
  // const snap_topic = await getDocs(q_topic);
  // snap_timeline.forEach((doc) => {
  //   console.log(doc.data().postType, doc.data().topic, doc.data().rounge);
  // });
  // return;
  //
  //
  //
  //
  //
  //
  // await delay(800);
  const dummyRoungePost: RoungePost = {
    postId: 'r8q394uf90q23urq89pd3oil',
    postType: 'rounge',
    rounge: { title: '외식·음료', url: 'food-service' },
    title: '라운지 글 제목',
    content:
      `조회하고 있는 list는 ${list}이고` +
      `전달된 pageParam은 ${pageParam}입니다` +
      '블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 ',
    commentsCount: Math.floor(Math.random() * 5),
    author: { nickname: '닉네임', jobSector: '외식·음료' },
    likeCount: Math.floor(Math.random() * 5),
    createdAt: Date.now().toString(),
    images: [],
  };
  const dummyTopicPost: TopicPost = {
    postId: 'r8qur390wjfioajwfeio394uf90q23urq89pd3oil',
    postType: 'topic',
    topic: { title: '블라블라', url: 'blabla' },
    title: '토픽 글 제목',
    content:
      `조회하고 있는 list는 ${list}이고` +
      `전달된 pageParam은 ${pageParam}입니다` +
      '블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 ',
    commentsCount: Math.floor(Math.random() * 5),
    author: { nickname: '닉네임', jobSector: '외식·음료' },
    likeCount: Math.floor(Math.random() * 5),
    createdAt: Date.now().toString(),
    images: [],
  };

  const generateTenTopicPosts = () => {
    const dummyTopicPosts = [];
    for (let i = 0; i < 10; i++) {
      if (i % 2 === 0) {
        const newTopicPost: TopicPost = {
          ...dummyTopicPost,
          postId: dummyTopicPost.postId + Math.floor(Math.random() * 1000000),
          createdAt: (
            parseInt(dummyTopicPost.createdAt) -
            Math.floor(Math.random() * 30000) * 1000
          ).toString(),
        };
        dummyTopicPosts.push(newTopicPost);
      } else {
        const newTopicPost: TopicPost = {
          ...dummyTopicPost,
          images: ['https://i.ibb.co/VJXmhFt/asdasd.jpg'],
          postId: dummyTopicPost.postId + Math.floor(Math.random() * 1000000),
          createdAt: (
            parseInt(dummyTopicPost.createdAt) -
            Math.floor(Math.random() * 30000) * 1000
          ).toString(),
        };
        dummyTopicPosts.push(newTopicPost);
      }
    }
    return dummyTopicPosts;
  };
  const generateTenRoungePosts = () => {
    const dummyRoungePosts = [];
    for (let i = 0; i < 10; i++) {
      if (i % 2 === 0) {
        const newRoungePost: RoungePost = {
          ...dummyRoungePost,
          images: [
            'https://i.ibb.co/VJXmhFt/asdasd.jpg',
            'https://i.ibb.co/VJXmhFt/asdasd.jpg',
          ],
          postId: dummyRoungePost.postId + Math.floor(Math.random() * 1000000),
          createdAt: (
            parseInt(dummyRoungePost.createdAt) -
            Math.floor(Math.random() * 30000) * 1000
          ).toString(),
        };
        dummyRoungePosts.push(newRoungePost);
      } else {
        const newRoungePost: RoungePost = {
          ...dummyRoungePost,
          postId: dummyRoungePost.postId + Math.floor(Math.random() * 1000000),
          createdAt: (
            parseInt(dummyRoungePost.createdAt) -
            Math.floor(Math.random() * 30000) * 1000
          ).toString(),
        };
        dummyRoungePosts.push(newRoungePost);
      }
    }
    return dummyRoungePosts;
  };
  const dummyTopicPosts = generateTenTopicPosts();
  const dummyRoungePosts = generateTenRoungePosts();
  const dummyPosts: Array<TopicPost | RoungePost> = []; // 배열복사
  switch (list) {
    case 'timeline':
      dummyPosts.push(...generateTenTopicPosts());
      for (let i = 0; i < 10; i++) {
        dummyPosts.splice(
          Math.floor(Math.random() * 10),
          0,
          dummyRoungePosts[i],
        );
      }
      break;
    case 'topic':
      dummyPosts.push(...generateTenTopicPosts());
      const newDummyTopicPosts = generateTenTopicPosts();
      for (let i = 0; i < 10; i++) {
        dummyPosts.splice(
          Math.floor(Math.random() * 10),
          0,
          newDummyTopicPosts[i],
        );
      }
      break;
    default:
      dummyPosts.push(...generateTenRoungePosts());
      const newDummyRoungePosts = generateTenRoungePosts();
      for (let i = 0; i < 10; i++) {
        dummyPosts.splice(
          Math.floor(Math.random() * 10),
          0,
          newDummyRoungePosts[i],
        );
      }
      break;
  }

  // console.log(lastIndex);
  return { result: dummyPosts, nextPage: pageParam + 1 };
};

export const searchInfiniteFunction = async (
  searchValue: string,
  pageParam: number,
) => {
  const value = searchValue;
  // console.log(searchValue, pageParam);
  if (!value) {
    return { result: [], nextPage: 1 };
  }
  // await delay(800);
  const dummyRoungePost: RoungePost = {
    postId: 'r8q394uf90q23urq89pd3oil',
    postType: 'rounge',
    rounge: { title: '외식·음료', url: 'food-service' },
    title: '라운지 글 제목',
    content:
      `전달된 pageParam은 ${pageParam} ` +
      searchValue +
      '블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 ',
    commentsCount: Math.floor(Math.random() * 5),
    author: { nickname: '닉네임', jobSector: '외식·음료' },
    likeCount: Math.floor(Math.random() * 5),
    createdAt: Date.now().toString(),
    images: [],
  };
  const dummyTopicPost: TopicPost = {
    postId: 'r8qur390wjfioajwfeio394uf90q23urq89pd3oil',
    postType: 'topic',
    topic: { title: '블라블라', url: 'blabla' },
    title: '토픽 글 제목',
    content:
      `전달된 pageParam은 ${pageParam} ` +
      searchValue +
      '블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 블라블라 ',
    commentsCount: Math.floor(Math.random() * 5),
    author: { nickname: '닉네임', jobSector: '외식·음료' },
    likeCount: Math.floor(Math.random() * 5),
    createdAt: Date.now().toString(),
    images: [],
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
