import PostForm from '../components/post/postForm';

export interface ChildProps {
  postsProps: any;
}

export default function Write({ postsProps }: ChildProps) {
  return (
    <>
      <PostForm />
    </>
  );
}
