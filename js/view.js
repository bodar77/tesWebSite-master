var cb = cb || {};

cb.View = function () {
	this.title = document.getElementsByClassName('cbp-article-title')[0];
	this.description = document.getElementsByClassName('cbp-article-description')[0];
	this.init();
};

cb.View.prototype = {
	init: function() {
		this.loadMenu();
		this.menuAvailiable();
		this.addHandlers();
	},
	
	loadMenu: function() {
		cb.menu = new cb.Menu();
	},

	menuAvailiable:function() {	
		var _this = this;
		$(document).on('menuAvailiable', function(e) {
			var categoryId;
			if(cb.route.hash){
				categoryId = cb.flickr.toplevellookup[cb.route.category.toLowerCase()];
			}
			
			if(!categoryId) {
				categoryId = e.menuData.id;
			}
			_this.loadImages(categoryId);
		});
	},
	
	updateTitleDescription: function(title, description) {
		this.title.innerHTML = title;
		this.description.innerHTML = description;
	},

	addHandlers: function() {
		$(document).on('hashUpdated', $.proxy(this.handleHashChange, this));
	},

	handleHashChange: function() {
		var categoryId;
		if(cb.route.hash){
			categoryId = cb.flickr.toplevellookup[cb.route.category.toLowerCase()];
		}
		
		if(!categoryId) {
			categoryId = cb.flickr.toplevellookup["home"];
		}
		this.loadImages(categoryId);
	},

	loadImages: function(categoryId) {
			var _this = this;
			var cid = categoryId;
			cb.imgmanager.loadCategoryImages(cid, function() {
				_this.updateTitleDescription(cb.flickr.menuItemLookup[cid].title, cb.flickr.menuItemLookup[cid].description);
				picturefill();
			});
	}
};