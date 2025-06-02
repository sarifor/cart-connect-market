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
      console.log("장바구니 최신 상태: ", cartItems);
    }
  }, [cartItems]);

  const handleAddClick = () => {
    if (!me) {
      setCartActionMessage("로그인이 필요합니다. 로그인 후 이용해 주세요.");
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
      setCartActionMessage("장바구니에 담는 중...");
    } else if (addToCartDone) {
      setCartActionMessage("장바구니에 담겼습니다.");
    } else if (addToCartError) {
      setCartActionMessage(`장바구니 담기에 실패하였습니다: ${addToCartError}`);
    }
  }, [addToCartLoading, addToCartDone, addToCartError]);

  if (!me) {
    cartStatusMessage = "장바구니에 담겼는지 여부를 확인하려면 로그인을 해 주세요.";
  } else {
    if (loadCartItemsLoading) {
      cartStatusMessage = "장바구니에 담겼는지 여부를 확인 중입니다.";    
    } else if (loadCartItemsDone && cartItems && cartItems.length === 0) {
      cartStatusMessage = "장바구니는 비어 있습니다.";     
    } else if (loadCartItemsDone && cartItems && !cartItems.some(item => Number(item.product_id) === Number(productId))) {
      cartStatusMessage = "장바구니에 담긴 적이 없는 상품입니다.";
    } else if (loadCartItemsDone && cartItems && cartItems.some(item => Number(item.product_id) === Number(productId))) {
      cartStatusMessage = "장바구니에 이미 담긴 상품입니다.";
    } else if (loadCartItemsError) {
      cartStatusMessage = "장바구니에 담겼는지 확인하는 과정에서 에러가 발생하였습니다.";
    }
  }

  if (loadProductDetailLoading) {
    return <CommonLayout title="상품 상세">
      <div>Product Detail Loading...</div>
    </CommonLayout>
  } else if (loadProductDetailDone && (productDetail === null)) {
    return <CommonLayout title="상품 상세">
      <div>상품 정보가 없습니다.</div>
    </CommonLayout>    
  } else if (loadProductDetailDone && (productDetail.status === 0)) {
    return <CommonLayout title="상품 상세">
      <div>상품이 판매 중지 상태입니다.</div>
    </CommonLayout>        
  } else if (loadProductDetailDone && productDetail) {
    return <CommonLayout title="상품 상세">
      <>
        <Col md={16} style={{ backgroundColor: "orange" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div><img src={productDetail.ProductImages[0].src}/></div>
            <div>{productDetail.description}</div>
            <div>{/* 스크롤을 보기 위해 넣은 더미 데이터. 내용 자체는 본 앱과 관계 없음 */}
              Alice, a young girl, sits bored by a riverbank and spots a White Rabbit with a pocket watch and waistcoat lamenting that he is late. Surprised, Alice follows him down a rabbit hole, which sends her into a lengthy plummet but to a safe landing. Inside a room with a table, she finds a key to a tiny door, beyond which is a garden. While pondering how to fit through the door, she discovers a bottle labelled "Drink me". Alice drinks some of the bottle's contents, and to her astonishment, she shrinks small enough to enter the door. However, she had left the key upon the table and cannot reach it. Alice then discovers and eats a cake labelled "Eat me", which causes her to grow to a tremendous size. Unhappy, Alice bursts into tears, and the passing White Rabbit flees in a panic, dropping a fan and two gloves. Alice uses the fan for herself, which causes her to shrink once more and leaves her swimming in a pool of her own tears. Within the pool, Alice meets various animals and birds, who convene on a bank and engage in a "Caucus Race" to dry themselves. Following the end of the race, Alice inadvertently frightens the animals away by discussing her cat.

              The White Rabbit appears looking for the gloves and fan. Mistaking Alice for his maidservant, he orders her to go to his house and retrieve them. Alice finds another bottle and drinks from it, which causes her to grow to such an extent that she gets stuck in the house. Attempting to extract her, the White Rabbit and his neighbours eventually take to hurling pebbles that turn into small cakes. Alice eats one and shrinks herself, allowing her to flee into the forest. She meets a Caterpillar seated on a mushroom and smoking a hookah. During the Caterpillar's questioning, Alice begins to admit to her current identity crisis, compounded by her inability to remember a poem. Before crawling away, the Caterpillar says that a bite of one side of the mushroom will make her larger, while a bite from the other side will make her smaller. During a period of trial and error, Alice's neck extends between the treetops, frightening a pigeon who mistakes her for a serpent. After shrinking to an appropriate height, Alice arrives at the home of a Duchess, who owns a perpetually grinning Cheshire Cat. The Duchess's baby, whom she hands to Alice, transforms into a piglet, which Alice releases into the woods. The Cheshire Cat appears to Alice and directs her toward the Hatter and March Hare before disappearing, leaving his grin behind.

              Alice finds the Hatter, March Hare, and a sleepy Dormouse in the midst of a tea party. The Hatter explains that it is always 6 p.m. (tea time), claiming that time is standing still as punishment for the Hatter trying to "kill it". A conversation ensues around the table, and the riddle "Why is a raven like a writing desk?" is brought up. Alice impatiently decides to leave, calling the party stupid.

              Noticing a door on a tree, Alice passes through and finds herself back in the room from the beginning of her journey. She takes the key and uses it to open the door to the garden, which turns out to be the croquet court of the Queen of Hearts, whose guard consists of living playing cards. Alice participates in a croquet game, in which hedgehogs are used as balls, flamingos are used as mallets, and soldiers act as hoops. The Queen is short-tempered and constantly orders beheadings. When the Cheshire Cat appears as only a head, the Queen orders his beheading, only to be told that such an act is impossible. Because the cat belongs to the Duchess, Alice prompts the Queen to release the Duchess from prison to resolve the matter.

              Alice then meets a Gryphon and a Mock Turtle, who dance to the Lobster Quadrille while Alice recites (rather incorrectly) a poem. The Mock Turtle sings them "Beautiful Soup", during which the Gryphon drags Alice away for a trial, in which the Knave of Hearts stands accused of stealing the Queen's tarts. The trial is conducted by the King of Hearts, and the jury is composed of animals that Alice previously met. Alice gradually grows in size and confidence, allowing herself increasingly frequent remarks on the irrationality of the proceedings. The Queen eventually commands Alice's beheading, but Alice scoffs that the Queen's guard is only a pack of cards. Although Alice holds her own for a time, the guards soon gang up and start to swarm all over her. Alice's sister wakes her up from a dream, brushing what turns out to be leaves from Alice's face. Alice leaves her sister on the bank to imagine all the curious happenings for herself.
            </div>
          </div>          
        </Col>
        <Col md={8} style={{ backgroundColor: "green" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div>{productDetail.product_name}</div>
            <div>{productDetail.price}엔</div>
            <div>{productDetail.stock}개 남음</div>
            <div>상태: {productDetail.status === 0 ? "판매 중지" : "판매 중"}</div>
            <div>
              <Button onClick={() => setQuantity(quantity - 1)} disabled={quantity <= 1}>-</Button>
                {quantity}
              <Button onClick={() => setQuantity(quantity + 1)} disabled={quantity >= productDetail.stock}>+</Button><br/>
              <Button type="primary" onClick={handleAddClick}>장바구니 담기</Button>
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
    return <CommonLayout title="상품 상세">
      <div>상품 정보를 불러올 수 없습니다: {loadProductDetailError}</div>
    </CommonLayout>       
  }
};

export default ProductDetail;