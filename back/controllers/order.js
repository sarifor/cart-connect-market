const { Order, OrderDetail, Product, ProductImage } = require('../config/db');
require('dotenv').config();

let BASE_URL;

if (process.env.NODE_ENV === 'production') {
  BASE_URL = 'http://ccm-api.sarifor.net';  
} else {
  BASE_URL = 'http://localhost:4000';
}

const getOrders = async (req, res, next) => {
  try {
    // 로그인한 회원인지 확인
    if (!req.session.member) {
      return res.status(401).send("로그인이 필요합니다.");
    }

    // 로그인한 회원의 모든 주문 조회 (+ 주문 상세, 상품 정보, 상품 이미지 정보)
    const orders = await Order.findAll({
      where: {
        member_id: req.session.member.member_id,
      },
      // order: [
      //  ['created_at', 'DESC']
      // ],
      include: [{
        model: OrderDetail,
        include: [{
          model: Product,
          include: [{
            model: ProductImage,
          }]
        }]
      }]
    });

  const modifiedOrders = orders.map(eachOrder => {
    const eachOrderJson = eachOrder.toJSON();

    eachOrderJson.OrderDetails = eachOrderJson.OrderDetails.map(detail => {
      detail.Product.ProductImages = detail.Product.ProductImages.map(img => ({
        ...img,
        src: `${BASE_URL}${img.src}`
      }));
      return detail;
    });

    return eachOrderJson;
  });

    // 클라이언트에게 주문 목록 데이터 응답
    return res.status(200).json(modifiedOrders);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getOrderDetail = async (req, res, next) => {
  try {
    // 로그인한 회원인지 확인
    if (!req.session.member) {
      return res.status(401).send("로그인이 필요합니다.");
    }

    // 클라이언트로부터 받은 주문 ID 확인
    const orderId = req.params.orderId;

    // 해당 주문 조회(주문 일부 필드, 주문 상세 모든 필드, 상품 모든 필드, 상품 이미지 모든 필드)
    const orderDetail = await Order.findOne({
      where: {
        member_id: req.session.member.member_id,
        order_id: orderId,
      },
      attributes: ['shipping_fee', 'payment', 'total'],
      include: [{
        model: OrderDetail,
        include: [{
          model: Product,
          include: [{
            model: ProductImage,
          }]
        }]        
      }]
    });

    if (!orderDetail) {
      return res.status(404).send('주문 상세 정보를 찾을 수 없습니다.');
    }

    // JSON 가공
    const orderDetailJson = orderDetail.toJSON();

    // 이미지 경로 수정
    orderDetailJson.OrderDetails = orderDetailJson.OrderDetails.map(detail => {
      detail.Product.ProductImages = detail.Product.ProductImages.map(img => ({
        ...img,
        src: `${BASE_URL}${img.src}`
      }));
      return detail;
    });

    // 지불 방법 수정
    const paymentMap = {
      1: '신용카드',
      2: '代引き',
      3: '프로모션 코드',
      4: '쿠폰',
    };

    orderDetailJson.payment = paymentMap[orderDetailJson.payment] || '알 수 없음';

    // 상품 총 개수, 상품 총 가격, 세금 계산
    const itemQuantityTotal = orderDetailJson.OrderDetails.reduce((acc, cur) => acc + cur.quantity, 0);
    const itemPriceTotal = orderDetailJson.OrderDetails.reduce((acc, cur) => acc + (cur.Product.price * cur.quantity), 0);
    const tax = Math.round(itemPriceTotal * 0.1);

    // 필드 추가
    orderDetailJson.itemQuantityTotal = itemQuantityTotal;
    orderDetailJson.itemPriceTotal = itemPriceTotal;
    orderDetailJson.tax = tax;
    
    // 클라이언트에게 주문 데이터 응답
    res.status(200).json(orderDetailJson);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { 
  getOrders,
  getOrderDetail,
};