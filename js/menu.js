		var cb = cb || {};

		cb.Menu = function() {
			this.collections = {};
			this.menuItemLookup = {};
			this.init();
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
								var li2, a1, tn2;
								li2 = document.createElement('li');
								li2.setAttribute('data-id', sets[i].id);	
								a1 = document.createElement('a');	
								a1.setAttribute('href', '#' + sets[i].title.toLowerCase());	
								tn2 = document.createTextNode(sets[i].title);
								a1.appendChild(tn2);
								li2.appendChild(a1);
								ul2.appendChild(li2);
							}
						}
					}

					frag.appendChild(ul1);
					menu = document.getElementById('menu');
					menu.appendChild(frag);
					
					firstSet = data[cb.flickr.photoCollection[0]];
					event = $.Event( "menuAvailiable" );
					event.menuData = firstSet;
					$(document).trigger(event);
					
				});
			},
			
			
			getRandomInt: function(min, max) {
				return Math.floor(Math.random() * (max - min)) + min;
			}
	
		};