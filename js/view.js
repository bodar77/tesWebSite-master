var cb = cb || {};

cb.View = function () {
	this.title = document.getElementsByClassName('cbp-article-title')[0];
	this.description = document.getElementsByClassName('cbp-article-description')[0];
	this.init();
};

cb.View.prototype = {
	init: function() {
		this.loadMenu();
		this.loadImages();
	},
	
	loadMenu: function() {
		cb.menu = new cb.Menu();
	},

	loadImages:function() {	
		var _this = this;
		$(document).on('menuAvailiable', function(e) {
			var categoryId;
			if(cb.route.hash){
				categoryId = cb.flickr.toplevellookup[cb.route.category.toLowerCase()];
			}
			
			if(!categoryId) {
				categoryId = e.menuData.id;
			}

			cb.imgmanager.loadCategoryImages(categoryId, function() {
				_this.updateTitleDescription(cb.flickr.menuItemLookup[categoryId].title, cb.flickr.menuItemLookup[categoryId].description);
				picturefill();
			});
		});
	},
	
	updateTitleDescription: function(title, description) {
		this.title.innerHTML = title;
		this.description.innerHTML = description;
	}
};