const { mysql, PublicCart, Like, Order, OrderDetail, Product, ProductImage, Member } = require('../config/db');

let BASE_URL;

if (process.env.NODE_ENV === 'production') {
  BASE_URL = 'https://ccm-api.sarifor.net';  
} else {
  BASE_URL = 'http://localhost:4000';
}

// 公開カート一覧取得
// Q. 退会会員の公開カートを表示しないようにするには？
const getPublicCarts = async (req, res, next) => {
  try {
    // 公開カート全件取得（「いいね！」がない場合も含む）
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

    // 商品絵文字配列、「いいね！」数・「いいね！」した会員一覧を追加
    // - falsy値（undefined, null, '', 0, false など）は除外
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

    // 公開カート一覧レスポンス
    return res.status(200).json(modifiedPublicCarts);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

// 公開カート「いいね！」ネットワークデータ取得
// Q. 退会会員の公開カートを表示しないようにするには？
const getPublicCartsNetworkByLikes = async (req, res, next) => {
  try {
    // 1️⃣ 会員ごと → 最新「いいね！」カート3件を接続

    // 公開カート「いいね！」全履歴取得（更新日降順）
    const likes = await Like.findAll({
      where: { status: 1 },
      order: [['updated_at', 'DESC']],
      raw: true,
    });

    // 会員別に「いいね！」した公開カートを分類（最大3件）
    // - memberRecentLikedCarts: 誰がどのカートを「いいね！」したか
    const memberRecentLikedCarts = new Map();

    likes.forEach(({ member_id, public_cart_id, updated_at }) => {
      if (!memberRecentLikedCarts.has(member_id)) {
        memberRecentLikedCarts.set(member_id, []);
      }

      memberRecentLikedCarts.get(member_id).push({ public_cart_id, updated_at });
    });

    // 最新3件のみ保持
    // - 各会員ごとに公開カートIDを updated_at の降順で並び替えた後に処理
    for (const [memberId, carts] of memberRecentLikedCarts) {
      carts.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      memberRecentLikedCarts.set(memberId, carts.slice(0, 3));
    }

    // 会員ごとの公開カート間エッジ生成
    const edges = [];

    for (const [memberId, publiccartidAndUpdatedat] of memberRecentLikedCarts) {
      for (let i = 0; i < publiccartidAndUpdatedat.length - 1; i++) {
        const from = `public-cart-${publiccartidAndUpdatedat[i].public_cart_id}`;
        const to = `public-cart-${publiccartidAndUpdatedat[i + 1].public_cart_id}`;

        edges.push({
          from,
          to,
          group: `member-${memberId}`,
        });
      }
    }

    // 2️⃣ 同じカートを「いいね！」した最新2名基準でカート接続

    // カート別に「いいね！」会員を逆引き
    const likedMembersByCart = new Map();

    for (const [memberId, likedCarts] of memberRecentLikedCarts) {
      for (const { public_cart_id, updated_at } of likedCarts) {
        if (!likedMembersByCart.has(public_cart_id)) {
          likedMembersByCart.set(public_cart_id, []);
        }

        likedMembersByCart.get(public_cart_id).push({
          member_id: Number(memberId),
          updated_at,
        });
      }
    }

    // 各カートごとに最新の「いいね！」会員2名のみを保持
    // - 会員リストを updated_at 基準の降順で並び替えた後に処理
    for (const [cartId, memberInfos] of likedMembersByCart) {
      // updated_at 基準で降順ソート
      memberInfos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

      // 最新2名のみ残し、member_id だけを抽出
      const latestTwo = memberInfos.slice(0, 2).map(m => m.member_id);

      likedMembersByCart.set(cartId, latestTwo);
    }

    // 共通の関心に基づく接続を生成
    // - 同じ公開カートに「いいね！」した最新2名会員の公開カート間の接続を生成
    const edgeSet = new Set();

    for (const [, members] of likedMembersByCart) {
      if (members.length > 1) {
        const [m1, m2] = members; // すでに最新順のため、そのまま使用

        // 各会員が「いいね！」した公開カート一覧を取得
        const carts1 = memberRecentLikedCarts.get(m1) || [];
        const carts2 = memberRecentLikedCarts.get(m2) || [];

        // 各会員が最後（＝最新）に「いいね！」した公開カート間のエッジを作成
        if (carts1.length && carts2.length) {
          // from, to は最後（つまり最新）のカート
          const from = Number(carts1[carts1.length - 1].public_cart_id);
          const to = Number(carts2[carts2.length - 1].public_cart_id);

          // console.log(`会員1 '${m1}' の最後のカートは ${from}、会員2 '${m2}' の最後のカートは ${to}`); // ok

          // 自分自身への接続ではなく、かつ重複していない場合のみエッジを追加
          if (from !== to) {
            const key = [from, to].sort((a, b) => a - b).join('-');

            if (!edgeSet.has(key)) {
              edgeSet.add(key);
              edges.push({
                from,
                to,
                group: 'shared-link',
              });
            }
          }
        }
      }
    }

    // 3️⃣ 最終ノードを生成
    // - 精製されたデータを使用するため、エッジ作成後にノードを生成
    // - publicCartOwnerMap: このカートは「誰」の関心か
    const publicCartOwnerMap = new Map();

    for (const [memberId, carts] of memberRecentLikedCarts) {
      for (const { public_cart_id, updated_at } of carts) {
        const existing = publicCartOwnerMap.get(public_cart_id);

        // 未登録、または更新日時がより新しい場合は更新
        if (!existing || new Date(updated_at) > new Date(existing.updated_at)) {
          publicCartOwnerMap.set(public_cart_id, {
            memberId: Number(memberId),
            updated_at,
          });
        }
      }
    }

    const nodes = [];

    for (const [publicCartId, { memberId }] of publicCartOwnerMap) {
      nodes.push({
        id: `public-cart-${publicCartId}`,
        label: `カート${publicCartId}`,
        shape: "dot",
        group: `member-${memberId}`,
      });
    }

    // 4️⃣ ログイン会員の最新「いいね！」カートID取得
    // - Q. 他会員の「いいね！」ノード列の末尾に接続するには？
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

    // 5️⃣ レスポンス
    return res.status(200).json({ nodes, edges, latestLikedPublicCartId });
  } catch (error) {
    console.log(error);
    
    return res.status(500).send(error);
  }
};

// Q. public-cart_id が 1 の場合、total（最終合計）の値が実際の計算結果と一致しない原因は？
const getPublicCartDetail = async (req, res, next) => {
  try {
    // クライアントから受け取った公開カートIDを確認
    const publicCartId = req.params.publicCartId;

    // 該当する公開カートの詳細情報を取得（退会会員のものは除外）
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

    // JSON 加工
    const publicCartDetailJson = publicCartDetail.toJSON();

    // 画像パス修正
    publicCartDetailJson.Order.OrderDetails = publicCartDetailJson.Order.OrderDetails.map(detail => {
      detail.Product.ProductImages = detail.Product.ProductImages.map(img => ({
        ...img,
        src: `${BASE_URL}${img.src}`
      }));
      return detail;
    });

    // 商品の総数量、商品合計金額を計算
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

    // 「いいね！」数を計算
    const likeCount = await Like.count({
      where: {
        public_cart_id: publicCartId,
        status: 1,
      }
    });

    // フィールドを追加
    publicCartDetailJson.itemQuantityTotal = itemQuantityTotal;
    publicCartDetailJson.itemPriceTotal = itemPriceTotal;
    publicCartDetailJson.likeCount = likeCount;
    publicCartDetailJson.likedMemberIds = likedMemberIdsArray;
    
    // クライアントへ注文データを返却
    return res.status(200).json(publicCartDetailJson);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

const postPublicCart = async (req, res, next) => {
  // トランザクションを手動開始
  const transaction = await mysql.transaction();

  try {
    // ログイン会員か確認
    if (!req.session.member) {
      return res.status(401).send("ログインが必要です。");
    }

    // クライアントから送信されたデータを確認
    const { title, content, selectedOrderId, } = req.body;

    // 注文を検索
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

    // 使用可能な注文か確認
    if (!result || !result.OrderDetails || result.OrderDetails.length === 0) {
      await transaction.rollback();

      return res.status(400).send("公開カートの投稿に必要な条件が揃っていません。最初からやり直してください。");
    } else {
      // 公開カートを作成
      await PublicCart.create({
        member_id: req.session.member.member_id,
        order_id: selectedOrderId,
        title: title,
        content: content,
      }, 
      { 
        transaction: transaction
      });

      // トランザクションをコミット
      await transaction.commit();
      
      // 応答
      return res.status(201).send("公開カートが投稿されました。");

    }
  } catch (error) {
    await transaction.rollback();
    console.error("postPublicCartエラー：", error);
    return res.status(500).send(error);
  }
};

const updatePublicCart = async (req, res, next) => {
  // トランザクションを手動開始
  const transaction = await mysql.transaction();

  try {
    // ログイン会員か確認
    if (!req.session.member) {
      return res.status(401).send("ログインが必要です。");
    }

    // クライアントから送信されたデータを確認
    const { title, content, publicCartId, } = req.body;

    // バリデーション
    if (!title || !content) {
      return res.status(400).send("タイトルと本文の両方を入力してください。");
    }

    if ([...title].length > 20 || [...content].length > 50) {
      return res.status(400).send("タイトルは20文字以内、本文は50文字以内で入力してください。");
    }

    // 公開カートを検索
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
      // 公開カートを更新
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

      // トランザクションをコミット
      await transaction.commit();
      
      // 応答
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