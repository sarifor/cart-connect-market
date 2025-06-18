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
      alert("配送先住所が登録されていないため、注文を進めることができません。");
      return;
    }

    // 배송 날짜 선택이 없다면
    if (!selectedDeliveryDate) {
      alert("配送希望日が選択されていないため、注文を進めることができません。");
      return;
    }

    // 배송 시간대 선택이 없다면
    if (!selectedDeliveryTime) {
      alert("配送希望時間帯が選択されていないため、注文を進めることができません。");
      return;
    }

    // 결제 방법 선택이 없다면
    if (!selectedPayment) {
      alert("お支払い方法が選択されていないため、注文を進めることができません。");
      return;
    }

    // 장바구니에 상품이 0개라면
    if (cartItems && cartItems.length === 0) {
      alert("カートに商品が入っていないため、注文を進めることができません。");
      return;
    }

    // 위의 경우들이 아니면
    router.push('/checkout/processing');
  };

  return (
    <CommonLayout title="注文確認">
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
                  配送先住所
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
                      配送先住所が登録されていません。
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 배송 일시 */}
            <div style={{ display: "flex", flexDirection: "column", marginTop: "16px" }}>
              <div style={{ borderBottom: "1px solid black" }}>
                <div style={{ fontWeight: "bold", padding: "10px" }}>
                  配送日時
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", padding: "10px", rowGap: "10px" }}>
                {selectedDeliveryDate ? (
                  <div>
                    {selectedDeliveryDate}
                  </div>
                ) : (
                  <div>
                    配送希望日が選択されていません。
                  </div>
                )}

                {selectedDeliveryTime ? (
                  <div>
                    {selectedDeliveryTime}
                  </div>
                ) : (
                  <div>
                    配送希望時間帯が選択されていません。
                  </div>
                )}
              </div>
            </div>

            {/* 주문 상품 */}
            <div style={{ display: "flex", flexDirection: "column", marginTop: "16px" }}>
              <div style={{ borderBottom: "1px solid black" }}>
                <div style={{ fontWeight: "bold", padding: "10px" }}>
                  注文商品
                </div>
              </div>

              {(loadCartItemsLoading && !loadCartItemsDone) && (
                <div style={{ padding: "10px" }}>
                  カートの情報を読み込み中...
                </div>                
              )}

              {(loadCartItemsDone && (cartItems.length === 0)) && (
                <div style={{ padding: "10px" }}>
                  カートが空です。
                </div>                
              )}

              {(loadCartItemsDone && (cartItems.length > 0)) && (
                cartItems.map(item => (
                  <ReviewItemList item={item} />
                ))          
              )}

              {(!loadCartItemsDone && loadCartItemsError) && (
                <div style={{ padding: "10px" }}>
                  カート情報の取得中にエラーが発生しました。
                </div>
              )}
            </div>

            {/* 결제 방법 */}
            <div style={{ display: "flex", flexDirection: "column", marginTop: "16px" }}>
              <div style={{ borderBottom: "1px solid black" }}>
                <div style={{ fontWeight: "bold", padding: "10px" }}>
                  お支払い方法
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", padding: "10px", rowGap: "10px" }}>
                {selectedPayment ? (
                  <div>
                    {selectedPayment}
                  </div>
                ) : (
                  <div>
                    お支払い方法が選択されていません。
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