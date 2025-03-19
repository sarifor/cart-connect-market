const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { mysql } = require('./config/db');
require('dotenv').config();

const app = express();
const port = process.env.PORT;
console.log("Assigned port: ", port);

const { 
  userRouter,
  cartRouter,
  orderRouter,
  productRouter,
  publicCartRouter,
} = require('./routes');

app.use(cors());
app.use(morgan('dev'));

// Q. 클라이언트에게서 받은 req에서 id 값과 password 값을 찾을 수가 없어
// A. Express에서 POST 요청의 body 데이터를 읽으려면 express.json() 미들웨어를 추가해야 해 (ChatGPT)
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hi!!');
});

app.use('/user', userRouter);
app.use('/cart', cartRouter);
app.use('/order', orderRouter);
app.use('/product', productRouter);
app.use('/public-cart', publicCartRouter);
// app.use('/promotion', promotionRouter);
// app.use('/notification', notificationRouter);
// app.use('/log', logRouter);
// app.use('/admin', adminRouter);

const connectDB = async() => {
  try {
    await mysql.authenticate();
    console.log('DB connection OK');
  } catch (error) {
    console.log('DB connection failed: ', error);
  }
};

// Q. sync()의 역할?
// A. This creates the table if it doesn't exist (and does nothing if it already exists)
const syncDB = async () => {
  try {
    await mysql.sync();
    console.log('All models are synced');
    console.log('Models: ', mysql.models);
  } catch (error) {
    console.log('Model sync failed: ', error)
  }
};

connectDB();
syncDB();

app.listen(port, () => {
  console.log(`Sever running on localhost:${port}`);
});