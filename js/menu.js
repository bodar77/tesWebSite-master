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
					var collections, i = 0, len, frag, ul1, event, menu;
					collections = data.collections.collection;
					//console.log(collections);
					len = collections.length
					frag = document.createDocumentFragment();
					ul1 = document.createElement('ul');
					for (i; i < len; i++) {
						_this.menuItemLookup[collections[i].id] = collections[i];
						_this.menuItemLookup[collections[i].id].photos = {};
						
						var j = 0, jlen, sets, ul2, li1, tn;
						li1 = document.createElement('li');
						tn = document.createTextNode(collections[i].title)
						ul2 = document.createElement('ul');
						li1.appendChild(tn);
						li1.appendChild(ul2);
						ul1.appendChild(li1);
						sets = collections[i].set;
						jlen = sets.length;
						console.log('- ' + collections[i].title);
						for (j; j < jlen; j++) {
							_this.menuItemLookup[collections[i].id].photos[sets[j].id] = sets[j];
							_this.menuItemLookup[collections[i].id].photos[sets[j].id].photos = {};
							_this.menuItemLookup[sets[j].id] = sets[j];
							
							var li2, tn2;
							li2 = document.createElement('li');
							li2.setAttribute('data-id', sets[j].id);			
							tn2 = document.createTextNode(sets[j].title);
							li2.appendChild(tn2);
							ul2.appendChild(li2);
							console.log('--' + sets[j].title);
						}
					}
					console.log(_this.collections);
					frag.appendChild(ul1);
					menu = document.getElementById('menu');
					menu.appendChild(frag);
					//console.log(_this.menuItemLookup)
					// Add Handlers
					_this.addHandlers();
					
					event = $.Event( "menuAvailiable" );
					event.menuData = data;
					$(document).trigger(event);
				});
			},
			
			addHandlers: function() {
				var _this = this;
				$('ul').on('click', function(e) {
					var target = $(e.target);
					var details = _this.menuItemLookup[target.attr('data-id')];
					if (e.target && target.attr('data-id').length > 0) {
						console.log("clicked: " + target.attr('data-id'));
						cb.imgmanager.loadCategoryImages(target.attr('data-id'));
						cb.view.updateTitleDescription(details.title, details.description);
					}
				});	
				
			},
			
			removeHandlers: function() {
				
				$('ul').off('click');
				
			}
	
		}