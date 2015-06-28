			var cb = cb || {};
			
			cb.Slider = function(){
				var _this = this;
				this.view = document.getElementById('slider');
				
				this.max = parseInt(getComputedStyle(this.view).width, 10) - innerWidth;
				this.offset = this.min = 0;
				this.pressed = false;
				this.timeConstant = 325; // ms	
				this.velocity;
				this.amplitude;
				this.ticker;
				
				this.overlay = document.getElementById('overlay');
				this.init();
				
				if (typeof window.ontouchstart !== 'undefined') {
					this.view.addEventListener('touchstart', this.tap.bind(this));
					this.view.addEventListener('touchmove', this.drag.bind(this));
					this.view.addEventListener('touchend', this.release.bind(this));
				}
				this.view.addEventListener('mousedown', this.tap.bind(this));
				this.view.addEventListener('mousemove', this.drag.bind(this));
				this.view.addEventListener('mouseup', this.release.bind(this));
				
				// Add event listener for onresize that adds a class of disabled whilst the window is being resized
				window.addEventListener('resize', this.resize.bind(this));
				
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
					this.snap = parseInt(getComputedStyle(document.getElementById('item1')).width, 10);
					this.overlay.style.left = (2 * this.snap) + 'px';
				},
				xpos: function(e) {
					// touch event
					if (e.targetTouches && (e.targetTouches.length >= 1)) {
						return e.targetTouches[0].clientX;
					 }

					 // mouse event
					 return e.clientX;
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
					
					console.log("track now = " + now + " elapsed = " + elapsed + " delta= " + delta + " v = " + v + " velocity = " + this.velocity);
				},

				autoScroll: function() {
					var elapsed, delta;
					
					if (this.amplitude) {
						elapsed = Date.now() - this.timestamp;
						delta = -this.amplitude * Math.exp(-elapsed / this.timeConstant);
						console.log("autoscroll delta = " + delta)
						if (delta > 0.5 || delta < -0.5) {
							this.scroll(this.target + delta);
							requestAnimationFrame(this.autoScroll.bind(this));
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
					this.ticker = setInterval(this.track.bind(this), 100);

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
					requestAnimationFrame(this.autoScroll.bind(this));
					
					console.log("release target = " + this.target + " amplitude = " + this.amplitude);
					
					e.preventDefault();
					e.stopPropagation();
					return false;
				},
				
				resized: function() {
					this.init();
					this.autoScroll.bind(this);
					
					if(this.view.classList.contains("disabled")) {
						this.view.classList.remove("disabled");
					}
				},
				
				resize: function(e) {
					this.resizeFinished
					var that = this;
					clearTimeout(this.resizeFinished);
					this.resizeFinished = setTimeout(this.resized.bind(that), 1000);

					if(!this.view.classList.contains("disabled")) {
						this.view.classList.add("disabled");
					}
				}
			};

		
		window.onload = function () {
			var s = new cb.Slider();	
		};