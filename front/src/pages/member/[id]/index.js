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
    <CommonLayout title="マイページ">
      <div 
        style={{ 
          display: "flex", 
          flexDirection: "column", 
          padding: "20px",
          rowGap: "10px"
        }}
      >
        <Link href={`/member/${memberId}/profile`}>会員情報</Link>
        <Link href={"/order/history"}>注文履歴</Link>
      </div>
    </CommonLayout>
  );
};

export default MyPage;