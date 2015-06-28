		var cb = cb || {};

		cb.flickr = function(){
			var _this = this;
			this.appid = '9b217b1f476896d402cabd129e91974a';
			this.userid = '67942935@N04';
			this.albumnid;
			this.tree;
			this.photoCollection = [];
			//properties
			//an array of arrays. each requested photoset is stored as an array by key in the photos array.
			this.photos;
			
			this.init();
		};
		
		cb.flickr.prototype = {
			init: function() {	
				this.getCollectionTree();
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
			
			
			getCollectionTree: function() {		
				//Need to separate api calls and create a caching mechanism.
			
				var _this = this;
				$.getJSON('https://api.flickr.com/services/rest/?method=flickr.collections.getTree&api_key=' + this.appid + '&user_id=' + this.userid + '&format=json&nojsoncallback=1',
				function(data){
					_this.tree = data;
					console.log(_this.tree);
					//if the image has a location, build an html snippet containing the data
					if(data.stat != 'fail') {
						_this.handleCollectionCallback(data);
					}
				});
			},
			
			getPhotosByPhotoId: function(id, callback) {
				var _this = this;
				$.getJSON('https://api.flickr.com/services/rest/?&method=flickr.photosets.getPhotos&api_key=' + this.appid + '&photoset_id=' + id + '&format=json&jsoncallback=?',
				function(data){
					_this.photoCollection = data.photoset;
					console.log(_this.photoCollection.ownername);
					//if the image has a location, build an html snippet containing the data
					if(data.stat != 'fail') {
						callback.call(this, data);
					}
				});
			},
			
			// local storage calls
			
			
			// Call backs
			
			handleCollectionCallback : function(data) {
				//Create a document fragment to insert into the dom
				var collections, i = 0, len, frag, ul1, event, menu;
				collections = data.collections.collection;
				len = collections.length
				frag = document.createDocumentFragment();
				ul1 = document.createElement('ul');
				for (i; i < len; i++) {
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
						var li2, tn2;
						li2 = document.createElement('li');
						tn = document.createTextNode(sets[j].title)
						li2.appendChild(tn);
						ul2.appendChild(li2);
						console.log('--' + sets[j].title);
					}
				}
				frag.appendChild(ul1);
				menu = document.getElementById('menu');
				menu.appendChild(frag);
				event = jQuery.Event( "menuAvailiable" );
				event.data = data;
				$(document).trigger(event);
			}
		};
