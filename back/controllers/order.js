const { Order, OrderDetail, Product, ProductImage, PublicCart } = require('../config/db');
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
      return res.status(401).send("ログインが必要です。");
    }

    // 로그인한 회원의 모든 주문 조회 (+ 주문 상세, 상품 정보, 상품 이미지 정보)
    const orders = await Order.findAll({
      where: {
        member_id: req.session.member.member_id,
        deleted_at: null,
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
    return res.status(500).send(error);
  }
};

const getOrderDetail = async (req, res, next) => {
  try {
    // 로그인한 회원인지 확인
    if (!req.session.member) {
      return res.status(401).send("ログインが必要です。");
    }

    // 클라이언트로부터 받은 주문 ID 확인
    const orderId = req.params.orderId;

    // 해당 주문 조회(주문 일부 필드, 주문 상세 모든 필드, 상품 모든 필드, 상품 이미지 모든 필드)
    const orderDetail = await Order.findOne({
      where: {
        member_id: req.session.member.member_id,
        order_id: orderId,
        deleted_at: null,
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
      return res.status(404).send('注文情報が見つかりません。');
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
      1: 'クレジットカード',
      2: '代引き',
      3: 'プロモーションコード',
      4: 'クーポン',
    };

    orderDetailJson.payment = paymentMap[orderDetailJson.payment] || '不明';

    // 상품 총 개수, 상품 총 가격, 세금 계산
    const itemQuantityTotal = orderDetailJson.OrderDetails.reduce((acc, cur) => acc + cur.quantity, 0);
    const itemPriceTotal = orderDetailJson.OrderDetails.reduce((acc, cur) => acc + (cur.purchase_price * cur.quantity), 0);
    const tax = Math.round(itemPriceTotal * 0.1);

    // 필드 추가
    orderDetailJson.itemQuantityTotal = itemQuantityTotal;
    orderDetailJson.itemPriceTotal = itemPriceTotal;
    orderDetailJson.tax = tax;
    
    // 클라이언트에게 주문 데이터 응답
    return res.status(200).json(orderDetailJson);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const getOrderSummary = async (req, res, next) => {
  try {
    // 로그인한 회원인지 확인
    if (!req.session.member) {
      return res.status(401).send("ログインが必要です。");
    }

    // 로그인한 회원의 모든 주문 조회 (+ 주문 상세, 상품 정보, 공개 장바구니 정보)
    // - 내림차순 정렬
    const orders = await Order.findAll({
      where: {
        member_id: req.session.member.member_id,
        deleted_at: null,
      },
      attributes: ['order_id', 'created_at'],
      order: [
       ['created_at', 'DESC']
      ],
      include: [
        {
          model: OrderDetail,
          attributes: ['order_detail_id', 'quantity'],
          include: [{
            model: Product,
            attributes: ['product_name', 'emoji'],
          }],
        },
        {
          model: PublicCart,
          attributes: ['public_cart_id'],
          where: { deleted_at: null },
          required: false,
        },
      ]
    });

    const modifiedOrders = orders.map((order) => {
      const raw = order.toJSON();
      const { OrderDetails, PublicCart, ...rest } = raw;

      let quantitySum = 0;
      let emojiArray = [];
      
      // 상품 총 개수, 이모지 배열 계산
      OrderDetails.forEach((detail) => {
        quantitySum += detail.quantity;
        emojiArray.push(detail.Product.emoji);
      });

      // 대표 상품명 취득
      const firstProductName = OrderDetails[0].Product.product_name;

      // 상품 종류 개수 취득
      const orderLength = OrderDetails.length;

      // 이미지 배열을 한 문자열로 가공
      const mergedEmojiArray = Array.from(emojiArray.join('') || '').slice(0, 8).join('');

      return {
        ...rest,
        quantitySum,
        productEmojis: mergedEmojiArray,
        firstProductName,
        public_cart_id: PublicCart?.public_cart_id || null,
        orderLength: orderLength,
      }
    });

    // Select options 객체 형태로 만들기
    const ordersInOptionFormat = modifiedOrders.map((order) => {
      const orderDate = new Date(order.created_at).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      
      const etc = order.orderLength > 1 ? ' 他' : '';

      if (order.public_cart_id) {
        return {
          value: `${order.order_id}-${order.public_cart_id}`,
          label: `[${orderDate}] ${order.firstProductName}${etc}（計${order.quantitySum}点）${order.productEmojis} →公開済み`,
          disabled: true,
        }
      } else {
        return {
          value: String(order.order_id),
          label: `[${orderDate}] ${order.firstProductName}${etc}（計${order.quantitySum}点）${order.productEmojis}`,
        }
      }
    });

    // 클라이언트에게 데이터 응답
    return res.status(200).json(ordersInOptionFormat);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

module.exports = { 
  getOrders,
  getOrderDetail,
  getOrderSummary,
};