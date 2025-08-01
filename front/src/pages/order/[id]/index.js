import { useEffect, useRef } from 'react';
import CommonLayout from '../../../components/CommonLayout';
import OrderDetailList from '../../../components/order/OrderDetailList';
import OrderDetailSummary from '../../../components/order/OrderDetailSummary';
import { Col, Button } from 'antd';
import { loadOrderDetailRequest, resetOrderState } from '../../../reducers/order.js';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

const OrderDetail = () => {
  const { 
    loadOrderDetailLoading,
    loadOrderDetailDone,
    loadOrderDetailError,
    orderDetail,
  } = useSelector(state => state.order);

  const { me } = useSelector(state => state.member);

  const router = useRouter();
  const dispatch = useDispatch();
  const dispatched = useRef(false);

  const orderId = router.query.id;

  useEffect(() => {
    if (!dispatched.current && me && orderId) {
      dispatched.current = true;

      dispatch({
        type: loadOrderDetailRequest.type,
        data: { orderId: orderId },
      });
    }
  }, [me, orderId]);

  // Q. useEffect 클린업 함수로 resetOrderState 할까?
  const handleOrderHistoryClick = () => {
    router.push(`/order/history`).then(() => {
      dispatch(resetOrderState());
    })
  };

  const handleHomeClick = () => {
    router.push("/");
  };

  return (
    <CommonLayout title="注文情報">
      <>
        <Col md={16}>
          <div 
            style={{ 
              display: "flex", 
              flexDirection: "column",
              maxWidth: 600,
              width: '100%',
              padding: "20px"
            }}
          >

            {/* 비회원이면 */}
            {/* Q. 로그인을 했는데도, http://localhost:3000/order/9와 같은 주소로 직접 주문 상세 정보 페이지를 조회하면 순간 '로그인을 해 주세요'가 보임. 이걸 막으려면? */}
            { !me ? (
              <>
                <div style={{ padding: "10px" }}>
                  ログインしてください。
                </div>
                <div style={{ padding: "10px" }}>
                  <Button type="primary" style={{ width: '100px' }} onClick={handleHomeClick} >
                    ホーム画面に戻る
                  </Button>
                </div>
              </>

            // 회원이고, 데이터는 로딩 중이고, 아직 도착하지 않았다면,
            ) : loadOrderDetailLoading && !loadOrderDetailDone ? (
              <div style={{ padding: "10px" }}>
                注文情報を読み込み中...
              </div>

            // 회원이고, 데이터는 아직 도착하지 않았고, 에러가 났다면,
            ) : !loadOrderDetailDone && loadOrderDetailError ? (
              <>
                <div style={{ padding: "10px" }}>
                  注文情報が存在しないか、読み込めませんでした。
                </div>
                <div style={{ padding: "10px" }}>
                  <Button type="primary" style={{ width: '100px' }} onClick={handleOrderHistoryClick} >
                    一覧へ戻る
                  </Button>
                </div>
              </>

            // 회원이고, 데이터는 도착했는데, 주문 상세 정보가 없으면(0개),
            ) : loadOrderDetailDone && orderDetail.OrderDetails && orderDetail.OrderDetails.length === 0 ? (
              <>
                <div style={{ padding: "10px" }}>
                  注文情報が存在しません。
                </div>
                <div style={{ padding: "10px" }}>
                  <Button type="primary" style={{ width: '100px' }} onClick={handleOrderHistoryClick} >
                    一覧へ戻る
                  </Button>
                </div>
              </>

            // 회원이고, 데이터는 도착했고, 주문 상세 정보가 있으면(1개 이상),          
            ) : loadOrderDetailDone && orderDetail.OrderDetails && orderDetail.OrderDetails.length > 0 ? (
              orderDetail.OrderDetails.map(detail => (
                <OrderDetailList detail={detail} />
              ))
            ) : null}

          </div>
        </Col>

        {/* 회원이고, 데이터는 도착했고, 주문 상세 정보가 있으면(1개 이상), */}
        { loadOrderDetailDone && orderDetail.OrderDetails && orderDetail.OrderDetails.length > 0 ? (
          <Col md={8}>
            <OrderDetailSummary
              itemQuantityTotal={orderDetail.itemQuantityTotal}
              itemPriceTotal={orderDetail.itemPriceTotal}
              tax={orderDetail.tax}
              shippingFee={orderDetail.shipping_fee}
              payment={orderDetail.payment}
              finalTotal={orderDetail.total}
              handleOrderHistoryClick={handleOrderHistoryClick}
            />
          </Col>
        ) : null}
      </>
    </CommonLayout>
  );
};

export default OrderDetail;