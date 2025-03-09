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

// Q. 왜 JSON 응답을 파싱해주지 않지?
// A. express.json은 '요청'의 JSON을 파싱해줌
// app.use(express.json());

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