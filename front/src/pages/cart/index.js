import React, { useEffect, useState } from 'react';
import CommonLayout from '../../components/CommonLayout.js';
import ItemList from '../../components/cart/ItemList.js';
import Summary from '../../components/cart/Summary.js';
import { Col } from 'antd';
import { loadCartItemsRequest } from '../../reducers/cart.js';
import { useSelector, useDispatch } from 'react-redux';

const Cart = () => {
  const { me } = useSelector(state => state.member);

  // Q. 개별 상품 페이지에서 장바구니에 상품을 추가하고 장바구니 페이지로 오면, 이미 addToCartDone인 탓에 [+] 버튼을 누르기도 전에 '상품 추가 완료'와 같은 메시지가 보일 때가 있다. 이를 해결하려면?
  // A. cart 리듀서에 reset 액션을 추가한다. Cart 컴포넌트에서는 장바구니 불러오기 전에 reset 액션을 dispatch한다. 이러면 추가/감소/삭제 상태가 페이지 진입 시마다 초기화된다. (ChatGPT)
  const { 
    loadCartItemsLoading,
    loadCartItemsDone,
    loadCartItemsError,
    addToCartLoading,
    addToCartDone,
    addToCartError,
    decrementCartLoading,
    decrementCartDone,
    decrementCartError,
    deleteCartLoading,
    deleteCartDone,
    deleteCartError,
    cartItems,
  } = useSelector(state => state.cart);

  const [cartActionMessage, setCartActionMessage] = useState('');

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
    if (cartItems) {
      console.log("장바구니 최신 상태: ", cartItems);
    }
  }, [cartItems]);

  useEffect(() => {
    if (addToCartLoading) {
      setCartActionMessage(`1개 더 추가 중...`);
    } 
    
    if (addToCartDone) {
      setCartActionMessage("1개 더 추가 완료");
    } 
    
    if (addToCartError) {
      setCartActionMessage(`1개 더 추가하기에 실패하였습니다: ${addToCartError}`);
    } 
    
    if (decrementCartLoading) {
      setCartActionMessage("1개 제외 중...");
    } 
    
    if (decrementCartDone) {
      setCartActionMessage("1개 제외 완료");
    } 
    
    if (decrementCartError) {
      setCartActionMessage(`1개 제외시키기에 실패하였습니다: ${decrementCartError}`)
    }

    if (deleteCartLoading) {
      setCartActionMessage("상품 삭제 중...");
    } 
    
    if (deleteCartDone) {
      setCartActionMessage("상품 삭제 완료");
    } 
    
    if (deleteCartError) {
      setCartActionMessage(`상품 삭제에 실패하였습니다: ${deleteCartError}`)
    }    
  }, [addToCartLoading, addToCartDone, addToCartError, decrementCartLoading, decrementCartDone, decrementCartError, deleteCartLoading, deleteCartDone, deleteCartError]);

  // Q. 레이아웃 설정은 개별 컴포넌트에서 관리? (Col md={16}, div style={{ display: flex ... 등)
  if (!me) {
    return <CommonLayout title="장바구니">
      <div style={{ width: "100%", backgroundColor: "pink" }}>
        장바구니를 확인하려면 로그인을 해 주세요.
      </div>
    </CommonLayout>
  } else if (loadCartItemsLoading) {
    return <CommonLayout title="장바구니">
      <div style={{ width: "100%", backgroundColor: "pink" }}>
      장바구니 상세 정보 로딩 중...
      </div>
    </CommonLayout>
  } else if (loadCartItemsDone && (cartItems.length === 0)) {
    return <CommonLayout title="장바구니">
      <div style={{ width: "100%", backgroundColor: "pink" }}>
      장바구니가 비어 있습니다.
      </div>
    </CommonLayout>  
  } else if (loadCartItemsDone && cartItems) {
    return <CommonLayout title="장바구니">
      <>
        <Col md={16} style={{ backgroundColor: "orange" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {cartItems.map(item => (
              <ItemList item={item} />
            ))}
          </div>
        </Col>
        <Col md={8} style={{ backgroundColor: "green" }}>
          <Summary 
            itemPriceTotal={itemPriceTotal}
            itemQuantityTotal={itemQuantityTotal}
            shippingFee={shippingFee}
            tax={tax}
            finalTotal={finalTotal}
            cartActionMessage={cartActionMessage}
          />
        </Col>
      </>
    </CommonLayout>    
  } else if (!loadCartItemsDone && loadCartItemsError) {
    return <CommonLayout title="장바구니">
      <div style={{ width: "100%", backgroundColor: "pink" }}>
        장바구니를 불러 오는 과정에서 에러가 발생하였습니다: {loadCartItemsError}
      </div>
    </CommonLayout>    
  }
};

export default Cart;