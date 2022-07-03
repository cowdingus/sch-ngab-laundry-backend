const express = require("express");
const { checkSchema, validationResult } = require("express-validator");
const router = express.Router();

const asyncHandler = require("express-async-handler");
const { TransactionDetail, Transaction, Package } = require("../models");
const { mustLogin, mustBeAdmin } = require("../middlewares/must");

const validateSchema = [
	checkSchema({
		transactionId: { isInt: true },
		packageId: { isInt: true },
		qty: {
			isInt: true,
			isLength: {
				options: { min: 1, max: 3 },
				errorMessage: "Qty must be more than 1 and less than 1000"
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

router.post("/", mustLogin, mustBeAdmin, validateSchema, asyncHandler(async (req, res) => {
	const result = await TransactionDetail.create(req.body, {
		fields: transactionDetailFields
	});

	res.json(result);
}));

router.put("/:id", mustLogin, mustBeAdmin, validateSchema, asyncHandler(async (req, res) => {
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
