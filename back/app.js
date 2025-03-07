const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const port = 4000;

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

app.listen(port, () => {
  console.log(`Sever running on localhost:${port}`);
})