var cb = cb || {};

cb.Flickr = function(){
	var _this = this;
	this.appid = '9b217b1f476896d402cabd129e91974a';
	this.userid = '67942935@N04';
	this.albumnid;
	this.tree;
	this.photoCollection = [];
	this.menuItemLookup = {};
	this.toplevellookup = {};
	//properties
	//an array of arrays. each requested photoset is stored as an array by key in the photos array.
	this.photos;
	
	this.init();
};

cb.Flickr.prototype = {
	init: function() {	
		//this.getCollectionTree();
	},
	
	// Required api calls
	
	// json ajax calls
	ajaxJsonCall: function(method, params) { //flickr.photosets.getPhotos
		var baseURL, i, len, strBuilder;
		
		len = params.length
		
		//todo loop through params to build up query string.
		for (i = 0; i < len; i++) {
			strBuilder += '&' + params[i].key + '=' + params[i].value;
		}
		
		baseURL = 'https://api.flickr.com/services/rest/?&method=';
		$.getJSON(baseURL + method + strBuilder + '&format=json&jsoncallback=?');
	},
	
	
	getCollectionTree: function(callback) {		
		//Need to separate api calls and create a caching mechanism.
		var cb = callback;
		var _this = this;
		$.getJSON('https://api.flickr.com/services/rest/?method=flickr.collections.getTree&api_key=' + this.appid + '&user_id=' + this.userid + '&format=json&nojsoncallback=1',
		function(data){
			_this.tree = data;

			//Manipulate the data, loop through it building a new Flikr object and id array.
			//Create a document fragment to insert into the dom
			var collections, i = 0, len, event;
			collections = data.collections.collection;
			//console.log(collections);
			len = collections.length

			for (i; i < len; i++) {
				var j = 0, jlen, sets;
				
				_this.menuItemLookup[collections[i].id] = collections[i];
				_this.menuItemLookup[collections[i].id].photos = {};
				
				sets = collections[i].set;
				jlen = sets.length;

				for (j; j < jlen; j++) {
					_this.menuItemLookup[collections[i].id].photos[sets[j].id] = sets[j];
					_this.menuItemLookup[collections[i].id].photos[sets[j].id].photos = {};
					_this.menuItemLookup[sets[j].id] = _this.menuItemLookup[collections[i].id].photos[sets[j].id];
					_this.photoCollection.push(sets[j].id);
					_this.toplevellookup[sets[j].title.toLowerCase()] = sets[j].id;
				}
			}
			
			if(data.stat != 'fail') {
				cb(_this.menuItemLookup);
			}
		});
	},
	
	getPhotosByPhotoId: function(id, callback) {
		var _this = this;
		$.getJSON('https://api.flickr.com/services/rest/?&method=flickr.photosets.getPhotos&api_key=' + this.appid + '&photoset_id=' + id + '&format=json&jsoncallback=?',
		function(data){
			_this.photoCollection = data.photoset;
			//console.log(_this.photoCollection.ownername);
			//if the image has a location, build an html snippet containing the data
			if(data.stat != 'fail') {
				callback.call(this, data);
			}
		});
	},
	
	// local storage calls
};

var cb = cb || {};

// Image viewer allows a thumnail image to be clicked and become full size. Then the images can be scrolled at full size or closed.
cb.ImageViewer = function(){
	var _this = this;
	// Add properties for page elements
	this.view = document.getElementById('slider');
	this.pressed = false;
	this.isDragDelta = 50;
	
	this.clickDurationDelta = 1000;
	this.clickStartTime;
	this.clickEndTime;
	
	this.documentCache = $('body');
	
	// Need full screen measurements
	this.screen = { width: 0, height:0, mousex: 0, mousey: 0, distancex: 0, distancey: 0, isLandscape: true};
	
	this.init();
	
	// Add handlers for thumbnail click, left and right, close.
	this.addHandlers();
	// Request need to be made for images.

	
};

