const express = require('express');

const userRouter = express.Router();
const cartRouter = express.Router();
const orderRouter = express.Router();
const productRouter = express.Router();
const publicCartRouter = express.Router();

const { userTest, login, me, logout } = require('../controllers/user');
const { cartTest } = require('../controllers/cart');
const { orderTest } = require('../controllers/order');
const { productTest } = require('../controllers/product');
const { publicCartTest } = require('../controllers/public-cart');


// /user
userRouter.get('/', userTest);
userRouter.post('/login', login);
userRouter.post('/me', me);
userRouter.post('/logout', logout);

// /cart
cartRouter.get('/', cartTest);

// /order
orderRouter.get('/', orderTest);

// /product
productRouter.get('/', productTest);

// public-cart
publicCartRouter.get('/', publicCartTest);

const routers = {
  userRouter,
  cartRouter,
  orderRouter,
  productRouter,
  publicCartRouter,
}

module.exports = routers;