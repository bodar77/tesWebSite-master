var cb = cb || {};

// Image viewer allows a thumnail image to be clicked and become full size. Then the images can be scrolled at full size or closed.
cb.ImageViewer = function(){
	var _this = this;
	// Add properties for page elements
	this.view = document.getElementById('slider');
	
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
	
	addHandlers: function() {
	
		// Thumbnail based touchstart, touchmove - prevents drag move opening the thumbnail. touchend.
		var $view = $(this.view);
		
			if (typeof window.ontouchstart !== 'undefined') {
			$view.on('touchstart', $.proxy(this.handleTouchStart, this));
			$view.on('touchmove', $.proxy(this.handleTouchMove, this));
			$view.on('touchend', $.proxy(this.handleTouchEnd, this));
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
			picture += '<source srcset="https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_b.jpg" media="(min-width: 620px)">';
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

		this.handleClose();
		this.handleImageNavigation(photoId);
	},
	
	handleTouchStart: function(e) {
		//get mouse clicked time
		this.clickStartTime = Date.now();
		
		//get mouse position
		this.screen.mousex = e.clientX;
		this.screen.mousey = e.clientY;
	},
	
	handleTouchMove: function(e) {
		//update mouse position
	},
	
	handleTouchEnd: function(e) {
		var longClick, drag;
	
		//get mouse clicked tIme, if longer than the delta we exit;
		this.clickEndTime = Date.now();
		longClick = (this.clickDurationDelta < (this.clickEndTime - this.clickStartTime));
		
		if(longClick) { return; }
		
		//calculate distance moved
		this.screen.distancex = this.screen.mousex - e.clientX;
		this.screen.distancey = this.screen.mousey - e.clientY;
		
		//get how much the click event moved to work out if it was a drag or a click.
		drag = (	this.screen.distancex > this.isDragDelta ||
					this.screen.distancey > this.isDragDelta ||
					this.screen.distancex < -this.isDragDelta || 
					this.screen.distancey < -this.isDragDelta 
				);
		
		if (drag) { return; }
		
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
		if (closeButton.length > 0) {
			closeButton.on("click", function(e) {
				$('.image-viewer').remove();
			});
		}
	},
	
	handleImageClicked: function(e) {
		var photoId;
		
		// get id of image clicked.
		photoId = e.target.id;
		console.log(photoId);

		this.addImageView(photoId);
		
	}
	
	
};
