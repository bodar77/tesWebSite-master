var cb = cb || {};

cb.View = function() {
	this.title = document.getElementsByClassName('article-title')[0],
	this.description = document.getElementsByClassName('article-description')[0];
	this.init();
}

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
			cb.imgmanager.loadCategoryImages(e.menuData.collections.collection[0].set[0].id, function() {
				_this.updateTitleDescription(e.menuData.collections.collection[0].title, e.menuData.collections.collection[0].description)
			});
		});
	},
	
	updateTitleDescription(title, description) {
		this.title.innerHTML = title;
		this.description.innerHTML = description;
	}
}