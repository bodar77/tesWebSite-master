var cb = cb || {};

// Image manager supplies an image url based the size of the screen
// Also manages showing images when they are in view.
cb.ImgManager = function(){
	var _this = this;
	this.init();
};

cb.ImgManager.prototype = {
	init: function() {

	},
	
	loadCategoryImages: function(id, callback){
		var slider = document.getElementById('slider');
		var cback = callback;
		slider.innerHTML = '';
		
		cb.flickr.getPhotosByPhotoId(id, function(data) { 
			var i = 0, 
				len = data.photoset.photo.length, 
				photos = data.photoset.photo, 
				img, 
				photo,
				frag = document.createDocumentFragment(),
				div, 
				mainImage = document.getElementById('main-image'),
				picture;
			
			for (i; i < len; i++)
			{
				photo = photos[i];
				cb.flickr.menuItemLookup[photo.id] = photo;
				cb.flickr.menuItemLookup[id].photos[photo.id] = photo;
				
				div = document.createElement('div');
				div.className = 'item';
				if (i === 0) {
					div.id = "item1";
					picture = '<picture>';
					picture += '<source srcset="https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_z.jpg" media="(min-width: 620px)">';
					picture += '<img id="' + photo.id  + '" srcset="https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_n.jpg" alt="">';
					picture += '</picture>';
				}
							
				//img = '<img src="https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_q.jpg" />';
				img = '<picture>';
				img += '<source srcset="https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_q.jpg" media="(min-width: 620px)">';
				img += '<img id="' + photo.id  + '" srcset="https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_s.jpg" alt="">';
				img += '</picture>';
				div.innerHTML = img;
				frag.appendChild(div);
				//containers.eq(i).css('background', 'url(https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_q.jpg)');
			}
			console.log(cb.menu.menuItemLookup);
			mainImage.innerHTML = picture;
			slider.appendChild(frag);
			var s = new cb.Slider();
			
			if(cback) { cback(); }
			
		});	
	
	}
};