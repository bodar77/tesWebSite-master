var cb = cb || {};

cb.Route = function () {
	this.hash;
	this.category;
	this.photoId;
	this.init();
};

cb.Route.prototype = {
	init: function() {
		var hashSplit;
		console.log(location.hash.substring(1));
		this.hash = location.hash.substring(1);
		if(this.hash) {
			hashSplit = this.hash.split('/');
			this.category = hashSplit[0];
			this.photoId = hashSplit[1];
		}
	}
};