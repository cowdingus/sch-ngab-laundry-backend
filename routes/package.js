const express = require("express");
const router = express.Router();

const asyncHandler = require("express-async-handler");
const { Package } = require("../models");
const { mustLogin, mustBeAdmin } = require("../middlewares/must");

const packageFields = ["name", "price"];

router.get("/", asyncHandler(async (req, res) => {
	const packages = await Package.findAll();
	res.json(packages);
}));

router.get("/:id", asyncHandler(async (req, res) => {
	const package = await Package.findByPk(req.params.id);

	if (!package) {
		res.sendStatus(404);
		return;
	}

	res.json(package);
}));

router.post("/", mustLogin, mustBeAdmin, asyncHandler(async (req, res) => {
	const result = await Package.create(req.body, {
		fields: packageFields
	});

	res.json(result);
}));

router.put("/:id", mustLogin, mustBeAdmin, asyncHandler(async (req, res) => {
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
		res.sendStatus(404);
		return;
	}

	await package.destroy();
	res.sendStatus(202);
}));

module.exports = router;
