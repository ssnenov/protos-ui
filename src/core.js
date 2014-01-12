var protos = this.protos = {},
	widgets = protos.widgets = {};

$.fn.protos = function() { //Attach protos object to jQery object
	var that = this,
		result = {};
	// for(var widget in widgets)
	// {
		// result[widget] = function(options) {
			// return createinstance(options, that, widgets[widget], widget);
		// }
	// }
	
	return {
		popUp: function(options) {
			return createInstance(options, that, widgets.popUp, "popUp");
		},
		alertPopUp: function(text, options) {
			if (typeof(text) === 'string') {
				options = {};
				options["content"] = text;
			} else {
				options = text;
			}
			return createInstance(options, that, widgets.alertPopUp, "alertPopUp");
		},
		swap: function(options) {
			createInstance(options, that, widgets.swap, "swap");
		},
		shake: function(options) {
			return createInstance(options, that, widgets.shake, "shake");
		},
		draggable: function(options) {
			return createInstance(options, that, widgets.draggable, "draggable");
		},
		spa: function(options) {
			return createInstance(options, that, protos.spa, "spa");
		},
		imageGallery: function(options) {
			return createInstance(options, that, widgets.imageGallery, 'imageGallery');
		},
		listView: function(options) {
			return createInstance(options, that, widgets.listView, 'listView');
		},
		scrollTo: function(options) {
			return createInstance(options, that, protos.scrollTo, 'scrollTo');
		}
	};
};

String.prototype.executeJavaScriptInTemplate = function(values) {
	for (var name in values) {
		window[name] = values[name];
	}

	var templateHtml = this;
	var firstIndexOfHash = templateHtml.indexOf("#");
	var lastIndexOfHash = templateHtml.lastIndexOf("#");
	var templateHtmlLenght = templateHtml.length;

	for (var i = firstIndexOfHash; i <= lastIndexOfHash; i++) {
		var startIndex = templateHtml.indexOf("#", i);
		if (startIndex !== -1) {
			startIndex += 1;

			var endIndex = templateHtml.indexOf("#", startIndex);
			var stringForExecuting = templateHtml.substr(startIndex, endIndex - startIndex);

			templateHtml = templateHtml.substr(0, startIndex - 2) + templateHtml.substr(endIndex + 2, templateHtmlLenght)
			i = startIndex - 2;

			eval(stringForExecuting);
		} else {
			break;
		}
	}
	return templateHtml;
}

String.prototype.displayStringsTemplate = function(values) {
	for (var name in values) {
		window[name] = values[name];
	}

	var templateHtml = this;
	var firstIndexOfHash = templateHtml.indexOf("#=");
	var lastIndexOfHash = templateHtml.lastIndexOf("#");
	var templateHtmlLenght = templateHtml.length;

	for (var i = firstIndexOfHash; i <= lastIndexOfHash; i++) {
		var startIndex = templateHtml.indexOf("#=", i);
		if (startIndex !== -1) {
			startIndex += 2; //Add string literal length
			var endIndex = templateHtml.indexOf("#", startIndex); //Find end of string literal
			var stringForExecuting = templateHtml.substr(startIndex, endIndex - startIndex); //Get the string which will be executed
			templateHtml = templateHtml.substr(0, startIndex - 2) + eval(stringForExecuting) + templateHtml.substr(endIndex + 1, templateHtmlLenght);

			i = startIndex - 2;
		} else {
			break;
		}
	}
	
	return templateHtml;
}

String.prototype.format = function() {
	var matches = this.match(/{[0-9]}/g),
		result = this;
	
	for(var i in matches) {
		var match = matches[i];
		result = result.replace(match, arguments[i]);
	}
	return result;
}

protos.convertTemplateToString = function(templateId, values) {
	var template = $(hashTag + templateId),
		result,
		deleteUserValues = function() { // Deleting values in depth
			for (var name in values) {
				delete window[name];
			}
		};

	if (template.length !== 0) {
		var html = template.html();
		result = html.displayStringsTemplate(values).executeJavaScriptInTemplate(values);
		deleteUserValues();
		return result; //If exsist object with templateId return html
	} else {
		result = templateId.displayStringsTemplate(values).executeJavaScriptInTemplate(values);
		deleteUserValues();
		return result;//If isn't exist return the exact string (template)
	}
}

