const express = require('express');

const memberRouter = express.Router();
const cartRouter = express.Router();
const checkoutRouter = express.Router();
const orderRouter = express.Router();
const productRouter = express.Router();
const publicCartRouter = express.Router();

const { login, me, logout, signup } = require('../controllers/member');
const { getCart, addCart, decrementCart, deleteCart } = require('../controllers/cart');
const { createOrder, getShippingAddress, getServerTime } = require('../controllers/checkout');
const { getOrders } = require('../controllers/order');
const { productTest, getProduct, getCategories, getProductsByCategory } = require('../controllers/product');
const { publicCartTest } = require('../controllers/public-cart');


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

// /checkout
checkoutRouter.post('/', createOrder);
checkoutRouter.get('/shipping-address', getShippingAddress);
checkoutRouter.get('/server-time', getServerTime);

// /order
orderRouter.get('/', getOrders);
// orderRouter.get('/:orderId', getOrder);

// /product
productRouter.get('/', productTest);
productRouter.get('/category', getCategories);
productRouter.get('/:productId', getProduct);
productRouter.get('/category/:categoryId', getProductsByCategory);

// public-cart
publicCartRouter.get('/', publicCartTest);

const routers = {
  memberRouter,
  cartRouter,
  checkoutRouter,
  orderRouter,
  productRouter,
  publicCartRouter,
}

module.exports = routers;