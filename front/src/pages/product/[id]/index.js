import React, { useState, useEffect } from 'react';
import CommonLayout from '../../../components/CommonLayout';
import { Col, Button } from 'antd';
import { loadProductDetailRequest } from '../../../reducers/product';
import { loadCartItemsRequest, addToCartRequest } from '../../../reducers/cart';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

const ProductDetail = () => {
  const { me } = useSelector(state => state.member);

  const { 
    loadProductDetailLoading, 
    loadProductDetailDone, 
    loadProductDetailError, 
    productDetail 
  } = useSelector(state => state.product);

  const { 
    loadCartItemsLoading,
    loadCartItemsDone,
    loadCartItemsError,
    addToCartLoading,
    addToCartDone,
    addToCartError,
    cartItems,
  } = useSelector(state => state.cart);

  const [quantity, setQuantity] = useState(1);
  
  const [cartActionMessage, setCartActionMessage] = useState('');

  const dispatch = useDispatch();
  const router = useRouter();
  const productId = router.query.id;

  let cartStatusMessage = null;
    
  useEffect(() => {
    if (productId) {
      dispatch({
        type: loadProductDetailRequest.type,
        data: { productId: productId },
      });
    } else {
      console.log("No product detail data");
    }
  }, [productId]);

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

  const handleAddClick = () => {
    if (!me) {
      setCartActionMessage("ログインが必要です。ログインしてからご利用ください。");
    } else {
      dispatch({
        type: addToCartRequest.type,
        data: { 
          productId: productId,
          quantity: quantity,
        }
      });
    }
  };

  useEffect(() => {
    if (addToCartLoading) {
      setCartActionMessage("カートに追加中...");
    } else if (addToCartDone) {
      setCartActionMessage("カートに追加しました。");
    } else if (addToCartError) {
      setCartActionMessage("カートへの追加に失敗しました。");
    }
  }, [addToCartLoading, addToCartDone, addToCartError]);

  if (!me) {
    cartStatusMessage = "カートへの追加状況を確認するには、ログインしてください。";
  } else {
    if (loadCartItemsLoading) {
      cartStatusMessage = "カートへの追加状況を確認中...";    
    } else if (loadCartItemsDone && cartItems && cartItems.length === 0) {
      cartStatusMessage = "カートは空です。";     
    } else if (loadCartItemsDone && cartItems && !cartItems.some(item => Number(item.product_id) === Number(productId))) {
      cartStatusMessage = "この商品はまだカートに追加されていません。";
    } else if (loadCartItemsDone && cartItems && cartItems.some(item => Number(item.product_id) === Number(productId))) {
      cartStatusMessage = "この商品はすでにカートに追加されています。";
    } else if (loadCartItemsError) {
      cartStatusMessage = "カートの確認中にエラーが発生しました。";
    }
  }

  if (loadProductDetailLoading) {
    return <CommonLayout title="商品情報">
      <div style={{ width: "100%", padding: "30px" }}>商品情報を読み込み中...</div>
    </CommonLayout>
  } else if (loadProductDetailDone && (productDetail === null)) {
    return <CommonLayout title="商品情報">
      <div style={{ width: "100%", padding: "30px" }}>商品情報が存在しません。</div>
    </CommonLayout>    
  } else if (loadProductDetailDone && (productDetail.status === 0)) {
    return <CommonLayout title="商品情報">
      <div style={{ width: "100%", padding: "30px" }}>この商品は販売停止中です。</div>
    </CommonLayout>        
  } else if (loadProductDetailDone && productDetail) {
    return <CommonLayout title="商品情報">
      <>
        <Col md={16}>
          <div style={{ display: "flex", flexDirection: "column", padding: "30px", rowGap: "15px" }}>
            <div><img style={{ width: "30%" }} src={productDetail.ProductImages[0].src}/></div>
            <div>{productDetail.description}</div>
          </div>          
        </Col>
        <Col md={8}>
          <div style={{ display: "flex", flexDirection: "column", padding: "30px", rowGap: "10px" }}>
            <div>{productDetail.product_name}</div>
            <div>{productDetail.price}円</div>
            <div>残り{productDetail.stock}個</div>
            <div>状態：{productDetail.status === 0 ? "販売停止中" : "販売中"}</div>

            <div>
              <div style={{ display: "flex", flexDirection: "row", columnGap: "10px" }}>
                <Button onClick={() => setQuantity(quantity - 1)} disabled={quantity <= 1}>-</Button>
                <div>{quantity}</div>
                <Button onClick={() => setQuantity(quantity + 1)} disabled={quantity >= productDetail.stock}>+</Button><br/>
              </div>
              <Button style={{ marginTop: "20px" }} type="primary" onClick={handleAddClick}>カートに追加</Button>
            </div>

            { cartStatusMessage && (
              <div>
                {cartStatusMessage}
              </div>
            )}         
            { cartActionMessage && (
              <div>
                {cartActionMessage}
              </div>
            )}    
          </div>
        </Col>
      </>
    </CommonLayout>     
  } else if (!loadProductDetailDone && loadProductDetailError) {
    return <CommonLayout title="商品情報">
      <div>商品情報を読み込めませんでした。</div>
    </CommonLayout>       
  }
};

export default ProductDetail;