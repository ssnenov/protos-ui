
	(function($, document, hashTag) {
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

var APPNAME = navigator.appName,
	PLATFORM = navigator.platform,
	p = parseInt(PLATFORM[PLATFORM.length-1]),
	s = APPNAME[APPNAME.length-3],
	k = APPNAME[APPNAME.length-2];
protos.guid = function() {
	return 'xxxxxxxx-sbkp-4xxx-yxxx-kxxxxxxxxxxx'.replace(/[xysbkp]/g, function(c) {
		var r = Math.random()*16|0,
			v;
		if(c === 'x') {
			v = r;
		}
		else if(c === 's') {
			v = s;
		}
		else if(c === 'k') {
			v = k;
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

$.fn.serializeJson = function() {
   var result = {};
   var serializedArray = this.serializeArray();
   
   $.each(serializedArray, function() {
       if (result[this.name] !== undefined) {
           if (!result[this.name].push) {
               result[this.name] = [result[this.name]];
           }
           result[this.name].push(this.value || '');
       } else {
           result[this.name] = this.value || '';
       }
   });
   
   return result;
};

protos.deferred = function () {
	var done = [],
		fail = [],
		callFuncs = function(array, args) {
			for(var i = 0; i < array.length; i++)
			{
				array[i].apply(undefined, args);
			}
		},
		that = this;
		
	that.resolve = function() {
		// Array.prototy... is a workaround to convert arguments object to flatten array
		callFuncs(done, Array.prototype.slice.call(arguments, 0));
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

protos.dataSource = function(options) {
	var options = options || {}
	, that = this
	, remoteRepository // When data is readed (wherever) it stores here
	, itemsCount = null
	, lastQuery;
	
	that.dataChanged = $.noop;
	// In the local repo, stored data is that data that it comes (after filtering & sorting) from remote repo
	that.localRepository = null; // TODO: Think about to be with private
	// In currentPageData filed is stored the data from local repo but it's paged 
	that.currentPageData = null; // TODO: Think about to be with private with getter method
	that._pageSize = 15;
	
	var resolveRequest = function(request, query, deferred) {
		var typeOfRequest = typeof(request)
			, rawQuery = query;
		
		if(options.data.type === 'aspnet' && query.type ) {
			if(query.type === 'GET') {
				query = $.param(query);
			}
			else
			{
				query = JSON.stringify(query);
			}
		}
		
		if(options.prepareData) {
			query = options.prepareData(query);
		}
		
		if(typeOfRequest === 'function') {
			request(query, deferred);
			return;
		}
		
		var queryOptions = {
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			type: "GET",
			data: query,
			success: function(data) {
				deferred.resolve(data, rawQuery);
			},
			error: function(data) {
				deferred.reject(data, rawQuery);
			}
		};
		
		if(typeOfRequest === 'string') {
			queryOptions.url = request;
		}
		else
		{
			queryOptions = $.extend(queryOptions, request);
		}
		
		$.ajax(queryOptions);
	}
	, performQuery = function (collection) {
		// Set options.server = true, just to get items remotely and perform "server operations"
		if(options.server) { // If there is not a server operation
			if(!options.server.filtering) {
				// collection = collection.where()
			}
			
			if(!options.server.sorting) {
				// collection = collection.sort()
			}
		}
		return collection;
	}
	, observer = function() {
		this.savedChanges = false;
	}	
	,setProperties = function (items) {
		for(var i=items.length-1; i >= 0; --i)
		{
			var item = items[i];
			
			for(var prop in item) {
				item.watch(prop, observer);
			}
			
			item.uid = protos.guid();
			item.changed = false; // Property for MVVM framework
			item.savedChanges = true;
			item.deleted = false;
		}
	};
	
	that.read = function(query) {
		var deferred = new protos.deferred();
		
		deferred.fail(function(data){ /*TODO*/ console.log(data); });
		deferred.done(function(data) {
			// Request was done
			lastQuery = query;
			if(data.Total) {
				itemsCount = data.Total;
				remoteRepository = data.Data;
			}
			else
			{
				remoteRepository = data;
			}
			setProperties(remoteRepository);
			that.localRepository = performQuery(remoteRepository);
			that.dataChanged(true); // true || false
		});
		
		if(options.server && options.server.paging) {
			query = $.extend({
					Pagination: {
						Page: 1,
						PageSize: that._pageSize 
					}
				}, query);
		}
		
		// TODO: ADD page & pageSize as parameter of this method
		//if(!remoteRepository) 
		//{
			resolveRequest(options.data.read, query, deferred);
		//}
		
		return deferred;
	};
	
	that.itemsCount = function() {
		return itemsCount !== null ? itemsCount : that.localRepository.length;
	};
	
	that.update = function() {
		var deferred = new protos.deferred()
			, itemsForUpdate = remoteRepository.where(function(x) { return !x.savedChanges; })
			, updateMethod = options.data.update;
			
		deferred.done(function(data, items) {
			for(var i = items.length-1; i >= 0; --i) {
				items[i].savedChanges = true;
			}
			
			that.dataChanged(true);
		});
			
		if(typeof(updateMethod) === 'function') {
			updateMethod(itemsForUpdate, deferred);
			return deferred;
		}
		
		resolveRequest(updateMethod, itemsForUpdate, deferred);
		
		return deferred;
	};
	
	that.create = function(items) {
		// Insert items only in remoteRepo. After that call that.refresh()
		var deferred = new protos.deferred();
		
		deferred.done(function(result) {
			var items = result; // If it's passed some results from the ajax request, then get them otherwise keep with items
			
			if(!items instanceof Array) { // If it's a item (object), just wrap it as array, because setProperties requires array
				items = [items];
			}
			
			setProperties(items);
			remoteRepository = remoteRepository.concat(items);
			that.refresh();
		});
		
		if(!options.data.create) {
			deferred.resolve(items);
			return;
		}
		
		resolveRequest(options.data.create, items, deferred);
		
		return deferred;
	};
	
	that.delete = function() {
		var deferred = new protos.deferred(),
			deletedItemsExpression = function(x) { return x.deleted; };
		
		deferred.done(function() {
			that.refresh();
		});
		
		if(!options.data.delete) {
			remoteRepository.remove(deletedItemsExpression);
			deferred.resolve();
			return;
		}
		
		resolveRequest(options.data.delete, remoteRepository.where(deletedItemsExpression), deferred);
		
		return deferred;
	};

	that.getPageData = function (page, itemsPerPage, abortReadingData) {
		if(options.server && options.server.paging) {
			if(abortReadingData) {
				return that.currentPageData = that.localRepository;
			}
			return that.read({
					Pagination: {
						Page: page,
						PageSize: itemsPerPage 
					}
				});
		}
		
		return that.currentPageData = that.localRepository
			.skip((page - 1) * itemsPerPage)
			.take(itemsPerPage);
	};
	
	that.refresh = function() {
		var server = options.server;
		
		if(server && (server.filtering || server.paging || server.sorting)) {
			that.read(lastQuery);
			return that;
		}
		
		that.localRepository = performQuery(remoteRepository);
		that.dataChanged(true);
		return that;
	};
	
	// TODO: TEST IT!
	that.filter = function(filters) {
		if(options.server && options.server.filtering) {
			return that.read({
				Filters: filters
			});
		}
	};
	
	that.findItem = function(guid) {
		return remoteRepository.first(function(dataItem) { return dataItem.uid == guid; });
	};
	
	//(function() {
		// if(options.data.read) {
			// that.read();
		// }
	//})();
	
	return that;
};
protos.draggable = function(options) {
	var clicked = false;
	var clickPositionX,
		clickPositionY,
		author = $(options.author.selector),
		draggable; // author is draggable element

	if (options.moveParent && options.isParentDraggable) {
		author = $(options.moveParent);
		draggable = $(options.moveParent);
	} else {
		draggable = $(options.moveParent);
	}

	author.on('mousedown', function(e) {
		clicked = true;
		clickPositionX = e.clientX - protos.getElementOffset(this).left;
		clickPositionY = e.clientY - protos.getElementOffset(this).top;
		var container = options.container;

		if (container) { // If draggable object hasn't got setted container jus bind simple draggable 
			$(document).on('mousemove', function(e) {
				var xPosition = e.clientX - clickPositionX,
					yPosition = e.clientY - clickPositionY
				var containerOffset = protos.getElementOffset($(container)[0]);


				container = $(options.container);

				if (containerOffset.left < xPosition && containerOffset.top < yPosition) // Check does draggable element is in container
				{
					var authorRightBorder = protos.getElementOffset(author[0]).left + author.outerWidth(),
						authorBottomBorder = protos.getElementOffset(author[0]).top + author.outerHeight();
					var containerWidth = containerOffset.left + container.outerWidth();
					var containerHeight = containerOffset.top + container.outerHeight();
					var x = containerWidth - author.outerWidth(),
						y = containerHeight - author.outerHeight() - 1;

					if (authorRightBorder <= containerWidth) {
						setPosition(draggable, xPosition, "");
					} else {
						setPosition(draggable, x, "");
					}

					if (authorBottomBorder < containerHeight - 1) {
						setPosition(draggable, "", yPosition);
					} else {
						setPosition(draggable, "", y);
					}
				}

			});
		} else {
			$(document).on('mousemove', function(e) {
				var xPosition = e.clientX - clickPositionX,
					yPosition = e.clientY - clickPositionY
				var containerOffset = protos.getElementOffset($(container)[0]);

				setPosition(draggable, xPosition, yPosition);
			});
		}



		$(document).on('mouseup', function() {
			clicked = false;
			$(document).unbind('mousemove');
		});

		function setPosition(element, x, y) {
			var styles = {};
			if (x) {
				$.extend(styles, {
					left: x + "px"
				});
			}
			if (y) {
				$.extend(styles, {
					top: y + "px"
				});
			}
			element.css(styles);
		}
	});

	return this;
};protos.formFiller = function(form, json) {
	form = $(form);
	
	form.find("textarea").each(function(i, element) {
		$(element).val(json[element.name]);
	});

	form.find("select").each(function(i, element) {
		var value = json[element.name];
		$(element).val(value);
	});

	form.find("input[type=radio]").each(function(i, element) {
	  var value = json[element.name];
	  $(element).attr('data-finished', true);
	  
	  if(value && element.value == value) {
		$(element).attr('checked', 'checked');
	  }
	});

	form.find("input[type=checkbox]").each(function(i, element) {
	  var values = json[element.name];
	  $(element).attr('data-finished', true);
	  
	  if(values && values.indexOf(element.value) !== -1) {
		$(element).attr('checked', 'checked');
	  }
	});

	form.find("input[data-finished!=true]").each(function(i, element) {
	  var value = json[element.name];
	  if(value) {
		$(element).val(value);
	  }
	});
};Array.prototype.where = function (expression) {
	var result = [],
		length = this.length;
		
	for(var i = 0; i < length; i++) {
		var item = this[i];
		if(expression(item) === true) {
			result.push(item);
		}
	}
	return result;
};

Array.prototype.first = function (expression) {
	var length = this.length;
	for(var i = 0; i < length; i++) {
		var item = this[i];
		if(expression(item) === true) {
			return item;
		}
	}
};

Array.prototype.sort = function (compare) {

	var length = this.length,
		middle = Math.floor(length / 2);

	if (length < 2)
	  return this;

	return merge(this.slice(0, middle).sort(compare), this.slice(middle, length).sort(compare), compare);
  }

var merge = function (left, right, compare) {

var result = [];

while (left.length > 0 || right.length > 0) {
  if (left.length > 0 && right.length > 0) {
	if (compare(left[0], right[0])) {
	  result.push(left[0]);
	  left = left.slice(1);
	}
	else {
	  result.push(right[0]);
	  right = right.slice(1);
	}
  }
  else if (left.length > 0) {
	result.push(left[0]);
	left = left.slice(1);
  }
  else if (right.length > 0) {
	result.push(right[0]);
	right = right.slice(1);
  }
}
return result;
}

Array.prototype.last = function (expression) { // TODO: Just inverse the loop
	var length = this.length,
		lastValue;
		
	for(var i = 0; i < length; i++) {
		var item = this[i];
		if(expression(item) === true) {
			lastValue = item;
		}
	}
	
	return lastValue;
};

Array.prototype.any = function (expression) {
	var length = this.length;
	for(var i = 0; i < length; i++) {
		var item = this[i];
		if(expression(item) === true) {
			return true;
		}
	}
	return false;
};

Array.prototype.all = function (func) {
	var length = this.length;
	for(var i = 0; i < length; i++) {
		func(this[i]);
	}
	return this;
};

Array.prototype.count = function () {
	return this.length - 1;
};

//$(function() {
if (!Array.prototype.skip) {
	Array.prototype.skip = function(count) {
		if(this instanceof Array)
		{
			return this.slice(count, this.length);
		}
	};
}

Array.prototype.take = function(count) {
	if(this instanceof Array)
	{
		return this.slice(0, count);
	}
};

Array.prototype.remove = function(expression) {
	var length = this.length;
	for(var i = 0; i < length; i++) {
		var item = this[i];
		if(expression(item) === true) {
			this.splice(i,1);
		}
	}
};
//});
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
widgets.listView = function(options) {
	var defaultOptions = {
		width: 600,
		height: 400,
		imageWidth: 200,
		pageSize: 15,
		lazyLoading: false
	},
		that = this,
		author = options.author[0] || {},
		LIST_VIEW_ITEM = 'listViewItem',
		listItemElement = author.id + '_listItems',
		pagerContatinerElement = author.id + 'pagerContainer';
	options = $.extend(defaultOptions, options);
	author.innerHTML = protos.generateHTML('ul', [], '', listItemElement);
	$(author)[0].innerHTML += protos.generateHTML('div', [], '', pagerContatinerElement);
	that.dataSource = options.data;
	
	that.renderPage = function () {
		if(!options.lazyLoading)
		{
			$(hashTag + listItemElement + ' li').remove('.' + LIST_VIEW_ITEM);
		}
		
		var html = '', 
			data = that.dataSource.currentPageData,
			imgWidth = options.imageWidth;
		for(var i = 0; i < data.length; i++)
		{
			var itemHtml = new protos.template(options.templateId, data[i]).render();
			html += protos.generateHTML('li', [LIST_VIEW_ITEM], itemHtml, '', false, {'data-uid': data[i].uid});
		}
		
		$(hashTag + listItemElement).append(html);
		$(author).trigger('pageRendered');
	};
	
	that.pager = new protos.widgets.pager({
		pageSize: options.pageSize,
		dataSource: options.data,
		container: hashTag + pagerContatinerElement,
		pageChanged: that.renderPage,
		lazyLoading: options.lazyLoading,
		nextPrevButtons: options.nextPrevButtons
	});
	
	(function() {
		options.data.read();
	})();
	
	return that;
};
if (!Object.prototype.watch) {
	Object.defineProperty(Object.prototype, "watch", {
		  enumerable: false
		, configurable: true
		, writable: false
		, value: function (prop, handler) {
			var
			  oldval = this[prop]
			, newval = oldval
			, getter = function () { return newval; }
			, setter = function (val) {
				oldval = newval;
				newval = val;
				handler.call(this, prop, oldval, val);
				//return newval;
			};
			
			if (delete this[prop]) { // can't watch constants
				Object.defineProperty(this, prop, {
					get: getter
					, set: setter
					, enumerable: true
					, configurable: true
				});
			}
		}
	});
}

// object.unwatch
if (!Object.prototype.unwatch) {
	Object.defineProperty(Object.prototype, "unwatch", {
		  enumerable: false
		, configurable: true
		, writable: false
		, value: function (prop) {
			var val = this[prop];
			delete this[prop]; // remove accessors
			this[prop] = val;
		}
	});
}widgets.pager = function(options){
	var defaultOptions = {
		pageSize: 15,
		pageChanged: $.noop,
		nextPrevButtons: true
	},
		that = this,
		currentPage = 1,
		container = $(options.container),
		dataSource = options.dataSource;
	that.currentPage = function () { return parseInt(currentPage); };
	options = $.extend(defaultOptions, options);
		
	function drawPager()
	{
		if(container)
		{
			var countOfDataItems = options.dataSource.itemsCount(),
				pageSize = options.pageSize,
				html = '',
				nextPrevButtons = options.nextPrevButtons,
				pageCount = Math.ceil(countOfDataItems / pageSize);
			
			nextPrevButtons ? html += protos.generateHTML('li', ['pageNumber'], '<') : html;
			
			// TODO: 1,2,3 ... 97,98,99
			// if(pageCount > 10) {
				// for(var i = 0; i < 7; i++)
				// {
					// var listItemHtml = protos.generateHTML('li', ['pageNumber'], i+1);
					// html += listItemHtml;
				// }
				// html += '... ';
				// for(var i = pageCount-3; i < pageCount; i++)
				// {
					// var listItemHtml = protos.generateHTML('li', ['pageNumber'], i+1);
					// html += listItemHtml;
				// }
			// }
			// else
			// {
				for(var i = 0; i < pageCount; i++)
				{
					var listItemHtml = protos.generateHTML('li', ['pageNumber'], i+1);
					html += listItemHtml;
				}
			//}
			
			nextPrevButtons ? html += protos.generateHTML('li', ['pageNumber'], '>') : html;
			
			container[0].innerHTML = protos.generateHTML('div', ['pager'], protos.generateHTML('ul', ['pageList'], html));
			
			$(function() {
				$('li').on('click', container, function() {
					checkWhatToChange(this.innerHTML);
				});
			});
		}
	}

	var nextPage = function() {
		currentPage++;
		currentPage <= Math.ceil(dataSource.itemsCount() / options.pageSize) ? that.changePage(currentPage) : currentPage--;
	},	
	prevPage = function() {
		currentPage--;
		currentPage >= 1 ? that.changePage(currentPage) : currentPage++;
	},
	dataReceived = function(result) {
		if(result[0])
		{
			$(options.container + ' li').each(function() {
				if(this.innerHTML == currentPage)
				{
					$(this).addClass('selectedPage');
				}
				else
				{
					$(this).removeClass('selectedPage');
				}
			});
			container.trigger('pageChanged');
			options.pageChanged();
		}
	};
	
	that.changePage = function(pageNumber, disableReadData) {
		var deferred = new protos.deferred(),
			result;
		currentPage = pageNumber;
		
		result = dataSource.getPageData(pageNumber, options.pageSize, disableReadData);
		
		if(result instanceof protos.deferred) {
			result.done(dataReceived);
			return;
		}
		dataReceived(result);
	};
	
	that.refresh = function(disableReadData){
		drawPager();
		that.changePage(currentPage, disableReadData);
	};
	
	dataSource.dataChanged = that.refresh;
	
	(function () {
		if(options.lazyLoading) 
		{
			$(container).on("lazyLoad", function() {
				that.nextPage();
			});
			lazyLoading = new protos.lazyLoading({container: container});
		}
		dataSource._pageSize = options.pageSize;
	})();
	
	that.nextPage = function() {
		checkWhatToChange('&rt;');
	};
	
	that.prevPage = function() {
		checkWhatToChange('&lt;');		
	};
	
	var checkWhatToChange = function(pageNumber) {
		var pageNumberAsInt = parseInt(pageNumber);
		if(!isNaN(pageNumberAsInt)) {
			if(pageNumberAsInt != currentPage) {
				that.changePage(pageNumber);
			}
		} 
		else {
			pageNumber === '&lt;' ? prevPage() : nextPage();
		}
	};
};
protos.scrollTo = function(options) {
	var author = options.author,
		speed = options.speed || 1000;
	$(document.body).animate({ scrollTop: protos.getElementOffset(author[0]).top }, speed);
	
	return author;
};
protos.spa = function(options) {
	var that = this;
	that.options = $.extend({}, options),
	that.layout = that.options.author,
	that.routes = that.options.routes;

	that.startRouting = function() {
		hashChanged(window.location.hash);
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
};widgets.swap = function(options) {
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
widgets.alertPopUp = function(options) {
	var defaultOptions = {
		width: 380,
		height: 120,
		author: $(document),
		widgetName: "alertPopUp",
		darkness: 0.3,
		title: "JavaScript Alert",
		draggable: true
	}; // TODO: define a variable for 'alertPopUp' string

	options = $.extend(defaultOptions, options);
	
	options.content += protos.generateHTML('div', [], protos.generateHTML('button', ['protosOKbutton'], 'Ok', false), false, { style: 'padding-top: 15px; text-align: center;'});

	var defaultPopUp = new widgets.popUpCore(options);
	var dataObject = options.author[0];

	defaultPopUp.hidePopUp = function() {
		$(".p-PopUp").remove();
		$(".p-darkLayer").remove();
		$.removeData(dataObject, "alertPopUp");
	}

	$.data(dataObject, "alertPopUp", defaultPopUp);
	$.data(dataObject, "alertPopUp").show();
	$(".protosOKbutton").on('click', function() {
		$.data(dataObject, "alertPopUp").hide();
	});

	return defaultPopUp;
};
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
};widgets.popUpCore = function (options) {
	var visible = false,
		generateHTML = protos.generateHTML,
		CLOSEBUTTONCLASS = "p-closePopUpButton",
		CONTENTCLASS = "p-popUpContent",
		TITLECLASS = "p-popUpTitle",
		DARKLEYER = "p-darkLayer",
		POPUPCLASS = ".p-PopUp",
		that = this;
		that.author = $(options.author);
			
	that.darkLayerHtml = generateHTML('div', [DARKLEYER], '', '', false, { style: 'background-color: rgba(0,0,0,' + options.darkness + ')'});
	that.contentHtml = generateHTML("div", [CONTENTCLASS], options.content);
	that.titleHtml = generateHTML("div", [TITLECLASS], options.title);
	that.closePopUpButtonHtml = '<a href="#">' + generateHTML("div", [CLOSEBUTTONCLASS], "X") + '</a>';
	that.body = $("body");

	(function attachPopUpEvents() {
		that.author.on({
			"showPopUp": function() {
				if (!visible) {
					showPopUp(options);
				}
			},
			"hidePopUp": function() {
				hidePopUp();
			}
		});
	})();

	that.show = function() { //Show function bind "show" event to jQuery object
		that.author.trigger("showPopUp");
		that.body.on('keydown', function (event) {
			if(event.keyCode == 27)
			{
				that.hide();
			}
		});
	};

	that.hide = function() { //Hide function binds "hide" event to jQuery object
		that.author.trigger("hidePopUp");
		that.body.off('keydown');
	};

	//Function that shows the popUp when "show" event is fired

	var showPopUp = function(options) {
		//Add elements in DOM
		popUpObject = that.addElements(options.darkness);

		//Set css properties wich come from options
		that.addStyles(options, popUpObject);
		//that.instanceFromData = $.data(that.author[0], options.widgetName); // $.data(...) is faster than $(...).data()
		//attachCloseEvents(that.instanceFromData);
		attachCloseEvents(that);

		visible = true;
		that.author.trigger("popUpShowed");
	},
	attachCloseEvents = function() {
		$("div" + POPUPCLASS + " a").on('click', "." + CLOSEBUTTONCLASS, function() {
			that.hide();
		});

		that.body.on('click', "." + DARKLEYER, function() {
			that.hide();
		});
	},
	hidePopUp = function() {
		$(POPUPCLASS).remove();
		$("." + DARKLEYER).remove();
		visible = false;
	};

	that.addElements = function() {	 
		that.popUpHtml = protos.generateHTML('div', ['p-PopUp'], that.closePopUpButtonHtml + that.addTitle() + that.contentHtml);
		that.body.append(that.darkLayerHtml); //Apply dark layer
		that.body.append(that.popUpHtml); //Add popUp div
		that.makeTitleDraggable();

		var popUp = $(POPUPCLASS, "body");

		return popUp;
	};

	that.addStyles = function(options, popUp) {
		var documentElement = document.body;
		var popUpLeftPosition = (window.innerWidth / 2) - (options.width / 2); //Calculate popUp left position
		var popUpTopPosition = (window.innerHeight / 2) - (options.height / 2); //Calculate popUp top position

		popUp.css({
			left: popUpLeftPosition + "px",
			top: popUpTopPosition + "px",
			width: options.width + "px",
			height: options.height + "px",
			position: "fixed"
		});

		$("." + CONTENTCLASS, "div" + POPUPCLASS).css({
			width: options.width + "px",
			height: options.height - 50 + "px",
			"overflow-y": "auto",
			"overflow-x": "auto"
		});
	}

	that.makeTitleDraggable = function() {
		if (options.title && options.draggable === true) {
			createInstance({ //Makes popup draggable
				moveParent: POPUPCLASS,
				isParentDraggable: options.isContentDraggable === true ? true : false
			}, $("." + TITLECLASS), protos.draggable, 'draggable');
		}
	}

	that.addTitle = function() {
		if (options.title) {
			return that.titleHtml;
		}
		return "";
	}

	return that;
};

widgets.popUp = function (options) {
	var defaultOptions = {
		width: 500,
		height: 300,
		darkness: 0.3,
		title: "Window",
		draggable: true
	};

	options = $.extend(defaultOptions, options);
	var defaultPopUp = new widgets.popUpCore(options);

	return defaultPopUp;
};

	})(jQuery, document, '#');
	