const router = require('express').Router();
const { checkSchema, validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');

const { mustLogin, mustBeAdmin } = require('../middlewares/must');
const { User } = require('../models');
const {filterProperties} = require('../utilities');

const validateSchema = [
	checkSchema({
    username: {
      matches: {
        options: ["^[a-zA-Z0-9]*$"],
        errorMessage: "Username must only consists of alphanumeric characters"
      },
			isLength: {
				options: { min: 3, max: 12 },
				errorMessage: "Username must be at least 2 chars and maximum 12 chars long"
			},
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

router.delete('/:id', mustLogin, asyncHandler(async (req, res) => {
  if (req.params.id !== req.user.id && req.user.role !== "admin") {
    res.status(403).json({message: "If you're not doing the operation for your own account, admin role required"});
    return;
  }

  const user = await User.findByPk(req.params.id);

  if (!user) {
    res.status(404).end();
  }

  await user.destroy();
  res.status(202).end();
}));

router.put('/:id', mustLogin, validateSchema, asyncHandler(async (req, res) => {
  if (req.params.id !== req.user.id && req.user.role !== "admin") {
    res.status(403).json({message: "If not deleting your own account, admin role required"});
    return;
  }

  const user = await User.findByPk(req.params.id);

  await user.update(req.body, {
    fields: ["username", "password"]
  })

  res.json(user);
}));

router.get('/:id', mustLogin, asyncHandler(async (req, res) => {
  if (req.params.id !== req.user.id && req.user.role !== "admin") {
    res.status(403).json({message: "If not fetching your own account, admin role required"});
    return;
  }

  const user = await User.findByPk(req.params.id, { attributes: { exclude: ["password"] } });

  res.json(user);
}));

router.get('/', mustLogin, mustBeAdmin, (req, res, next) => {
  const query = filterProperties(req.query, ["username", "email", "role"]);

  User.findAll({ where: query, attributes: { exclude: ["password"] } })
    .then((users) => {
      res.json(users);
    })
    .catch((error) => { next(error) });
});

router.post('/topup', mustLogin, (req, res, next) => {
  if (!req.body.jumlah) {
    res.status(400).json({ message: "`jumlah` field isn't defined" });
  }

  User.findByPk(req.user.id)
    .then((user) => {
      if (!user) {
        res.status(400).json({ message: "Logged-in user doesn't exist" });
      }

      user.update({
        saldo: user.saldo + parseInt(req.body.jumlah)
      }).then((result) => {
        res.json({ status: 1, message: "Berhasil Topup" });
      }).catch(err => next(err));
    }).catch(err => next(err));
});

module.exports = router;
