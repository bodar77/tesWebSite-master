window.onload = function () {
	var s = new cb.Slider();
	var f = new cb.flickr();
	var i = new cb.imageViewer();
	
	f.getPhotosByPhotoId('72157646674241526', function(data) { 
		var i = 0, 
			len = data.photoset.photo.length, 
			photos = data.photoset.photo, 
			img, 
			photo,
			containers = $('.item');
		
		for (i; i < len; i++)
		{
			photo = photos[i];
			//img = '<img src="https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_q.jpg" />';
			img = '<picture>';
			img += '<source srcset="https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_q.jpg" media="(min-width: 620px)">';
			img += '<img id="' + photo.id  + '" srcset="https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_s.jpg" alt="">';
			img += '</picture>'
			containers[i].innerHTML = img;
			//containers.eq(i).css('background', 'url(https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_q.jpg)');
		}
	});	
	$(document).on('menuAvailiable', function(e) { 
		//console.log(e.data); 
	}
	);
};