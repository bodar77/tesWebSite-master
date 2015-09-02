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
	
	this.documentCache = $('document');
	
	// Need full screen measurements
	this.screen = { width: 0, height:0, mousex: 0, mousey: 0, distancex: 0, distancey: 0 };
	
	this.init();
	
	// Add handlers for thumbnail click, left and right, close.
	this.addHandlers();
	// Request need to be made for images.

	
};

cb.ImageViewer.prototype = {
	init: function() {	
		
	},
	
	getMetrix: function() {
		var doc = this.documentCache,
			screen = this.screen;
			
		screen.width = doc.width();
		screen.height = doc.height();
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
	
	handleImageNavigation: function(e) {
	
	},
	
	handleClose: function(e) {
	
	},
	
	handleImageClicked: function(e) {
		var photoId;
		
		// Add overlay
		this.addOverlay
		
		// get id of image clicked.
		photoId = e.target.id;
		console.log(photoId);
		// request image from flickr api
		
		// add image to dom.
	}
	
	
};
