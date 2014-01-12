protos.spa = function(options) {
	var that = this;
	that.options = $.extend({}, options),
	that.layout = that.options.author,
	that.routes = that.options.routes;

	that.startRouting = function() {
		if ("onhashchange" in window) { // event supported?
			window.onhashchange = function() {
				hashChanged(window.location.hash);
			}
		} else { // event not supported:
			var storedHash = window.location.hash;
			window.setInterval(function() {
				if (window.location.hash != storedHash) {
					storedHash = window.location.hash;
					hashChanged(storedHash);
				}
			}, 100);
		}
	};
	
	that.stopRouting = function() {
		clearInterval(true);
		window.onhashchange = $.noop;
	};

	that.navigate = function(path) {
		hashChanged('#' + path);
	};
	
	var hashChanged = function(hashValue) {
		for (var route in that.routes) {
			var path = that.routes[route].route,
				parseQueryString;
			
			(hashValue.indexOf('/') === 1 && path.indexOf('/') === 0) ? parseQueryString = false : parseQueryString = true;

			if (doesExistMatchingRoute('#' + path, hashValue, parseQueryString)) {
				var action = that.routes[route].action;
				
				if(typeof(action) !== 'undefined' && typeof(action) === 'function')
				{
					var params = parseQueryString ? protos.queryStringToJson(hashValue) : protos.routeToArray(hashValue);
					return action(params || {}); // Return callback of route
				}
				else if(typeof(action) === 'undefined')
				{
					return loadContent(path); // Load route value to the layout
				}
				else if (typeof(action) === 'string') {
					return loadContent(action); // Load action url to the layout
				}
				break;
			}
		}
	},
	doesExistMatchingRoute = function(path, hashValue, parseQueryString) {
		if(path === hashValue) {
			return true;
		} // Else continue searching for parameterized route
		
		var regex = new RegExp(':[a-zA-Z0-9.\\-~_+%]+', 'g'),
			paramsToReplace = path.match(regex),
			params;
			
		if (paramsToReplace === null)
		{
			return false;
		}
		
		if (parseQueryString) {
			params = protos.jsonToArray(protos.queryStringToJson(hashValue)); //The route is in '/page?id=:id&filter=:filter' format
		} else {
			params = protos.routeToArray(hashValue); //The route is in '/:page/:id' format
		}
		
		for (var param in paramsToReplace)
		{
			path = path.replace(paramsToReplace[param], params[param]);
		}
		
		return path === hashValue;
	},
	loadContent = function(url) {
		$.ajax({
			url: url,
			type: 'html',
			method: 'get'
		}).done(function(data) {
			that.layout.html(data);
		});
	};

	return that;
}
