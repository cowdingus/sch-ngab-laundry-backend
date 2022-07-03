const express = require("express");
const router = express.Router();

const asyncHandler = require("express-async-handler");
const { Transaction, TransactionDetail, User, Member } = require("../models");
const { mustLogin, mustBeAdmin } = require("../middlewares/must");

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

router.post("/", mustLogin, mustBeAdmin, asyncHandler(async (req, res) => {
	const result = await Transaction.create(req.body, {
		fields: transactionFields
	});

	res.json(result);
}));

router.put("/:id", mustLogin, mustBeAdmin, asyncHandler(async (req, res) => {
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
