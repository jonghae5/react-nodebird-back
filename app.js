// const http = require('http');
// const server = http.createServer((req, res) => {
//   console.log(req.url, req.method);
//   res.end('hello world');
// });

// server.listen(3065, () => {
//   console.log('서버 실행 중');
// });

const express = require('express');
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const cors = require('cors');
const db = require('./models');
const app = express();
const passportConfig = require('./passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
dotenv.config();
passportConfig();

db.sequelize
  .sync()
  .then(() => {
    console.log('DB 연결 성공');
  })
  .catch(err => {
    console.error(err);
  });
app.use(
  cors({
    // origin: 'http://localhost:3060',
    origin: true,
    credentials: true,
  })
);

app.use('/', express.static(path.join(__dirname, 'uploads')));
app.use(morgan('dev'));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('hello express');
});

app.get('/api', (req, res) => {
  res.send('hello api');
});

app.use('/posts', postsRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);

// app.use((err,req,res,next) => {}); 에러 처리 미들웨어
app.listen(3065, () => {
  console.log('서버 실행 중');
});
