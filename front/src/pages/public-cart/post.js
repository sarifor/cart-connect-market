import { useState, useEffect, useRef } from 'react';
import CommonLayout from '@/components/CommonLayout';
import { Col, Button } from 'antd';
import { postPublicCartRequest, resetPublicCartState } from '@/reducers/publicCart.js';
import { loadOrdersForPublicCartRequest, resetOrderState } from '@/reducers/order.js';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import PublicCartPostForm from '@/components/publicCart/PublicCartPostForm';

// Q. 제목, 내용 길이 제한시키기?
const PublicCartPost = () => {
  const {
    loadOrdersForPublicCartLoading,
    loadOrdersForPublicCartDone,
    loadOrdersForPublicCartError,
    ordersForPublicCart
  } = useSelector(state => state.order);

  const {
    postPublicCartLoading,
    postPublicCartDone,
    postPublicCartError,
  } = useSelector(state => state.publicCart);

  const { me } = useSelector(state => state.member);

  const [ title, setTitle ] = useState('');
  const [ content, setContent ] = useState('');
  const [ selectedOrderId, setSelectedOrderId ] = useState(undefined);

  const [ isSuccessModalOpen, setIsSuccessModalOpen ] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const dispatched = useRef(false);

  useEffect(() => {
    if (!dispatched.current) {
      dispatched.current = true;

      dispatch({
        type: loadOrdersForPublicCartRequest.type,
      });
    }
  }, []);

  useEffect(() => {
    if (!me) {
      setTimeout(() => {
        router.replace("/auth/login");
      }, 2000);
    }
  }, [me]);

  const handleSuccessOkClick = () => {
    router.push('/public-cart').then(() => {
      dispatch(resetPublicCartState());
      dispatch(resetOrderState());
    });
  };

  const handleShowSuccessModal = () => {
    setIsSuccessModalOpen(true);
  };  

  useEffect(() => {
    if (postPublicCartDone) {
      handleShowSuccessModal();
    }
  }, [postPublicCartDone]);

  const handleTitleChange = (e) => {
    // 빈 문자열인 경우에도 반영
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    // 빈 문자열인 경우에도 반영
    setContent(e.target.value);
  };

  const handleOrderIdChange = (value) => {
    // 빈 값이어도 반영
    setSelectedOrderId(value);
  };

  const handlePostClick = () => {
    if (!title || !content || !selectedOrderId) {
      alert("公開したい注文を選択し、タイトルと内容を入力してください。\nまだ注文履歴がない場合は、先に注文を行ってください。");

      return;
    } else {
      dispatch({
        type: postPublicCartRequest.type,
        data: { title, content, selectedOrderId }
      });
    }
  };

  const handleGoBackClick = () => {
    router.push("/public-cart").then(() => {
      dispatch(resetOrderState());
    });
  };

  let mainContent;

  if (!me) {
    mainContent = <div style={{ padding: "30px" }}>
      <div>ログインしてください。</div>
      <div style={{ marginTop: '10px' }}>2秒後にログイン画面へ移動します。</div>
    </div> 
  } else {
    if (loadOrdersForPublicCartLoading && !loadOrdersForPublicCartDone) {
      mainContent = <div style={{ padding: "30px" }}>
        注文履歴を読み込み中...
      </div>
    } else if (!loadOrdersForPublicCartDone && loadOrdersForPublicCartError) {
      mainContent = <div style={{ padding: "30px" }}>
        <div>注文履歴を取得できませんでした。</div>
        <div style={{ marginTop: '10px' }}><Button onClick={handleGoBackClick}>戻る</Button></div>
      </div>
    } else if (loadOrdersForPublicCartDone && ordersForPublicCart.length === 0) {
      mainContent = <div style={{ padding: "30px" }}>
        <div>注文履歴が存在しません。</div>
        <div style={{ marginTop: '10px' }}><Button onClick={handleGoBackClick}>戻る</Button></div>
      </div>
    } else if (loadOrdersForPublicCartDone && ordersForPublicCart.length > 0) {
      mainContent = <PublicCartPostForm 
        title={title}
        content={content}
        selectedOrderId={selectedOrderId}
        ordersForPublicCart={ordersForPublicCart}
        handleTitleChange={handleTitleChange}
        handleContentChange={handleContentChange}
        handleOrderIdChange={handleOrderIdChange}
        handleGoBackClick={handleGoBackClick}
        handlePostClick={handlePostClick}
        handleSuccessOkClick={handleSuccessOkClick}
        isSuccessModalOpen={isSuccessModalOpen}
      />
    }
  }

  let postStatusMessage;

  if (postPublicCartLoading && !postPublicCartDone) {
    postStatusMessage = '投稿中...';
  } else if (!postPublicCartDone && postPublicCartError) {
    postStatusMessage = '投稿中にエラーが発生しました。';
  } else if (postPublicCartDone) {
    postStatusMessage = '';
  }

  return (
    <CommonLayout title='公開カート投稿'>
      <Col xs={24} sm={24} md={24} lg={24} style={{ maxWidth: 600 }}>
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
            {postStatusMessage}
          </div>
        </div>        
      </Col>
    </CommonLayout>
  );
};

export default PublicCartPost;