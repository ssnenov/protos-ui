
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
protos.dataSource = function(options) {
	var that = this,
		_items;
	
	that.items = function() { return _items; };
	
	that.server = options.server;
	that.originalData = options.data || [];
	that.dataChanged = options.dataChanged || $.noop;
	that.filters = [];
	that._data = []; //Private original data
	that.originalDataLength = that.originalData.length;
	that.data = []; //Public data - sliced in pages, filtred and sorted
	
	function setProperties(data) {
		for(var i in data)
		{
			var item = data[i];
			item.uid = protos.guid();
			item.changed = false; // Property for MVVM framework
			item.savedChanges = true;
			item.deleted = false;
		}
	}
	
	that.read = function(page, itemsPerPage) {
		var query = {};
		if(itemsPerPage || that._data.length === 0)
		{
			query = {
				page: page || 0,
				itemsPerPage: itemsPerPage
			}
		}
		
		query.filters = [];
		for(var i in that.filters)
		{
			var filter = that.filters[i];
			if(typeof(filter) !== typeof(function(){}))
			{
				query.filters.push(filter);
			}
		}
				
		var deferred = new protos.deferred();
		if(typeof(options.data.read) === 'function') {
			options.data.read(query);
			return deferred.resolve();
		}
		
		$.ajax({
			type: 'json',
			url: that.originalData.read,
			contentType: "application/json; charset=utf-8",
			type: "GET",
			dataType: "jsonp",
			data: query,
			success: function(data) {
				that.readed(data);
				deferred.resolve();
			},
			error: function(data) {
				deferred.reject();
			}
		});
		
		return deferred;
	};
	
	that.readed = function(dataItems) {
		var data = {},
			disableReadData;
		if(!dataItems.length) { //If the data is not array => the options.read method used server paging & filtering
			_items = dataItems.items;
			data = dataItems.data;
			disableReadData = true;
		}
		else
		{
			_items = dataItems.length;
			data = dataItems;
		}
		
		setProperties(data);
		that._data = data;
		return that.dataChanged(disableReadData);
	};
	
	var create = function(dataItems) { //Should to stay private because items are importing from addItems()
	// TODO: batch create (e.g. 50 items per piece)
		var deferred = new protos.deferred();
	
		if(typeof(options.data.create) === 'function') {
			options.data.create(dataItems);
			return deferred.resolve();
		}
		
		$.ajax({
			url: options.data.create,
			data: { 
				items: dataItems 
			}
		}).done(function () {
			deferred.resolve();
		});
		
		return deferred;
	};
	
	that.created = function(dataItems) {
		setProperties(dataItems);
		that._data = that._data.concat(dataItems);
		return that.dataChanged();
	};
	
	that.update = function(dataItem) { // TODO: batch update (e.g. 50 items per piece)
		var deferred = new protos.deferred(),
			expression = function(x) { return !x.savedChanges; },
			itemsForUpdate = dataItem || that._data.where(expression);
			
		if(typeof(options.data.update) === 'function') {
			options.data.update(itemsForUpdate);
			return deferred.resolve();
		}
		
		that._data.all(function(x){ x.savedChanges = true; });
		
		$.ajax({
			url: options.data.update,
			data: {
				items: itemsForUpdate
			}
		}).done(function () {
			that.updated();
			deferred.resolve();
		});
		
		return deferred;
	};
	
	that.updated = function(dataItems) {
		for(var i = 0; i < dataItems.length; i++) {
			dataItems[i].savedChanges = false;
		}
		return that.dataChanged();
	};
	
	that.delete = function(dataItems) { // TODO: batch delete (e.g. 50 items per piece)
		var deferred = new protos.deferred(),
			expression = function(x) { return x.deleted; },
			itemsForDelete = dataItems || that._data.where(expression);
			
		if(typeof(options.data.delete) === 'function') {
			options.data.delete(itemsForDelete);
			return deferred.resolve();
		}
		
		$.ajax({
			url: options.data.update,
			data: {
				items: itemsForDelete
			}
		}).done(function () {
			deferred.resolve();
		});
		
		return deferred;
	};
	
	that.deleted = function(dataItems) {
		var data = that._data,
			len = data.length;
		
		for(var i = 0; i < len; i++) {
			var dataItem = data[i];
			if(dataItem.deleted) {
				protos.deeplyDelete(dataItem);
				data = data.splice(i, 1);
			}
		}
		
		return that.dataChanged();
	};
	
	(function() {
		if(that.originalData.read)
		{
			//that.read(); //It's not necessary
		}
		else
		{
			that.readed(that.originalData);
		}
	})();
	
	that.findItem = function(guid) {
		var originalData = that.originalData;
		for(var i = 0; i < _items; i++ )
		{
			if(originalData[i].uid === guid)
			{
				return originalData[i];
			}
		}
	};
	
	that.getPageData = function (page, itemsPerPage, disableReadData) {
		var deferred = new protos.deferred();
		
		if(!disableReadData && that.originalData.read) {
			that.read(page - 1, itemsPerPage)
				.done(function() {
					deferred.resolve(that.data);
				});
		}
		else
		{
			if(_items) {
				var result = that._data.skip((page - 1) * itemsPerPage).take(itemsPerPage);
				return that.data = result;
			}
		}
		return deferred.reject();
	};
	
	that.addItems = function(items) {
		create(items).done(function() {
			var lengthOfItems = items.length;
			for(var i=0; i < lengthOfItems; i++)
			{
				var item = items[i];
				item.uid = protos.guid();
				item.changed = false;
				item.savedChanges = true;
				item.deleted = false;
			}
			that._data = that._data.concat(items);
			return that.dataChanged();
		});
	};
	
	that.addFilter = function(filter){
		that.filters.push(filter);
	};
	
	that.clearFilters = function(){
		that._data = that.originalData;
	};
	
	function filterAndSort() {
		that.filter();
		that.sort();
	}
	
	that.sort = function() {
	
	};
	
	that.filter = function (logic){
		var result = [],
			logic = logic | 'and',
			filters = that.filters;
		that._data = []; // Filtred and sorted data
		for(var filter in filters)
		{
			var currentFilter = filters[filter];
			switch(currentFilter.operator)
			{
				case 'eq': 
					var data = (logic === 'and' ? that._data : that.originalData);
					for(var item in data)
					{
						var dataItem = data[item];
						for(var filedData in dataItem)
						{
							if(filedData == currentFilter.field && dataItem[filedData] == currentFilter.value)
							{
								result.push(dataItem);
							}
						}
					}
					break;
				// TODO: another operators like neq, contains ...
			}
			that._data = that._data.concat(result);
			result = [];
		}
	};
	
	that.getOriginalData = function() {
		return that.originalData;
	};
	
	that.set = function(item, prop, value) {
		item[prop] = value;
		item.savedChanges = false;
		
		return item;
	};
	
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

Array.prototype.last = function (expression) {
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
		author = options.author[0],
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
			data = that.dataSource.data,
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
	
	(function () {
		that.pager.changePage(1);
	})();
	
	return that;
};
widgets.pager = function(options){
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
			var countOfDataItems = options.dataSource.items(),
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
		else
		{
			drawPager();
		}
	})();

	var nextPage = function() {
		currentPage++;
		currentPage <= Math.ceil(dataSource._data.length / options.pageSize) ? that.changePage(currentPage) : currentPage--;
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
	
	that.nextPage = function() {
		checkWhatToChange('&rt;');
	};
	
	that.prevPage = function() {
		checkWhatToChange('&lt;');		
	};
	
	var checkWhatToChange = function(pageNumber) {
		if(!isNaN(parseInt(pageNumber))) {
			that.changePage(pageNumber);
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
		that.author = $(options.author.selector);
			
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
		//TODO: When press ESC button close the popUp
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
	