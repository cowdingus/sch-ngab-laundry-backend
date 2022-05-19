const express = require("express");
const router = express.Router();

const asyncHandler = require("express-async-handler");
const { Member } = require("../models");
const { mustLogin, mustBeAdmin } = require("../middlewares/must");

const memberFields = ["name", "address", "gender", "phoneNumber"];

router.get("/", asyncHandler(async (req, res) => {
	const members = await Member.findAll();
	res.json(members);
}));

router.get("/:id", asyncHandler(async (req, res) => {
	const member = await Member.findByPk(req.params.id);

	if (!member) {
		res.sendStatus(404);
		return;
	}

	res.json(member);
}));

router.post("/", mustLogin, mustBeAdmin, asyncHandler(async (req, res) => {
	const result = await Member.create(req.body, {
		fields: memberFields
	});

	res.json(result);
}));

router.put("/:id", mustLogin, mustBeAdmin, asyncHandler(async (req, res) => {
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
		res.sendStatus(404);
		return;
	}

	await member.destroy();
	res.sendStatus(202);
}));

module.exports = router;
