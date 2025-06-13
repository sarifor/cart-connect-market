import { useState, useEffect, useRef } from 'react';
import CommonLayout from '@/components/CommonLayout';
import { Col, Button } from 'antd';
import { loadPublicCartDetailRequest, updatePublicCartRequest, resetPublicCartState } from '@/reducers/publicCart.js';
import { loadOrdersForPublicCartRequest, resetOrderState } from '@/reducers/order.js';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import PublicCartEditForm from '@/components/publicCart/PublicCartEditForm';

const PublicCartEdit = () => {
  const {
    ordersForPublicCart
  } = useSelector(state => state.order);

  const {
    loadPublicCartDetailLoading,
    loadPublicCartDetailDone,
    loadPublicCartDetailError,
    updatePublicCartLoading,
    updatePublicCartDone,
    updatePublicCartError,
    publicCartDetail,
  } = useSelector(state => state.publicCart);

  const { me } = useSelector(state => state.member);

  const [ initialTitle, setInitialTitle ] = useState('');
  const [ initialContent, setInitialContent ] = useState('');
  const [ title, setTitle ] = useState('');
  const [ content, setContent ] = useState('');

  const [ selectedOrder, setSelectedOrder ] = useState([]);

  const [ isConfirmCancelModalOpen, setIsConfirmCancelModalOpen ] = useState(false);
  const [ isSuccessModalOpen, setIsSuccessModalOpen ] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const dispatched = useRef(false);
  const dispatched2 = useRef(false);

  const publicCartId = router.query.id;

  useEffect(() => {
    if (!dispatched.current && me) {
      dispatched.current = true;

      dispatch(resetPublicCartState());

      dispatch({
        type: loadPublicCartDetailRequest.type,
        data: { publicCartId: publicCartId },
      });
    }
  }, [publicCartId, me]);

  useEffect(() => {
    const isAuthor = publicCartDetail?.member_id && me?.member_id === publicCartDetail.member_id;
    if (!dispatched2.current && isAuthor) {
      dispatched2.current = true;

      dispatch(resetOrderState());

      dispatch({
        type: loadOrdersForPublicCartRequest.type,
      });
    }
  }, [
    loadPublicCartDetailDone,
    publicCartDetail, 
    me
  ]);

  useEffect(() => {
    if (ordersForPublicCart.length > 0) {
      const selectedOrder = ordersForPublicCart.filter(order => order?.value.includes(`-${publicCartId}`)) || [];

      setSelectedOrder(selectedOrder);
    }
  }, [ordersForPublicCart]);

  useEffect(() => {
    if (publicCartDetail) {
      setInitialTitle(publicCartDetail?.title);
      setInitialContent(publicCartDetail?.content);
      setTitle(publicCartDetail?.title);
      setContent(publicCartDetail?.content);      
    }
  }, [publicCartDetail]);

  // 취소 모달 관련
  const handleConfirmOkClick = () => {
    router.push(`/public-cart/${publicCartId}`);
  };

  const handleConfirmCancelClick = () => {
    setIsConfirmCancelModalOpen(false);
  };

  const handleShowConfirmCancelModal = () => {
    setIsConfirmCancelModalOpen(true);
  };

  // 수정 완료 모달 관련
  const handleSuccessOkClick = () => {
    router.push(`/public-cart/${publicCartId}`);
  };

  const handleShowSuccessModal = () => {
    setIsSuccessModalOpen(true);
  };

  useEffect(() => {
    if (updatePublicCartDone) {
      handleShowSuccessModal();
    }
  }, [updatePublicCartDone]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleLoginClick = () => {
    router.push('/auth/login');
  };  

  const handleUpdateClick = () => {
    if (!title || !content) {
      alert("제목과 내용을 모두 입력해 주세요.");
      return;
    } else if ([...title].length > 20 || [...content].length > 50) {
      alert("제목은 20자 이내로, 본문은 50자 이내로 작성해 주세요.");
      return;
    } else {
      dispatch({
        type: updatePublicCartRequest.type,
        data: { title, content, publicCartId }
      });
    }
  };

  const handleGoBackClick = () => {
    if ((title !== initialTitle) || (content !==initialContent)) {
      handleShowConfirmCancelModal();
    } else {
      router.push(`/public-cart/${publicCartId}`);
    }
  };

  let mainContent;

  if (!me) {
    mainContent = <div style={{ padding: "30px" }}>
      <div>로그인을 해 주세요.</div>
      <div style={{ display: "flex", flexDirection: "row", columnGap: "10px", marginTop: "10px" }}>
        <Button style={{ width: '100px' }} onClick={handleGoBackClick}>돌아가기</Button>
        <Button style={{ width: '100px' }} onClick={handleLoginClick}>로그인</Button>
      </div>      
    </div>
  } else if (me && publicCartDetail.member_id && me.member_id !== publicCartDetail.member_id) {
    mainContent = <div style={{ padding: "30px" }}>
      <div>작성자 본인이 아니면 수정할 수 없습니다.</div>
      <div style={{ marginTop: '10px' }}><Button onClick={handleGoBackClick}>돌아가기</Button></div>
    </div>
  } else {
    if (loadPublicCartDetailLoading && !loadPublicCartDetailDone) {
      mainContent = <div style={{ padding: "30px" }}>
        공개 장바구니 상세 정보 로딩 중...
      </div>
    } else if (!loadPublicCartDetailDone && loadPublicCartDetailError) {
      mainContent = <div style={{ padding: "30px" }}>
        <div>공개 장바구니 상세 정보를 불러올 수 없습니다.</div>
        <div style={{ marginTop: '10px' }}><Button onClick={handleGoBackClick}>돌아가기</Button></div>
      </div>
    } else if (loadPublicCartDetailDone && publicCartDetail.Order.OrderDetails && publicCartDetail.Order.OrderDetails.length === 0) {
      mainContent = <div style={{ padding: "30px" }}>
        <div>공개 장바구니 상세 정보가 존재하지 않습니다.</div>
        <div style={{ marginTop: '10px' }}><Button onClick={handleGoBackClick}>돌아가기</Button></div>
      </div>
    } else if (loadPublicCartDetailDone && publicCartDetail.Order.OrderDetails && publicCartDetail.Order.OrderDetails.length > 0) {
      mainContent = <PublicCartEditForm 
        title={title}
        content={content}
        selectedOrder={selectedOrder}
        handleTitleChange={handleTitleChange}
        handleContentChange={handleContentChange}
        handleGoBackClick={handleGoBackClick}
        handleUpdateClick={handleUpdateClick}
        handleSuccessOkClick={handleSuccessOkClick}        
        handleConfirmOkClick={handleConfirmOkClick}
        handleConfirmCancelClick={handleConfirmCancelClick}
        isConfirmCancelModalOpen={isConfirmCancelModalOpen}        
        isSuccessModalOpen={isSuccessModalOpen}
      />
    }
  }

  let updateStatusMessage;

  if (updatePublicCartLoading && !updatePublicCartDone) {
    updateStatusMessage = '전송 중...';
  } else if (!updatePublicCartDone && updatePublicCartError) {
    updateStatusMessage = '전송 중 오류가 발생하였습니다.';
  } else if (updatePublicCartDone) {
    updateStatusMessage = '';
  }

  return (
    <CommonLayout title='공개 장바구니 수정'>
      <Col xs={24} sm={24} md={24} lg={24} style={{ backgroundColor: 'orange', maxWidth: 600 }}>
        {mainContent}
        <div 
          style={{ 
            display: 'flex', 
            flexDirection: 'column',
            maxWidth: 600,
            width: '100%',
            padding: '20px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ padding: '30px', marginTop: "16px" }}>
            {updateStatusMessage}
          </div>
        </div>
      </Col>
    </CommonLayout>
  );
};

export default PublicCartEdit;