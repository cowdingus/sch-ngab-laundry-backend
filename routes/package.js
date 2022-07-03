const express = require("express");
const router = express.Router();

const asyncHandler = require("express-async-handler");
const { checkSchema, validationResult } = require("express-validator");
const { Package } = require("../models");
const { mustLogin, mustBeAdmin } = require("../middlewares/must");

const validateSchema = [
	checkSchema({
		name: {
			matches: {
				options: ["^[a-zA-Z0-9 ]+$"],
				errorMessage: "Name must consists alphanumeric characters"
			}
		},
		price: {
			isInt: {
				errorMessage: "Price must be an integer"
			},
			isLength: {
				options: { min: 3, max: 6 },
				errorMessage: "Price must be higher than 100 and less than 1000000"
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

const packageFields = ["name", "price"];

router.get("/", asyncHandler(async (req, res) => {
	const packages = await Package.findAll();
	res.json(packages);
}));

router.get("/:id", asyncHandler(async (req, res) => {
	const package = await Package.findByPk(req.params.id);

	if (!package) {
		res.status(404).end();
		return;
	}

	res.json(package);
}));

router.post("/", mustLogin, mustBeAdmin, validateSchema, asyncHandler(async (req, res) => {
	const result = await Package.create(req.body, {
		fields: packageFields
	});

	res.json(result);
}));

router.put("/:id", mustLogin, mustBeAdmin, validateSchema, asyncHandler(async (req, res) => {
	const package = await Package.findByPk(req.params.id);

	if (!package) {
		res.status(404);
		return;
	}

	await package.update(req.body, {
		fields: packageFields
	});

	res.json(package);
}));

router.delete("/:id", mustLogin, mustBeAdmin, asyncHandler(async (req, res) => {
	const package = await Package.findByPk(req.params.id);

	if (!package) {
		res.status(404).end();
		return;
	}

	await package.destroy();
	res.status(202).end();
}));

module.exports = router;
