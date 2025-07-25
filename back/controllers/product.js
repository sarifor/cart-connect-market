const { Category, Product, ProductImage } = require('../config/db');
const { Op } = require('sequelize');

let BASE_URL;

if (process.env.NODE_ENV === 'production') {
  BASE_URL = 'https://ccm-api.sarifor.net';  
} else {
  BASE_URL = 'http://localhost:4000';
}

const productTest = (req, res, next) => {
  try {
    return res.status(200).json([{"value": "ok"}]);
  } catch (error) {
    console.log(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    
    const productDetail = await Product.findOne({
      where: {
        product_id: productId
      },
      include: [{
        model: ProductImage,
        attributes: ['product_image_id', 'src', 'product_id'],
      }]
    });

    const modifiedProductDetail = {
      ...productDetail.toJSON(),
      ProductImages: productDetail.ProductImages.map(img => {
        const plainImage = img.toJSON();
        return {
          ...plainImage,
          src: `${BASE_URL}${img.src}`,
        };
      }),
    };

    return res.status(200).json(modifiedProductDetail);
  } catch (error) {
    return res.status(500).json(error);    
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({ raw: true });
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json(error);
  }
};

/* Q. getSubCategoryIds 함수의 동작을 설명해줄래?
   A. 재귀 함수이기 때문에 내부적으로는 call stack에 쌓였다가 우루루 빠져나오는 구조로 동작해!
      getSubCategoryIds(1, categories)
        → getSubCategoryIds(3, categories)
          → getSubCategoryIds(6, categories)
            → []
          → [6]
        → [3, 6]
      → [1, 3, 6]
      이런 식으로 스택 구조를 따라 쌓이고,
      더 이상 자식이 없는 카테고리(leaf node)에 도달하면
      그때부터 반환되면서 concat()으로 하나씩 합쳐져서 위로 전달돼. (ChatGPT)
*/
const getSubCategoryIds = (categoryId, categories) => {
  // 자식 찾기
  const directChildren = categories.filter(category => Number(category.parent_category_id) === Number(categoryId));

  // 결과 배열 준비
  let completeCategoryIds = [categoryId];

  // 자식의 자식 찾기
  for (const child of directChildren) {
    completeCategoryIds = completeCategoryIds.concat(getSubCategoryIds(child.category_id, categories));
  }

  return completeCategoryIds;
};

const getProductsByCategory = async (req, res, next) => {
  try {  
    // 특정 카테고리 아이디 받아오기
    const categoryId = req.params.categoryId;
    
    // 모든 카테고리 아이디 획득
    const categories = await Category.findAll({ raw: true });
    
    // 특정 카테고리의 모든 자식, 손주 카테고리 아이디 획득
    const completeCategoryIds = getSubCategoryIds(categoryId, categories);

    // 상품 테이블 및 연계된 상품 이미지 테이블에서 데이터 조회
    const products = await Product.findAll({
      where: {
        category_id: { [Op.in]: completeCategoryIds }
      },
      include: [{
        model: ProductImage,
        attributes: ['product_image_id', 'src', 'product_id'],
      }],
    });

    // 실행 환경에 따라 상품 이미지 src 변경
    const modifiedProducts = products.map(product => ({
      ...product.toJSON(),
      ProductImages: product.ProductImages.map(img => {
        const plainImage = img.toJSON();
        return {
          ...plainImage,
          src: `${BASE_URL}${img.src}`,
        };
      }),
    }));

    return res.status(200).json(modifiedProducts);
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = { 
  productTest,
  getProduct, 
  getCategories, 
  getProductsByCategory
};