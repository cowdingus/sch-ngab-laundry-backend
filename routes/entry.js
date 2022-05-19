const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const { User } = require('../models');

router.post('/login', asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ where: { username: req.body.username } });

  if (user === null) {
    res.status(401).json({ message: 'Wrong username or password' });
    return;
  }

  if (!bcrypt.compareSync(req.body.password, user.password)) {
    res.status(401).json({ message: 'Wrong username or password' });
    return;
  }

  jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    process.env.SECRET_KEY,
    (err, token) => {
      if (err) {
        res.status(500).json({message: err.message});
        return;
      }

      res.json({
        type: "Bearer",
        token: token
      });
    }
  );
}));

router.post('/signup', asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body, { fields: ['username', 'email', 'password'] })

  res.json({
    id: user.id,
    username: user.username,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  });
}));

module.exports = router;
