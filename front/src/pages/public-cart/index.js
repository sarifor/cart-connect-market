import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'antd';
import { loadPublicCartsRequest, resetPublicCartState } from '@/reducers/publicCart';
import CommonLayout from '@/components/CommonLayout';
import NetworkView from '@/components/publicCart/NetworkView';
import PublicCartList from '@/components/publicCart/PublicCartList';
import { useRouter } from 'next/router';

const PublicCart = () => {
  const {
    loadPublicCartsLoading,
    loadPublicCartsDone,
    loadPublicCartsError, 
    publicCarts,
  } = useSelector(state => state.publicCart);

  const { me } = useSelector(state => state.member);

  const [ sortType, setSortType ] = useState('latest');

  const router = useRouter();
  const dispatch = useDispatch();
  const dispatched = useRef(false);

  useEffect(() => {
    if (!dispatched.current) {
      dispatched.current = true;
      dispatch(loadPublicCartsRequest());
    }
  }, []);

  const handleSortClick = (sortType) => {
    setSortType(sortType);
  };

  const sortedPublicCarts = useMemo(() => {
    if (!publicCarts) {
      return [];
    }

    switch (sortType) {
      case 'likes':
        return publicCarts.toSorted((a, b) => b.likeCount - a.likeCount);
      case 'mine':
        return publicCarts.filter(publicCart => publicCart.member_id === me?.member_id);
      case 'network':
        return [];
      case 'latest':
      default:
        return publicCarts.toSorted((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }    
  }, [sortType, publicCarts, me]);

  const handlePostClick = () => {
    if (!me) {
      alert('公開カートを投稿するにはログインしてください。');

      router.push('/auth/login').then(() => {
        dispatch(resetPublicCartState());
      });
    } else {
      router.push('/public-cart/post').then(() => {
        dispatch(resetPublicCartState());
      });
    }
  };

  let content;

  if (sortType === 'network') {
    content = <NetworkView />;
  } else if (loadPublicCartsLoading && !loadPublicCartsDone) {
    content = <Row>公開カートを読み込み中...</Row>
  } else if (!loadPublicCartsDone && loadPublicCartsError) {
    content = <Row>公開カートを読み込めませんでした。</Row>
  } else if (loadPublicCartsDone && sortedPublicCarts && sortedPublicCarts.length === 0) {
    content = <Row>投稿された公開カートはありません。</Row>
  } else if (loadPublicCartsDone && sortedPublicCarts && sortedPublicCarts.length > 0) {
    content = <PublicCartList sortedPublicCarts={sortedPublicCarts} />;
  } else {
    content = null;
  }

  return (
    <CommonLayout title="公開カート">
      <Col md={6}>
        <div style={{ display: "flex", flexDirection: "column", rowGap: "10px" }}>
          <div style={{ cursor: "pointer"}} onClick={ () => handleSortClick('latest') }>新着順</div>
          <div style={{ cursor: "pointer"}} onClick={ () => handleSortClick('likes') }>いいね順</div>
          <div style={{ cursor: "pointer"}} onClick={ () => handleSortClick('network') }>関係ネットワーク</div>
          <hr style={{ 
            border: "1px dotted #e0e0e0", 
            width: "120px", 
            marginTop: "5px",
            marginRight: "0px",
            marginBottom: "5px",
            marginLeft: "0px",
          }} />          
          { me?.member_id &&
            <>
              <div style={{ cursor: "pointer"}} onClick={ () => handleSortClick('mine') }>自分の公開カート</div>
              <hr style={{ 
                border: "1px dotted #e0e0e0", 
                width: "120px", 
                marginTop: "5px",
                marginRight: "0px",
                marginBottom: "5px",
                marginLeft: "0px",
              }} />
            </>
          }
          <div style={{ cursor: "pointer"}} onClick={handlePostClick}>投稿する</div>
        </div>
      </Col>

      <Col md={18}>
        {content}
      </Col>      
    </CommonLayout>
  );
};

export default PublicCart;