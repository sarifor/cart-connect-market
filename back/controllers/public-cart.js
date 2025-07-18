const { mysql, PublicCart, Like, Order, OrderDetail, Product, ProductImage, Member } = require('../config/db');

let BASE_URL;

if (process.env.NODE_ENV === 'production') {
  BASE_URL = 'https://ccm-api.sarifor.net';  
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
      return res.status(404).send('公開カート情報が見つかりません。');
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

    // 「いいね！」をつけた会員の情報取得
    const likedMemberIds = await Like.findAll({
      where: {
        public_cart_id: publicCartId,
        status: 1,
      },
      attributes: ['member_id'],
      // transaction: transaction,
      raw: true,        
    });     

    const likedMemberIdsArray = likedMemberIds.map(item => item.member_id);

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
    publicCartDetailJson.likedMemberIds = likedMemberIdsArray;
    
    // 클라이언트에게 주문 데이터 응답
    return res.status(200).json(publicCartDetailJson);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

const postPublicCart = async (req, res, next) => {
  // 트랜잭션 수동 시작
  const transaction = await mysql.transaction();

  try {
    // 로그인한 회원인지 확인
    if (!req.session.member) {
      return res.status(401).send("ログインが必要です。");
    }

    // 클라이언트가 보낸 데이터 확인
    const { title, content, selectedOrderId, } = req.body;

    // 주문 조회
    const result = await Order.findOne({
      where: {
        order_id: selectedOrderId,
        member_id: req.session.member.member_id,
        deleted_at: null,
      },
      attributes: ['order_id'],
      include: [{
        model: OrderDetail,
        attributes: ['order_detail_id'],
      }],
      transaction: transaction,
    })

    // 사용할 수 있는 주문인가 검토
    if (!result || !result.OrderDetails || result.OrderDetails.length === 0) {
      await transaction.rollback();

      return res.status(400).send("公開カートの投稿に必要な条件が揃っていません。最初からやり直してください。");
    } else {
      // 공개 장바구니 생성
      await PublicCart.create({
        member_id: req.session.member.member_id,
        order_id: selectedOrderId,
        title: title,
        content: content,
      }, 
      { 
        transaction: transaction
      });

      // 트랜잭션 커밋
      await transaction.commit();
      
      // 응답
      return res.status(201).send("公開カートが投稿されました。");

    }
  } catch (error) {
    await transaction.rollback();
    console.error("postPublicCartエラー：", error);
    return res.status(500).send(error);
  }
};

const updatePublicCart = async (req, res, next) => {
  // 트랜잭션 수동 시작
  const transaction = await mysql.transaction();

  try {
    // 로그인한 회원인지 확인
    if (!req.session.member) {
      return res.status(401).send("ログインが必要です。");
    }

    // 클라이언트가 보낸 데이터 확인
    const { title, content, publicCartId, } = req.body;

    // 유효성 검사
    if (!title || !content) {
      return res.status(400).send("タイトルと本文の両方を入力してください。");
    }

    if ([...title].length > 20 || [...content].length > 50) {
      return res.status(400).send("タイトルは20文字以内、本文は50文字以内で入力してください。");
    }

    // 공개 장바구니 조회
    const result = await PublicCart.findOne({
      where: {
        public_cart_id: publicCartId,
        member_id: req.session.member.member_id,
        deleted_at: null,
      },
      attributes: ['public_cart_id'],
      transaction: transaction,
      raw: true,
    });

    if (!result || !result.public_cart_id) {
      await transaction.rollback();

      return res.status(400).send("公開カートのデータが存在しません。")
    } else {
      // 공개 장바구니 업데이트      
      await PublicCart.update(
        {
          title: title,
          content: content,        
        },        
        {
          where: {
            member_id: req.session.member.member_id,
            public_cart_id: publicCartId,          
          },
          transaction: transaction,
        }
      );

      // 트랜잭션 커밋
      await transaction.commit();
      
      // 응답
      return res.status(200).send("公開カートが更新されました。");
    }
  } catch (error) {
    await transaction.rollback();

    console.error("updatePublicCartエラー：", error);
    
    return res.status(500).send("サーバエラーが発生しました。");
  }
};

const updateLike = async (req, res, next) => {
  // トランザクションを手動開始
  const transaction = await mysql.transaction();

  try {
    // ログイン会員か確認
    if (!req.session.member) {
      return res.status(401).send("ログインが必要です。");
    }    

    // クライアントからのデータ取得
    const { publicCartId } = req.params;

    // 公開カートを検索
    const result = await PublicCart.findOne({
      where: {
        public_cart_id: publicCartId,
        deleted_at: null,
      },
      attributes: ['public_cart_id', 'member_id'],
      transaction: transaction,
      raw: true,
    });

    // 公開カートが存在しなかったら
    if (!result || !result.public_cart_id) {
      await transaction.rollback();

      return res.status(400).send("公開カートのデータが存在しません。");
    
    // 投稿者と「いいね！」をつけた人が同じだったら
    } else if (result.member_id === req.session.member.member_id) {
      await transaction.rollback();

      return res.status(400).send("自分の投稿には「いいね！」をつけられません。");
    } else {
      // 「いいね！」情報を取得
      const likeResult = await Like.findOne({
        where: {
          public_cart_id: publicCartId,
          member_id: req.session.member.member_id,
        },
        attributes: ['like_id', 'status'],
        transaction: transaction,
        raw: true,
      });

      // なかったら生成
      if (!likeResult || !likeResult.like_id) {
        await Like.create(
          {
            public_cart_id: publicCartId,
            member_id: req.session.member.member_id,
            status: 1,
          },
          {
            transaction: transaction,
          }
        );
      
      // 存在すれば更新（トグル）
      } else {      
        await Like.update(
          {
            status: likeResult.status === 1 ? 0 : 1,
          },
          {
            where: {
              like_id: likeResult.like_id,
            },
            transaction: transaction,            
          }
        );      
      };

      const likedMemberIds = await Like.findAll({
        where: {
          public_cart_id: publicCartId,
          status: 1,
        },
        attributes: ['member_id'],
        transaction: transaction,
        raw: true,        
      });

      // トランザクションをコミット
      await transaction.commit();

      const likedMemberIdsArray = likedMemberIds.map(item => item.member_id);
      console.log(likedMemberIdsArray);
      
      // 応答
      return res.status(200).json(likedMemberIdsArray);
    }
  } catch (error) {
    await transaction.rollback();

    console.error("updateLikeエラー：", error);

    return res.status(500).send("サーバエラーが発生しました。");
  }
};

module.exports = { getPublicCarts, getPublicCartsNetworkByLikes, getPublicCartDetail, postPublicCart, updatePublicCart, updateLike, };