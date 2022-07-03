const express = require("express");
const router = express.Router();

const asyncHandler = require("express-async-handler");
const { TransactionDetail, Transaction, Package } = require("../models");
const { mustLogin, mustBeAdmin } = require("../middlewares/must");

const transactionDetailFields = [
	"transactionId",
	"packageId",
	"qty"
];

router.get("/", asyncHandler(async (req, res) => {
	const transactionDetails = await TransactionDetail.findAll({
		include: [
			{ model: Transaction, as: "transaction" },
			{ model: Package, as: "package" }
		]
	});

	res.json(transactionDetails);
}));

router.get("/:id", asyncHandler(async (req, res) => {
	const transactionDetail = await TransactionDetail.findByPk(req.params.id, {
		include: [
			{ model: Transaction, as: "transaction" },
			{ model: Package, as: "package" }
		]
	});

	if (!transactionDetail) {
		res.status(404).end();
		return;
	}

	res.json(transactionDetail);
}));

router.post("/", mustLogin, mustBeAdmin, asyncHandler(async (req, res) => {
	const result = await TransactionDetail.create(req.body, {
		fields: transactionDetailFields
	});

	res.json(result);
}));

router.put("/:id", mustLogin, mustBeAdmin, asyncHandler(async (req, res) => {
	const transactionDetail = await TransactionDetail.findByPk(req.params.id);

	if (!transactionDetail) {
		res.status(404);
		return;
	}

	await transactionDetail.update(req.body, {
		fields: transactionDetailFields
	});

	res.json(transactionDetail);
}));

router.delete("/:id", mustLogin, mustBeAdmin, asyncHandler(async (req, res) => {
	const transactionDetail = await TransactionDetail.findByPk(req.params.id);

	if (!transactionDetail) {
		res.status(404).end();
		return;
	}

	await transactionDetail.destroy();
	res.status(202).end();
}));

module.exports = router;
