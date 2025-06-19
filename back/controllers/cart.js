const { mysql, Product, ProductImage, Cart, PublicCart, Order, OrderDetail } = require('../config/db');
const { Op } = require('sequelize');

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
    throw new Error(`カート照会失敗: ${error}`);
  }
};

// Q. 에러 핸들링 중앙화?
const getCart = async (req, res, next) => {
  try {
    // 로그인한 회원인지 확인하고,
    if (!req.session.member) {
      return res.status(401).send("ログインが必要です。");
    }

    // 응답으로 장바구니 목록 반환
    const modifiedCart = await getModifiedCart(req.session.member.member_id);

    return res.status(200).json(modifiedCart);
  } catch (error) {
    return res.status(500).send(error);
  }
};

// Q. incrementCart로 수정할까?
// Q. decrementCart와의 공통 로직을 별도의 함수로 빼낸다면 어떤 이름이 좋을까?
// Q. existingCart -> alreadyInCart로 고칠까?
const addCart = async (req, res, next) => {
  try {
    // 로그인한 회원인지 확인하고,
    if (!req.session.member.member_id) {
      return res.status(401).send("ログインが必要です。");
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
      return res.status(401).send('購入できない商品です。');
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

    return res.status(200).json(modifiedCart);
  } catch (error) {
    return res.status(500).json(error);    
  }
};

// Q. existingCart -> alreadyInCart로 고칠까?
const decrementCart = async (req, res, next) => {
  try {
    // 로그인한 회원인지 확인하고,
    if (!req.session.member.member_id) {
      return res.status(401).send("ログインが必要です。");
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
      return res.status(401).send('購入できない商品です。');
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

    return res.status(200).json(modifiedCart);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const deleteCart = async (req, res, next) => {
  try {
    // 로그인한 회원인지 확인하고,
    if (!req.session.member.member_id) {
      return res.status(401).send("ログインが必要です。");
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

    return res.status(200).json(modifiedCart);
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Q. 재고 유무도 조건 포함?
const copyCart = async (req, res, next) => {
  // 트랜잭션 수동 시작
  const transaction = await mysql.transaction();

  try {
    // 로그인한 회원인지 확인 
    if (!req.session.member.member_id) {
      await transaction.rollback();
      return res.status(401).send("ログインが必要です。");
    }

    // 클라이언트로부터 공개 장바구니 ID 확보
    const { publicCartId } = req.body;
    
    // 공개 장바구니 -> 주문 -> 주문 상세 -> 상품 테이블을 조회하여, 판매 중인 상품 구매 이력만 필터링
    const existingProducts = await PublicCart.findOne({
      where: {
        public_cart_id: publicCartId,
        deleted_at: null,
      },
      attributes: ['public_cart_id'],
      include: [
        {
          model: Order,
          attributes: ['order_id'],
          include: [{
            model: OrderDetail,
            attributes: ['product_id', 'quantity', 'purchase_price'],
            include: [{
              model: Product,
              attributes: ['product_name', 'description', 'price'],
              where: { status: 1 },
            }]
          }]
        },
      ]
    }, { transaction: transaction });

    // 판매 중인 상품이 없으면 처리 중단
    if (!existingProducts) {
      await transaction.rollback();
      return res.status(400).send('購入可能な商品がありません。');
    }

    // 상품 ID, 수량 세트 배열 생성
    const productIdAndQuantity = existingProducts.Order.OrderDetails.map((item) => {
      return {
        product_id: item.product_id, 
        quantity: item.quantity 
      };
    });

    // 로그인 회원의 장바구니에 이미 있는 상품, 없는 상품 나누기
    const alreadyInCart = [];
    const notInCart = [];

    for (const item of productIdAndQuantity) {
      const searchResult = await Cart.findOne({
        where: {
          member_id: req.session.member.member_id,
          product_id: item.product_id,
        }
      }, { transaction: transaction });

      if (searchResult) {
        alreadyInCart.push(item);
      } else {
        notInCart.push(item);
      }
    }

    // 장바구니에 이미 담긴 상품 -> 수량 갱신, 공개 장바구니 ID 기록
    if (alreadyInCart.length > 0) {
      for (const item of alreadyInCart) {

        const currentRecord = await Cart.findOne({
          where: {
            member_id: req.session.member.member_id,
            product_id: item.product_id,
          }
        }, { transaction: transaction });

        const newQuantity = currentRecord.quantity + item.quantity;

        await Cart.update(
          {
            quantity: newQuantity,
            public_cart_id: publicCartId,
          },
          {
            where: {
              member_id: req.session.member.member_id,
              product_id: item.product_id,
            }
          },
          { transaction: transaction }
        );
      }
    } 
    
    // 장바구니에 없는 상품 -> 새 레코드 추가, 공개 장바구니 ID 기록
    if (notInCart.length > 0) {
      for (const item of notInCart) {     
        await Cart.create({
          member_id: req.session.member.member_id,
          product_id: item.product_id,
          quantity: item.quantity,
          public_cart_id: publicCartId,
        }, 
        { transaction: transaction });
      }
    }

    await transaction.commit();

    // 200 상태만 응답
    return res.sendStatus(200);
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    return res.status(500).send(error);
  }
};

module.exports = { getCart, addCart, decrementCart, deleteCart, copyCart };