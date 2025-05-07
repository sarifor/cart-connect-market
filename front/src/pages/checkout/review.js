import { useEffect } from 'react';
import CommonLayout from '../../components/CommonLayout';
import ReviewItemList from '../../components/checkout/ReviewItemList.js';
import ReviewSummary from '../../components/checkout/ReviewSummary.js';
import { Col } from 'antd';
import { loadCartItemsRequest } from '../../reducers/cart.js';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

const CheckoutReview = () => {
  const { 
    loadCartItemsLoading,
    loadCartItemsDone,
    loadCartItemsError,
    cartItems,
  } = useSelector(state => state.cart);

  const {
    shippingAddresses,
    selectedDeliveryDate, 
    selectedDeliveryTime, 
    selectedPayment, 
  } = useSelector(state => state.checkout);

  const { me } = useSelector(state => state.member);
  const router = useRouter();
  
  const itemPriceTotal = cartItems.reduce((acc, cur) => acc + (cur.Product.price * cur.quantity), 0);
  const itemQuantityTotal = cartItems.reduce((acc, cur) => acc + (cur.quantity), 0); 
  const shippingFee = itemPriceTotal > 2000 ? 0 : 200;
  const tax = Math.round(itemPriceTotal * 0.1);
  const finalTotal = itemPriceTotal + shippingFee + tax;

  const dispatch = useDispatch();
  
  useEffect(() => {
    if (me) {
      dispatch(loadCartItemsRequest());
    }
  }, [me]);

  useEffect(() => {
    if (!me) {
      router.replace("/");
    }
  }, [me]);

  const handleOrderClick = () => {
    // 배송 주소가 없다면
    if (!shippingAddresses[0]) {
      alert("배송 주소가 없으므로 주문을 진행할 수 없습니다.");
      return;
    }

    // 배송 날짜 선택이 없다면
    if (!selectedDeliveryDate) {
      alert("배송 날짜 선택 값이 없으므로 주문을 진행할 수 없습니다.");
      return;
    }

    // 배송 시간대 선택이 없다면
    if (!selectedDeliveryTime) {
      alert("배송 시간대 선택 값이 없으므로 주문을 진행할 수 없습니다.");
      return;
    }

    // 결제 방법 선택이 없다면
    if (!selectedPayment) {
      alert("결제 방법 선택값이 없으므로 주문을 진행할 수 없습니다.");
      return;
    }

    // 장바구니에 상품이 0개라면
    if (cartItems && cartItems.length === 0) {
      alert("장바구니에 상품이 없으므로 주문을 진행할 수 없습니다.");
      return;
    }

    // 위의 경우들이 아니면
    console.log(`
      배송 주소: ${JSON.stringify(shippingAddresses?.[0], null, 2)}, 
      배송 날짜: ${selectedDeliveryDate}, 
      배송 시간대: ${selectedDeliveryTime}, 
      결제 방법: ${selectedPayment}
    `);
  };

  return (
    <CommonLayout title="주문 확인">
      <>
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

            {/* 배송 주소 */}            
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ borderBottom: "1px solid black" }}>
                <div style={{ fontWeight: "bold", padding: "10px" }}>
                  배송 주소
                </div>
              </div>

              <div>
                <div style={{ display: "flex", flexDirection: "column", padding: "10px", rowGap: "10px" }}>
                  {shippingAddresses?.length > 0 ? (
                    <>
                      <div>
                        {shippingAddresses[0].receiver}
                      </div>

                      <div>
                        {shippingAddresses[0].postcode}
                      </div>
                      
                      <div>
                        {shippingAddresses[0].address}
                      </div>                    
                    </>
                  ):(
                    <div>
                      주소가 존재하지 않습니다.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 배송 일시 */}
            <div style={{ display: "flex", flexDirection: "column", marginTop: "16px" }}>
              <div style={{ borderBottom: "1px solid black" }}>
                <div style={{ fontWeight: "bold", padding: "10px" }}>
                  배송 일시
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", padding: "10px", rowGap: "10px" }}>
                {selectedDeliveryDate ? (
                  <div>
                    {selectedDeliveryDate}
                  </div>
                ) : (
                  <div>
                    배송 날짜 선택 값이 존재하지 않습니다.
                  </div>
                )}

                {selectedDeliveryTime ? (
                  <div>
                    {selectedDeliveryTime}
                  </div>
                ) : (
                  <div>
                    배송 시간대 선택 값이 존재하지 않습니다.
                  </div>
                )}
              </div>
            </div>

            {/* 주문 상품 */}
            <div style={{ display: "flex", flexDirection: "column", marginTop: "16px" }}>
              <div style={{ borderBottom: "1px solid black" }}>
                <div style={{ fontWeight: "bold", padding: "10px" }}>
                  주문 상품
                </div>
              </div>

              {(loadCartItemsLoading && !loadCartItemsDone) && (
                <div style={{ padding: "10px" }}>
                  장바구니 상세 정보 로딩 중...
                </div>                
              )}

              {(loadCartItemsDone && (cartItems.length === 0)) && (
                <div style={{ padding: "10px" }}>
                  장바구니가 비어 있습니다.
                </div>                
              )}

              {(loadCartItemsDone && (cartItems.length > 0)) && (
                cartItems.map(item => (
                  <ReviewItemList item={item} />
                ))          
              )}

              {(!loadCartItemsDone && loadCartItemsError) && (
                <div style={{ padding: "10px" }}>
                  장바구니를 불러 오는 과정에서 에러가 발생하였습니다: {loadCartItemsError}
                </div>
              )}
            </div>

            {/* 결제 방법 */}
            <div style={{ display: "flex", flexDirection: "column", marginTop: "16px" }}>
              <div style={{ borderBottom: "1px solid black" }}>
                <div style={{ fontWeight: "bold", padding: "10px" }}>
                  결제 방법
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", padding: "10px", rowGap: "10px" }}>
                {selectedPayment ? (
                  <div>
                    {selectedPayment}
                  </div>
                ) : (
                  <div>
                    결제 방법 선택값이 존재하지 않습니다.
                  </div>
                )}
              </div>
            </div>

          </div>
        </Col>

        <Col md={8} style={{ backgroundColor: "green" }}>
          <ReviewSummary
            itemPriceTotal={itemPriceTotal}
            itemQuantityTotal={itemQuantityTotal}
            shippingFee={shippingFee}
            tax={tax}
            finalTotal={finalTotal}
            handleOrderClick={handleOrderClick}
          />        
        </Col>
      </>
    </CommonLayout>
  );
};

export default CheckoutReview;