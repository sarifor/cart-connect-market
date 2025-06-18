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
      console.log("カートの最新状態：", cartItems);
    }
  }, [cartItems]);

  useEffect(() => {
    if (addToCartLoading) {
      setCartActionMessage('1個追加中...');
    } 
    
    if (addToCartDone) {
      setCartActionMessage("1個追加しました。");
    } 
    
    if (addToCartError) {
      setCartActionMessage('1個追加に失敗しました。');
    } 
    
    if (decrementCartLoading) {
      setCartActionMessage("1個削除中...");
    } 
    
    if (decrementCartDone) {
      setCartActionMessage("1個削除しました。");
    } 
    
    if (decrementCartError) {
      setCartActionMessage('1個削除に失敗しました。')
    }

    if (deleteCartLoading) {
      setCartActionMessage("商品を削除中...");
    } 
    
    if (deleteCartDone) {
      setCartActionMessage("商品を削除しました。");
    } 
    
    if (deleteCartError) {
      setCartActionMessage('商品の削除に失敗しました。')
    }    
  }, [addToCartLoading, addToCartDone, addToCartError, decrementCartLoading, decrementCartDone, decrementCartError, deleteCartLoading, deleteCartDone, deleteCartError]);

  // Q. 레이아웃 설정은 개별 컴포넌트에서 관리? (Col md={16}, div style={{ display: flex ... 등)
  if (!me) {
    return <CommonLayout title="カート">
      <div style={{ width: "100%", padding: "30px" }}>
        カートを確認するにはログインが必要です。
      </div>
    </CommonLayout>
  } else if (loadCartItemsLoading) {
    return <CommonLayout title="カート">
      <div style={{ width: "100%", padding: "30px" }}>
        カートの情報を読み込み中...
      </div>
    </CommonLayout>
  } else if (loadCartItemsDone && (cartItems.length === 0)) {
    return <CommonLayout title="カート">
      <div style={{ width: "100%", padding: "30px" }}>
        カートは空です。
      </div>
    </CommonLayout>  
  } else if (loadCartItemsDone && cartItems) {
    return <CommonLayout title="カート">
      <>
        <Col md={16}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {cartItems.map(item => (
              <ItemList item={item} />
            ))}
          </div>
        </Col>
        <Col md={8}>
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
    return <CommonLayout title="カート">
      <div style={{ width: "100%", padding: "30px" }}>
        カートの読み込み中にエラーが発生しました。
      </div>
    </CommonLayout>    
  }
};

export default Cart;