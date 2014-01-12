widgets.swap = function(options) {
	var author = options.author,
		newElement = $(options.element),
		that = this;

	author.on(options.event, function() {
		that.start();
	});

	that.start = function() {
		author.trigger("swappingStarts");
		author.fadeOut(options.fadeOutSpeed);
		newElement.fadeIn(options.fadeInSpeed);

		setTimeout(function() {
			author.trigger("swappingEnds");
		}, options.fadeOutSpeed + options.fadeInSpeed);
	}

	return that;
};
