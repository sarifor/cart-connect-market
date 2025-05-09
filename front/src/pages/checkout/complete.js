import { useEffect } from 'react';
import CommonLayout from '../../components/CommonLayout';
import { cartResetState } from '../../reducers/cart.js';
import { checkoutResetState } from '../../reducers/checkout.js';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

const CheckoutComplete = () => {
  const { me } = useSelector(state => state.member);
  const { checkoutDone } = useSelector(state => state.checkout);

  const dispatch = useDispatch();
  const router = useRouter();
  
  useEffect(() => {
    if (!me) {
      setTimeout(() => {
        router.replace("/");
      }, 2000);
    }
  }, [me]);

  useEffect(() => {
    if (!checkoutDone) {
      setTimeout(() => {
        router.replace("/");
      }, 2000);
    }
  }, [checkoutDone]);

  const handleResetClick = () => {
    dispatch(cartResetState());
    dispatch(checkoutResetState());
  };

  return (
    <CommonLayout title="주문 완료">
      <div style={{ 
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
      }}>
        { !me ? (
          <div style={{ display: "flex", flexDirection: "column", rowGap: "10px" }}>
            <div>로그인을 먼저 해 주세요.</div>
            <div>2초 뒤 홈 화면으로 이동합니다.</div>
          </div>
        ) : (
          <>
            { checkoutDone ? (
              <div style={{ display: "flex", flexDirection: "column", rowGap: "10px" }}>
                <div>주문이 확정되었습니다. 감사합니다.</div>
                <div style={{ display: "flex", flexDirection: "column", rowGap: "10px", marginTop: "16px" }}>
                  <Link href={"/member/orderhistory"} onClick={handleResetClick}>최근 주문 확인하기</Link>
                  <Link href={"/"} onClick={handleResetClick}>홈 화면으로 돌아가기</Link>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", rowGap: "10px" }}>
                <div>유효하지 않은 접근입니다.</div>
                <div>2초 뒤 홈 화면으로 이동합니다.</div>
              </div>
            )}
          </>
        )}
      </div>
    </CommonLayout>
  );
};

export default CheckoutComplete;