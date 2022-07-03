const express = require("express");
const { checkSchema, validationResult } = require('express-validator');
const router = express.Router();

const asyncHandler = require("express-async-handler");
const { Member } = require("../models");
const { mustLogin, mustBeAdmin } = require("../middlewares/must");

const validateSchema = [
	checkSchema({
		name: {
			isLength: {
				options: { min: 3, max: 12 },
				errorMessage: "Name must be at least 2 chars and maximum 12 chars long"
			},
			matches: {
				options: ['^[a-zA-Z ]+$'],
				errorMessage: "Name must consists of alpha characters"
			},
		},
		address: {
			isString: {
				errorMessage: "Address must be a string"
			}
		},
		gender: {
			isIn: {
				options: [["male", "female"]],
				errorMessage: "Gender must be 'male' or 'female'",
			},
		},
		phoneNumber: {
			isMobilePhone: true,
			errorMessage: "Invalid phone number"
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

const memberFields = ["name", "address", "gender", "phoneNumber"];

router.get("/", asyncHandler(async (req, res) => {
	const members = await Member.findAll();
	res.json(members);
}));

router.get("/:id", asyncHandler(async (req, res) => {
	const member = await Member.findByPk(req.params.id);

	if (!member) {
		res.status(404).end();
		return;
	}

	res.json(member);
}));

router.post("/", mustLogin, mustBeAdmin, validateSchema, asyncHandler(async (req, res) => {
	const result = await Member.create(req.body, {
		fields: memberFields
	});

	res.json(result);
}));

router.put("/:id", mustLogin, mustBeAdmin, validateSchema, asyncHandler(async (req, res) => {
	const member = await Member.findByPk(req.params.id);

	if (!member) {
		res.status(404);
		return;
	}

	await member.update(req.body, {
		fields: memberFields
	});

	res.json(member);
}));

router.delete("/:id", mustLogin, mustBeAdmin, asyncHandler(async (req, res) => {
	const member = await Member.findByPk(req.params.id);

	if (!member) {
		res.status(404).end();
		return;
	}

	await member.destroy();
	res.status(202).end();
}));

module.exports = router;
