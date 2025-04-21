const express = require('express');

const memberRouter = express.Router();
const cartRouter = express.Router();
const orderRouter = express.Router();
const productRouter = express.Router();
const publicCartRouter = express.Router();

const { login, me, logout, signup } = require('../controllers/member');
const { getCart, addCart } = require('../controllers/cart');
const { orderTest } = require('../controllers/order');
const { productTest, getProduct, getCategories, getProductsByCategory } = require('../controllers/product');
const { publicCartTest } = require('../controllers/public-cart');


// /member
memberRouter.post('/login', login);
memberRouter.post('/me', me);
memberRouter.post('/logout', logout);
memberRouter.post('/signup', signup);

// /cart
cartRouter.get('/', getCart);
cartRouter.post('/add', addCart);

// /order
orderRouter.get('/', orderTest);

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
  orderRouter,
  productRouter,
  publicCartRouter,
}

module.exports = routers;