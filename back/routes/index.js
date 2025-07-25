const express = require('express');

const memberRouter = express.Router();
const cartRouter = express.Router();
const checkoutRouter = express.Router();
const orderRouter = express.Router();
const productRouter = express.Router();
const publicCartRouter = express.Router();

const { login, me, logout, signup } = require('../controllers/member');
const { getCart, addCart, decrementCart, deleteCart, copyCart } = require('../controllers/cart');
const { createOrder, getShippingAddress, getServerTime } = require('../controllers/checkout');
const { getOrders, getOrderDetail, getOrderSummary } = require('../controllers/order');
const { productTest, getProduct, getCategories, getProductsByCategory } = require('../controllers/product');
const { getPublicCarts, getPublicCartsNetworkByLikes, getPublicCartDetail, postPublicCart, updatePublicCart, updateLike, } = require('../controllers/public-cart');


// /member
memberRouter.post('/login', login);
memberRouter.post('/me', me);
memberRouter.post('/logout', logout);
memberRouter.post('/signup', signup);

// /cart
// Q. cartRouter.post('/increment', incrementCart);로 언제 수정할까?
cartRouter.get('/', getCart);
cartRouter.post('/add', addCart);
cartRouter.patch('/decrement', decrementCart);
cartRouter.delete('/delete', deleteCart);
cartRouter.post('/copy', copyCart);

// /checkout
checkoutRouter.post('/', createOrder);
checkoutRouter.get('/shipping-address', getShippingAddress);
checkoutRouter.get('/server-time', getServerTime);

// /order
orderRouter.get('/', getOrders);
orderRouter.get('/summary', getOrderSummary);
orderRouter.get('/:orderId', getOrderDetail);

// /product
// Q. getProduct를 getProductDetail로 바꿀까?
productRouter.get('/', productTest);
productRouter.get('/category', getCategories);
productRouter.get('/category/:categoryId', getProductsByCategory);
productRouter.get('/:productId', getProduct);

// public-cart
// Q. RESTful 준수 위해 /network를 /로 통합?
publicCartRouter.get('/', getPublicCarts);
publicCartRouter.post('/', postPublicCart);
publicCartRouter.get('/network', getPublicCartsNetworkByLikes);
publicCartRouter.get('/:publicCartId', getPublicCartDetail);
publicCartRouter.patch('/:publicCartId/like', updateLike);
publicCartRouter.patch('/:publicCartId', updatePublicCart);

const routers = {
  memberRouter,
  cartRouter,
  checkoutRouter,
  orderRouter,
  productRouter,
  publicCartRouter,
};

module.exports = routers;