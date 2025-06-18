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

      dispatch(resetPublicCartState());
      
      dispatch({
        type: loadPublicCartDetailRequest.type,
        data: { publicCartId: publicCartId },
      });
    }
  }, [publicCartId]);

  useEffect(() => {
    return () => {
      // dispatch(resetPublicCartState());
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
    router.push('/public-cart').then(() => {
      dispatch(resetPublicCartState());
      dispatch(resetCartState());
    })
  };

  const handleLikeClick = () => {
    if (!me) {
      alert("「いいね！」をつけるにはログインが必要です。");
    } else if (me && me.member_id === publicCartDetail.member_id) {
      alert("自分の投稿には「いいね！」をつけられません。");
    } else {
      alert("「いいね！」機能は準備中です。");
    }
  };

  const handleCopyClick = () => {
    if (!me) {
      alert("コピーをするにはログインが必要です。");
    } else if (me && me.member_id === publicCartDetail.member_id) {
      alert("自分で投稿した商品はコピーできません。");
    } else {
      dispatch({
        type: copyCartRequest.type,
        data: { publicCartId },
      });
    }
  };

  const handleUpdateClick = () => {
    if (!me) {
      alert('公開カートを編集するにはログインが必要です。');

      router.push('/auth/login').then(() => {
        dispatch(resetPublicCartState());
      });
    } else if (me && me.member_id !== publicCartDetail.member_id) {
      alert('投稿者ご本人のみ編集できます。');
      return;
    } else if (me && me.member_id === publicCartDetail.member_id) {
      router.push(`/public-cart/edit?id=${publicCartId}`).then(() => {
        // dispatch(resetPublicCartState());
      });
    }
  };

  return (
    <CommonLayout title='公開カート情報'>
      <>
        <Col md={16}>
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
                公開カート情報を読み込み中...
              </div>

            // 비로그인 사용자/열람자 회원/작성자 회원이고, loadPublicCartDetailDone false이고, loadPublicCartDetailError면,
            ) : !loadPublicCartDetailDone && loadPublicCartDetailError ? (
              <>
                <div style={{ padding: "10px" }}>
                  公開カートの情報が存在しないか、読み込めませんでした。
                </div>
                <div style={{ padding: "10px" }}>
                  <Button type="primary" style={{ width: '100px' }} onClick={handlePublicCartListClick} >
                    一覧へ戻る
                  </Button>
                </div>
              </>

            // 비로그인 사용자/열람자 회원/작성자 회원이고, loadPublicCartDetailDone true이고, 상세 정보가 없으면(0개),
            ) : loadPublicCartDetailDone && publicCartDetail.Order.OrderDetails && publicCartDetail.Order.OrderDetails.length === 0 ? (
              <>
                <div style={{ padding: "10px" }}>
                  公開カートの情報が存在しません。
                </div>
                <div style={{ padding: "10px" }}>
                  <Button type="primary" style={{ width: '100px' }} onClick={handlePublicCartListClick} >
                    一覧へ戻る
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
                        <div style={{ cursor: "pointer"}} onClick={handleUpdateClick}>編集</div> <Link href="" title="準備中">削除</Link>
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
          <Col md={8}>
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