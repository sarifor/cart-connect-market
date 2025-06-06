const { PublicCart, Like, Order, OrderDetail, Product, ProductImage, Member } = require('../config/db');
require('dotenv').config();

let BASE_URL;

if (process.env.NODE_ENV === 'production') {
  BASE_URL = 'http://ccm-api.sarifor.net';  
} else {
  BASE_URL = 'http://localhost:4000';
}

// 공개 장바구니 목록 조회
// Q. 탈퇴 회원의 공개 장바구니를 안 보이게 하려면?
const getPublicCarts = async (req, res, next) => {
  try {
    // 공개 장바구니 전체 조회('좋아요' 없는 경우도 포함)
    const publicCarts = await PublicCart.findAll({
      include: [
        {
          model: Like,
          where: { status: 1 },
          required: false,
          attributes: ['member_id'],
        },
        {
          model: Order,
          include: [{
            model: OrderDetail,
            include: [{
              model: Product,
            }]
          }]
        }
      ]
    });

    // 상품 이모지 배열, '좋아요 수'와 '좋아요 한 회원 목록' 속성 및 값 추가
    // - 상품 이모지 배열을 만들 때 undefined, null, '', 0, false 같은 falsy 값 제거
    const modifiedPublicCarts = publicCarts.map(publicCart => {
      const raw = publicCart.toJSON();
      const { Likes, Order, ...rest } = raw;
      const likedBy = Likes?.map(like => like.member_id) || [];

      const emojis = Order.OrderDetails
        ?.map(detail => detail.Product?.emoji)
        .filter(v => v)
        || [];

      return {
        ...rest,
        emojis: emojis,
        likeCount: likedBy.length,
        likedBy: likedBy,
      }
    });

    // 공개 장바구니 목록 데이터 응답
    return res.status(200).json(modifiedPublicCarts);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

// 공개 장바구니 연결 관계 네트워크 데이터 조회
// Q. label에 공개 장바구니 '제목'을 표시할까?
// Q. 탈퇴 회원의 공개 장바구니를 안 보이게 하려면?
const getPublicCartsNetworkByLikes = async (req, res, next) => {
  try {
    // 공개 장바구니 '좋아요' 전체 이력 조회
    const likes = await Like.findAll({
      where: { status: 1 },
      order: [['updated_at', 'ASC']],
      raw: true,
    });
    
    // 노드 구성
    // - 노드 = 공개 장바구니
    // - 노드는 가장 마지막에 '좋아요' 한 회원 그룹으로 분류
    const publicCartToLastMemberMap = {};

    likes.forEach(({ member_id, public_cart_id }) => {
      publicCartToLastMemberMap[public_cart_id] = member_id;
    });

    const nodes = Object.entries(publicCartToLastMemberMap).map(([ publicCartId, memberId ]) => ({
      id: `public-cart-${publicCartId}`,
      label: `カート${publicCartId}`,
      shape: "dot",
      group: `member-${memberId}`,
    }));


    // 사용자별 '좋아요' 한 공개 장바구니 분류
    const memberToFinalLikedPublicCarts = {};

    likes.forEach(({ member_id, public_cart_id }) => {
      if (publicCartToLastMemberMap[public_cart_id] === member_id) {
        if (!memberToFinalLikedPublicCarts[member_id]) {
          memberToFinalLikedPublicCarts[member_id] = [];
        }
        if (!memberToFinalLikedPublicCarts[member_id].includes(public_cart_id)) {
          memberToFinalLikedPublicCarts[member_id].push(public_cart_id);
        }
      }
    });


    // 엣지 구성
    // - 회원별로 '좋아요' 한 공개 장바구니를, '좋아요' 갱신 일시 순으로 연결
    const edges = [];

    for (const [ member_id, public_carts_ids ] of Object.entries(memberToFinalLikedPublicCarts)) {
      for (let i = 0; i < public_carts_ids.length - 1; i++) {
        const from = `public-cart-${public_carts_ids[i]}`;
        const to = `public-cart-${public_carts_ids[i + 1]}`;
        edges.push({ from, to, group: `member-${member_id}` });
      }
    }

    // 로그인 회원이 가장 최근에 '좋아요' 누른 공개 장바구니 아이디 조회
    // - Q. 다른 회원의 '좋아요' 노드 타래 맨 끝에 붙게 하려면?
    let latestLikedPublicCartId;

    if (!req.session?.member?.member_id) {
      latestLikedPublicCartId = null;
    } else {
      const latestLikedPublicCart = await Like.findOne({
        where: {
          member_id: req.session.member.member_id,
          status: 1,
        },
        order: [['updated_at', 'DESC']],
        attributes: ['public_cart_id'],
        raw: true,
      });

      latestLikedPublicCartId = latestLikedPublicCart?.public_cart_id || null;
    }

    // 공개 장바구니 연결 관계 네트워크 데이터 응답
    return res.status(200).json({ nodes, edges, latestLikedPublicCartId });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

// Q. public-cart_id 1의 경우 total(최종 합계) 값이 실제 계산값과 맞지 않는데 원인이 뭘까?
const getPublicCartDetail = async (req, res, next) => {
  try {
    // 클라이언트로부터 받은 공개 장바구니 ID 확인
    const publicCartId = req.params.publicCartId;

    // 해당 공개 장바구니 상세 정보 조회(탈퇴 회원 것은 제외)
    const publicCartDetail = await PublicCart.findOne({
      where: {
        public_cart_id: publicCartId,
      },
      attributes: ['public_cart_id', 'member_id', 'title', 'content', 'created_at'],
      include: [
        {
          model: Order,
          attributes: ['created_at'],
          include: [{
            model: OrderDetail,
            attributes: ['product_id', 'quantity', 'purchase_price'],
            include: [{
              model: Product,
              attributes: ['product_name', 'description'],
              include: [{
                model: ProductImage,
                attributes: ['src'],
              }]
            }]
          }]
        },
        {
          model: Member,
          attributes: ['nickname'],
          where: { deleted_at: null },
          required: true,
        },
      ]
    });

    if (!publicCartDetail) {
      return res.status(404).send('공개 장바구니 정보를 찾을 수 없습니다.');
    }

    // JSON 가공
    const publicCartDetailJson = publicCartDetail.toJSON();

    // 이미지 경로 수정
    publicCartDetailJson.Order.OrderDetails = publicCartDetailJson.Order.OrderDetails.map(detail => {
      detail.Product.ProductImages = detail.Product.ProductImages.map(img => ({
        ...img,
        src: `${BASE_URL}${img.src}`
      }));
      return detail;
    });

    // 상품 총 개수, 상품 총 가격 계산
    const itemQuantityTotal = publicCartDetailJson.Order.OrderDetails.reduce((acc, cur) => acc + cur.quantity, 0);
    const itemPriceTotal = publicCartDetailJson.Order.OrderDetails.reduce((acc, cur) => acc + (cur.purchase_price * cur.quantity), 0);

    // 좋아요 개수 계산
    const likeCount = await Like.count({
      where: {
        public_cart_id: publicCartId,
        status: 1,
      }
    });

    // 필드 추가
    publicCartDetailJson.itemQuantityTotal = itemQuantityTotal;
    publicCartDetailJson.itemPriceTotal = itemPriceTotal;
    publicCartDetailJson.likeCount = likeCount;
    
    // 클라이언트에게 주문 데이터 응답
    return res.status(200).json(publicCartDetailJson);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

module.exports = { getPublicCarts, getPublicCartsNetworkByLikes, getPublicCartDetail };