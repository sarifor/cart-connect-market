import { useEffect, useRef } from 'react';
import CommonLayout from '../../components/CommonLayout';
import { checkoutRequest } from '../../reducers/checkout.js';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

const CheckoutProcessing = () => {
  const {
    checkoutLoading,
    checkoutDone,
    checkoutError,
    shippingAddresses,
    selectedDeliveryDate, 
    selectedDeliveryTime, 
    selectedPayment, 
  } = useSelector(state => state.checkout);

  const { me } = useSelector(state => state.member);

  const dispatch = useDispatch();
  const router = useRouter();
  const dispatched = useRef(false);

  useEffect(() => {
    if (!dispatched.current && me && shippingAddresses?.length > 0 && selectedDeliveryDate && selectedDeliveryTime && selectedPayment) {
      dispatched.current = true;

      dispatch({
        type: checkoutRequest.type,
        data: {
          shippingAddress: shippingAddresses[0],
          selectedDeliveryDate,
          selectedDeliveryTime,
          selectedPayment,
        }
      });
    }
  }, [me, shippingAddresses, selectedDeliveryDate, selectedDeliveryTime, selectedPayment]);

  useEffect(() => {
    if (!me) {
      setTimeout(() => {
        router.replace("/");
      }, 2000);
    }
  }, [me]);

  useEffect(() => {
    if (checkoutDone) {
      setTimeout(() => {
        router.replace("/checkout/complete");
      }, 2000);
    }    
  }, [checkoutDone]);

  // Q. 스크롤이 생기지 않게 하려면?
  // Q. 상태 메시지를 왼쪽 위에 표시되게 하는 걸로 바꿀까?
  return (
    <CommonLayout title="注文処理中">
      <div style={{ 
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
      }}>
        { !me && (
          <div>ログインしてください。</div>  
        )}

        { checkoutLoading && (
          <div>処理中...</div>
        )}
        
        { checkoutDone && (
          <div>注文処理が完了しました。まもなく完了ページに移動します。</div>
        )}

        { checkoutError && (
          <div style={{ display: "flex", flexDirection: "column", rowGap: "10px" }}>
            <div>注文処理中にエラーが発生しました。</div>
            <div>ご不便をおかけして申し訳ございません。次のメールアドレスまでご連絡ください：iread1q84@gmail.com</div>
            <div style={{ marginTop: "16px" }}>
              <Link href={"/"}>ホーム画面に戻る</Link>              
            </div>
          </div>
        )}
      </div>
    </CommonLayout>
  );
};

export default CheckoutProcessing;