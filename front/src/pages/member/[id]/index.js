import { useEffect } from 'react';
import CommonLayout from '../../../components/CommonLayout';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

const MyPage = () => {
  const { me } = useSelector(state => state.member);
  let memberId;

  if (me) {
    memberId = me.member_id;
  }

  const router = useRouter();
  
  useEffect(() => {
    if (!me) {
      router.replace("/");
    }
  }, [me]);

  return (
    <CommonLayout title="마이 페이지">
      <div>
        <Link href={`/member/${memberId}/profile`}>회원 정보</Link><br />
        주문 이력
      </div>
    </CommonLayout>
  );
};

export default MyPage;