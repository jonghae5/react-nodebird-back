const express = require('express');
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const hashtagRouter = require('./routes/hashtag');
const cors = require('cors');
const db = require('./models');

const passportConfig = require('./passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');
const hpp = require('hpp');

dotenv.config();
const app = express();
db.sequelize
  .sync()
  .then(() => {
    console.log('DB 연결 성공');
  })
  .catch(err => {
    console.error(err);
  });

passportConfig();

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
  app.use(morgan('combined')); //접속자 IP 등 다양한 log
  // 보안 패키지
  app.use(hpp());
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(
    cors({
      origin: 'http://jonghae5.shop',
      credentials: true,
    })
  );
} else {
  app.use(morgan('dev'));
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
}

app.use('/', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    proxy: true,
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // 개발용이면 false
      // secure: false, // Production
      domain: process.env.NODE_ENV === 'production' && '.jonghae5.shop',
    },
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
app.use('/hashtag', hashtagRouter);
// app.use((err,req,res,next) => {}); 에러 처리 미들웨어
app.listen(3065, () => {
  console.log('서버 실행 중');
});
