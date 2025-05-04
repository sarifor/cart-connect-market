const express = require('express');

const memberRouter = express.Router();
const cartRouter = express.Router();
const checkoutRouter = express.Router();
const productRouter = express.Router();
const publicCartRouter = express.Router();

const { login, me, logout, signup } = require('../controllers/member');
const { getCart, addCart, decrementCart, deleteCart } = require('../controllers/cart');
const { getShippingAddress, getServerTime } = require('../controllers/checkout');
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
checkoutRouter.get('/shipping-address', getShippingAddress);
checkoutRouter.get('/server-time', getServerTime);

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
  productRouter,
  publicCartRouter,
}

module.exports = routers;