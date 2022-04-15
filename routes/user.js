const express = require('express');
const { User, Post } = require('../models');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

router.post('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('ok');
});

//POST /user/login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, async loginError => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      // res.setHeader('Cookie','cxlhy1')
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attribute: { exclude: ['password'] },
        include: [
          {
            model: Post,
          },
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' },
        ],
      });
      return res.status(200).json(fullUserWithoutPassword); // Front로 사용자 정보를 내려준다.
    });
  })(req, res, next);
});

router.post('/', async (req, res, next) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  //POST /user/
  try {
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (exUser) {
      return res.status(403).send('이미 사용 중인 아이디입니다.');
    }
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    res.status(201).send('ok');
  } catch (error) {
    console.error(error);
    next(error); // status 5XX
  }
});

module.exports = router;
