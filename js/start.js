var cb = cb || {};

window.onload = function () {
	
	cb.flickr = new cb.Flickr();
	cb.imageviewer = new cb.ImageViewer();
	cb.imgmanager = new cb.ImgManager();
	cb.view = new cb.View();
	
};