cb.ImageViewer.prototype = {
	init: function() {	
		
	},
	
	getMetrix: function() {
		var doc = this.documentCache;
		this.screen.width = doc.width();
		this.screen.height = $(window).height();
		this.screen.isLandscape = (this.screen.width > this.screen.height);
	},

	xpos: function(e) {
		// touch event
		if (e.targetTouches && (e.targetTouches.length >= 1)) {
			return e.targetTouches[0].clientX;
		 }

		 // mouse event
		 return e.clientX;
	 },

	 ypos: function(e) {
		// touch event
		if (e.targetTouches && (e.targetTouches.length >= 1)) {
			return e.targetTouches[0].clientY;
		 }

		 // mouse event
		 return e.clientY;
	 },
	
	addHandlers: function() {
	
		// Thumbnail based touchstart, touchmove - prevents drag move opening the thumbnail. touchend.
		var $view = $(this.view);
		
		var supportsTouch = 'ontouchstart' in document;
		if (supportsTouch) {
			this.view.addEventListener("touchstart", $.proxy(this.handleTouchStart, this), false);
			this.view.addEventListener("touchmove", $.proxy(this.handleTouchMove, this), false);
			this.view.addEventListener("touchend", $.proxy(this.handleTouchEnd, this), false);
		}

		$view.on('mousedown', $.proxy(this.handleTouchStart, this));
		$view.on('mousemove', $.proxy(this.handleTouchMove, this));
		$view.on('mouseup', $.proxy(this.handleTouchEnd, this));
	},
	
	removeHandlers: function() {
		
	},
	
	addOverlay: function() {
		// Create overlay.
	},
	
	removeOverlay: function() {
	
	},
	
	addImageView: function(photoId) {
		$(document).scrollTop(0,0);

		var image = $('.image-viewer'), imageHeight;
		
		if(image.length > 0) {
			image.remove();
		}
		
		var photo = cb.flickr.menuItemLookup[photoId];
		var body = $('body');

		var picture = '<div class="image-viewer" >'; 
			picture += '<div class="image-close"><button class="button-close"></button></div>';
			picture += '<div class="image-left"><button class="button-left"></button></div>';
			picture += '<div class="image-right"><button class="button-right"></button></div>';
			picture += '<picture>';
			picture += '<source srcset="https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_b.jpg" media="(min-width: 670px)">';
			picture += '<img id="' + photo.id  + '" srcset="https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_c.jpg" alt="">';
			picture += '</picture>';
			picture += '</div>';
		body.append(picture);
		
		image = $('.image-viewer img');
		
		this.getMetrix();

		imageHeight = this.screen.height - $(this.view).height();

		if(this.screen.isLandscape) {
			image.height(imageHeight);
		}

		this.documentCache.height(imageHeight);
		this.documentCache.css('overflow', 'hidden');

		this.handleClose();
		this.handleImageNavigation(photoId);
	},
	
	handleTouchStart: function(e) {
		//get mouse clicked time
		this.clickStartTime = Date.now();
		this.pressed = true;
		//get mouse position

		this.screen.mousex = this.xpos(e);
		this.screen.mousey = this.ypos(e);;
	},
	
	handleTouchMove: function(e) {
		//calculate distance moved
		if(this.pressed) {
			this.screen.distancex = this.screen.mousex - this.xpos(e);
			this.screen.distancey = this.screen.mousey - this.ypos(e);
		}
	},
	
	handleTouchEnd: function(e) {
		var longClick, drag;
		this.pressed = false;
		//get mouse clicked tIme, if longer than the delta we exit;
		this.clickEndTime = Date.now();
		longClick = (this.clickDurationDelta < (this.clickEndTime - this.clickStartTime));
		
		if(longClick) { return; }

		//get how much the click event moved to work out if it was a drag or a click.
		drag = (	this.screen.distancex > this.isDragDelta ||
					this.screen.distancey > this.isDragDelta ||
					this.screen.distancex < -this.isDragDelta || 
					this.screen.distancey < -this.isDragDelta 
				);

		this.screen.distancex = 0;
		this.screen.distancey =0;

		if (drag) { 
			return; 
		}
		
		
		this.handleImageClicked(e);

	},
	
	handleImageNavigation: function(id) {
		//Resolve issue  with navigating through images
		var left, right, photo, _this = this;
		left = $('.button-left');
		right = $('.button-right');
		if (left.length > 0) {
			photo = cb.flickr.menuItemLookup[id];

			left.on("click", function(e) {
				_this.addImageView(photo.previous.id);
			});
			right.on("click", function(e) {
				_this.addImageView(photo.next.id);
			});
		}
	},
	
	handleClose: function() {
		var closeButton = $('.image-close');
		var _this = this;
		if (closeButton.length > 0) {
			closeButton.on("click", function(e) {
				$('.image-viewer').remove();
				_this.documentCache.removeAttr('style');
			});
		}
	},
	
	handleImageClicked: function(e) {
		var photoId;
		
		// get id of image clicked.
		photoId = e.target.id;

		this.addImageView(photoId);
		
	}
	
	
};

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
	
				if(i !== 0) {
						cb.flickr.menuItemLookup[id].photos[photos[i].id].previous = photos[i-1];
					}
					if(photos[i+1]) {
						cb.flickr.menuItemLookup[id].photos[photos[i].id].next = photos[i+1];
					}
					cb.flickr.menuItemLookup[id].photos[photos[i].id].parentId = id;
				
				div = document.createElement('div');
				div.className = 'item';
				if (i === 0) {
					div.id = "item1";
					picture = '<picture>';
					picture += '<source srcset="https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_b.jpg" media="(min-width: 1300px)">';
					picture += '<source srcset="https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_z.jpg" media="(min-width: 620px)">';
					picture += '<img id="' + photo.id  + '" class="cbp-sideimage" src="https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_n.jpg" alt="">';
					picture += '</picture>';
				}
							
				//img = '<img src="https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_q.jpg" />';
				img = '<picture>';
				img += '<source srcset="https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_q.jpg" media="(min-width: 700px)">';
				img += '<img id="' + photo.id  + '" src="https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_s.jpg" alt="">';
				img += '</picture>';
				div.innerHTML = img;
				frag.appendChild(div);
				//containers.eq(i).css('background', 'url(https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_q.jpg)');
			}

			mainImage.innerHTML = picture;
			slider.appendChild(frag);
			var s = new cb.Slider();

			if(cback) { cback(); }
			
		});	
	
	}
};
		var cb = cb || {};

		cb.Menu = function() {
			this.collections = {};
			this.menuItemLookup = {};
			this.init();
			this.addHandlers();
		};  
		
		cb.Menu.prototype = {
			
			init: function() {	
				this.createMenu();
			},
			
			createMenu: function(){
				var _this = this;
				cb.flickr.getCollectionTree(function(data) {
					//Create a document fragment to insert into the dom
					console.log(data);
					var frag, ul1, event, menu, key, firstSet;
					
					frag = document.createDocumentFragment();
					ul1 = document.createElement('ul');
					
					for (key in data) {
						if (data.hasOwnProperty(key) && key.indexOf('-') > -1) {
							
							var item, i = 0, len, sets, ul2, li1, tn, randomSet;
							
							item = data[key];
							sets = item.set;
							len = sets.length;
							
							li1 = document.createElement('li');
							tn = document.createTextNode(item.title);
							ul2 = document.createElement('ul');
							li1.appendChild(tn);
							li1.appendChild(ul2);
							ul1.appendChild(li1);
							
							for (i; i < len; i++) {
								var li2, tn2;
								li2 = document.createElement('li');
								li2.setAttribute('data-id', sets[i].id);			
								tn2 = document.createTextNode(sets[i].title);
								li2.appendChild(tn2);
								ul2.appendChild(li2);
							}
						}
					}

					frag.appendChild(ul1);
					menu = document.getElementById('menu');
					menu.appendChild(frag);

					// Add Handlers
					_this.addHandlers();
					
					firstSet = data[cb.flickr.photoCollection[0]];
					event = $.Event( "menuAvailiable" );
					event.menuData = firstSet;
					$(document).trigger(event);
					
				});
			},
			
			addHandlers: function() {
				var _this = this;
				$('ul').on('click', function(e) {
					e.preventDefault();
					e.stopPropagation()
					var target = $(e.target);
					var details = cb.flickr.menuItemLookup[target.attr('data-id')]; 
					if (e.target && target.length > 0 && target.attr('data-id') && target.attr('data-id').length > 0) {
						cb.imgmanager.loadCategoryImages(target.attr('data-id'), function() {
							picturefill();
						});
						cb.view.updateTitleDescription(details.title, details.description);
					}
				});	
				
			},
			
			removeHandlers: function() {
				
				$('ul').off('click');
				
			},
			
			getRandomInt: function(min, max) {
				return Math.floor(Math.random() * (max - min)) + min;
			}
	
		};
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
			//http://ariya.ofilabs.com/2013/11/javascript-kinetic-scrolling-part-2.html
			
			var cb = cb || {};
			
			cb.Slider = function(){
				var _this = this;
				
				this.view = document.getElementById('slider');
				this.container = $('.cbp-container');
				this.overlay = document.getElementById('overlay');

				this.screenWidth;
				this.screenHeight;
				this.max;
				
				// Add event listener for onresize that adds a class of disabled whilst the window is being resized
				$(window).on('resize', $.proxy(this.resize, this));

				this.screenSize();
				
				if(this.screenWidth > this.container.width()) {
					this.container.width('100%');
					return false;
				}
				
				this.imgCount = $('.item').length;
				this.offset = this.min = 0;
				this.pressed = false;
				this.timeConstant = 325; // ms	
				this.velocity;
				this.amplitude;
				this.ticker;			
				
				this.init();

				this.addHandlers();
				
				this.indicator = document.getElementById('indicator');
				this.relative = (innerWidth - 30) / this.max;

				this.xform = 'transform';
				['webkit', 'Moz', 'O', 'ms'].every(function (prefix) {
					var e = prefix + 'Transform';
					if (typeof _this.view.style[e] !== 'undefined') {
						xform = e;
						return false;
					}
					return true;
				});
			};
			
			cb.Slider.prototype = {
				init: function() {
					// get device dimentions, calculate width and height of each image as a percentage.
					// 
					this.container.width(parseInt(getComputedStyle(document.getElementById('item1')).width, 10) * this.imgCount);
					this.snap = parseInt(getComputedStyle(document.getElementById('item1')).width, 10);
					this.overlay.style.left = (2 * this.snap) + 'px';
				},
				addHandlers: function() {
					var $view = $(this.view)
					var supportsTouch = 'ontouchstart' in document;
					if (supportsTouch) {
						this.view.addEventListener("touchstart", $.proxy(this.tap, this), false);
						this.view.addEventListener("touchmove", $.proxy(this.drag, this), false);
						this.view.addEventListener("touchend", $.proxy(this.release, this), false);
					}
					else {
						$view.on('mousedown', $.proxy(this.tap, this));
						$view.on('mousemove', $.proxy(this.drag, this));
						$view.on('mouseup', $.proxy(this.release, this));
					}

					
				},
				removeHandlers: function() {
					var $view = $(this.view)
				
					var supportsTouch = 'ontouchstart' in document;
					if (supportsTouch) {
						this.view.removeventListener("touchstart", $.proxy(this.tap, this), false);
						this.view.removeventListener("touchmove", $.proxy(this.drag, this), false);
						this.view.removeventListener("touchend", $.proxy(this.release, this), false);
					}
					else {
						$view.off('mousedown', $.proxy(this.tap, this));
						$view.off('mousemove', $.proxy(this.drag, this));
						$view.off('mouseup', $.proxy(this.release, this));
					}
				},
				xpos: function(e) {
					// touch event
					if (e.targetTouches && (e.targetTouches.length >= 1)) {
						return e.targetTouches[0].clientX;
					 }

					 // mouse event
					 return e.clientX;
				 },
				 screenSize: function() {
					var doc = $(document);
					this.screenWidth = doc.width();
					this.screenHeight = doc.height();
					this.max = parseInt(getComputedStyle(document.getElementById('slider')).width, 10) - window.innerWidth;
					this.relative = (window.innerWidth - 30) / this.max;
				 },
				
				scroll: function(x) {
					this.offset = (x > this.max) ? this.max : (x < this.min) ? this.min : x;
					this.view.style[xform] = 'translateX(' + (-this.offset) + 'px)';
					this.indicator.style[xform] = 'translateX(' + (this.offset * this.relative) + 'px)';
				},

				track: function() {
					var now, elapsed, delta, v;

					now = Date.now();
					elapsed = now - this.timestamp;
					this.timestamp = now;
					delta = this.offset - this.frame;
					this.frame = this.offset;

					v = 1000 * delta / (1 + elapsed);
					this.velocity = 0.5 * v + 0.2 * this.velocity;
				},

				autoScroll: function() {
					var elapsed, delta;
					
					if (this.amplitude) {
						elapsed = Date.now() - this.timestamp;
						delta = -this.amplitude * Math.exp(-elapsed / this.timeConstant);

						if (delta > 0.5 || delta < -0.5) {
							this.scroll(this.target + delta);
							requestAnimationFrame($.proxy(this.autoScroll, this));
						} else {
							this.scroll(this.target);
						}
					}
				},

				tap: function(e) {
					this.pressed = true;
					this.reference = this.xpos(e);
					this.velocity = this.amplitude = 0;
					this.frame = this.offset;
					this.timestamp = Date.now();
					clearInterval(this.ticker);
					this.ticker = setInterval($.proxy(this.track, this), 100);

					e.preventDefault();
					e.stopPropagation();
					return false;
				},

				drag: function(e) {
					var x, delta;
					if (this.pressed) {
						x = this.xpos(e);
						delta = this.reference - x;
						if (delta > 2 || delta < -2) {
							this.reference = x;
							this.scroll(this.offset + delta);
						}
					}
					e.preventDefault();
					e.stopPropagation();
					return false;
				},

				release: function(e) {
					this.pressed = false;

					clearInterval(this.ticker);
					this.target = this.offset;
					if (this.velocity > 10 || this.velocity < -10) {
						this.amplitude = 0.8 * this.velocity;
						this.target = this.offset + this.amplitude;
					}
					this.target = Math.round(this.target / this.snap) * this.snap;
					this.amplitude = this.target - this.offset;
					this.timestamp = Date.now();
					requestAnimationFrame($.proxy(this.autoScroll,this));
					
					e.preventDefault();
					e.stopPropagation();
					return false;
				},
				
				resized: function() {
					var that = this;
					this.init();
					this.autoScroll();
					this.offset = 0;
					this.view.style[xform] = 'translateX(0px)';
					this.indicator.style[xform] = 'translateX(0px)';
					this.screenSize();
					
					if(this.screenWidth > this.container.width()) {
						this.container.width('100%');
						this.removeHandlers();
					}
					else
					{
						this.addHandlers();
					}
					
					if(this.view.classList.contains("disabled")) {
						this.view.classList.remove("disabled");
					}
				},
				
				resize: function(e) {
					var that = this;
					clearTimeout(this.resizeFinished);
					this.resizeFinished = setTimeout($.proxy(this.resized, that), 2000);

					if(!this.view.classList.contains("disabled")) {
						this.view.classList.add("disabled");
					}
				}
			};
var cb = cb || {};

window.onload = function () {
	
	cb.route = new cb.Route(); 
	cb.flickr = new cb.Flickr();
	cb.imageviewer = new cb.ImageViewer();
	cb.imgmanager = new cb.ImgManager();
	cb.view = new cb.View();
	
};

window.onerror = function (errorMsg, url, lineNumber) {
    //alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber);
}
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