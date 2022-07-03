const express = require("express");
const { checkSchema, validationResult } = require("express-validator");
const router = express.Router();

const asyncHandler = require("express-async-handler");
const { Transaction, TransactionDetail, User, Member } = require("../models");
const { mustLogin, mustBeAdmin } = require("../middlewares/must");

const validateSchema = [
	checkSchema({
		memberId: {
			isInt: true
		},
		userId: {
			isInt: true
		},
		date: {
			isDate: true
		},
		deadline: {
			isDate: true
		},
		paymentDate: {
			isDate: true
		},
		progressStatus: {
			isIn: {
				options: [["new", "in_progress", "done", "picked_up"]],
				errorMessage: "Valid values: 'new', 'in_progress', 'done', 'picked_up'"
			}
		},
		paymentStatus: {
			isIn: {
				options: [["already_paid", "not_paid_yet"]],
				errorMessage: "Valid values: 'already_paid', 'not_paid_yet'"
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

const transactionFields = [
	"memberId",
	"userId",
	"date",
	"deadline",
	"paymentDate",
	"progressStatus",
	"paymentStatus"
];

router.get("/", asyncHandler(async (req, res) => {
	const transactions = await Transaction.findAll({
		include: [
			{ model: User, as: "cashier", attributes: { exclude: ["password"] } },
			{ model: Member, as: "member" },
			{ model: TransactionDetail, as: "details", include: ["package"] }
		]
	});

	res.json(transactions);
}));

router.get("/:id", asyncHandler(async (req, res) => {
	const transaction = await Transaction.findByPk(req.params.id, {
		include: [
			{ model: User, as: "cashier", attributes: { exclude: ["password"] } },
			{ model: Member, as: "member" },
			{ model: TransactionDetail, as: "details", include: ["package"] }
		]
	});

	if (!transaction) {
		res.status(404).end();
		return;
	}

	res.json(transaction);
}));

router.post("/", mustLogin, mustBeAdmin, validateSchema, asyncHandler(async (req, res) => {
	const result = await Transaction.create(req.body, {
		fields: transactionFields
	});

	res.json(result);
}));

router.put("/:id", mustLogin, mustBeAdmin, validateSchema, asyncHandler(async (req, res) => {
	const transaction = await Transaction.findByPk(req.params.id);

	if (!transaction) {
		res.status(404);
		return;
	}

	await transaction.update(req.body, {
		fields: transactionFields
	});

	res.json(transaction);
}));

router.delete("/:id", mustLogin, mustBeAdmin, asyncHandler(async (req, res) => {
	const transaction = await Transaction.findByPk(req.params.id);

	if (!transaction) {
		res.status(404).end();
		return;
	}

	await transaction.destroy();
	res.status(202).end();
}));

module.exports = router;
