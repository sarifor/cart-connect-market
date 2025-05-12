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

// const getOrder = () => {};

module.exports = { 
  getOrders,
  // getOrder
};