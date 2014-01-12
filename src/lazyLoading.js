protos.lazyLoading = function(options) {
	var defaultOptions = {
		container: $()
	};
	options = $.extend(defaultOptions, options);
	
	$(document).scroll(function() {
		var wintop = $(window).scrollTop(),
			docheight = $(document).height(),
			winheight = $(window).height(),
			scrolltrigger = 0.95;

		//$(window).scrollTop() == $(document).height() - $(window).height()
        if((wintop/(docheight-winheight)) > scrolltrigger) {
			options.container.trigger("lazyLoad");
		}
	});
};
