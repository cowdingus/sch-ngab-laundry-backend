const jwt = require("jsonwebtoken");

module.exports = {
	mustBeAdmin(req, res, next) {
		const role = req.user?.role;

		if (!role || role !== "admin") {
			res.status(403).json({ message: "Admin role required" });
			return;
		}

		next();
	},

	mustLogin(req, res, next) {
		const token = req.get("Authorization")?.split(' ')[1];

		if (!token) {
			res.status(401).json({ message: "Login required" });
			return;
		}

		jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
			if (err) {
				res.status(401).json({ message: err.message });
				console.error(err);
				return;
			}

			req.user = payload;
			next();
		});
	}
};
