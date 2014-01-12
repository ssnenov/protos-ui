protos.scrollTo = function(options) {
	var author = options.author,
		speed = options.speed || 1000;
	$(document.body).animate({ scrollTop: protos.getElementOffset(author[0]).top }, speed);
	
	return author;
};
