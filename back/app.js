const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const session = require('express-session');
const path = require('path');
const { mysql } = require('./config/db');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

const { 
  memberRouter,
  cartRouter,
  checkoutRouter,
  productRouter,
  publicCartRouter,
} = require('./routes');

// Q. origin엔 뭘 넣는 거야?
// A. 허용할 클라이언트 주소 (ChatGPT)
// Q. production 모드의 session/ cookie/ sameSite에는 lax? none?
if (process.env.NODE_ENV === 'production') {
  app.use(cors({
    origin: 'http://ccm.sarifor.net',
    credentials: true,
  }));

  app.use(morgan('combined'));

  app.use(session({
    name: 'connect.sid',
    saveUninitialized: false,
    resave: false,
    secret: "test",
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: "lax",
      domain: '.sarifor.net',
    }
  }));
} else {
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }));

  app.use(morgan('dev'));

  app.use(session({
    name: 'connect.sid',
    saveUninitialized: false,
    resave: false,
    secret: "test",
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: "lax"
    }
  }));
}

// Q. 클라이언트에게서 받은 req에서 id 값과 password 값을 찾을 수가 없어
// A. Express에서 POST 요청의 body 데이터를 읽으려면 express.json() 미들웨어를 추가해야 해 (ChatGPT)
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hi!!');
});

app.use('/member', memberRouter);
app.use('/cart', cartRouter);
app.use('/checkout', checkoutRouter);
app.use('/product', productRouter);
app.use('/public-cart', publicCartRouter);
// app.use('/promotion', promotionRouter);
// app.use('/notification', notificationRouter);
// app.use('/log', logRouter);
// app.use('/admin', adminRouter);

// Q. 정적 파일 용도별로 디렉토리 분리 운영하려면?
// A. 정적 리소스는 /assets/, 사용자 or 관리자 업로드는 /uploads/ (ChatGPT)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/static', express.static(path.join(__dirname, 'assets')));

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