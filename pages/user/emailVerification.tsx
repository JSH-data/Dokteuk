import React from 'react';
import Link from 'next/link';

export default function EmailVerification() {
  return (
    <>
      <div>이메일 인증 완료</div>
      <button>
        <Link href="/user/login">로그인하기</Link>
      </button>
      <button>
        <Link href="/">메인으로 가기</Link>
      </button>
    </>
  );
}
