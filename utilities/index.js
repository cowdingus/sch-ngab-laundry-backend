module.exports = {
	filterProperties(object, keys) {
		const newObject = {};

		for (key of keys) {
			if (object.hasOwnProperty(key)) {
				newObject[key] = object[key];
			}
		}

		return newObject;
	}
};
