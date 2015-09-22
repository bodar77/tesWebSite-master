var cb = cb || {};

cb.Route = function () {
	this.hash;
	this.category;
	this.photoId;
	this.init();
	this.addHandlers();
};

cb.Route.prototype = {
	init: function() {
		this.updateHashObject();
	},

	updateHashObject: function() {
		var hashSplit;
		console.log(location.hash.substring(1));
		this.hash = location.hash.substring(1);
		if(this.hash) {
			hashSplit = this.hash.split('/');
			this.category = hashSplit[0];
			this.photoId = hashSplit[1];
		}
	},

	addHandlers: function() {
		$(window).on("hashchange", $.proxy(this.handleHashChange, this));
	},

	handleHashChange: function() {
		this.updateHashObject();
		var event = $.Event( "hashUpdated" );
		$(document).trigger(event);
	}
};