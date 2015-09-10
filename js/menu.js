		var cb = cb || {};

		cb.Menu = function(){
			this.collections = {};
			this.menuItemLookup = {};
			this.init();
			this.addHandlers();
		}
		
		cb.Menu.prototype = {
			
			init: function() {	
				this.createMenu();
			},
			
			createMenu: function(){
				var _this = this;
				cb.flickr.getCollectionTree(function(data) {
					//Create a document fragment to insert into the dom
					console.log(data);
					var frag, ul1, event, menu, key;
					
					frag = document.createDocumentFragment();
					ul1 = document.createElement('ul');
					
					for (key in data) {
						if (data.hasOwnProperty(key) && key.indexOf('-') > -1) {
							
							var item, i = 0, len, sets, ul2, li1, tn, randomSet;
							
							item = data[key];
							sets = item.set;
							len = sets.length;
							
							li1 = document.createElement('li');
							tn = document.createTextNode(item.title)
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
					//console.log(_this.menuItemLookup)
					// Add Handlers
					_this.addHandlers();
					
					randomSet = data[cb.flickr.photoCollection[_this.getRandomInt(0, len)]];
					event = $.Event( "menuAvailiable" );
					event.menuData = randomSet;
					$(document).trigger(event);
					
				});
			},
			
			addHandlers: function() {
				var _this = this;
				$('ul').on('click', function(e) {
					var target = $(e.target);
					var details = cb.flickr.menuItemLookup[target.attr('data-id')];
					if (e.target && target.attr('data-id').length > 0) {
						console.log("clicked: " + target.attr('data-id'));
						cb.imgmanager.loadCategoryImages(target.attr('data-id'));
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
	
		}