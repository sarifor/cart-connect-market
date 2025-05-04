const { Product, ProductImage, Cart } = require('../config/db');
const { Op } = require('sequelize');
require('dotenv').config();

let BASE_URL;

if (process.env.NODE_ENV === 'production') {
  BASE_URL = 'http://ccm-api.sarifor.net';  
} else {
  BASE_URL = 'http://localhost:4000';
}

const getModifiedCart = async (memberId) => {
  try {
    const cart = await Cart.findAll({
      where: {
        member_id: memberId,
      },
      include: [{
        model: Product,
        attributes: ['product_name', 'description', 'price', 'stock'],
        include: [{
          model: ProductImage,
          attributes: ['product_image_id', 'src', 'product_id'],
        }],
      }],
    });

    const modifiedCart = cart.map(eachCart => {
      let eachCartJson = eachCart.toJSON();
      eachCartJson.Product.ProductImages = eachCartJson.Product.ProductImages.map(img => ({
        ...img,
        src: `${BASE_URL}${img.src}`
      }));
      return eachCartJson;
    });

    return modifiedCart;
  } catch (error) {
    throw new Error(`장바구니 조회 실패: ${error}`);
  }
};

// Q. 에러 핸들링 중앙화?
const getCart = async (req, res, next) => {
  try {
    // 로그인한 회원인지 확인하고,
    if (!req.session.member) {
      return res.status(401).send("로그인이 필요합니다.");
    }

    // 응답으로 장바구니 목록 반환
    const modifiedCart = await getModifiedCart(req.session.member.member_id);

    res.status(200).json(modifiedCart);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Q. incrementCart로 수정할까?
// Q. decrementCart와의 공통 로직을 별도의 함수로 빼낸다면 어떤 이름이 좋을까?
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

    // 응답으로 장바구니 목록 반환
    const modifiedCart = await getModifiedCart(req.session.member.member_id);

    res.status(200).json(modifiedCart);
  } catch (error) {
    res.status(500).json(error);    
  }
};

const decrementCart = async (req, res, next) => {
  try {
    // 로그인한 회원인지 확인하고,
    if (!req.session.member.member_id) {
      return res.status(401).send("로그인이 필요합니다.");
    }

    // 클라이언트로부터 상품 ID와 수량 받음
    const idAndCount = req.body;
    const productId = Number(idAndCount.productId);
    const productQuantity = Number(idAndCount.quantity);

    // 상품 테이블을 조회하여, 판매 중인지 체크
    const existingProduct = await Product.findOne({
      where: {
        product_id: productId,
        status: 1
      },
      attributes: ['product_id'],
      raw: true,
    });

    // 판매 중이 아니면 처리 중단 
    if (!existingProduct) {
      res.status(401).send('구매할 수 없는 상품입니다.');
    }

    // 이미 담긴 상품인가 검증
    const existingCart = await Cart.findOne({
      where: {
        member_id: req.session.member.member_id,
        product_id: existingProduct.product_id,
      },
      raw: true,
    });

    // 수량이 0 이하이면 장바구니에서 상품을 삭제하고, 아니라면 상품 수량 감소 처리만 하기
    if (existingCart) {
      const newQuantity = existingCart.quantity - productQuantity;

      if (newQuantity <= 0) {
        await Cart.destroy({
          where: {
            member_id: req.session.member.member_id,
            product_id: existingProduct.product_id,            
          }
        });
      } else {
        await Cart.update(
          {
            quantity: newQuantity,
          },
          {
            where: {
              member_id: req.session.member.member_id,
              product_id: existingProduct.product_id,
            }
          }
        );
      }
    }

    // 응답으로 장바구니 목록 반환
    const modifiedCart = await getModifiedCart(req.session.member.member_id);

    res.status(200).json(modifiedCart);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteCart = async (req, res, next) => {
  try {
    // 로그인한 회원인지 확인하고,
    if (!req.session.member.member_id) {
      return res.status(401).send("로그인이 필요합니다.");
    }

    // 클라이언트로부터 상품 ID 확보
    const productId = Number(req.body.productId);

    // 장바구니에서 상품 삭제   
    await Cart.destroy({
      where: {
        member_id: req.session.member.member_id,
        product_id: productId,
      }
    });

    // 응답으로 장바구니 목록 반환
    const modifiedCart = await getModifiedCart(req.session.member.member_id);

    res.status(200).json(modifiedCart);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { getCart, addCart, decrementCart, deleteCart };