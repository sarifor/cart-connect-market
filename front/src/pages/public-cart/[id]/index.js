import { useState, useEffect, useRef } from 'react';
import CommonLayout from '@/components/CommonLayout';
import PublicCartDetailList from '@/components/publicCart/PublicCartDetailList';
import PublicCartDetailSummary from '@/components/publicCart/PublicCartDetailSummary';
import { Col, Button } from 'antd';
import Link from 'next/link';
import { loadPublicCartDetailRequest, resetPublicCartState } from '@/reducers/publicCart.js';
import { copyCartRequest, resetCartState } from '@/reducers/cart';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

const PublicCartDetail = () => {
  const {
    loadPublicCartDetailLoading,
    loadPublicCartDetailDone,
    loadPublicCartDetailError,
    publicCartDetail,
  } = useSelector(state => state.publicCart);

  const {
    copyCartLoading,
    copyCartDone,
    copyCartError,
  } = useSelector(state => state.cart);

  const { me } = useSelector(state => state.member);

  const [ isModalOpen, setIsModalOpen ] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const dispatched = useRef(false);
  
  const publicCartId = router.query.id;

  useEffect(() => {
    if (!dispatched.current && publicCartId) {
      dispatched.current = true;

      dispatch({
        type: loadPublicCartDetailRequest.type,
        data: { publicCartId: publicCartId },
      });
    }
  }, [publicCartId]);

  useEffect(() => {
    return () => {
      dispatch(resetPublicCartState());
      dispatch(resetCartState());
    }
  }, []);

  const handleShowModal = () => {
    setIsModalOpen(true);
  };

  const handleOkClick = () => {
    setIsModalOpen(false);
    router.push("/cart");
  };

  const handleCancelClick = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (copyCartDone) {
      handleShowModal();
    }
  }, [copyCartDone]);

  const handlePublicCartListClick = () => {
    router.push(`/public-cart`).then(() => {
      dispatch(resetPublicCartState());
      dispatch(resetCartState());
    })
  };

  const handleLikeClick = () => {
    if (!me) {
      alert("'좋아요'를 누르려면 로그인을 해 주세요.");
    } else if (me && me.member_id === publicCartDetail.member_id) {
      alert("본인 게시물에는 '좋아요'를 누를 수 없습니다.");
    } else {
      alert("'좋아요' 기능 구현 예정");
    }
  };

  const handleCopyClick = () => {
    if (!me) {
      alert("복사 기능을 이용하려면 로그인을 해 주세요.");
    } else if (me && me.member_id === publicCartDetail.member_id) {
      alert("본인 게시물의 상품은 복사할 수 없습니다.");
    } else {
      dispatch({
        type: copyCartRequest.type,
        data: { publicCartId },
      });
    }
  };

  return (
    <CommonLayout title='공개 장바구니 상세 정보'>
      <>
        <Col md={16} style={{ backgroundColor: 'orange' }}>
          <div 
            style={{ 
              display: 'flex', 
              flexDirection: 'column',
              maxWidth: 600,
              width: '100%',
              padding: '20px'
            }}
          >
            {/* 비로그인 사용자/열람자 회원/작성자 회원이고, loadPublicCartDetailLoading true, loadOrderDetailDone false면, */}
            { loadPublicCartDetailLoading && !loadPublicCartDetailDone ? (
              <div style={{ padding: "10px" }}>
                공개 장바구니 상세 정보 로딩 중...
              </div>

            // 비로그인 사용자/열람자 회원/작성자 회원이고, loadPublicCartDetailDone false이고, loadPublicCartDetailError면,
            ) : !loadPublicCartDetailDone && loadPublicCartDetailError ? (
              <>
                <div style={{ padding: "10px" }}>
                  공개 장바구니 상세 정보가 존재하지 않거나 불러올 수 없습니다.
                </div>
                <div style={{ padding: "10px" }}>
                  <Button type="primary" style={{ width: '100px' }} onClick={handlePublicCartListClick} >
                    목록으로
                  </Button>
                </div>
              </>

            // 비로그인 사용자/열람자 회원/작성자 회원이고, loadPublicCartDetailDone true이고, 상세 정보가 없으면(0개),
            ) : loadPublicCartDetailDone && publicCartDetail.Order.OrderDetails && publicCartDetail.Order.OrderDetails.length === 0 ? (
              <>
                <div style={{ padding: "10px" }}>
                  공개 장바구니 상세 정보가 존재하지 않습니다.
                </div>
                <div style={{ padding: "10px" }}>
                  <Button type="primary" style={{ width: '100px' }} onClick={handlePublicCartListClick} >
                    목록으로
                  </Button>
                </div>
              </>

            // 비로그인 사용자/열람자 회원/작성자 회원이고, loadPublicCartDetailDone true이고, 상세 정보가 있으면(1개 이상),
            ) : loadPublicCartDetailDone && publicCartDetail.Order.OrderDetails && publicCartDetail.Order.OrderDetails.length > 0 ? (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', padding: '10px', rowGap: '10px' }}>
                  {/* 제목, 수정, 삭제 */}
                  <div style ={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', borderBottom: "1px solid black" }}>                
                    <div style={{ fontSize: '1.75rem', fontWeight: 'bold', padding: '10px' }}>
                      {publicCartDetail.title}
                    </div>

                    {/* 작성자 회원에게만 '수정' '삭제' 버튼 보임 */}
                    { me && me.member_id === publicCartDetail.member_id ? (
                      <div style={{ padding: "10px", display: 'flex', gap: '15px' }}>
                        <Link href="" title="기능 준비 중">수정</Link> <Link href="" title="기능 준비 중">삭제</Link>
                      </div>
                    ): null}
                  </div>

                  {/* 내용 */}
                  <div style={{ padding: '10px' }}>
                    {publicCartDetail.content}
                  </div>
                </div>

                {/* 주문 내역 */}
                <div style={{ padding: '10px' }}>
                  { publicCartDetail.Order.OrderDetails.map(detail => (
                    <PublicCartDetailList key={detail.product_id} detail={detail} />
                  ))}
                </div>
              </>
            ) : null}

          </div>
        </Col>

        {/* 비로그인 사용자/열람자 회원/작성자 회원이고, loadPublicCartDetailDone true이고, 상세 정보가 있으면(1개 이상) */}
        { loadPublicCartDetailDone && publicCartDetail.Order.OrderDetails && publicCartDetail.Order.OrderDetails.length > 0 ? (
          <Col md={8} style={{ backgroundColor: 'green' }}>
            <PublicCartDetailSummary
              nickname={publicCartDetail.Member.nickname}
              orderCreatedAt={publicCartDetail.Order.created_at}
              publicCartCreatedAt={publicCartDetail.created_at}
              itemQuantityTotal={publicCartDetail.itemQuantityTotal}
              itemPriceTotal={publicCartDetail.itemPriceTotal}
              likeCount={publicCartDetail.likeCount}
              copyCartLoading={copyCartLoading}
              copyCartDone={copyCartDone}
              copyCartError={copyCartError}
              isModalOpen={isModalOpen}
              handlePublicCartListClick={handlePublicCartListClick}
              handleLikeClick={handleLikeClick}
              handleCopyClick={handleCopyClick}
              handleOkClick={handleOkClick}
              handleCancelClick={handleCancelClick}
            />
          </Col>
        ): null}
      </>
    </CommonLayout>    
  );
};

export default PublicCartDetail;