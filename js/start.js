var cb = cb || {};

window.onload = function () {
	
	cb.route = new cb.Route(); 
	cb.flickr = new cb.Flickr();
	cb.imageviewer = new cb.ImageViewer();
	cb.imgmanager = new cb.ImgManager();
	cb.view = new cb.View();
	
};

window.onerror = function (errorMsg, url, lineNumber) {
    //alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber);
};