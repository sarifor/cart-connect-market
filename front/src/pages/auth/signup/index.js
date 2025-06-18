import { useState, useEffect } from 'react';
import CommonLayout from '../../../components/CommonLayout';
import Link from 'next/link';
import { useSelector } from 'react-redux';

const Signup = () => {
  const { me } = useSelector(state => state.member);

  useEffect(() => {
    if (me) {
      router.push("/");
    }
  }, [me]);

  // Q. <div> 안에서 <br />를 쓰니 줄바꿈이 되는 이유?
  // A. <p>는 줄바꿈을 자체 포함해서 <br />가 무시되기 쉽지만, <div> 안에선 <Link>가 인라인처럼 작동해 <br />로 줄바꿈이 제대로 적용돼요 (ChatGPT)
  return (
    <CommonLayout title="会員登録">
      <div>
        <Link href="/auth/signup/email">メールアドレスで会員登録</Link><br />
        <Link href="/auth/signup/google">Googleアカウントで会員登録</Link>
      </div>
    </CommonLayout>
  );
};

export default Signup;