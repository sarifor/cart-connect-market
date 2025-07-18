const { mysql, Product, ProductImage, Cart, PublicCart, Order, OrderDetail } = require('../config/db');
const { Op } = require('sequelize');

let BASE_URL;

if (process.env.NODE_ENV === 'production') {
  BASE_URL = 'https://ccm-api.sarifor.net';  
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

// Q. エラーハンドリングを1か所にまとめて管理？
const getCart = async (req, res, next) => {
  try {
    // ログイン会員か確認
    if (!req.session.member) {
      return res.status(401).send("ログインが必要です。");
    }

    const modifiedCart = await getModifiedCart(req.session.member.member_id);

    // カートリスト応答
    return res.status(200).json(modifiedCart);
  } catch (error) {
    return res.status(500).send(error);
  }
};

// Q. incrementCartに修正？
// Q. existingCartをalreadyInCartに改名？
const addCart = async (req, res, next) => {
  try {
    // ログイン会員か確認
    if (!req.session.member.member_id) {
      return res.status(401).send("ログインが必要です。");
    }

    // クライアントからの商品IDと数量
    const idAndCount = req.body;
    const productId = Number(idAndCount.productId);
    const productQuantity = Number(idAndCount.quantity);

    // 商品テーブルを照会して販売中かどうかを確認
    const existingProduct = await Product.findOne({
      where: {
        product_id: productId,
        status: 1
      },
      attributes: ['product_id'],
      raw: true,
    });

    // 販売中でない場合は処理を中断
    if (!existingProduct) {
      return res.status(401).send('購入できない商品です。');
    }

    // 販売中であればカートテーブルに保存
    // - すでに保存済みの商品であれば数量を更新
    // - なければ新しいレコードを追加
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

    // カートリスト応答
    const modifiedCart = await getModifiedCart(req.session.member.member_id);

    return res.status(200).json(modifiedCart);
  } catch (error) {
    return res.status(500).json(error);    
  }
};

// Q. existingCart -> alreadyInCartに改名？
const decrementCart = async (req, res, next) => {
  try {
    // ログイン会員か確認
    if (!req.session.member.member_id) {
      return res.status(401).send("ログインが必要です。");
    }

    // クライアントからの商品IDと数量
    const idAndCount = req.body;
    const productId = Number(idAndCount.productId);
    const productQuantity = Number(idAndCount.quantity);

    // 商品テーブルを照会して販売中かどうかを確認
    const existingProduct = await Product.findOne({
      where: {
        product_id: productId,
        status: 1
      },
      attributes: ['product_id'],
      raw: true,
    });

    // 販売中でない場合は処理を中断
    if (!existingProduct) {
      return res.status(401).send('購入できない商品です。');
    }

    // すでに保存済みの商品かどうか確認
    const existingCart = await Cart.findOne({
      where: {
        member_id: req.session.member.member_id,
        product_id: existingProduct.product_id,
      },
      raw: true,
    });

    // 数量が0以下の場合はカートから商品を削除し、そうでなければ商品の数量を減らすだけ
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

    // カートリスト応答
    const modifiedCart = await getModifiedCart(req.session.member.member_id);

    return res.status(200).json(modifiedCart);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const deleteCart = async (req, res, next) => {
  try {
    // ログイン会員か確認
    if (!req.session.member.member_id) {
      return res.status(401).send("ログインが必要です。");
    }

    // クライアントからの商品ID
    const productId = Number(req.body.productId);

    // カートから商品を削除  
    await Cart.destroy({
      where: {
        member_id: req.session.member.member_id,
        product_id: productId,
      }
    });

    // カートリスト応答
    const modifiedCart = await getModifiedCart(req.session.member.member_id);

    return res.status(200).json(modifiedCart);
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Q. 在庫の有無も条件に含むべき？
const copyCart = async (req, res, next) => {
  // トランザクション手動スタート
  const transaction = await mysql.transaction();

  try {
    // ログイン会員か確認 
    if (!req.session.member.member_id) {
      await transaction.rollback();
      return res.status(401).send("ログインが必要です。");
    }

    // クライアントからの公開カートID
    const { publicCartId } = req.body;
    
    // 公開カート、注文、注文詳細、商品テーブルの順に照会し、販売中の商品購入履歴のみ抽出
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

    // 販売中の商品がない場合は処理を中断
    if (!existingProducts) {
      await transaction.rollback();
      return res.status(400).send('購入可能な商品がありません。');
    }

    // 商品IDと数量セット配列を生成
    const productIdAndQuantity = existingProducts.Order.OrderDetails.map((item) => {
      return {
        product_id: item.product_id, 
        quantity: item.quantity 
      };
    });

    // 「ログイン会員のカートに保存済みの商品」と「そうではない商品」を分離
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

    // カートに保存済みの商品は数量更新・公開カートID記録
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
    
    // カートにない商品はレコード追加・公開カートID記録
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

    // 200ステータスのみ応答
    return res.sendStatus(200);
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    return res.status(500).send(error);
  }
};

module.exports = { getCart, addCart, decrementCart, deleteCart, copyCart };