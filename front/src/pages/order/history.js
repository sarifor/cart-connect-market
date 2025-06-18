import { useEffect, useRef } from 'react';
import CommonLayout from '../../components/CommonLayout';
import OrderList from '../../components/order/OrderList';
import { Col, Button } from 'antd';
import { loadOrdersRequest } from '../../reducers/order.js';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

const OrderHistory = () => {
  const { 
    loadOrdersLoading,
    loadOrdersDone,
    loadOrdersError,
    orders,
  } = useSelector(state => state.order);

  const { me } = useSelector(state => state.member);

  const router = useRouter();
  const dispatch = useDispatch();
  const dispatched = useRef(false);

  useEffect(() => {
    if (!dispatched.current && me) {
      dispatched.current = true;
      dispatch(loadOrdersRequest());
    }
  }, [me]);

  useEffect(() => {
    if (!me) {
      setTimeout(() => {
        router.replace("/");
      }, 2000);
    }
  }, [me]);

  const handleGoBackClick = () => {
    router.back();
  };

  // 주문을 연-월 단위로 그룹화
  const groupedOrders = orders.reduce((acc, eachOrder) => {
    // 주문 일자를 날짜 객체로 바꿈
    const date = new Date(eachOrder.created_at);

    // 주문일자에서 '연-월' 추출하고, acc 객체에 같은 이름의 키가 없다면 만들고 빈 배열을 할당
    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1)}`;
    
    if (!acc[yearMonth]) {
      acc[yearMonth] = [];
    }

    // '연-월' 키의 배열에 주문 추가
    acc[yearMonth].push(eachOrder);

    return acc;
  }, {});
  
  return (
    <CommonLayout title="注文履歴">
      <Col md={16} style={{ backgroundColor: "orange" }}>
        <div 
          style={{ 
            display: "flex", 
            flexDirection: "column",
            maxWidth: 600,
            width: '100%',
            padding: "20px"
          }}
        >

          {/* 비로그인 사용자면 */}
          { !me ? (
            <div style={{ padding: "10px" }}>ログインしてください。</div>

          // 회원이고, loadOrdersLoading true, loadOrdersDone false면,
          ) : loadOrdersLoading && !loadOrdersDone ? (
            <div style={{ padding: "10px" }}>注文履歴を読み込み中...</div>

          // 회원이고, loadOrdersDone false이고, loadOrdersError면
          ) : !loadOrdersDone && loadOrdersError ? (
            <>
              <div style={{ padding: "10px" }}>
                注文履歴を読み込めませんでした。
              </div>
              <div style={{ padding: "10px" }}>
                <Button type="primary" style={{ width: '100px' }} onClick={handleGoBackClick} >
                  戻る
                </Button>
              </div>
            </>

          // 회원이고, loadOrdersDone true이고, 주문 이력이 없으면(0개)
          ) : loadOrdersDone && orders && orders.length === 0 ? (
            <>
              <div style={{ padding: "10px" }}>
                注文履歴がありません。
              </div>
              <div style={{ padding: "10px" }}>
                <Button type="primary" style={{ width: '100px' }} onClick={handleGoBackClick} >
                  戻る
                </Button>
              </div>
            </>

          // 회원이고, loadOrdersDone true이고, 주문 이력이 1개 이상 있으면
          ) : loadOrdersDone && orders && orders.length > 0 ? (
            <>
              {/* 연-월별 구분 ('연-월 문자열'끼리 비교하여 내림차순 정렬) */}
              {Object.entries(groupedOrders).toSorted((a, b) => b[0].localeCompare(a[0])).map(([yearMonth, ordersInMonth]) => (
                <div key={yearMonth} style={{ display: "flex", flexDirection: "column" }}>

                  {/* 연-월 제목 */}
                  <div style={{ borderBottom: "1px solid black" }}>
                    <div style={{ fontWeight: "bold", padding: "10px" }}>
                      {yearMonth.split('-')[0]}年{yearMonth.split('-')[1]}月
                    </div>
                  </div>

                  {/* 월별 주문 목록 */}
                  {ordersInMonth.toSorted((a, b) => new Date(b.created_at) - new Date(a.created_at)).map(order => (
                    <OrderList key={order.order_id} order={order} />
                  ))}

                </div>
              ))}

              <div style={{ padding: "10px" }}>
                <Button type="primary" style={{ width: '100px' }} onClick={handleGoBackClick} >
                  戻る
                </Button>
              </div>
            </>
          ) : null}

        </div>
      </Col>
    </CommonLayout>
  )
};

export default OrderHistory;