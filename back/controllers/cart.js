const { Product, ProductImage, Cart } = require('../config/db');
const { Op } = require('sequelize');
require('dotenv').config();

let BASE_URL;

if (process.env.NODE_ENV === 'production') {
  BASE_URL = 'http://ccm-api.sarifor.net';  
} else {
  BASE_URL = 'http://localhost:4000';
}

// Q. 에러 핸들링 중앙화?
const getCart = async (req, res, next) => {
  try {
    // 로그인한 회원인지 확인하고,
    if (!req.session.member) {
      return res.status(401).send("로그인이 필요합니다.");
    }

    // 장바구니에 담긴 상품 목록을 조회하여,
    const cartItems = await Cart.findAll({
      where: {
        member_id: req.session.member.member_id,
      },
      raw: true,
    });
    
    // 결과 전송
    if (cartItems.length >= 0) {
      res.status(200).json(cartItems);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const addCart = async (req, res, next) => {
  try {
    // 로그인한 회원인지 확인하고,
    if (!req.session.member.member_id) {
      return res.status(401).send("로그인이 필요합니다.");
    }

    // 클라이언트로부터 상품 ID와 수량 확보
    const idAndCount = req.body;
    const productId = Number(idAndCount.productId);
    const productQuantity = Number(idAndCount.quantity);

    // 상품 테이블을 조회하여, 판매 중인지 체크함
    const existingProduct = await Product.findOne({
      where: {
        product_id: productId,
        status: 1
      },
      attributes: ['product_id'],
      raw: true,
    });

    // 판매 중이 아니면 처리 중단하고, 
    if (!existingProduct) {
      res.status(401).send('구매할 수 없는 상품입니다.');
    }

    // 판매 중이라면 장바구니 테이블에 저장
    // - 이미 담긴 상품이면 수량 갱신
    // - 없으면 새 레코드 추가
    const existingCart = await Cart.findOne({
      where: {
        member_id: req.session.member.member_id,
        product_id: existingProduct.product_id,
      },
      raw: true,
    });

    if (existingCart) {
      await Cart.update(
        {
          quantity: existingCart.quantity + productQuantity
        },
        {
          where: {
            member_id: req.session.member.member_id,
            product_id: existingProduct.product_id,
          }
        }
      );
    } else {
      await Cart.create({
        member_id: req.session.member.member_id,
        product_id: existingProduct.product_id,
        quantity: productQuantity,
        public_cart_id: null,
      });      
    }

    // 응답으로 장바구니 목록(+상품 정보 & 상품 이미지 정보) 반환
    // - 직접 JSON 포매팅
    const cart = await Cart.findAll({
      where: {
        member_id: req.session.member.member_id,
      },
      include: [{
        model: Product,
        attributes: ['product_name', 'description', 'price'],
        include: [{
          model: ProductImage,
          attributes: ['product_image_id', 'src', 'product_id'],
        }],
      }],
      // raw: true,
    });

    const modifiedCart = cart.map(eachCart => {
      let eachCartJson = eachCart.toJSON();
      eachCartJson.Product.ProductImages = eachCartJson.Product.ProductImages.map(img => ({
        ...img,
        src: `${BASE_URL}${img.src}`
      }));
      return eachCartJson;
    });

    res.status(200).json(modifiedCart);
  } catch (error) {
    res.status(500).json(error);    
  }
};

// 클라이언트로부터 상품 ID 배열을 받을 경우의 처리
// - 예: [1, 1, 1, 2, 2, 3, 3, 3, 3]
/* const addCart = async (req, res, next) => {
  try {
    // 로그인한 회원인지 확인하고,
    if (!req.session.member.member_id) {
      return res.status(401).send("로그인이 필요합니다.");
    }

    // 클라이언트로부터 받은 상품 ID 배열로,
    // const productIds = req.body.productIds;

    // 상품 테이블을 조회하여, 판매 중인 상품 ID만 모음
    const existingProductIds = await Product.findAll({
      where: {
        product_id: { [Op.in]: productIds },
        status: 1
      },
      attributes: ['product_id'],
      raw: true
    });

    // 판매 중인 상품 ID 모음에서, 상품 아이디 값만 추출하기
    const idValues = existingProductIds.map(product => product.product_id);

    // 클라이언트로부터 받은 상품 ID 배열에서, 유효한 값만 골라내기
    const validProductIds = productIds.filter(id => idValues.includes(id));
    
    // 상품별 수량 조사하여,
    const idsAndCounts = validProductIds.reduce((acc, cur) => {
      const currentCount = acc.get(cur) || 0;
      acc.set(cur, currentCount + 1);
      return acc;
    }, new Map());
    
    // 장바구니 테이블에 저장하고,
    // - 이미 담긴 상품이면 수량 갱신
    // - 없으면 새 레코드 추가
    for ( const [ product_id, quantity ] of idsAndCounts ) {
      const existingCart = await Cart.findOne({
        where: {
          member_id: req.session.member.member_id,
          product_id: product_id,
        }
      });

      if (existingCart) {
        await Cart.update(
          { quantity: existingCart.quantity + quantity },
          {
            where: {
              member_id: req.session.member.member_id,
              product_id: product_id,
            }
          }
        );
      } else {
        await Cart.create({
          member_id: req.session.member.member_id,
          product_id: product_id,
          quantity: quantity,
          public_cart_id: null,
        });
      }
    }
    
    // 응답으로 장바구니 목록(+상품 정보 & 상품 이미지 정보) 반환
    // - Cart + Product, ProductImage
    // - 직접 JSON 포매팅
    const cart = await Cart.findAll({
      where: {
        member_id: req.session.member.member_id,
      },
      include: [{
        model: Product,
        attributes: ['product_name', 'description', 'price'],
        include: [{
          model: ProductImage,
          attributes: ['product_image_id', 'src', 'product_id'],
        }],
      }],
      // raw: true,
    });

    const modifiedCart = cart.map(eachCart => {
      let eachCartJson = eachCart.toJSON();
      eachCartJson.Product.ProductImages = eachCartJson.Product.ProductImages.map(img => ({
        ...img,
        src: `${BASE_URL}${img.src}`
      }));
      return eachCartJson;
    });

    res.status(200).json(modifiedCart);
  } catch (error) {
    res.status(500).send(error);
  }
}; */

module.exports = { getCart, addCart };