import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'antd';
import { loadPublicCartsRequest } from '@/reducers/publicCart';
import CommonLayout from '@/components/CommonLayout';
import NetworkView from '@/components/publicCart/NetworkView';
import PublicCartList from '@/components/publicCart/PublicCartList';

const PublicCart = () => {
  const {
    loadPublicCartsLoading,
    loadPublicCartsDone,
    loadPublicCartsError, 
    publicCarts,
  } = useSelector(state => state.publicCart);

  const { me } = useSelector(state => state.member);

  const [ sortType, setSortType ] = useState('latest');

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

  let content;

  if (sortType === 'network') {
    content = <NetworkView />;
  } else if (loadPublicCartsLoading && !loadPublicCartsDone) {
    content = <Row>Public carts Loading...</Row>
  } else if (!loadPublicCartsDone && loadPublicCartsError) {
    content = <Row>공개 장바구니를 불러올 수 없습니다.</Row>
  } else if (loadPublicCartsDone && sortedPublicCarts && sortedPublicCarts.length === 0) {
    content = <Row>작성된 공개 장바구니가 없습니다.</Row>
  } else if (loadPublicCartsDone && sortedPublicCarts && sortedPublicCarts.length > 0) {
    content = <PublicCartList sortedPublicCarts={sortedPublicCarts} />;
  } else {
    content = null;
  }

  return (
    <CommonLayout title="공개 장바구니">
      <Col md={6}>
        <div style={{ display: "flex", flexDirection: "column", rowGap: "10px" }}>
          <div style={{ cursor: "pointer"}} onClick={ () => handleSortClick('latest') }>최신 순</div>
          <div style={{ cursor: "pointer"}} onClick={ () => handleSortClick('likes') }>좋아요 순</div>
          { me?.member_id && <div style={{ cursor: "pointer"}} onClick={ () => handleSortClick('mine') }>내가 공개한 장바구니</div>}
          <div style={{ cursor: "pointer"}} onClick={ () => handleSortClick('network') }>관계 네트워크</div>
        </div>
      </Col>

      <Col md={18}>
        {content}
      </Col>      
    </CommonLayout>
  );
};

export default PublicCart;