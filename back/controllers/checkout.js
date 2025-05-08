const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const { mysql, ShippingAddress, Cart, Product, Order, OrderDetail } = require('../config/db');

const createOrder = async (req, res, next) => {
  const transaction = await mysql.transaction();

  try {
    // 로그인한 회원인지 확인
    if (!req.session.member) {
      return res.status(401).send("로그인이 필요합니다.");
    }

    // 클라이언트가 보낸 데이터 확인
    const {
      shippingAddress,
      selectedDeliveryDate,
      selectedDeliveryTime,
      selectedPayment,
    } = req.body;

    let selectedPaymentNumber;

    if (selectedPayment === '신용카드') {
      selectedPaymentNumber = 1;
    } else if (selectedPayment === '代引き') {
      selectedPaymentNumber = 2;
    } else if (selectedPayment === '프로모션 코드') {
      selectedPaymentNumber = 3;
    } else if (selectedPayment === '쿠폰') {
      selectedPaymentNumber = 4;
    }

    // 결제 검증
    // TBD

    // 장바구니 아이템 조회
    const cartItems = await Cart.findAll({ 
      where: {
        member_id: req.session.member.member_id,
      },
      include: [{
        model: Product,
        attributes: ['price'],
      }],
      transaction: transaction,
      // raw: true,
    });

    // 장바구니에 상품이 1개 이상이고, 필요 조건이 갖춰지면
    if (cartItems.length > 0 && shippingAddress && selectedDeliveryDate && selectedDeliveryTime && selectedPaymentNumber) {
      // 파생값 생성
      const itemPriceTotal = cartItems.reduce((acc, cur) => acc + (cur.Product.price * cur.quantity), 0);
      const shippingFee = itemPriceTotal > 2000 ? 0 : 200;
      const tax = Math.round(itemPriceTotal * 0.1);
      const finalTotal = itemPriceTotal + shippingFee + tax;

      // 주문 생성
      const order = await Order.create(
        {
          member_id: req.session.member.member_id,
          payment: selectedPaymentNumber,
          receiver: shippingAddress.receiver,
          address: shippingAddress.address,
          postcode: shippingAddress.postcode,
          shipping_fee: shippingFee,
          total: finalTotal,
          status: 1, // 결제 완료
        },
        { 
          transaction: transaction
        },
      );

      // 주문 상세 생성
      if (order) {
        for (const item of cartItems) {
          await OrderDetail.create({
            order_id: order.order_id,
            product_id: item.product_id,
            public_cart_id: item.public_cart_id,
            quantity: item.quantity,
            purchase_price: item.Product.price,
          }, 
          { transaction: transaction });
        }
      }

      // 장바구니 삭제
      await Cart.destroy({
        where: {
          member_id: req.session.member.member_id,
        },
        transaction: transaction,
      });

      await transaction.commit();

      // 응답
      res.status(201).send("주문이 생성되었습니다");      
    } else {
      await transaction.rollback();
      console.error("주문 생성에 필요한 조건이 갖춰지지 않았습니다.", {
        cartLength: cartItems?.length,
        shippingAddress,
        selectedDeliveryDate,
        selectedDeliveryTime,
        selectedPaymentNumber,
      });
      res.status(400).send("주문 생성에 필요한 조건이 갖춰지지 않았습니다. 처음부터 다시 시도해 주세요.");
    }
  } catch (error) {
    await transaction.rollback();
    console.error("createOrder 에러: ", error);
    res.status(500).send(error);
  }
};

const getShippingAddress = async (req, res, next) => {
  try {
    // 로그인한 회원인지 확인하고,
    if (!req.session.member) {
      return res.status(401).send("로그인이 필요합니다.");
    }

    // 응답으로 배송처 목록 반환
    const shippingAddresses = await ShippingAddress.findAll({
      where: {
        member_id: req.session.member.member_id,
      },
    });

    res.status(200).json(shippingAddresses);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Q. ChatGPT에 의하면 'dayjs.tz(date, 'Asia/Tokyo')처럼 명시적으로 지정하는 게 안전합니다'라는데, 이렇게 고쳐야 하나?
const getServerTime = async (req, res, next) => {
  try {
    // 응답으로 서버 시간(JST) 반환
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.tz.setDefault('Asia/Tokyo');
    // const currentServerTime = dayjs.tz().format("YYYY-MM-DD HH:mm:ss");
    const currentServerTime = dayjs.tz().format();

    res.status(200).json(currentServerTime);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { createOrder, getShippingAddress, getServerTime };