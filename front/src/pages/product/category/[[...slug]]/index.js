import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Select } from 'antd';
import { loadCategoriesRequest, loadProductsRequest } from '../../../../reducers/product';
import CommonLayout from '../../../../components/CommonLayout';
import ProductList from '../../../../components/product/ProductList';

// Q. 주소 직접 입력으로도 원하는 카테고리 선택하고 상품 필터링 하려면?
// A. slug 사용 (ChatGPT) -> 보류
// Q. 상품 상세 페이지에서 뒤로가기 눌러 카테고리 메인으로 돌아가도, 선택한 카테고리 값이 유지되게 하려면?
const CategoryProductList = () => {
  // const router = useRouter();
  // const slug = router.query.slug || [];
  
  // 전역 상태
  const {
    loadCategoriesLoading,
    loadCategoriesDone,
    loadCategoriesError,
    loadProductsLoading,
    loadProductsDone,
    loadProductsError,
    categories,
    products,
  } = useSelector(state => state.product);

  // 로컬 상태
  const [level1Selected, setLevel1Selected] = useState(null);
  const [level2Selected, setLevel2Selected] = useState(null);
  const [level3Selected, setLevel3Selected] = useState(null);

  const [level1Categories, setLevel1Categories] = useState([]);
  const [level2Categories, setLevel2Categories] = useState([]);
  const [level3Categories, setLevel3Categories] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadCategoriesRequest())
  }, []);

  useEffect(() => {
    if (categories) {
      setLevel1Categories(categories.filter(category => !category.parent_category_id));
    } else {
      console.log("No category data");
    }
  }, [categories]);

  // Q. useEffect 의존성 배열을 아예 생략하면 왜 액션 디스패치 무한 루프?
  // A. 상태 변경마다 리렌더링되고, useEffect가 매번 실행되어 다시 dispatch되기 때문. (ChatGPT)
  useEffect(() => {
    // 레벨 1 카테고리 및 후손 카테고리에 속한 모든 상품 데이터 불러오기
    if (level1Selected) {
      dispatch({
        type: loadProductsRequest.type,
        data: { categoryId: level1Selected },
      })
    }

    if (level2Selected) {
      dispatch({
        type: loadProductsRequest.type,
        data: { categoryId: level2Selected },
      })
    }

    if (level3Selected) {
      dispatch({
        type: loadProductsRequest.type,
        data: { categoryId: level3Selected },
      })
    }        
  }, [level1Selected, level2Selected, level3Selected]);

  const handleLevel1Change = (value) => {
    // 선택한 레벨 1 카테고리 저장
    setLevel1Selected(value);

    // 레벨 2, 3 카테고리 선택, 데이터 리셋하기
    setLevel2Selected(null);
    setLevel2Categories([]);
    setLevel3Selected(null);
    setLevel3Categories([]);

    // 레벨 2 카테고리 불러오기
    const children = categories.filter(category => Number(category.parent_category_id) === Number(value));
    setLevel2Categories(children);

    // URL에 선택한 레벨 1 카테고리 ID 추가하기
    // router.push(`/product/category/${value}`);
  };

  const handleLevel2Change = (value) => {
    // 선택한 레벨 2 카테고리 저장
    setLevel2Selected(value);

    // 레벨 3 카테고리 선택, 데이터 리셋하기
    setLevel3Selected(null);    
    setLevel3Categories([]);

    // 레벨 3 카테고리 불러오기
    const children = categories.filter(category => Number(category.parent_category_id) === Number(value));
    
    setLevel3Categories(children);

    // URL에 선택한 레벨 2 카테고리 ID 추가하기
    // router.push(`/product/category/${level1Selected}/${value}`);
  };

  const handleLevel3Change = (value) => {
    // 선택한 레벨 3 카테고리 저장
    setLevel3Selected(value);

    // URL에 선택한 레벨 3 카테고리 ID 추가하기
    // router.push(`/product/category/${level1Selected}/${level2Selected}/${value}`);
  };

  return (
    <CommonLayout title="카테고리">
      <Col md={6}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {loadCategoriesLoading && (
            <div>Categories Loading...</div>
          )}
          {loadCategoriesDone && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Select
                // defaultValue="lucy"
                value={level1Selected}
                style={{ width: 120 }}
                onChange={handleLevel1Change}
                options={
                  level1Categories.map(category => ({
                    value: category.category_id, 
                    label: category.category_name
                  }))
                }
              />

              {Array.isArray(level2Categories) && level2Categories.length > 0 && (
                <Select
                  // defaultValue="lucy"
                  value={level2Selected}
                  style={{ width: 120 }}
                  onChange={handleLevel2Change}
                  options={
                    level2Categories.map(category => ({
                      value: category.category_id, 
                      label: category.category_name
                    }))
                  }
                />
              )}

              {Array.isArray(level3Categories) && level3Categories.length > 0 && (
                <Select
                  // defaultValue="lucy"
                  value={level3Selected}
                  style={{ width: 120 }}
                  onChange={handleLevel3Change}
                  options={
                    level3Categories.map(category => ({
                      value: category.category_id, 
                      label: category.category_name
                    }))
                  }
                />
              )}              
            </div>
          )}
          {loadCategoriesError && (
            <div>카테고리 데이터를 불러올 수 없습니다: {loadCategoriesError}</div>
          )}
        </div>      
      </Col>      
      <ProductList
        levelSelected={ level1Selected || level2Selected || level3Selected }        
        loadProductsLoading={loadProductsLoading}
        loadProductsDone={loadProductsDone}
        loadProductsError={loadProductsError}        
        products={products}
      />
    </CommonLayout>
  );
};

export default CategoryProductList;