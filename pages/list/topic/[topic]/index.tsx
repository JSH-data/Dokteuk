import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function TopicPage() {
  const router = useRouter();
  const [asPath, setAsPath] = useState('');
  useEffect(() => {
    setAsPath(router.asPath);
  }, [router]);
  return (
    <div>
      <div>asPath:{asPath}</div>
      <br />
      <div>topic의 indexPage</div>
    </div>
  );
}
