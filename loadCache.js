var fs = require("fs");
var siteCache = {};

exports.getCache = function () {
	fs.exists("./siteCache.json", function(exists) {
		if (exists) {
			siteCache = require("./siteCache.json"); console.log("CACHE (" + process.pid + "): Site loaded into memory.");
		} else {
			console.log("CACHE (" + process.pid + "): Site loading from disk.");
		}
	});
    return siteCache;
};
