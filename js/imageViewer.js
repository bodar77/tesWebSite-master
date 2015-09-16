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