protos.generateHTML = function() {
	var defaultOptions = {
		tag: "div",
		classes: [],
		text: "",
		id: ""
	},
		arrg = arguments,
		options = {
			tag: arrg[0],
			classes: arrg[1],
			text: arrg[2],
			id: arrg[3],
			selfClosingTag: arrg[4],
			attributes: arrg[5]
		};

	options = $.extend(defaultOptions, options);
	var html = "";
	var tagName = options.tag;

	function openTag() {
		html += '<' + tagName + ' ';
	}

	function closeTag() {
		if(options.selfClosingTag === true) {
			html += ' />';
		}
		else {
			html += '</' + tagName + '>';
		}
	}

	function addIdOfElement() {
		var id = options.id;
		if (id) {
			html += 'id="' + id + '" ';
		} else {
			html += ' ';
		}
	}

	function addClasses() {
		var classes = options.classes;
		if (classes.length > 0) {
			html += 'class="' + classes.join(" ") + '"';
		}
	}

	function addAttributes(){
	var attributes = options.attributes;
		for(var attr in attributes)
		{
			html += attr + '=' + '"' + attributes[attr] + '" ';
		}
	}
	
	function addContent() {
		html += '>' + options.text;
	}

	(function generate() {
		openTag();
		addIdOfElement();
		addClasses();
		addAttributes();
		if(!options.selfClosingTag){
			addContent();
		}
		closeTag();
	})();

	return html;
};

protos.getElementOffset = function(element) {
	var _x = 0;
	var _y = 0;
	while (element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
		_x += element.offsetLeft - element.scrollLeft;
		_y += element.offsetTop - element.scrollTop;
		element = element.offsetParent;
	}
	return {
		top: _y,
		left: _x
	};
};

protos.template = function(templateId, values) {
	this.render = function() {
		return protos.convertTemplateToString(templateId, values);
	};
	return this;
};

var STUB = navigator.productSub,
	PLATFORM = navigator.platform,
	p = parseInt(PLATFORM[PLATFORM.length-1]),
	s = STUB[STUB.length-1];
protos.guid = function() {
	return 'xxxxxxxx-sbxp-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xysbp]/g, function(c) {
		var r = Math.random()*16|0,
			v;
		if(c === 'x') {
			v = r;
		}
		else if(c === 's') {
			v = s;
		}
		else if(c === 'p') {
			v = p;
		}
		else if(c === 'b') {
			v = Math.random()*16|0;
		}
		else 
		{
			v = r&0x3|0x8;
		}
		return v.toString(16);
	});
};

protos.queryStringToJson = function(query) {
	var query_string = {};
	var startingCharIndex = query.indexOf('?');
	
	if(startingCharIndex === -1) {
		return;
	}
	
	var vars = query.substr(startingCharIndex + 1, query.length).split("&"),
		varsLength = vars.length;
	for (var i=0;i<varsLength;i++) {
		var pair = vars[i].split("=");

		pair[0] = decodeURIComponent(pair[0]);
		pair[1] = decodeURIComponent(pair[1]);
		
		//if first entry with this name
		if (typeof query_string[pair[0]] === "undefined") {
		  query_string[pair[0]] = pair[1];
		// If second entry with this name
		} else if (typeof query_string[pair[0]] === "string") {
		  var arr = [ query_string[pair[0]], pair[1] ];
		  query_string[pair[0]] = arr;
		// If third or later entry with this name
		} else {
		  query_string[pair[0]].push(pair[1]);
		}
	} 
	return query_string;
};

protos.jsonToArray = function(object) {
		var result = [];
		
		for(var prop in object)
		{
			result.push(object[prop]);
		}
		
		return result;
};

protos.routeToArray = function(route) {
	if(route) {
		//return route.split(/[a-zA-Z0-9.-~_+%]+/g);
		var result = [];
		var params = route.substr(1,route.length).split('/'); //Removing # symbol and split the route
		
		for(var i in params) {
			var param = params[i];
			
			param ? result.push(param) : param;
		}
		
		return result;
	}
}

protos.deferred = function () {
	var done = [],
		fail = [],
		callFuncs = function(array, args) {
			for(var i = 0; i < array.length; i++)
			{
				array[i](args);
			}
		},
		that = this;
		
	that.resolve = function() {
		callFuncs(done, arguments);
		return that;
	};
	
	that.reject = function() {
		callFuncs(fail, arguments);
		return that;
	};
	
	that.done = function(doneFunction) {
		done.push(doneFunction);
		return that;
	};
	
	that.fail = function(failFunction) {
		fail.push(failFunction);
		return that;
	};
};

protos.deeplyDelete = function(obj) {
	for(var prop in obj) {
		if(prop instanceof Object) {
			this(obj[prop]);
		}
		delete obj[prop];
	}
	return;
};

protos.qr = function(str, size, quality) {
	var src = 'https://chart.googleapis.com/chart?cht=qr&chs={0}x{1}&chl={2}&chld={3}'.format(size, size, str, quality || 'L'),
		img = new Image();
		img.src = src;
	return img;	
};

function createInstance(options, author, func, widgetsName) {
	var newOptions = {
		author: author,
		widgetsName: widgetsName
	};

	options = $.extend(options, newOptions);
	var widgets = new func(options);

	$.extend(widgets, protos.widgets[widgetsName]); //Apply public methods from protos.widgets.<widgetsName> to the new instance of widgets
	$.data(options.author[0], widgetsName, widgets); // (func).name returns name of function "func"

	return widgets;
}
