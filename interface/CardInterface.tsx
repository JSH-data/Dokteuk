export interface PostAuthor {
  nickname: string;
  jobSector: string;
}
export interface RoungePost {
  postId: string;
  postType: 'rounge';
  rounge: string;
  title: string;
  content: string;
  author: PostAuthor;
  commentsCount: number;
  likeCount: number;
  createdAt: string;
}
export interface TopicPost {
  postId: string;
  postType: 'topic';
  topic: string;
  title: string;
  content: string;
  author: PostAuthor;
  commentsCount: number;
  likeCount: number;
  createdAt: string;
}
