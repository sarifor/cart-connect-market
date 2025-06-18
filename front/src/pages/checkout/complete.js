import { useEffect } from 'react';
import CommonLayout from '../../components/CommonLayout';
import { Button } from 'antd';
import { resetCartState } from '../../reducers/cart.js';
import { resetCheckoutState } from '../../reducers/checkout.js';
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

  const handleOrderHistoryClick = () => {
    router.push("/order/history").then(() => {
      dispatch(resetCartState());
      dispatch(resetCheckoutState());
    })
  };

  const handleHomeClick = () => {
    router.push("/").then(() => {
      dispatch(resetCartState());
      dispatch(resetCheckoutState());
    })
  };

  return (
    <CommonLayout title="注文完了">
      <div style={{ 
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
      }}>
        { !me ? (
          <div style={{ display: "flex", flexDirection: "column", rowGap: "10px" }}>
            <div>ログインしてください。</div>
            <div>2秒後、ホーム画面に移動します。</div>
          </div>
        ) : (
          <>
            { checkoutDone ? (
              <div style={{ display: "flex", flexDirection: "column", rowGap: "10px" }}>
                <div>ご注文が確定しました。ありがとうございます。</div>
                <div style={{ display: "flex", flexDirection: "column", rowGap: "10px", marginTop: "16px" }}>
                  <Button onClick={handleOrderHistoryClick}>最近の注文を確認する</Button>
                  <Button onClick={handleHomeClick}>ホーム画面に戻る</Button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", rowGap: "10px" }}>
                <div>無効なアクセスです。</div>
                <div>2秒後、ホーム画面に移動します。</div>
              </div>
            )}
          </>
        )}
      </div>
    </CommonLayout>
  );
};

export default CheckoutComplete;