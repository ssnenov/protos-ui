widgets.shake = function(options) {
	var that = this,
		author = options.author,
		speed = options.speed,
		distance = options.distance * -1,
		vertical = options.vertical,
		intervalInstance,
		timeoutInstance;

	author.on(options.event, function() {
		that.start();
	});

	that.start = function() {
		author.trigger("shakingStarts");

		intervalInstance = setInterval(function() {
			author.css({
				'-webkit-transform': 'translate(' + (!vertical ? distance : 0) + 'px, ' + (vertical ? distance : 0) + 'px)'
			});
			distance *= -1;
		}, speed * 100);

		timeoutInstance = setTimeout(function() {
			author.css({
				'-webkit-transform': 'translate(0px, 0px)'
			});
			that.stop();
		}, options.duration);
		
		return that;
	};

	this.stop = function() {
		clearInterval(intervalInstance);
		clearTimeout(timeoutInstance);
	};

	return that;
};