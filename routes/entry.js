const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const { User } = require('../models');

const { checkSchema, validationResult } = require("express-validator");

const validateSchema = [
	checkSchema({
    username: {
      matches: {
        options: ["^[a-zA-Z0-9]*$"],
        errorMessage: "Username must only consists of alphanumeric characters"
      },
      isLength: {
        options: { min: 3, max: 22 },
        errorMessage: "Username must consist of > 3 and < 22 number of chars"
      }
    },
    email: {
      isEmail: {
        errorMessage: "Email must be a valid email address"
      }
    },
    password: {
      isLength: {
        options: { min: 8, max: 22 },
        errorMessage: "Password must be >8 and <22 digits"
      }
    }
	}),
	(req, res, next) => {
		const errors = validationResult(req);

		if (errors.isEmpty()) {
			return next();
		}

		res.status(400).json({ errors: errors.array() });
	}
];

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

router.post('/signup', validateSchema, asyncHandler(async (req, res, next) => {
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
