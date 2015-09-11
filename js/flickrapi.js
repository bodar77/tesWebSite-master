var cb = cb || {};

cb.Flickr = function(){
	var _this = this;
	this.appid = '9b217b1f476896d402cabd129e91974a';
	this.userid = '67942935@N04';
	this.albumnid;
	this.tree;
	this.photoCollection = [];
	this.menuItemLookup = {};
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
			console.log(_this.tree);

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
				console.log('- ' + collections[i].title);
				for (j; j < jlen; j++) {
					_this.menuItemLookup[collections[i].id].photos[sets[j].id] = sets[j];
					_this.menuItemLookup[collections[i].id].photos[sets[j].id].photos = {};
					_this.menuItemLookup[sets[j].id] = _this.menuItemLookup[collections[i].id].photos[sets[j].id];
					_this.photoCollection.push(sets[j].id);
					console.log('--' + sets[j].title);
				}
			}
			
			console.log(_this.menuItemLookup);
			
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
