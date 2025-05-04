import { useEffect } from 'react';
import CommonLayout from '../../components/CommonLayout';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

const CheckoutComplete = () => {
  const { me } = useSelector(state => state.member);
  const router = useRouter();
  
  useEffect(() => {
    if (!me) {
      router.replace("/");
    }
  }, [me]);

  return (
    <CommonLayout title="주문 메인">
      <div>
        주문 완료 화면이에요!
      </div>
    </CommonLayout>
  );
};

export default CheckoutComplete;