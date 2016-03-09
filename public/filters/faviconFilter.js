module.exports = function() {
	var provider = "https://www.google.com/s2/favicons?domain=%s";

	return function(url) {
		return provider.replace(/%s/g, url);
	}
};
