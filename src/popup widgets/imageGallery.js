widgets.imageGallery = function (options) {
	var MAINIMAGE = "mainImage",
	hashTag = '#',
	defaultOptions = {
			width: 1000,
			height: 500,
			darkness: 0.4,
			repeatImages: true,
			images: []
		},
		that = this,
		currentImageIndex = 0,
		IMAGE_CHANGED = 'imageChanged';
	that.images = options.images || [];
	that.dataSource = [];
		
	(function changeTheTypeOfImages() {
		if(that.images instanceof protos.dataSource) //If the data is setted by dataSource get only data property
		{
			that.dataSource = that.images;
			that.images = that.dataSource.data;
		}
	})();

	options = $.extend(defaultOptions, options);
	that.popUp = $(options.author).protos().popUp(options); //createInstance(options, options.author, protos.widget.popUp, "popUp");
	
	var widthOfButtons = { style: 'width: ' + options.width/2 + 'px'};
	that.popUp.contentHtml = 
		protos.generateHTML("img", [], "", MAINIMAGE, true, { style: "max-width: " + options.width + "px"}) + 
		protos.generateHTML('div', [], '<b>></b>', 'nextImg', false, widthOfButtons) +
		protos.generateHTML('div', [], '<b><</b> ', 'prevImg', false, widthOfButtons);
		
	var changeMainImage = function(imageSrc) {
		var imageElement = $(hashTag + MAINIMAGE)[0];
		imageElement.setAttribute('src', imageSrc);
	};
	
	var changeImageIfExist = function(image) {
		if(image)
		{
			changeMainImage(image.url);
			image.title ? $('.p-popUpTitle').text(image.title) : $('.p-popUpTitle').text(options.title);
		}
	};
	
	that.nextImage = function() {
		$(options.author[0]).trigger('nextImage');
		moveFlagIntoBounds(1);
		changeImageIfExist(that.images[currentImageIndex]);
		$(options.author[0]).trigger(IMAGE_CHANGED);
	};
	
	that.previousImage = function() {
		$(options.author[0]).trigger('previousImage');
		moveFlagIntoBounds(-1);
		changeImageIfExist(that.images[currentImageIndex]);
		$(options.author[0]).trigger(IMAGE_CHANGED);
	};
	
	var moveFlagIntoBounds = function(increment){
		var length = that.images.length - 1;
		if(length < 0)
		{
			return false;
		}
		currentImageIndex += increment;
		
		if(currentImageIndex > length){
			currentImageIndex = options.repeatImages ? 0 : length;
			return false;
		}
		if(currentImageIndex < 0){
			currentImageIndex = options.repeatImages ? length : 0;
			return false;
		}

	};
	
	var baseMethodShow = that.popUp.show,
		baseMethodHide = that.popUp.hide;
	
	that.popUp.show = function (){
		baseMethodShow();
		changeImageIfExist(that.images[0]);
		$('#nextImg').on('click', function(){
			 that.nextImage();
		 });
	
		$('#prevImg').on('click', function(){
			that.previousImage();
		});
		
		$('body').on('keydown', function (event) {
			if(event.keyCode == 37)
			{
				that.previousImage();
			}
			if(event.keyCode == 39)
			{
				that.nextImage();
			}
		});
	};
	
	that.popUp.hide = function (){
		baseMethodHide();
		$('#nextImg').off('click');
		$('#prevImg').off('click');
		$('body').off('keydown');
	};
	
	that.removeImages = function() {
		that.images = [];
	};
	
	that.addImages = function(image){
		if(image instanceof protos.dataSource)
		{
			that.images = image.data;
		}
		
		if(image.length > 0)
		{
			for(var item in image)
			{
				that.images.push(image[item]);
			}
			changeImageIfExist(that.images[0]);
			return that;
		}
		
		if(typeof(image) === 'object')
		{
			that.images.push(image);
		}
		changeImageIfExist(that.images[0]);
		return that;
	}
	
	that.changeImage = function(guid) {
		changeImageIfExist(that.dataSource.findItem(guid));
		$(options.author[0]).trigger(IMAGE_CHANGED);
	};
	
	return that;
};