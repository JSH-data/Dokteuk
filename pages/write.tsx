import PostForm from '@components/write/PostForm';

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
