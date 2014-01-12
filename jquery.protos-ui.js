
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
			return createInstance(options, that, widgets.spa, "spa");
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
/*! jQuery v1.7.1 jquery.com | jquery.org/license */
(function(a,b){function cy(a){return f.isWindow(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:!1}function cv(a){if(!ck[a]){var b=c.body,d=f("<"+a+">").appendTo(b),e=d.css("display");d.remove();if(e==="none"||e===""){cl||(cl=c.createElement("iframe"),cl.frameBorder=cl.width=cl.height=0),b.appendChild(cl);if(!cm||!cl.createElement)cm=(cl.contentWindow||cl.contentDocument).document,cm.write((c.compatMode==="CSS1Compat"?"<!doctype html>":"")+"<html><body>"),cm.close();d=cm.createElement(a),cm.body.appendChild(d),e=f.css(d,"display"),b.removeChild(cl)}ck[a]=e}return ck[a]}function cu(a,b){var c={};f.each(cq.concat.apply([],cq.slice(0,b)),function(){c[this]=a});return c}function ct(){cr=b}function cs(){setTimeout(ct,0);return cr=f.now()}function cj(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}function ci(){try{return new a.XMLHttpRequest}catch(b){}}function cc(a,c){a.dataFilter&&(c=a.dataFilter(c,a.dataType));var d=a.dataTypes,e={},g,h,i=d.length,j,k=d[0],l,m,n,o,p;for(g=1;g<i;g++){if(g===1)for(h in a.converters)typeof h=="string"&&(e[h.toLowerCase()]=a.converters[h]);l=k,k=d[g];if(k==="*")k=l;else if(l!=="*"&&l!==k){m=l+" "+k,n=e[m]||e["* "+k];if(!n){p=b;for(o in e){j=o.split(" ");if(j[0]===l||j[0]==="*"){p=e[j[1]+" "+k];if(p){o=e[o],o===!0?n=p:p===!0&&(n=o);break}}}}!n&&!p&&f.error("No conversion from "+m.replace(" "," to ")),n!==!0&&(c=n?n(c):p(o(c)))}}return c}function cb(a,c,d){var e=a.contents,f=a.dataTypes,g=a.responseFields,h,i,j,k;for(i in g)i in d&&(c[g[i]]=d[i]);while(f[0]==="*")f.shift(),h===b&&(h=a.mimeType||c.getResponseHeader("content-type"));if(h)for(i in e)if(e[i]&&e[i].test(h)){f.unshift(i);break}if(f[0]in d)j=f[0];else{for(i in d){if(!f[0]||a.converters[i+" "+f[0]]){j=i;break}k||(k=i)}j=j||k}if(j){j!==f[0]&&f.unshift(j);return d[j]}}function ca(a,b,c,d){if(f.isArray(b))f.each(b,function(b,e){c||bE.test(a)?d(a,e):ca(a+"["+(typeof e=="object"||f.isArray(e)?b:"")+"]",e,c,d)});else if(!c&&b!=null&&typeof b=="object")for(var e in b)ca(a+"["+e+"]",b[e],c,d);else d(a,b)}function b_(a,c){var d,e,g=f.ajaxSettings.flatOptions||{};for(d in c)c[d]!==b&&((g[d]?a:e||(e={}))[d]=c[d]);e&&f.extend(!0,a,e)}function b$(a,c,d,e,f,g){f=f||c.dataTypes[0],g=g||{},g[f]=!0;var h=a[f],i=0,j=h?h.length:0,k=a===bT,l;for(;i<j&&(k||!l);i++)l=h[i](c,d,e),typeof l=="string"&&(!k||g[l]?l=b:(c.dataTypes.unshift(l),l=b$(a,c,d,e,l,g)));(k||!l)&&!g["*"]&&(l=b$(a,c,d,e,"*",g));return l}function bZ(a){return function(b,c){typeof b!="string"&&(c=b,b="*");if(f.isFunction(c)){var d=b.toLowerCase().split(bP),e=0,g=d.length,h,i,j;for(;e<g;e++)h=d[e],j=/^\+/.test(h),j&&(h=h.substr(1)||"*"),i=a[h]=a[h]||[],i[j?"unshift":"push"](c)}}}function bC(a,b,c){var d=b==="width"?a.offsetWidth:a.offsetHeight,e=b==="width"?bx:by,g=0,h=e.length;if(d>0){if(c!=="border")for(;g<h;g++)c||(d-=parseFloat(f.css(a,"padding"+e[g]))||0),c==="margin"?d+=parseFloat(f.css(a,c+e[g]))||0:d-=parseFloat(f.css(a,"border"+e[g]+"Width"))||0;return d+"px"}d=bz(a,b,b);if(d<0||d==null)d=a.style[b]||0;d=parseFloat(d)||0;if(c)for(;g<h;g++)d+=parseFloat(f.css(a,"padding"+e[g]))||0,c!=="padding"&&(d+=parseFloat(f.css(a,"border"+e[g]+"Width"))||0),c==="margin"&&(d+=parseFloat(f.css(a,c+e[g]))||0);return d+"px"}function bp(a,b){b.src?f.ajax({url:b.src,async:!1,dataType:"script"}):f.globalEval((b.text||b.textContent||b.innerHTML||"").replace(bf,"/*@codeHere*/")),b.parentNode&&b.parentNode.removeChild(b)}function bo(a){var b=c.createElement("div");bh.appendChild(b),b.innerHTML=a.outerHTML;return b.firstChild}function bn(a){var b=(a.nodeName||"").toLowerCase();b==="input"?bm(a):b!=="script"&&typeof a.getElementsByTagName!="undefined"&&f.grep(a.getElementsByTagName("input"),bm)}function bm(a){if(a.type==="checkbox"||a.type==="radio")a.defaultChecked=a.checked}function bl(a){return typeof a.getElementsByTagName!="undefined"?a.getElementsByTagName("*"):typeof a.querySelectorAll!="undefined"?a.querySelectorAll("*"):[]}function bk(a,b){var c;if(b.nodeType===1){b.clearAttributes&&b.clearAttributes(),b.mergeAttributes&&b.mergeAttributes(a),c=b.nodeName.toLowerCase();if(c==="object")b.outerHTML=a.outerHTML;else if(c!=="input"||a.type!=="checkbox"&&a.type!=="radio"){if(c==="option")b.selected=a.defaultSelected;else if(c==="input"||c==="textarea")b.defaultValue=a.defaultValue}else a.checked&&(b.defaultChecked=b.checked=a.checked),b.value!==a.value&&(b.value=a.value);b.removeAttribute(f.expando)}}function bj(a,b){if(b.nodeType===1&&!!f.hasData(a)){var c,d,e,g=f._data(a),h=f._data(b,g),i=g.events;if(i){delete h.handle,h.events={};for(c in i)for(d=0,e=i[c].length;d<e;d++)f.event.add(b,c+(i[c][d].namespace?".":"")+i[c][d].namespace,i[c][d],i[c][d].data)}h.data&&(h.data=f.extend({},h.data))}}function bi(a,b){return f.nodeName(a,"table")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function U(a){var b=V.split("|"),c=a.createDocumentFragment();if(c.createElement)while(b.length)c.createElement(b.pop());return c}function T(a,b,c){b=b||0;if(f.isFunction(b))return f.grep(a,function(a,d){var e=!!b.call(a,d,a);return e===c});if(b.nodeType)return f.grep(a,function(a,d){return a===b===c});if(typeof b=="string"){var d=f.grep(a,function(a){return a.nodeType===1});if(O.test(b))return f.filter(b,d,!c);b=f.filter(b,d)}return f.grep(a,function(a,d){return f.inArray(a,b)>=0===c})}function S(a){return!a||!a.parentNode||a.parentNode.nodeType===11}function K(){return!0}function J(){return!1}function n(a,b,c){var d=b+"defer",e=b+"queue",g=b+"mark",h=f._data(a,d);h&&(c==="queue"||!f._data(a,e))&&(c==="mark"||!f._data(a,g))&&setTimeout(function(){!f._data(a,e)&&!f._data(a,g)&&(f.removeData(a,d,!0),h.fire())},0)}function m(a){for(var b in a){if(b==="data"&&f.isEmptyObject(a[b]))continue;if(b!=="toJSON")return!1}return!0}function l(a,c,d){if(d===b&&a.nodeType===1){var e="data-"+c.replace(k,"-$1").toLowerCase();d=a.getAttribute(e);if(typeof d=="string"){try{d=d==="true"?!0:d==="false"?!1:d==="null"?null:f.isNumeric(d)?parseFloat(d):j.test(d)?f.parseJSON(d):d}catch(g){}f.data(a,c,d)}else d=b}return d}function h(a){var b=g[a]={},c,d;a=a.split(/\s+/);for(c=0,d=a.length;c<d;c++)b[a[c]]=!0;return b}var c=a.document,d=a.navigator,e=a.location,f=function(){function J(){if(!e.isReady){try{c.documentElement.doScroll("left")}catch(a){setTimeout(J,1);return}e.ready()}}var e=function(a,b){return new e.fn.init(a,b,h)},f=a.jQuery,g=a.$,h,i=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,j=/\S/,k=/^\s+/,l=/\s+$/,m=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,n=/^[\],:{}\s]*$/,o=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,p=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,q=/(?:^|:|,)(?:\s*\[)+/g,r=/(webkit)[ \/]([\w.]+)/,s=/(opera)(?:.*version)?[ \/]([\w.]+)/,t=/(msie) ([\w.]+)/,u=/(mozilla)(?:.*? rv:([\w.]+))?/,v=/-([a-z]|[0-9])/ig,w=/^-ms-/,x=function(a,b){return(b+"").toUpperCase()},y=d.userAgent,z,A,B,C=Object.prototype.toString,D=Object.prototype.hasOwnProperty,E=Array.prototype.push,F=Array.prototype.slice,G=String.prototype.trim,H=Array.prototype.indexOf,I={};e.fn=e.prototype={constructor:e,init:function(a,d,f){var g,h,j,k;if(!a)return this;if(a.nodeType){this.context=this[0]=a,this.length=1;return this}if(a==="body"&&!d&&c.body){this.context=c,this[0]=c.body,this.selector=a,this.length=1;return this}if(typeof a=="string"){a.charAt(0)!=="<"||a.charAt(a.length-1)!==">"||a.length<3?g=i.exec(a):g=[null,a,null];if(g&&(g[1]||!d)){if(g[1]){d=d instanceof e?d[0]:d,k=d?d.ownerDocument||d:c,j=m.exec(a),j?e.isPlainObject(d)?(a=[c.createElement(j[1])],e.fn.attr.call(a,d,!0)):a=[k.createElement(j[1])]:(j=e.buildFragment([g[1]],[k]),a=(j.cacheable?e.clone(j.fragment):j.fragment).childNodes);return e.merge(this,a)}h=c.getElementById(g[2]);if(h&&h.parentNode){if(h.id!==g[2])return f.find(a);this.length=1,this[0]=h}this.context=c,this.selector=a;return this}return!d||d.jquery?(d||f).find(a):this.constructor(d).find(a)}if(e.isFunction(a))return f.ready(a);a.selector!==b&&(this.selector=a.selector,this.context=a.context);return e.makeArray(a,this)},selector:"",jquery:"1.7.1",length:0,size:function(){return this.length},toArray:function(){return F.call(this,0)},get:function(a){return a==null?this.toArray():a<0?this[this.length+a]:this[a]},pushStack:function(a,b,c){var d=this.constructor();e.isArray(a)?E.apply(d,a):e.merge(d,a),d.prevObject=this,d.context=this.context,b==="find"?d.selector=this.selector+(this.selector?" ":"")+c:b&&(d.selector=this.selector+"."+b+"("+c+")");return d},each:function(a,b){return e.each(this,a,b)},ready:function(a){e.bindReady(),A.add(a);return this},eq:function(a){a=+a;return a===-1?this.slice(a):this.slice(a,a+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(F.apply(this,arguments),"slice",F.call(arguments).join(","))},map:function(a){return this.pushStack(e.map(this,function(b,c){return a.call(b,c,b)}))},end:function(){return this.prevObject||this.constructor(null)},push:E,sort:[].sort,splice:[].splice},e.fn.init.prototype=e.fn,e.extend=e.fn.extend=function(){var a,c,d,f,g,h,i=arguments[0]||{},j=1,k=arguments.length,l=!1;typeof i=="boolean"&&(l=i,i=arguments[1]||{},j=2),typeof i!="object"&&!e.isFunction(i)&&(i={}),k===j&&(i=this,--j);for(;j<k;j++)if((a=arguments[j])!=null)for(c in a){d=i[c],f=a[c];if(i===f)continue;l&&f&&(e.isPlainObject(f)||(g=e.isArray(f)))?(g?(g=!1,h=d&&e.isArray(d)?d:[]):h=d&&e.isPlainObject(d)?d:{},i[c]=e.extend(l,h,f)):f!==b&&(i[c]=f)}return i},e.extend({noConflict:function(b){a.$===e&&(a.$=g),b&&a.jQuery===e&&(a.jQuery=f);return e},isReady:!1,readyWait:1,holdReady:function(a){a?e.readyWait++:e.ready(!0)},ready:function(a){if(a===!0&&!--e.readyWait||a!==!0&&!e.isReady){if(!c.body)return setTimeout(e.ready,1);e.isReady=!0;if(a!==!0&&--e.readyWait>0)return;A.fireWith(c,[e]),e.fn.trigger&&e(c).trigger("ready").off("ready")}},bindReady:function(){if(!A){A=e.Callbacks("once memory");if(c.readyState==="complete")return setTimeout(e.ready,1);if(c.addEventListener)c.addEventListener("DOMContentLoaded",B,!1),a.addEventListener("load",e.ready,!1);else if(c.attachEvent){c.attachEvent("onreadystatechange",B),a.attachEvent("onload",e.ready);var b=!1;try{b=a.frameElement==null}catch(d){}c.documentElement.doScroll&&b&&J()}}},isFunction:function(a){return e.type(a)==="function"},isArray:Array.isArray||function(a){return e.type(a)==="array"},isWindow:function(a){return a&&typeof a=="object"&&"setInterval"in a},isNumeric:function(a){return!isNaN(parseFloat(a))&&isFinite(a)},type:function(a){return a==null?String(a):I[C.call(a)]||"object"},isPlainObject:function(a){if(!a||e.type(a)!=="object"||a.nodeType||e.isWindow(a))return!1;try{if(a.constructor&&!D.call(a,"constructor")&&!D.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}var d;for(d in a);return d===b||D.call(a,d)},isEmptyObject:function(a){for(var b in a)return!1;return!0},error:function(a){throw new Error(a)},parseJSON:function(b){if(typeof b!="string"||!b)return null;b=e.trim(b);if(a.JSON&&a.JSON.parse)return a.JSON.parse(b);if(n.test(b.replace(o,"@").replace(p,"]").replace(q,"")))return(new Function("return "+b))();e.error("Invalid JSON: "+b)},parseXML:function(c){var d,f;try{a.DOMParser?(f=new DOMParser,d=f.parseFromString(c,"text/xml")):(d=new ActiveXObject("Microsoft.XMLDOM"),d.async="false",d.loadXML(c))}catch(g){d=b}(!d||!d.documentElement||d.getElementsByTagName("parsererror").length)&&e.error("Invalid XML: "+c);return d},noop:function(){},globalEval:function(b){b&&j.test(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(w,"ms-").replace(v,x)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toUpperCase()===b.toUpperCase()},each:function(a,c,d){var f,g=0,h=a.length,i=h===b||e.isFunction(a);if(d){if(i){for(f in a)if(c.apply(a[f],d)===!1)break}else for(;g<h;)if(c.apply(a[g++],d)===!1)break}else if(i){for(f in a)if(c.call(a[f],f,a[f])===!1)break}else for(;g<h;)if(c.call(a[g],g,a[g++])===!1)break;return a},trim:G?function(a){return a==null?"":G.call(a)}:function(a){return a==null?"":(a+"").replace(k,"").replace(l,"")},makeArray:function(a,b){var c=b||[];if(a!=null){var d=e.type(a);a.length==null||d==="string"||d==="function"||d==="regexp"||e.isWindow(a)?E.call(c,a):e.merge(c,a)}return c},inArray:function(a,b,c){var d;if(b){if(H)return H.call(b,a,c);d=b.length,c=c?c<0?Math.max(0,d+c):c:0;for(;c<d;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,c){var d=a.length,e=0;if(typeof c.length=="number")for(var f=c.length;e<f;e++)a[d++]=c[e];else while(c[e]!==b)a[d++]=c[e++];a.length=d;return a},grep:function(a,b,c){var d=[],e;c=!!c;for(var f=0,g=a.length;f<g;f++)e=!!b(a[f],f),c!==e&&d.push(a[f]);return d},map:function(a,c,d){var f,g,h=[],i=0,j=a.length,k=a instanceof e||j!==b&&typeof j=="number"&&(j>0&&a[0]&&a[j-1]||j===0||e.isArray(a));if(k)for(;i<j;i++)f=c(a[i],i,d),f!=null&&(h[h.length]=f);else for(g in a)f=c(a[g],g,d),f!=null&&(h[h.length]=f);return h.concat.apply([],h)},guid:1,proxy:function(a,c){if(typeof c=="string"){var d=a[c];c=a,a=d}if(!e.isFunction(a))return b;var f=F.call(arguments,2),g=function(){return a.apply(c,f.concat(F.call(arguments)))};g.guid=a.guid=a.guid||g.guid||e.guid++;return g},access:function(a,c,d,f,g,h){var i=a.length;if(typeof c=="object"){for(var j in c)e.access(a,j,c[j],f,g,d);return a}if(d!==b){f=!h&&f&&e.isFunction(d);for(var k=0;k<i;k++)g(a[k],c,f?d.call(a[k],k,g(a[k],c)):d,h);return a}return i?g(a[0],c):b},now:function(){return(new Date).getTime()},uaMatch:function(a){a=a.toLowerCase();var b=r.exec(a)||s.exec(a)||t.exec(a)||a.indexOf("compatible")<0&&u.exec(a)||[];return{browser:b[1]||"",version:b[2]||"0"}},sub:function(){function a(b,c){return new a.fn.init(b,c)}e.extend(!0,a,this),a.superclass=this,a.fn=a.prototype=this(),a.fn.constructor=a,a.sub=this.sub,a.fn.init=function(d,f){f&&f instanceof e&&!(f instanceof a)&&(f=a(f));return e.fn.init.call(this,d,f,b)},a.fn.init.prototype=a.fn;var b=a(c);return a},browser:{}}),e.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(a,b){I["[object "+b+"]"]=b.toLowerCase()}),z=e.uaMatch(y),z.browser&&(e.browser[z.browser]=!0,e.browser.version=z.version),e.browser.webkit&&(e.browser.safari=!0),j.test(" ")&&(k=/^[\s\xA0]+/,l=/[\s\xA0]+$/),h=e(c),c.addEventListener?B=function(){c.removeEventListener("DOMContentLoaded",B,!1),e.ready()}:c.attachEvent&&(B=function(){c.readyState==="complete"&&(c.detachEvent("onreadystatechange",B),e.ready())});return e}(),g={};f.Callbacks=function(a){a=a?g[a]||h(a):{};var c=[],d=[],e,i,j,k,l,m=function(b){var d,e,g,h,i;for(d=0,e=b.length;d<e;d++)g=b[d],h=f.type(g),h==="array"?m(g):h==="function"&&(!a.unique||!o.has(g))&&c.push(g)},n=function(b,f){f=f||[],e=!a.memory||[b,f],i=!0,l=j||0,j=0,k=c.length;for(;c&&l<k;l++)if(c[l].apply(b,f)===!1&&a.stopOnFalse){e=!0;break}i=!1,c&&(a.once?e===!0?o.disable():c=[]:d&&d.length&&(e=d.shift(),o.fireWith(e[0],e[1])))},o={add:function(){if(c){var a=c.length;m(arguments),i?k=c.length:e&&e!==!0&&(j=a,n(e[0],e[1]))}return this},remove:function(){if(c){var b=arguments,d=0,e=b.length;for(;d<e;d++)for(var f=0;f<c.length;f++)if(b[d]===c[f]){i&&f<=k&&(k--,f<=l&&l--),c.splice(f--,1);if(a.unique)break}}return this},has:function(a){if(c){var b=0,d=c.length;for(;b<d;b++)if(a===c[b])return!0}return!1},empty:function(){c=[];return this},disable:function(){c=d=e=b;return this},disabled:function(){return!c},lock:function(){d=b,(!e||e===!0)&&o.disable();return this},locked:function(){return!d},fireWith:function(b,c){d&&(i?a.once||d.push([b,c]):(!a.once||!e)&&n(b,c));return this},fire:function(){o.fireWith(this,arguments);return this},fired:function(){return!!e}};return o};var i=[].slice;f.extend({Deferred:function(a){var b=f.Callbacks("once memory"),c=f.Callbacks("once memory"),d=f.Callbacks("memory"),e="pending",g={resolve:b,reject:c,notify:d},h={done:b.add,fail:c.add,progress:d.add,state:function(){return e},isResolved:b.fired,isRejected:c.fired,then:function(a,b,c){i.done(a).fail(b).progress(c);return this},always:function(){i.done.apply(i,arguments).fail.apply(i,arguments);return this},pipe:function(a,b,c){return f.Deferred(function(d){f.each({done:[a,"resolve"],fail:[b,"reject"],progress:[c,"notify"]},function(a,b){var c=b[0],e=b[1],g;f.isFunction(c)?i[a](function(){g=c.apply(this,arguments),g&&f.isFunction(g.promise)?g.promise().then(d.resolve,d.reject,d.notify):d[e+"With"](this===i?d:this,[g])}):i[a](d[e])})}).promise()},promise:function(a){if(a==null)a=h;else for(var b in h)a[b]=h[b];return a}},i=h.promise({}),j;for(j in g)i[j]=g[j].fire,i[j+"With"]=g[j].fireWith;i.done(function(){e="resolved"},c.disable,d.lock).fail(function(){e="rejected"},b.disable,d.lock),a&&a.call(i,i);return i},when:function(a){function m(a){return function(b){e[a]=arguments.length>1?i.call(arguments,0):b,j.notifyWith(k,e)}}function l(a){return function(c){b[a]=arguments.length>1?i.call(arguments,0):c,--g||j.resolveWith(j,b)}}var b=i.call(arguments,0),c=0,d=b.length,e=Array(d),g=d,h=d,j=d<=1&&a&&f.isFunction(a.promise)?a:f.Deferred(),k=j.promise();if(d>1){for(;c<d;c++)b[c]&&b[c].promise&&f.isFunction(b[c].promise)?b[c].promise().then(l(c),j.reject,m(c)):--g;g||j.resolveWith(j,b)}else j!==a&&j.resolveWith(j,d?[a]:[]);return k}}),f.support=function(){var b,d,e,g,h,i,j,k,l,m,n,o,p,q=c.createElement("div"),r=c.documentElement;q.setAttribute("className","t"),q.innerHTML="   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>",d=q.getElementsByTagName("*"),e=q.getElementsByTagName("a")[0];if(!d||!d.length||!e)return{};g=c.createElement("select"),h=g.appendChild(c.createElement("option")),i=q.getElementsByTagName("input")[0],b={leadingWhitespace:q.firstChild.nodeType===3,tbody:!q.getElementsByTagName("tbody").length,htmlSerialize:!!q.getElementsByTagName("link").length,style:/top/.test(e.getAttribute("style")),hrefNormalized:e.getAttribute("href")==="/a",opacity:/^0.55/.test(e.style.opacity),cssFloat:!!e.style.cssFloat,checkOn:i.value==="on",optSelected:h.selected,getSetAttribute:q.className!=="t",enctype:!!c.createElement("form").enctype,html5Clone:c.createElement("nav").cloneNode(!0).outerHTML!=="<:nav></:nav>",submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0},i.checked=!0,b.noCloneChecked=i.cloneNode(!0).checked,g.disabled=!0,b.optDisabled=!h.disabled;try{delete q.test}catch(s){b.deleteExpando=!1}!q.addEventListener&&q.attachEvent&&q.fireEvent&&(q.attachEvent("onclick",function(){b.noCloneEvent=!1}),q.cloneNode(!0).fireEvent("onclick")),i=c.createElement("input"),i.value="t",i.setAttribute("type","radio"),b.radioValue=i.value==="t",i.setAttribute("checked","checked"),q.appendChild(i),k=c.createDocumentFragment(),k.appendChild(q.lastChild),b.checkClone=k.cloneNode(!0).cloneNode(!0).lastChild.checked,b.appendChecked=i.checked,k.removeChild(i),k.appendChild(q),q.innerHTML="",a.getComputedStyle&&(j=c.createElement("div"),j.style.width="0",j.style.marginRight="0",q.style.width="2px",q.appendChild(j),b.reliableMarginRight=(parseInt((a.getComputedStyle(j,null)||{marginRight:0}).marginRight,10)||0)===0);if(q.attachEvent)for(o in{submit:1,change:1,focusin:1})n="on"+o,p=n in q,p||(q.setAttribute(n,"return;"),p=typeof q[n]=="function"),b[o+"Bubbles"]=p;k.removeChild(q),k=g=h=j=q=i=null,f(function(){var a,d,e,g,h,i,j,k,m,n,o,r=c.getElementsByTagName("body")[0];!r||(j=1,k="position:absolute;top:0;left:0;width:1px;height:1px;margin:0;",m="visibility:hidden;border:0;",n="style='"+k+"border:5px solid #000;padding:0;'",o="<div "+n+"><div></div></div>"+"<table "+n+" cellpadding='0' cellspacing='0'>"+"<tr><td></td></tr></table>",a=c.createElement("div"),a.style.cssText=m+"width:0;height:0;position:static;top:0;margin-top:"+j+"px",r.insertBefore(a,r.firstChild),q=c.createElement("div"),a.appendChild(q),q.innerHTML="<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>",l=q.getElementsByTagName("td"),p=l[0].offsetHeight===0,l[0].style.display="",l[1].style.display="none",b.reliableHiddenOffsets=p&&l[0].offsetHeight===0,q.innerHTML="",q.style.width=q.style.paddingLeft="1px",f.boxModel=b.boxModel=q.offsetWidth===2,typeof q.style.zoom!="undefined"&&(q.style.display="inline",q.style.zoom=1,b.inlineBlockNeedsLayout=q.offsetWidth===2,q.style.display="",q.innerHTML="<div style='width:4px;'></div>",b.shrinkWrapBlocks=q.offsetWidth!==2),q.style.cssText=k+m,q.innerHTML=o,d=q.firstChild,e=d.firstChild,h=d.nextSibling.firstChild.firstChild,i={doesNotAddBorder:e.offsetTop!==5,doesAddBorderForTableAndCells:h.offsetTop===5},e.style.position="fixed",e.style.top="20px",i.fixedPosition=e.offsetTop===20||e.offsetTop===15,e.style.position=e.style.top="",d.style.overflow="hidden",d.style.position="relative",i.subtractsBorderForOverflowNotVisible=e.offsetTop===-5,i.doesNotIncludeMarginInBodyOffset=r.offsetTop!==j,r.removeChild(a),q=a=null,f.extend(b,i))});return b}();var j=/^(?:\{.*\}|\[.*\])$/,k=/([A-Z])/g;f.extend({cache:{},uuid:0,expando:"jQuery"+(f.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(a){a=a.nodeType?f.cache[a[f.expando]]:a[f.expando];return!!a&&!m(a)},data:function(a,c,d,e){if(!!f.acceptData(a)){var g,h,i,j=f.expando,k=typeof c=="string",l=a.nodeType,m=l?f.cache:a,n=l?a[j]:a[j]&&j,o=c==="events";if((!n||!m[n]||!o&&!e&&!m[n].data)&&k&&d===b)return;n||(l?a[j]=n=++f.uuid:n=j),m[n]||(m[n]={},l||(m[n].toJSON=f.noop));if(typeof c=="object"||typeof c=="function")e?m[n]=f.extend(m[n],c):m[n].data=f.extend(m[n].data,c);g=h=m[n],e||(h.data||(h.data={}),h=h.data),d!==b&&(h[f.camelCase(c)]=d);if(o&&!h[c])return g.events;k?(i=h[c],i==null&&(i=h[f.camelCase(c)])):i=h;return i}},removeData:function(a,b,c){if(!!f.acceptData(a)){var d,e,g,h=f.expando,i=a.nodeType,j=i?f.cache:a,k=i?a[h]:h;if(!j[k])return;if(b){d=c?j[k]:j[k].data;if(d){f.isArray(b)||(b in d?b=[b]:(b=f.camelCase(b),b in d?b=[b]:b=b.split(" ")));for(e=0,g=b.length;e<g;e++)delete d[b[e]];if(!(c?m:f.isEmptyObject)(d))return}}if(!c){delete j[k].data;if(!m(j[k]))return}f.support.deleteExpando||!j.setInterval?delete j[k]:j[k]=null,i&&(f.support.deleteExpando?delete a[h]:a.removeAttribute?a.removeAttribute(h):a[h]=null)}},_data:function(a,b,c){return f.data(a,b,c,!0)},acceptData:function(a){if(a.nodeName){var b=f.noData[a.nodeName.toLowerCase()];if(b)return b!==!0&&a.getAttribute("classid")===b}return!0}}),f.fn.extend({data:function(a,c){var d,e,g,h=null;if(typeof a=="undefined"){if(this.length){h=f.data(this[0]);if(this[0].nodeType===1&&!f._data(this[0],"parsedAttrs")){e=this[0].attributes;for(var i=0,j=e.length;i<j;i++)g=e[i].name,g.indexOf("data-")===0&&(g=f.camelCase(g.substring(5)),l(this[0],g,h[g]));f._data(this[0],"parsedAttrs",!0)}}return h}if(typeof a=="object")return this.each(function(){f.data(this,a)});d=a.split("."),d[1]=d[1]?"."+d[1]:"";if(c===b){h=this.triggerHandler("getData"+d[1]+"!",[d[0]]),h===b&&this.length&&(h=f.data(this[0],a),h=l(this[0],a,h));return h===b&&d[1]?this.data(d[0]):h}return this.each(function(){var b=f(this),e=[d[0],c];b.triggerHandler("setData"+d[1]+"!",e),f.data(this,a,c),b.triggerHandler("changeData"+d[1]+"!",e)})},removeData:function(a){return this.each(function(){f.removeData(this,a)})}}),f.extend({_mark:function(a,b){a&&(b=(b||"fx")+"mark",f._data(a,b,(f._data(a,b)||0)+1))},_unmark:function(a,b,c){a!==!0&&(c=b,b=a,a=!1);if(b){c=c||"fx";var d=c+"mark",e=a?0:(f._data(b,d)||1)-1;e?f._data(b,d,e):(f.removeData(b,d,!0),n(b,c,"mark"))}},queue:function(a,b,c){var d;if(a){b=(b||"fx")+"queue",d=f._data(a,b),c&&(!d||f.isArray(c)?d=f._data(a,b,f.makeArray(c)):d.push(c));return d||[]}},dequeue:function(a,b){b=b||"fx";var c=f.queue(a,b),d=c.shift(),e={};d==="inprogress"&&(d=c.shift()),d&&(b==="fx"&&c.unshift("inprogress"),f._data(a,b+".run",e),d.call(a,function(){f.dequeue(a,b)},e)),c.length||(f.removeData(a,b+"queue "+b+".run",!0),n(a,b,"queue"))}}),f.fn.extend({queue:function(a,c){typeof a!="string"&&(c=a,a="fx");if(c===b)return f.queue(this[0],a);return this.each(function(){var b=f.queue(this,a,c);a==="fx"&&b[0]!=="inprogress"&&f.dequeue(this,a)})},dequeue:function(a){return this.each(function(){f.dequeue(this,a)})},delay:function(a,b){a=f.fx?f.fx.speeds[a]||a:a,b=b||"fx";return this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,c){function m(){--h||d.resolveWith(e,[e])}typeof a!="string"&&(c=a,a=b),a=a||"fx";var d=f.Deferred(),e=this,g=e.length,h=1,i=a+"defer",j=a+"queue",k=a+"mark",l;while(g--)if(l=f.data(e[g],i,b,!0)||(f.data(e[g],j,b,!0)||f.data(e[g],k,b,!0))&&f.data(e[g],i,f.Callbacks("once memory"),!0))h++,l.add(m);m();return d.promise()}});var o=/[\n\t\r]/g,p=/\s+/,q=/\r/g,r=/^(?:button|input)$/i,s=/^(?:button|input|object|select|textarea)$/i,t=/^a(?:rea)?$/i,u=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,v=f.support.getSetAttribute,w,x,y;f.fn.extend({attr:function(a,b){return f.access(this,a,b,!0,f.attr)},removeAttr:function(a){return this.each(function(){f.removeAttr(this,a)})},prop:function(a,b){return f.access(this,a,b,!0,f.prop)},removeProp:function(a){a=f.propFix[a]||a;return this.each(function(){try{this[a]=b,delete this[a]}catch(c){}})},addClass:function(a){var b,c,d,e,g,h,i;if(f.isFunction(a))return this.each(function(b){f(this).addClass(a.call(this,b,this.className))});if(a&&typeof a=="string"){b=a.split(p);for(c=0,d=this.length;c<d;c++){e=this[c];if(e.nodeType===1)if(!e.className&&b.length===1)e.className=a;else{g=" "+e.className+" ";for(h=0,i=b.length;h<i;h++)~g.indexOf(" "+b[h]+" ")||(g+=b[h]+" ");e.className=f.trim(g)}}}return this},removeClass:function(a){var c,d,e,g,h,i,j;if(f.isFunction(a))return this.each(function(b){f(this).removeClass(a.call(this,b,this.className))});if(a&&typeof a=="string"||a===b){c=(a||"").split(p);for(d=0,e=this.length;d<e;d++){g=this[d];if(g.nodeType===1&&g.className)if(a){h=(" "+g.className+" ").replace(o," ");for(i=0,j=c.length;i<j;i++)h=h.replace(" "+c[i]+" "," ");g.className=f.trim(h)}else g.className=""}}return this},toggleClass:function(a,b){var c=typeof a,d=typeof b=="boolean";if(f.isFunction(a))return this.each(function(c){f(this).toggleClass(a.call(this,c,this.className,b),b)});return this.each(function(){if(c==="string"){var e,g=0,h=f(this),i=b,j=a.split(p);while(e=j[g++])i=d?i:!h.hasClass(e),h[i?"addClass":"removeClass"](e)}else if(c==="undefined"||c==="boolean")this.className&&f._data(this,"__className__",this.className),this.className=this.className||a===!1?"":f._data(this,"__className__")||""})},hasClass:function(a){var b=" "+a+" ",c=0,d=this.length;for(;c<d;c++)if(this[c].nodeType===1&&(" "+this[c].className+" ").replace(o," ").indexOf(b)>-1)return!0;return!1},val:function(a){var c,d,e,g=this[0];{if(!!arguments.length){e=f.isFunction(a);return this.each(function(d){var g=f(this),h;if(this.nodeType===1){e?h=a.call(this,d,g.val()):h=a,h==null?h="":typeof h=="number"?h+="":f.isArray(h)&&(h=f.map(h,function(a){return a==null?"":a+""})),c=f.valHooks[this.nodeName.toLowerCase()]||f.valHooks[this.type];if(!c||!("set"in c)||c.set(this,h,"value")===b)this.value=h}})}if(g){c=f.valHooks[g.nodeName.toLowerCase()]||f.valHooks[g.type];if(c&&"get"in c&&(d=c.get(g,"value"))!==b)return d;d=g.value;return typeof d=="string"?d.replace(q,""):d==null?"":d}}}}),f.extend({valHooks:{option:{get:function(a){var b=a.attributes.value;return!b||b.specified?a.value:a.text}},select:{get:function(a){var b,c,d,e,g=a.selectedIndex,h=[],i=a.options,j=a.type==="select-one";if(g<0)return null;c=j?g:0,d=j?g+1:i.length;for(;c<d;c++){e=i[c];if(e.selected&&(f.support.optDisabled?!e.disabled:e.getAttribute("disabled")===null)&&(!e.parentNode.disabled||!f.nodeName(e.parentNode,"optgroup"))){b=f(e).val();if(j)return b;h.push(b)}}if(j&&!h.length&&i.length)return f(i[g]).val();return h},set:function(a,b){var c=f.makeArray(b);f(a).find("option").each(function(){this.selected=f.inArray(f(this).val(),c)>=0}),c.length||(a.selectedIndex=-1);return c}}},attrFn:{val:!0,css:!0,html:!0,text:!0,data:!0,width:!0,height:!0,offset:!0},attr:function(a,c,d,e){var g,h,i,j=a.nodeType;if(!!a&&j!==3&&j!==8&&j!==2){if(e&&c in f.attrFn)return f(a)[c](d);if(typeof a.getAttribute=="undefined")return f.prop(a,c,d);i=j!==1||!f.isXMLDoc(a),i&&(c=c.toLowerCase(),h=f.attrHooks[c]||(u.test(c)?x:w));if(d!==b){if(d===null){f.removeAttr(a,c);return}if(h&&"set"in h&&i&&(g=h.set(a,d,c))!==b)return g;a.setAttribute(c,""+d);return d}if(h&&"get"in h&&i&&(g=h.get(a,c))!==null)return g;g=a.getAttribute(c);return g===null?b:g}},removeAttr:function(a,b){var c,d,e,g,h=0;if(b&&a.nodeType===1){d=b.toLowerCase().split(p),g=d.length;for(;h<g;h++)e=d[h],e&&(c=f.propFix[e]||e,f.attr(a,e,""),a.removeAttribute(v?e:c),u.test(e)&&c in a&&(a[c]=!1))}},attrHooks:{type:{set:function(a,b){if(r.test(a.nodeName)&&a.parentNode)f.error("type property can't be changed");else if(!f.support.radioValue&&b==="radio"&&f.nodeName(a,"input")){var c=a.value;a.setAttribute("type",b),c&&(a.value=c);return b}}},value:{get:function(a,b){if(w&&f.nodeName(a,"button"))return w.get(a,b);return b in a?a.value:null},set:function(a,b,c){if(w&&f.nodeName(a,"button"))return w.set(a,b,c);a.value=b}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(a,c,d){var e,g,h,i=a.nodeType;if(!!a&&i!==3&&i!==8&&i!==2){h=i!==1||!f.isXMLDoc(a),h&&(c=f.propFix[c]||c,g=f.propHooks[c]);return d!==b?g&&"set"in g&&(e=g.set(a,d,c))!==b?e:a[c]=d:g&&"get"in g&&(e=g.get(a,c))!==null?e:a[c]}},propHooks:{tabIndex:{get:function(a){var c=a.getAttributeNode("tabindex");return c&&c.specified?parseInt(c.value,10):s.test(a.nodeName)||t.test(a.nodeName)&&a.href?0:b}}}}),f.attrHooks.tabindex=f.propHooks.tabIndex,x={get:function(a,c){var d,e=f.prop(a,c);return e===!0||typeof e!="boolean"&&(d=a.getAttributeNode(c))&&d.nodeValue!==!1?c.toLowerCase():b},set:function(a,b,c){var d;b===!1?f.removeAttr(a,c):(d=f.propFix[c]||c,d in a&&(a[d]=!0),a.setAttribute(c,c.toLowerCase()));return c}},v||(y={name:!0,id:!0},w=f.valHooks.button={get:function(a,c){var d;d=a.getAttributeNode(c);return d&&(y[c]?d.nodeValue!=="":d.specified)?d.nodeValue:b},set:function(a,b,d){var e=a.getAttributeNode(d);e||(e=c.createAttribute(d),a.setAttributeNode(e));return e.nodeValue=b+""}},f.attrHooks.tabindex.set=w.set,f.each(["width","height"],function(a,b){f.attrHooks[b]=f.extend(f.attrHooks[b],{set:function(a,c){if(c===""){a.setAttribute(b,"auto");return c}}})}),f.attrHooks.contenteditable={get:w.get,set:function(a,b,c){b===""&&(b="false"),w.set(a,b,c)}}),f.support.hrefNormalized||f.each(["href","src","width","height"],function(a,c){f.attrHooks[c]=f.extend(f.attrHooks[c],{get:function(a){var d=a.getAttribute(c,2);return d===null?b:d}})}),f.support.style||(f.attrHooks.style={get:function(a){return a.style.cssText.toLowerCase()||b},set:function(a,b){return a.style.cssText=""+b}}),f.support.optSelected||(f.propHooks.selected=f.extend(f.propHooks.selected,{get:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex);return null}})),f.support.enctype||(f.propFix.enctype="encoding"),f.support.checkOn||f.each(["radio","checkbox"],function(){f.valHooks[this]={get:function(a){return a.getAttribute("value")===null?"on":a.value}}}),f.each(["radio","checkbox"],function(){f.valHooks[this]=f.extend(f.valHooks[this],{set:function(a,b){if(f.isArray(b))return a.checked=f.inArray(f(a).val(),b)>=0}})});var z=/^(?:textarea|input|select)$/i,A=/^([^\.]*)?(?:\.(.+))?$/,B=/\bhover(\.\S+)?\b/,C=/^key/,D=/^(?:mouse|contextmenu)|click/,E=/^(?:focusinfocus|focusoutblur)$/,F=/^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,G=function(a){var b=F.exec(a);b&&(b[1]=(b[1]||"").toLowerCase(),b[3]=b[3]&&new RegExp("(?:^|\\s)"+b[3]+"(?:\\s|$)"));return b},H=function(a,b){var c=a.attributes||{};return(!b[1]||a.nodeName.toLowerCase()===b[1])&&(!b[2]||(c.id||{}).value===b[2])&&(!b[3]||b[3].test((c["class"]||{}).value))},I=function(a){return f.event.special.hover?a:a.replace(B,"mouseenter$1 mouseleave$1")};
f.event={add:function(a,c,d,e,g){var h,i,j,k,l,m,n,o,p,q,r,s;if(!(a.nodeType===3||a.nodeType===8||!c||!d||!(h=f._data(a)))){d.handler&&(p=d,d=p.handler),d.guid||(d.guid=f.guid++),j=h.events,j||(h.events=j={}),i=h.handle,i||(h.handle=i=function(a){return typeof f!="undefined"&&(!a||f.event.triggered!==a.type)?f.event.dispatch.apply(i.elem,arguments):b},i.elem=a),c=f.trim(I(c)).split(" ");for(k=0;k<c.length;k++){l=A.exec(c[k])||[],m=l[1],n=(l[2]||"").split(".").sort(),s=f.event.special[m]||{},m=(g?s.delegateType:s.bindType)||m,s=f.event.special[m]||{},o=f.extend({type:m,origType:l[1],data:e,handler:d,guid:d.guid,selector:g,quick:G(g),namespace:n.join(".")},p),r=j[m];if(!r){r=j[m]=[],r.delegateCount=0;if(!s.setup||s.setup.call(a,e,n,i)===!1)a.addEventListener?a.addEventListener(m,i,!1):a.attachEvent&&a.attachEvent("on"+m,i)}s.add&&(s.add.call(a,o),o.handler.guid||(o.handler.guid=d.guid)),g?r.splice(r.delegateCount++,0,o):r.push(o),f.event.global[m]=!0}a=null}},global:{},remove:function(a,b,c,d,e){var g=f.hasData(a)&&f._data(a),h,i,j,k,l,m,n,o,p,q,r,s;if(!!g&&!!(o=g.events)){b=f.trim(I(b||"")).split(" ");for(h=0;h<b.length;h++){i=A.exec(b[h])||[],j=k=i[1],l=i[2];if(!j){for(j in o)f.event.remove(a,j+b[h],c,d,!0);continue}p=f.event.special[j]||{},j=(d?p.delegateType:p.bindType)||j,r=o[j]||[],m=r.length,l=l?new RegExp("(^|\\.)"+l.split(".").sort().join("\\.(?:.*\\.)?")+"(\\.|$)"):null;for(n=0;n<r.length;n++)s=r[n],(e||k===s.origType)&&(!c||c.guid===s.guid)&&(!l||l.test(s.namespace))&&(!d||d===s.selector||d==="**"&&s.selector)&&(r.splice(n--,1),s.selector&&r.delegateCount--,p.remove&&p.remove.call(a,s));r.length===0&&m!==r.length&&((!p.teardown||p.teardown.call(a,l)===!1)&&f.removeEvent(a,j,g.handle),delete o[j])}f.isEmptyObject(o)&&(q=g.handle,q&&(q.elem=null),f.removeData(a,["events","handle"],!0))}},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(c,d,e,g){if(!e||e.nodeType!==3&&e.nodeType!==8){var h=c.type||c,i=[],j,k,l,m,n,o,p,q,r,s;if(E.test(h+f.event.triggered))return;h.indexOf("!")>=0&&(h=h.slice(0,-1),k=!0),h.indexOf(".")>=0&&(i=h.split("."),h=i.shift(),i.sort());if((!e||f.event.customEvent[h])&&!f.event.global[h])return;c=typeof c=="object"?c[f.expando]?c:new f.Event(h,c):new f.Event(h),c.type=h,c.isTrigger=!0,c.exclusive=k,c.namespace=i.join("."),c.namespace_re=c.namespace?new RegExp("(^|\\.)"+i.join("\\.(?:.*\\.)?")+"(\\.|$)"):null,o=h.indexOf(":")<0?"on"+h:"";if(!e){j=f.cache;for(l in j)j[l].events&&j[l].events[h]&&f.event.trigger(c,d,j[l].handle.elem,!0);return}c.result=b,c.target||(c.target=e),d=d!=null?f.makeArray(d):[],d.unshift(c),p=f.event.special[h]||{};if(p.trigger&&p.trigger.apply(e,d)===!1)return;r=[[e,p.bindType||h]];if(!g&&!p.noBubble&&!f.isWindow(e)){s=p.delegateType||h,m=E.test(s+h)?e:e.parentNode,n=null;for(;m;m=m.parentNode)r.push([m,s]),n=m;n&&n===e.ownerDocument&&r.push([n.defaultView||n.parentWindow||a,s])}for(l=0;l<r.length&&!c.isPropagationStopped();l++)m=r[l][0],c.type=r[l][1],q=(f._data(m,"events")||{})[c.type]&&f._data(m,"handle"),q&&q.apply(m,d),q=o&&m[o],q&&f.acceptData(m)&&q.apply(m,d)===!1&&c.preventDefault();c.type=h,!g&&!c.isDefaultPrevented()&&(!p._default||p._default.apply(e.ownerDocument,d)===!1)&&(h!=="click"||!f.nodeName(e,"a"))&&f.acceptData(e)&&o&&e[h]&&(h!=="focus"&&h!=="blur"||c.target.offsetWidth!==0)&&!f.isWindow(e)&&(n=e[o],n&&(e[o]=null),f.event.triggered=h,e[h](),f.event.triggered=b,n&&(e[o]=n));return c.result}},dispatch:function(c){c=f.event.fix(c||a.event);var d=(f._data(this,"events")||{})[c.type]||[],e=d.delegateCount,g=[].slice.call(arguments,0),h=!c.exclusive&&!c.namespace,i=[],j,k,l,m,n,o,p,q,r,s,t;g[0]=c,c.delegateTarget=this;if(e&&!c.target.disabled&&(!c.button||c.type!=="click")){m=f(this),m.context=this.ownerDocument||this;for(l=c.target;l!=this;l=l.parentNode||this){o={},q=[],m[0]=l;for(j=0;j<e;j++)r=d[j],s=r.selector,o[s]===b&&(o[s]=r.quick?H(l,r.quick):m.is(s)),o[s]&&q.push(r);q.length&&i.push({elem:l,matches:q})}}d.length>e&&i.push({elem:this,matches:d.slice(e)});for(j=0;j<i.length&&!c.isPropagationStopped();j++){p=i[j],c.currentTarget=p.elem;for(k=0;k<p.matches.length&&!c.isImmediatePropagationStopped();k++){r=p.matches[k];if(h||!c.namespace&&!r.namespace||c.namespace_re&&c.namespace_re.test(r.namespace))c.data=r.data,c.handleObj=r,n=((f.event.special[r.origType]||{}).handle||r.handler).apply(p.elem,g),n!==b&&(c.result=n,n===!1&&(c.preventDefault(),c.stopPropagation()))}}return c.result},props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){a.which==null&&(a.which=b.charCode!=null?b.charCode:b.keyCode);return a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,d){var e,f,g,h=d.button,i=d.fromElement;a.pageX==null&&d.clientX!=null&&(e=a.target.ownerDocument||c,f=e.documentElement,g=e.body,a.pageX=d.clientX+(f&&f.scrollLeft||g&&g.scrollLeft||0)-(f&&f.clientLeft||g&&g.clientLeft||0),a.pageY=d.clientY+(f&&f.scrollTop||g&&g.scrollTop||0)-(f&&f.clientTop||g&&g.clientTop||0)),!a.relatedTarget&&i&&(a.relatedTarget=i===a.target?d.toElement:i),!a.which&&h!==b&&(a.which=h&1?1:h&2?3:h&4?2:0);return a}},fix:function(a){if(a[f.expando])return a;var d,e,g=a,h=f.event.fixHooks[a.type]||{},i=h.props?this.props.concat(h.props):this.props;a=f.Event(g);for(d=i.length;d;)e=i[--d],a[e]=g[e];a.target||(a.target=g.srcElement||c),a.target.nodeType===3&&(a.target=a.target.parentNode),a.metaKey===b&&(a.metaKey=a.ctrlKey);return h.filter?h.filter(a,g):a},special:{ready:{setup:f.bindReady},load:{noBubble:!0},focus:{delegateType:"focusin"},blur:{delegateType:"focusout"},beforeunload:{setup:function(a,b,c){f.isWindow(this)&&(this.onbeforeunload=c)},teardown:function(a,b){this.onbeforeunload===b&&(this.onbeforeunload=null)}}},simulate:function(a,b,c,d){var e=f.extend(new f.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?f.event.trigger(e,null,b):f.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},f.event.handle=f.event.dispatch,f.removeEvent=c.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){a.detachEvent&&a.detachEvent("on"+b,c)},f.Event=function(a,b){if(!(this instanceof f.Event))return new f.Event(a,b);a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault()?K:J):this.type=a,b&&f.extend(this,b),this.timeStamp=a&&a.timeStamp||f.now(),this[f.expando]=!0},f.Event.prototype={preventDefault:function(){this.isDefaultPrevented=K;var a=this.originalEvent;!a||(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){this.isPropagationStopped=K;var a=this.originalEvent;!a||(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=K,this.stopPropagation()},isDefaultPrevented:J,isPropagationStopped:J,isImmediatePropagationStopped:J},f.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){f.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c=this,d=a.relatedTarget,e=a.handleObj,g=e.selector,h;if(!d||d!==c&&!f.contains(c,d))a.type=e.origType,h=e.handler.apply(this,arguments),a.type=b;return h}}}),f.support.submitBubbles||(f.event.special.submit={setup:function(){if(f.nodeName(this,"form"))return!1;f.event.add(this,"click._submit keypress._submit",function(a){var c=a.target,d=f.nodeName(c,"input")||f.nodeName(c,"button")?c.form:b;d&&!d._submit_attached&&(f.event.add(d,"submit._submit",function(a){this.parentNode&&!a.isTrigger&&f.event.simulate("submit",this.parentNode,a,!0)}),d._submit_attached=!0)})},teardown:function(){if(f.nodeName(this,"form"))return!1;f.event.remove(this,"._submit")}}),f.support.changeBubbles||(f.event.special.change={setup:function(){if(z.test(this.nodeName)){if(this.type==="checkbox"||this.type==="radio")f.event.add(this,"propertychange._change",function(a){a.originalEvent.propertyName==="checked"&&(this._just_changed=!0)}),f.event.add(this,"click._change",function(a){this._just_changed&&!a.isTrigger&&(this._just_changed=!1,f.event.simulate("change",this,a,!0))});return!1}f.event.add(this,"beforeactivate._change",function(a){var b=a.target;z.test(b.nodeName)&&!b._change_attached&&(f.event.add(b,"change._change",function(a){this.parentNode&&!a.isSimulated&&!a.isTrigger&&f.event.simulate("change",this.parentNode,a,!0)}),b._change_attached=!0)})},handle:function(a){var b=a.target;if(this!==b||a.isSimulated||a.isTrigger||b.type!=="radio"&&b.type!=="checkbox")return a.handleObj.handler.apply(this,arguments)},teardown:function(){f.event.remove(this,"._change");return z.test(this.nodeName)}}),f.support.focusinBubbles||f.each({focus:"focusin",blur:"focusout"},function(a,b){var d=0,e=function(a){f.event.simulate(b,a.target,f.event.fix(a),!0)};f.event.special[b]={setup:function(){d++===0&&c.addEventListener(a,e,!0)},teardown:function(){--d===0&&c.removeEventListener(a,e,!0)}}}),f.fn.extend({on:function(a,c,d,e,g){var h,i;if(typeof a=="object"){typeof c!="string"&&(d=c,c=b);for(i in a)this.on(i,c,d,a[i],g);return this}d==null&&e==null?(e=c,d=c=b):e==null&&(typeof c=="string"?(e=d,d=b):(e=d,d=c,c=b));if(e===!1)e=J;else if(!e)return this;g===1&&(h=e,e=function(a){f().off(a);return h.apply(this,arguments)},e.guid=h.guid||(h.guid=f.guid++));return this.each(function(){f.event.add(this,a,e,d,c)})},one:function(a,b,c,d){return this.on.call(this,a,b,c,d,1)},off:function(a,c,d){if(a&&a.preventDefault&&a.handleObj){var e=a.handleObj;f(a.delegateTarget).off(e.namespace?e.type+"."+e.namespace:e.type,e.selector,e.handler);return this}if(typeof a=="object"){for(var g in a)this.off(g,c,a[g]);return this}if(c===!1||typeof c=="function")d=c,c=b;d===!1&&(d=J);return this.each(function(){f.event.remove(this,a,d,c)})},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},live:function(a,b,c){f(this.context).on(a,this.selector,b,c);return this},die:function(a,b){f(this.context).off(a,this.selector||"**",b);return this},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return arguments.length==1?this.off(a,"**"):this.off(b,a,c)},trigger:function(a,b){return this.each(function(){f.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0])return f.event.trigger(a,b,this[0],!0)},toggle:function(a){var b=arguments,c=a.guid||f.guid++,d=0,e=function(c){var e=(f._data(this,"lastToggle"+a.guid)||0)%d;f._data(this,"lastToggle"+a.guid,e+1),c.preventDefault();return b[e].apply(this,arguments)||!1};e.guid=c;while(d<b.length)b[d++].guid=c;return this.click(e)},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){f.fn[b]=function(a,c){c==null&&(c=a,a=null);return arguments.length>0?this.on(b,null,a,c):this.trigger(b)},f.attrFn&&(f.attrFn[b]=!0),C.test(b)&&(f.event.fixHooks[b]=f.event.keyHooks),D.test(b)&&(f.event.fixHooks[b]=f.event.mouseHooks)}),function(){function x(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}if(j.nodeType===1){g||(j[d]=c,j.sizset=h);if(typeof b!="string"){if(j===b){k=!0;break}}else if(m.filter(b,[j]).length>0){k=j;break}}j=j[a]}e[h]=k}}}function w(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}j.nodeType===1&&!g&&(j[d]=c,j.sizset=h);if(j.nodeName.toLowerCase()===b){k=j;break}j=j[a]}e[h]=k}}}var a=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,d="sizcache"+(Math.random()+"").replace(".",""),e=0,g=Object.prototype.toString,h=!1,i=!0,j=/\\/g,k=/\r\n/g,l=/\W/;[0,0].sort(function(){i=!1;return 0});var m=function(b,d,e,f){e=e||[],d=d||c;var h=d;if(d.nodeType!==1&&d.nodeType!==9)return[];if(!b||typeof b!="string")return e;var i,j,k,l,n,q,r,t,u=!0,v=m.isXML(d),w=[],x=b;do{a.exec(""),i=a.exec(x);if(i){x=i[3],w.push(i[1]);if(i[2]){l=i[3];break}}}while(i);if(w.length>1&&p.exec(b))if(w.length===2&&o.relative[w[0]])j=y(w[0]+w[1],d,f);else{j=o.relative[w[0]]?[d]:m(w.shift(),d);while(w.length)b=w.shift(),o.relative[b]&&(b+=w.shift()),j=y(b,j,f)}else{!f&&w.length>1&&d.nodeType===9&&!v&&o.match.ID.test(w[0])&&!o.match.ID.test(w[w.length-1])&&(n=m.find(w.shift(),d,v),d=n.expr?m.filter(n.expr,n.set)[0]:n.set[0]);if(d){n=f?{expr:w.pop(),set:s(f)}:m.find(w.pop(),w.length===1&&(w[0]==="~"||w[0]==="+")&&d.parentNode?d.parentNode:d,v),j=n.expr?m.filter(n.expr,n.set):n.set,w.length>0?k=s(j):u=!1;while(w.length)q=w.pop(),r=q,o.relative[q]?r=w.pop():q="",r==null&&(r=d),o.relative[q](k,r,v)}else k=w=[]}k||(k=j),k||m.error(q||b);if(g.call(k)==="[object Array]")if(!u)e.push.apply(e,k);else if(d&&d.nodeType===1)for(t=0;k[t]!=null;t++)k[t]&&(k[t]===!0||k[t].nodeType===1&&m.contains(d,k[t]))&&e.push(j[t]);else for(t=0;k[t]!=null;t++)k[t]&&k[t].nodeType===1&&e.push(j[t]);else s(k,e);l&&(m(l,h,e,f),m.uniqueSort(e));return e};m.uniqueSort=function(a){if(u){h=i,a.sort(u);if(h)for(var b=1;b<a.length;b++)a[b]===a[b-1]&&a.splice(b--,1)}return a},m.matches=function(a,b){return m(a,null,null,b)},m.matchesSelector=function(a,b){return m(b,null,null,[a]).length>0},m.find=function(a,b,c){var d,e,f,g,h,i;if(!a)return[];for(e=0,f=o.order.length;e<f;e++){h=o.order[e];if(g=o.leftMatch[h].exec(a)){i=g[1],g.splice(1,1);if(i.substr(i.length-1)!=="\\"){g[1]=(g[1]||"").replace(j,""),d=o.find[h](g,b,c);if(d!=null){a=a.replace(o.match[h],"");break}}}}d||(d=typeof b.getElementsByTagName!="undefined"?b.getElementsByTagName("*"):[]);return{set:d,expr:a}},m.filter=function(a,c,d,e){var f,g,h,i,j,k,l,n,p,q=a,r=[],s=c,t=c&&c[0]&&m.isXML(c[0]);while(a&&c.length){for(h in o.filter)if((f=o.leftMatch[h].exec(a))!=null&&f[2]){k=o.filter[h],l=f[1],g=!1,f.splice(1,1);if(l.substr(l.length-1)==="\\")continue;s===r&&(r=[]);if(o.preFilter[h]){f=o.preFilter[h](f,s,d,r,e,t);if(!f)g=i=!0;else if(f===!0)continue}if(f)for(n=0;(j=s[n])!=null;n++)j&&(i=k(j,f,n,s),p=e^i,d&&i!=null?p?g=!0:s[n]=!1:p&&(r.push(j),g=!0));if(i!==b){d||(s=r),a=a.replace(o.match[h],"");if(!g)return[];break}}if(a===q)if(g==null)m.error(a);else break;q=a}return s},m.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)};var n=m.getText=function(a){var b,c,d=a.nodeType,e="";if(d){if(d===1||d===9){if(typeof a.textContent=="string")return a.textContent;if(typeof a.innerText=="string")return a.innerText.replace(k,"");for(a=a.firstChild;a;a=a.nextSibling)e+=n(a)}else if(d===3||d===4)return a.nodeValue}else for(b=0;c=a[b];b++)c.nodeType!==8&&(e+=n(c));return e},o=m.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(a){return a.getAttribute("href")},type:function(a){return a.getAttribute("type")}},relative:{"+":function(a,b){var c=typeof b=="string",d=c&&!l.test(b),e=c&&!d;d&&(b=b.toLowerCase());for(var f=0,g=a.length,h;f<g;f++)if(h=a[f]){while((h=h.previousSibling)&&h.nodeType!==1);a[f]=e||h&&h.nodeName.toLowerCase()===b?h||!1:h===b}e&&m.filter(b,a,!0)},">":function(a,b){var c,d=typeof b=="string",e=0,f=a.length;if(d&&!l.test(b)){b=b.toLowerCase();for(;e<f;e++){c=a[e];if(c){var g=c.parentNode;a[e]=g.nodeName.toLowerCase()===b?g:!1}}}else{for(;e<f;e++)c=a[e],c&&(a[e]=d?c.parentNode:c.parentNode===b);d&&m.filter(b,a,!0)}},"":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("parentNode",b,f,a,d,c)},"~":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("previousSibling",b,f,a,d,c)}},find:{ID:function(a,b,c){if(typeof b.getElementById!="undefined"&&!c){var d=b.getElementById(a[1]);return d&&d.parentNode?[d]:[]}},NAME:function(a,b){if(typeof b.getElementsByName!="undefined"){var c=[],d=b.getElementsByName(a[1]);for(var e=0,f=d.length;e<f;e++)d[e].getAttribute("name")===a[1]&&c.push(d[e]);return c.length===0?null:c}},TAG:function(a,b){if(typeof b.getElementsByTagName!="undefined")return b.getElementsByTagName(a[1])}},preFilter:{CLASS:function(a,b,c,d,e,f){a=" "+a[1].replace(j,"")+" ";if(f)return a;for(var g=0,h;(h=b[g])!=null;g++)h&&(e^(h.className&&(" "+h.className+" ").replace(/[\t\n\r]/g," ").indexOf(a)>=0)?c||d.push(h):c&&(b[g]=!1));return!1},ID:function(a){return a[1].replace(j,"")},TAG:function(a,b){return a[1].replace(j,"").toLowerCase()},CHILD:function(a){if(a[1]==="nth"){a[2]||m.error(a[0]),a[2]=a[2].replace(/^\+|\s*/g,"");var b=/(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2]==="even"&&"2n"||a[2]==="odd"&&"2n+1"||!/\D/.test(a[2])&&"0n+"+a[2]||a[2]);a[2]=b[1]+(b[2]||1)-0,a[3]=b[3]-0}else a[2]&&m.error(a[0]);a[0]=e++;return a},ATTR:function(a,b,c,d,e,f){var g=a[1]=a[1].replace(j,"");!f&&o.attrMap[g]&&(a[1]=o.attrMap[g]),a[4]=(a[4]||a[5]||"").replace(j,""),a[2]==="~="&&(a[4]=" "+a[4]+" ");return a},PSEUDO:function(b,c,d,e,f){if(b[1]==="not")if((a.exec(b[3])||"").length>1||/^\w/.test(b[3]))b[3]=m(b[3],null,null,c);else{var g=m.filter(b[3],c,d,!0^f);d||e.push.apply(e,g);return!1}else if(o.match.POS.test(b[0])||o.match.CHILD.test(b[0]))return!0;return b},POS:function(a){a.unshift(!0);return a}},filters:{enabled:function(a){return a.disabled===!1&&a.type!=="hidden"},disabled:function(a){return a.disabled===!0},checked:function(a){return a.checked===!0},selected:function(a){a.parentNode&&a.parentNode.selectedIndex;return a.selected===!0},parent:function(a){return!!a.firstChild},empty:function(a){return!a.firstChild},has:function(a,b,c){return!!m(c[3],a).length},header:function(a){return/h\d/i.test(a.nodeName)},text:function(a){var b=a.getAttribute("type"),c=a.type;return a.nodeName.toLowerCase()==="input"&&"text"===c&&(b===c||b===null)},radio:function(a){return a.nodeName.toLowerCase()==="input"&&"radio"===a.type},checkbox:function(a){return a.nodeName.toLowerCase()==="input"&&"checkbox"===a.type},file:function(a){return a.nodeName.toLowerCase()==="input"&&"file"===a.type},password:function(a){return a.nodeName.toLowerCase()==="input"&&"password"===a.type},submit:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"submit"===a.type},image:function(a){return a.nodeName.toLowerCase()==="input"&&"image"===a.type},reset:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"reset"===a.type},button:function(a){var b=a.nodeName.toLowerCase();return b==="input"&&"button"===a.type||b==="button"},input:function(a){return/input|select|textarea|button/i.test(a.nodeName)},focus:function(a){return a===a.ownerDocument.activeElement}},setFilters:{first:function(a,b){return b===0},last:function(a,b,c,d){return b===d.length-1},even:function(a,b){return b%2===0},odd:function(a,b){return b%2===1},lt:function(a,b,c){return b<c[3]-0},gt:function(a,b,c){return b>c[3]-0},nth:function(a,b,c){return c[3]-0===b},eq:function(a,b,c){return c[3]-0===b}},filter:{PSEUDO:function(a,b,c,d){var e=b[1],f=o.filters[e];if(f)return f(a,c,b,d);if(e==="contains")return(a.textContent||a.innerText||n([a])||"").indexOf(b[3])>=0;if(e==="not"){var g=b[3];for(var h=0,i=g.length;h<i;h++)if(g[h]===a)return!1;return!0}m.error(e)},CHILD:function(a,b){var c,e,f,g,h,i,j,k=b[1],l=a;switch(k){case"only":case"first":while(l=l.previousSibling)if(l.nodeType===1)return!1;if(k==="first")return!0;l=a;case"last":while(l=l.nextSibling)if(l.nodeType===1)return!1;return!0;case"nth":c=b[2],e=b[3];if(c===1&&e===0)return!0;f=b[0],g=a.parentNode;if(g&&(g[d]!==f||!a.nodeIndex)){i=0;for(l=g.firstChild;l;l=l.nextSibling)l.nodeType===1&&(l.nodeIndex=++i);g[d]=f}j=a.nodeIndex-e;return c===0?j===0:j%c===0&&j/c>=0}},ID:function(a,b){return a.nodeType===1&&a.getAttribute("id")===b},TAG:function(a,b){return b==="*"&&a.nodeType===1||!!a.nodeName&&a.nodeName.toLowerCase()===b},CLASS:function(a,b){return(" "+(a.className||a.getAttribute("class"))+" ").indexOf(b)>-1},ATTR:function(a,b){var c=b[1],d=m.attr?m.attr(a,c):o.attrHandle[c]?o.attrHandle[c](a):a[c]!=null?a[c]:a.getAttribute(c),e=d+"",f=b[2],g=b[4];return d==null?f==="!=":!f&&m.attr?d!=null:f==="="?e===g:f==="*="?e.indexOf(g)>=0:f==="~="?(" "+e+" ").indexOf(g)>=0:g?f==="!="?e!==g:f==="^="?e.indexOf(g)===0:f==="$="?e.substr(e.length-g.length)===g:f==="|="?e===g||e.substr(0,g.length+1)===g+"-":!1:e&&d!==!1},POS:function(a,b,c,d){var e=b[2],f=o.setFilters[e];if(f)return f(a,c,b,d)}}},p=o.match.POS,q=function(a,b){return"\\"+(b-0+1)};for(var r in o.match)o.match[r]=new RegExp(o.match[r].source+/(?![^\[]*\])(?![^\(]*\))/.source),o.leftMatch[r]=new RegExp(/(^(?:.|\r|\n)*?)/.source+o.match[r].source.replace(/\\(\d+)/g,q));var s=function(a,b){a=Array.prototype.slice.call(a,0);if(b){b.push.apply(b,a);return b}return a};try{Array.prototype.slice.call(c.documentElement.childNodes,0)[0].nodeType}catch(t){s=function(a,b){var c=0,d=b||[];if(g.call(a)==="[object Array]")Array.prototype.push.apply(d,a);else if(typeof a.length=="number")for(var e=a.length;c<e;c++)d.push(a[c]);else for(;a[c];c++)d.push(a[c]);return d}}var u,v;c.documentElement.compareDocumentPosition?u=function(a,b){if(a===b){h=!0;return 0}if(!a.compareDocumentPosition||!b.compareDocumentPosition)return a.compareDocumentPosition?-1:1;return a.compareDocumentPosition(b)&4?-1:1}:(u=function(a,b){if(a===b){h=!0;return 0}if(a.sourceIndex&&b.sourceIndex)return a.sourceIndex-b.sourceIndex;var c,d,e=[],f=[],g=a.parentNode,i=b.parentNode,j=g;if(g===i)return v(a,b);if(!g)return-1;if(!i)return 1;while(j)e.unshift(j),j=j.parentNode;j=i;while(j)f.unshift(j),j=j.parentNode;c=e.length,d=f.length;for(var k=0;k<c&&k<d;k++)if(e[k]!==f[k])return v(e[k],f[k]);return k===c?v(a,f[k],-1):v(e[k],b,1)},v=function(a,b,c){if(a===b)return c;var d=a.nextSibling;while(d){if(d===b)return-1;d=d.nextSibling}return 1}),function(){var a=c.createElement("div"),d="script"+(new Date).getTime(),e=c.documentElement;a.innerHTML="<a name='"+d+"'/>",e.insertBefore(a,e.firstChild),c.getElementById(d)&&(o.find.ID=function(a,c,d){if(typeof c.getElementById!="undefined"&&!d){var e=c.getElementById(a[1]);return e?e.id===a[1]||typeof e.getAttributeNode!="undefined"&&e.getAttributeNode("id").nodeValue===a[1]?[e]:b:[]}},o.filter.ID=function(a,b){var c=typeof a.getAttributeNode!="undefined"&&a.getAttributeNode("id");return a.nodeType===1&&c&&c.nodeValue===b}),e.removeChild(a),e=a=null}(),function(){var a=c.createElement("div");a.appendChild(c.createComment("")),a.getElementsByTagName("*").length>0&&(o.find.TAG=function(a,b){var c=b.getElementsByTagName(a[1]);if(a[1]==="*"){var d=[];for(var e=0;c[e];e++)c[e].nodeType===1&&d.push(c[e]);c=d}return c}),a.innerHTML="<a href='#'></a>",a.firstChild&&typeof a.firstChild.getAttribute!="undefined"&&a.firstChild.getAttribute("href")!=="#"&&(o.attrHandle.href=function(a){return a.getAttribute("href",2)}),a=null}(),c.querySelectorAll&&function(){var a=m,b=c.createElement("div"),d="__sizzle__";b.innerHTML="<p class='TEST'></p>";if(!b.querySelectorAll||b.querySelectorAll(".TEST").length!==0){m=function(b,e,f,g){e=e||c;if(!g&&!m.isXML(e)){var h=/^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);if(h&&(e.nodeType===1||e.nodeType===9)){if(h[1])return s(e.getElementsByTagName(b),f);if(h[2]&&o.find.CLASS&&e.getElementsByClassName)return s(e.getElementsByClassName(h[2]),f)}if(e.nodeType===9){if(b==="body"&&e.body)return s([e.body],f);if(h&&h[3]){var i=e.getElementById(h[3]);if(!i||!i.parentNode)return s([],f);if(i.id===h[3])return s([i],f)}try{return s(e.querySelectorAll(b),f)}catch(j){}}else if(e.nodeType===1&&e.nodeName.toLowerCase()!=="object"){var k=e,l=e.getAttribute("id"),n=l||d,p=e.parentNode,q=/^\s*[+~]/.test(b);l?n=n.replace(/'/g,"\\@codeHere"):e.setAttribute("id",n),q&&p&&(e=e.parentNode);try{if(!q||p)return s(e.querySelectorAll("[id='"+n+"'] "+b),f)}catch(r){}finally{l||k.removeAttribute("id")}}}return a(b,e,f,g)};for(var e in a)m[e]=a[e];b=null}}(),function(){var a=c.documentElement,b=a.matchesSelector||a.mozMatchesSelector||a.webkitMatchesSelector||a.msMatchesSelector;if(b){var d=!b.call(c.createElement("div"),"div"),e=!1;try{b.call(c.documentElement,"[test!='']:sizzle")}catch(f){e=!0}m.matchesSelector=function(a,c){c=c.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!m.isXML(a))try{if(e||!o.match.PSEUDO.test(c)&&!/!=/.test(c)){var f=b.call(a,c);if(f||!d||a.document&&a.document.nodeType!==11)return f}}catch(g){}return m(c,null,null,[a]).length>0}}}(),function(){var a=c.createElement("div");a.innerHTML="<div class='test e'></div><div class='test'></div>";if(!!a.getElementsByClassName&&a.getElementsByClassName("e").length!==0){a.lastChild.className="e";if(a.getElementsByClassName("e").length===1)return;o.order.splice(1,0,"CLASS"),o.find.CLASS=function(a,b,c){if(typeof b.getElementsByClassName!="undefined"&&!c)return b.getElementsByClassName(a[1])},a=null}}(),c.documentElement.contains?m.contains=function(a,b){return a!==b&&(a.contains?a.contains(b):!0)}:c.documentElement.compareDocumentPosition?m.contains=function(a,b){return!!(a.compareDocumentPosition(b)&16)}:m.contains=function(){return!1},m.isXML=function(a){var b=(a?a.ownerDocument||a:0).documentElement;return b?b.nodeName!=="HTML":!1};var y=function(a,b,c){var d,e=[],f="",g=b.nodeType?[b]:b;while(d=o.match.PSEUDO.exec(a))f+=d[0],a=a.replace(o.match.PSEUDO,"");a=o.relative[a]?a+"*":a;for(var h=0,i=g.length;h<i;h++)m(a,g[h],e,c);return m.filter(f,e)};m.attr=f.attr,m.selectors.attrMap={},f.find=m,f.expr=m.selectors,f.expr[":"]=f.expr.filters,f.unique=m.uniqueSort,f.text=m.getText,f.isXMLDoc=m.isXML,f.contains=m.contains}();var L=/Until$/,M=/^(?:parents|prevUntil|prevAll)/,N=/,/,O=/^.[^:#\[\.,]*$/,P=Array.prototype.slice,Q=f.expr.match.POS,R={children:!0,contents:!0,next:!0,prev:!0};f.fn.extend({find:function(a){var b=this,c,d;if(typeof a!="string")return f(a).filter(function(){for(c=0,d=b.length;c<d;c++)if(f.contains(b[c],this))return!0});var e=this.pushStack("","find",a),g,h,i;for(c=0,d=this.length;c<d;c++){g=e.length,f.find(a,this[c],e);if(c>0)for(h=g;h<e.length;h++)for(i=0;i<g;i++)if(e[i]===e[h]){e.splice(h--,1);break}}return e},has:function(a){var b=f(a);return this.filter(function(){for(var a=0,c=b.length;a<c;a++)if(f.contains(this,b[a]))return!0})},not:function(a){return this.pushStack(T(this,a,!1),"not",a)},filter:function(a){return this.pushStack(T(this,a,!0),"filter",a)},is:function(a){return!!a&&(typeof a=="string"?Q.test(a)?f(a,this.context).index(this[0])>=0:f.filter(a,this).length>0:this.filter(a).length>0)},closest:function(a,b){var c=[],d,e,g=this[0];if(f.isArray(a)){var h=1;while(g&&g.ownerDocument&&g!==b){for(d=0;d<a.length;d++)f(g).is(a[d])&&c.push({selector:a[d],elem:g,level:h});g=g.parentNode,h++}return c}var i=Q.test(a)||typeof a!="string"?f(a,b||this.context):0;for(d=0,e=this.length;d<e;d++){g=this[d];while(g){if(i?i.index(g)>-1:f.find.matchesSelector(g,a)){c.push(g);break}g=g.parentNode;if(!g||!g.ownerDocument||g===b||g.nodeType===11)break}}c=c.length>1?f.unique(c):c;return this.pushStack(c,"closest",a)},index:function(a){if(!a)return this[0]&&this[0].parentNode?this.prevAll().length:-1;if(typeof a=="string")return f.inArray(this[0],f(a));return f.inArray(a.jquery?a[0]:a,this)},add:function(a,b){var c=typeof a=="string"?f(a,b):f.makeArray(a&&a.nodeType?[a]:a),d=f.merge(this.get(),c);return this.pushStack(S(c[0])||S(d[0])?d:f.unique(d))},andSelf:function(){return this.add(this.prevObject)}}),f.each({parent:function(a){var b=a.parentNode;return b&&b.nodeType!==11?b:null},parents:function(a){return f.dir(a,"parentNode")},parentsUntil:function(a,b,c){return f.dir(a,"parentNode",c)},next:function(a){return f.nth(a,2,"nextSibling")},prev:function(a){return f.nth(a,2,"previousSibling")},nextAll:function(a){return f.dir(a,"nextSibling")},prevAll:function(a){return f.dir(a,"previousSibling")},nextUntil:function(a,b,c){return f.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return f.dir(a,"previousSibling",c)},siblings:function(a){return f.sibling(a.parentNode.firstChild,a)},children:function(a){return f.sibling(a.firstChild)},contents:function(a){return f.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:f.makeArray(a.childNodes)}},function(a,b){f.fn[a]=function(c,d){var e=f.map(this,b,c);L.test(a)||(d=c),d&&typeof d=="string"&&(e=f.filter(d,e)),e=this.length>1&&!R[a]?f.unique(e):e,(this.length>1||N.test(d))&&M.test(a)&&(e=e.reverse());return this.pushStack(e,a,P.call(arguments).join(","))}}),f.extend({filter:function(a,b,c){c&&(a=":not("+a+")");return b.length===1?f.find.matchesSelector(b[0],a)?[b[0]]:[]:f.find.matches(a,b)},dir:function(a,c,d){var e=[],g=a[c];while(g&&g.nodeType!==9&&(d===b||g.nodeType!==1||!f(g).is(d)))g.nodeType===1&&e.push(g),g=g[c];return e},nth:function(a,b,c,d){b=b||1;var e=0;for(;a;a=a[c])if(a.nodeType===1&&++e===b)break;return a},sibling:function(a,b){var c=[];for(;a;a=a.nextSibling)a.nodeType===1&&a!==b&&c.push(a);return c}});var V="abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",W=/ jQuery\d+="(?:\d+|null)"/g,X=/^\s+/,Y=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,Z=/<([\w:]+)/,$=/<tbody/i,_=/<|&#?\w+;/,ba=/<(?:script|style)/i,bb=/<(?:script|object|embed|option|style)/i,bc=new RegExp("<(?:"+V+")","i"),bd=/checked\s*(?:[^=]|=\s*.checked.)/i,be=/\/(java|ecma)script/i,bf=/^\s*<!(?:\[CDATA\[|\-\-)/,bg={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]},bh=U(c);bg.optgroup=bg.option,bg.tbody=bg.tfoot=bg.colgroup=bg.caption=bg.thead,bg.th=bg.td,f.support.htmlSerialize||(bg._default=[1,"div<div>","</div>"]),f.fn.extend({text:function(a){if(f.isFunction(a))return this.each(function(b){var c=f(this);c.text(a.call(this,b,c.text()))});if(typeof a!="object"&&a!==b)return this.empty().append((this[0]&&this[0].ownerDocument||c).createTextNode(a));return f.text(this)},wrapAll:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapAll(a.call(this,b))});if(this[0]){var b=f(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&a.firstChild.nodeType===1)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapInner(a.call(this,b))});return this.each(function(){var b=f(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=f.isFunction(a);return this.each(function(c){f(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){f.nodeName(this,"body")||f(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.appendChild(a)})},prepend:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.insertBefore(a,this.firstChild)})},before:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this)});if(arguments.length){var a=f.clean(arguments);a.push.apply(a,this.toArray());return this.pushStack(a,"before",arguments)}},after:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this.nextSibling)});if(arguments.length){var a=this.pushStack(this,"after",arguments);a.push.apply(a,f.clean(arguments));return a}},remove:function(a,b){for(var c=0,d;(d=this[c])!=null;c++)if(!a||f.filter(a,[d]).length)!b&&d.nodeType===1&&(f.cleanData(d.getElementsByTagName("*")),f.cleanData([d])),d.parentNode&&d.parentNode.removeChild(d);return this},empty:function()
{for(var a=0,b;(b=this[a])!=null;a++){b.nodeType===1&&f.cleanData(b.getElementsByTagName("*"));while(b.firstChild)b.removeChild(b.firstChild)}return this},clone:function(a,b){a=a==null?!1:a,b=b==null?a:b;return this.map(function(){return f.clone(this,a,b)})},html:function(a){if(a===b)return this[0]&&this[0].nodeType===1?this[0].innerHTML.replace(W,""):null;if(typeof a=="string"&&!ba.test(a)&&(f.support.leadingWhitespace||!X.test(a))&&!bg[(Z.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(Y,"<$1></$2>");try{for(var c=0,d=this.length;c<d;c++)this[c].nodeType===1&&(f.cleanData(this[c].getElementsByTagName("*")),this[c].innerHTML=a)}catch(e){this.empty().append(a)}}else f.isFunction(a)?this.each(function(b){var c=f(this);c.html(a.call(this,b,c.html()))}):this.empty().append(a);return this},replaceWith:function(a){if(this[0]&&this[0].parentNode){if(f.isFunction(a))return this.each(function(b){var c=f(this),d=c.html();c.replaceWith(a.call(this,b,d))});typeof a!="string"&&(a=f(a).detach());return this.each(function(){var b=this.nextSibling,c=this.parentNode;f(this).remove(),b?f(b).before(a):f(c).append(a)})}return this.length?this.pushStack(f(f.isFunction(a)?a():a),"replaceWith",a):this},detach:function(a){return this.remove(a,!0)},domManip:function(a,c,d){var e,g,h,i,j=a[0],k=[];if(!f.support.checkClone&&arguments.length===3&&typeof j=="string"&&bd.test(j))return this.each(function(){f(this).domManip(a,c,d,!0)});if(f.isFunction(j))return this.each(function(e){var g=f(this);a[0]=j.call(this,e,c?g.html():b),g.domManip(a,c,d)});if(this[0]){i=j&&j.parentNode,f.support.parentNode&&i&&i.nodeType===11&&i.childNodes.length===this.length?e={fragment:i}:e=f.buildFragment(a,this,k),h=e.fragment,h.childNodes.length===1?g=h=h.firstChild:g=h.firstChild;if(g){c=c&&f.nodeName(g,"tr");for(var l=0,m=this.length,n=m-1;l<m;l++)d.call(c?bi(this[l],g):this[l],e.cacheable||m>1&&l<n?f.clone(h,!0,!0):h)}k.length&&f.each(k,bp)}return this}}),f.buildFragment=function(a,b,d){var e,g,h,i,j=a[0];b&&b[0]&&(i=b[0].ownerDocument||b[0]),i.createDocumentFragment||(i=c),a.length===1&&typeof j=="string"&&j.length<512&&i===c&&j.charAt(0)==="<"&&!bb.test(j)&&(f.support.checkClone||!bd.test(j))&&(f.support.html5Clone||!bc.test(j))&&(g=!0,h=f.fragments[j],h&&h!==1&&(e=h)),e||(e=i.createDocumentFragment(),f.clean(a,i,e,d)),g&&(f.fragments[j]=h?e:1);return{fragment:e,cacheable:g}},f.fragments={},f.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){f.fn[a]=function(c){var d=[],e=f(c),g=this.length===1&&this[0].parentNode;if(g&&g.nodeType===11&&g.childNodes.length===1&&e.length===1){e[b](this[0]);return this}for(var h=0,i=e.length;h<i;h++){var j=(h>0?this.clone(!0):this).get();f(e[h])[b](j),d=d.concat(j)}return this.pushStack(d,a,e.selector)}}),f.extend({clone:function(a,b,c){var d,e,g,h=f.support.html5Clone||!bc.test("<"+a.nodeName)?a.cloneNode(!0):bo(a);if((!f.support.noCloneEvent||!f.support.noCloneChecked)&&(a.nodeType===1||a.nodeType===11)&&!f.isXMLDoc(a)){bk(a,h),d=bl(a),e=bl(h);for(g=0;d[g];++g)e[g]&&bk(d[g],e[g])}if(b){bj(a,h);if(c){d=bl(a),e=bl(h);for(g=0;d[g];++g)bj(d[g],e[g])}}d=e=null;return h},clean:function(a,b,d,e){var g;b=b||c,typeof b.createElement=="undefined"&&(b=b.ownerDocument||b[0]&&b[0].ownerDocument||c);var h=[],i;for(var j=0,k;(k=a[j])!=null;j++){typeof k=="number"&&(k+="");if(!k)continue;if(typeof k=="string")if(!_.test(k))k=b.createTextNode(k);else{k=k.replace(Y,"<$1></$2>");var l=(Z.exec(k)||["",""])[1].toLowerCase(),m=bg[l]||bg._default,n=m[0],o=b.createElement("div");b===c?bh.appendChild(o):U(b).appendChild(o),o.innerHTML=m[1]+k+m[2];while(n--)o=o.lastChild;if(!f.support.tbody){var p=$.test(k),q=l==="table"&&!p?o.firstChild&&o.firstChild.childNodes:m[1]==="<table>"&&!p?o.childNodes:[];for(i=q.length-1;i>=0;--i)f.nodeName(q[i],"tbody")&&!q[i].childNodes.length&&q[i].parentNode.removeChild(q[i])}!f.support.leadingWhitespace&&X.test(k)&&o.insertBefore(b.createTextNode(X.exec(k)[0]),o.firstChild),k=o.childNodes}var r;if(!f.support.appendChecked)if(k[0]&&typeof (r=k.length)=="number")for(i=0;i<r;i++)bn(k[i]);else bn(k);k.nodeType?h.push(k):h=f.merge(h,k)}if(d){g=function(a){return!a.type||be.test(a.type)};for(j=0;h[j];j++)if(e&&f.nodeName(h[j],"script")&&(!h[j].type||h[j].type.toLowerCase()==="text/javascript"))e.push(h[j].parentNode?h[j].parentNode.removeChild(h[j]):h[j]);else{if(h[j].nodeType===1){var s=f.grep(h[j].getElementsByTagName("script"),g);h.splice.apply(h,[j+1,0].concat(s))}d.appendChild(h[j])}}return h},cleanData:function(a){var b,c,d=f.cache,e=f.event.special,g=f.support.deleteExpando;for(var h=0,i;(i=a[h])!=null;h++){if(i.nodeName&&f.noData[i.nodeName.toLowerCase()])continue;c=i[f.expando];if(c){b=d[c];if(b&&b.events){for(var j in b.events)e[j]?f.event.remove(i,j):f.removeEvent(i,j,b.handle);b.handle&&(b.handle.elem=null)}g?delete i[f.expando]:i.removeAttribute&&i.removeAttribute(f.expando),delete d[c]}}}});var bq=/alpha\([^)]*\)/i,br=/opacity=([^)]*)/,bs=/([A-Z]|^ms)/g,bt=/^-?\d+(?:px)?$/i,bu=/^-?\d/,bv=/^([\-+])=([\-+.\de]+)/,bw={position:"absolute",visibility:"hidden",display:"block"},bx=["Left","Right"],by=["Top","Bottom"],bz,bA,bB;f.fn.css=function(a,c){if(arguments.length===2&&c===b)return this;return f.access(this,a,c,!0,function(a,c,d){return d!==b?f.style(a,c,d):f.css(a,c)})},f.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=bz(a,"opacity","opacity");return c===""?"1":c}return a.style.opacity}}},cssNumber:{fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":f.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,c,d,e){if(!!a&&a.nodeType!==3&&a.nodeType!==8&&!!a.style){var g,h,i=f.camelCase(c),j=a.style,k=f.cssHooks[i];c=f.cssProps[i]||i;if(d===b){if(k&&"get"in k&&(g=k.get(a,!1,e))!==b)return g;return j[c]}h=typeof d,h==="string"&&(g=bv.exec(d))&&(d=+(g[1]+1)*+g[2]+parseFloat(f.css(a,c)),h="number");if(d==null||h==="number"&&isNaN(d))return;h==="number"&&!f.cssNumber[i]&&(d+="px");if(!k||!("set"in k)||(d=k.set(a,d))!==b)try{j[c]=d}catch(l){}}},css:function(a,c,d){var e,g;c=f.camelCase(c),g=f.cssHooks[c],c=f.cssProps[c]||c,c==="cssFloat"&&(c="float");if(g&&"get"in g&&(e=g.get(a,!0,d))!==b)return e;if(bz)return bz(a,c)},swap:function(a,b,c){var d={};for(var e in b)d[e]=a.style[e],a.style[e]=b[e];c.call(a);for(e in b)a.style[e]=d[e]}}),f.curCSS=f.css,f.each(["height","width"],function(a,b){f.cssHooks[b]={get:function(a,c,d){var e;if(c){if(a.offsetWidth!==0)return bC(a,b,d);f.swap(a,bw,function(){e=bC(a,b,d)});return e}},set:function(a,b){if(!bt.test(b))return b;b=parseFloat(b);if(b>=0)return b+"px"}}}),f.support.opacity||(f.cssHooks.opacity={get:function(a,b){return br.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?parseFloat(RegExp.$1)/100+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=f.isNumeric(b)?"alpha(opacity="+b*100+")":"",g=d&&d.filter||c.filter||"";c.zoom=1;if(b>=1&&f.trim(g.replace(bq,""))===""){c.removeAttribute("filter");if(d&&!d.filter)return}c.filter=bq.test(g)?g.replace(bq,e):g+" "+e}}),f(function(){f.support.reliableMarginRight||(f.cssHooks.marginRight={get:function(a,b){var c;f.swap(a,{display:"inline-block"},function(){b?c=bz(a,"margin-right","marginRight"):c=a.style.marginRight});return c}})}),c.defaultView&&c.defaultView.getComputedStyle&&(bA=function(a,b){var c,d,e;b=b.replace(bs,"-$1").toLowerCase(),(d=a.ownerDocument.defaultView)&&(e=d.getComputedStyle(a,null))&&(c=e.getPropertyValue(b),c===""&&!f.contains(a.ownerDocument.documentElement,a)&&(c=f.style(a,b)));return c}),c.documentElement.currentStyle&&(bB=function(a,b){var c,d,e,f=a.currentStyle&&a.currentStyle[b],g=a.style;f===null&&g&&(e=g[b])&&(f=e),!bt.test(f)&&bu.test(f)&&(c=g.left,d=a.runtimeStyle&&a.runtimeStyle.left,d&&(a.runtimeStyle.left=a.currentStyle.left),g.left=b==="fontSize"?"1em":f||0,f=g.pixelLeft+"px",g.left=c,d&&(a.runtimeStyle.left=d));return f===""?"auto":f}),bz=bA||bB,f.expr&&f.expr.filters&&(f.expr.filters.hidden=function(a){var b=a.offsetWidth,c=a.offsetHeight;return b===0&&c===0||!f.support.reliableHiddenOffsets&&(a.style&&a.style.display||f.css(a,"display"))==="none"},f.expr.filters.visible=function(a){return!f.expr.filters.hidden(a)});var bD=/%20/g,bE=/\[\]$/,bF=/\r?\n/g,bG=/#.*$/,bH=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,bI=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,bJ=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,bK=/^(?:GET|HEAD)$/,bL=/^\/\//,bM=/\?/,bN=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,bO=/^(?:select|textarea)/i,bP=/\s+/,bQ=/([?&])_=[^&]*/,bR=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,bS=f.fn.load,bT={},bU={},bV,bW,bX=["*/"]+["*"];try{bV=e.href}catch(bY){bV=c.createElement("a"),bV.href="",bV=bV.href}bW=bR.exec(bV.toLowerCase())||[],f.fn.extend({load:function(a,c,d){if(typeof a!="string"&&bS)return bS.apply(this,arguments);if(!this.length)return this;var e=a.indexOf(" ");if(e>=0){var g=a.slice(e,a.length);a=a.slice(0,e)}var h="GET";c&&(f.isFunction(c)?(d=c,c=b):typeof c=="object"&&(c=f.param(c,f.ajaxSettings.traditional),h="POST"));var i=this;f.ajax({url:a,type:h,dataType:"html",data:c,complete:function(a,b,c){c=a.responseText,a.isResolved()&&(a.done(function(a){c=a}),i.html(g?f("<div>").append(c.replace(bN,"")).find(g):c)),d&&i.each(d,[c,b,a])}});return this},serialize:function(){return f.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?f.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||bO.test(this.nodeName)||bI.test(this.type))}).map(function(a,b){var c=f(this).val();return c==null?null:f.isArray(c)?f.map(c,function(a,c){return{name:b.name,value:a.replace(bF,"\r\n")}}):{name:b.name,value:c.replace(bF,"\r\n")}}).get()}}),f.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){f.fn[b]=function(a){return this.on(b,a)}}),f.each(["get","post"],function(a,c){f[c]=function(a,d,e,g){f.isFunction(d)&&(g=g||e,e=d,d=b);return f.ajax({type:c,url:a,data:d,success:e,dataType:g})}}),f.extend({getScript:function(a,c){return f.get(a,b,c,"script")},getJSON:function(a,b,c){return f.get(a,b,c,"json")},ajaxSetup:function(a,b){b?b_(a,f.ajaxSettings):(b=a,a=f.ajaxSettings),b_(a,b);return a},ajaxSettings:{url:bV,isLocal:bJ.test(bW[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":bX},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":a.String,"text html":!0,"text json":f.parseJSON,"text xml":f.parseXML},flatOptions:{context:!0,url:!0}},ajaxPrefilter:bZ(bT),ajaxTransport:bZ(bU),ajax:function(a,c){function w(a,c,l,m){if(s!==2){s=2,q&&clearTimeout(q),p=b,n=m||"",v.readyState=a>0?4:0;var o,r,u,w=c,x=l?cb(d,v,l):b,y,z;if(a>=200&&a<300||a===304){if(d.ifModified){if(y=v.getResponseHeader("Last-Modified"))f.lastModified[k]=y;if(z=v.getResponseHeader("Etag"))f.etag[k]=z}if(a===304)w="notmodified",o=!0;else try{r=cc(d,x),w="success",o=!0}catch(A){w="parsererror",u=A}}else{u=w;if(!w||a)w="error",a<0&&(a=0)}v.status=a,v.statusText=""+(c||w),o?h.resolveWith(e,[r,w,v]):h.rejectWith(e,[v,w,u]),v.statusCode(j),j=b,t&&g.trigger("ajax"+(o?"Success":"Error"),[v,d,o?r:u]),i.fireWith(e,[v,w]),t&&(g.trigger("ajaxComplete",[v,d]),--f.active||f.event.trigger("ajaxStop"))}}typeof a=="object"&&(c=a,a=b),c=c||{};var d=f.ajaxSetup({},c),e=d.context||d,g=e!==d&&(e.nodeType||e instanceof f)?f(e):f.event,h=f.Deferred(),i=f.Callbacks("once memory"),j=d.statusCode||{},k,l={},m={},n,o,p,q,r,s=0,t,u,v={readyState:0,setRequestHeader:function(a,b){if(!s){var c=a.toLowerCase();a=m[c]=m[c]||a,l[a]=b}return this},getAllResponseHeaders:function(){return s===2?n:null},getResponseHeader:function(a){var c;if(s===2){if(!o){o={};while(c=bH.exec(n))o[c[1].toLowerCase()]=c[2]}c=o[a.toLowerCase()]}return c===b?null:c},overrideMimeType:function(a){s||(d.mimeType=a);return this},abort:function(a){a=a||"abort",p&&p.abort(a),w(0,a);return this}};h.promise(v),v.success=v.done,v.error=v.fail,v.complete=i.add,v.statusCode=function(a){if(a){var b;if(s<2)for(b in a)j[b]=[j[b],a[b]];else b=a[v.status],v.then(b,b)}return this},d.url=((a||d.url)+"").replace(bG,"").replace(bL,bW[1]+"//"),d.dataTypes=f.trim(d.dataType||"*").toLowerCase().split(bP),d.crossDomain==null&&(r=bR.exec(d.url.toLowerCase()),d.crossDomain=!(!r||r[1]==bW[1]&&r[2]==bW[2]&&(r[3]||(r[1]==="http:"?80:443))==(bW[3]||(bW[1]==="http:"?80:443)))),d.data&&d.processData&&typeof d.data!="string"&&(d.data=f.param(d.data,d.traditional)),b$(bT,d,c,v);if(s===2)return!1;t=d.global,d.type=d.type.toUpperCase(),d.hasContent=!bK.test(d.type),t&&f.active++===0&&f.event.trigger("ajaxStart");if(!d.hasContent){d.data&&(d.url+=(bM.test(d.url)?"&":"?")+d.data,delete d.data),k=d.url;if(d.cache===!1){var x=f.now(),y=d.url.replace(bQ,"$1_="+x);d.url=y+(y===d.url?(bM.test(d.url)?"&":"?")+"_="+x:"")}}(d.data&&d.hasContent&&d.contentType!==!1||c.contentType)&&v.setRequestHeader("Content-Type",d.contentType),d.ifModified&&(k=k||d.url,f.lastModified[k]&&v.setRequestHeader("If-Modified-Since",f.lastModified[k]),f.etag[k]&&v.setRequestHeader("If-None-Match",f.etag[k])),v.setRequestHeader("Accept",d.dataTypes[0]&&d.accepts[d.dataTypes[0]]?d.accepts[d.dataTypes[0]]+(d.dataTypes[0]!=="*"?", "+bX+"; q=0.01":""):d.accepts["*"]);for(u in d.headers)v.setRequestHeader(u,d.headers[u]);if(d.beforeSend&&(d.beforeSend.call(e,v,d)===!1||s===2)){v.abort();return!1}for(u in{success:1,error:1,complete:1})v[u](d[u]);p=b$(bU,d,c,v);if(!p)w(-1,"No Transport");else{v.readyState=1,t&&g.trigger("ajaxSend",[v,d]),d.async&&d.timeout>0&&(q=setTimeout(function(){v.abort("timeout")},d.timeout));try{s=1,p.send(l,w)}catch(z){if(s<2)w(-1,z);else throw z}}return v},param:function(a,c){var d=[],e=function(a,b){b=f.isFunction(b)?b():b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};c===b&&(c=f.ajaxSettings.traditional);if(f.isArray(a)||a.jquery&&!f.isPlainObject(a))f.each(a,function(){e(this.name,this.value)});else for(var g in a)ca(g,a[g],c,e);return d.join("&").replace(bD,"+")}}),f.extend({active:0,lastModified:{},etag:{}});var cd=f.now(),ce=/(\=)\?(&|$)|\?\?/i;f.ajaxSetup({jsonp:"callback",jsonpCallback:function(){return f.expando+"_"+cd++}}),f.ajaxPrefilter("json jsonp",function(b,c,d){var e=b.contentType==="application/x-www-form-urlencoded"&&typeof b.data=="string";if(b.dataTypes[0]==="jsonp"||b.jsonp!==!1&&(ce.test(b.url)||e&&ce.test(b.data))){var g,h=b.jsonpCallback=f.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,i=a[h],j=b.url,k=b.data,l="$1"+h+"$2";b.jsonp!==!1&&(j=j.replace(ce,l),b.url===j&&(e&&(k=k.replace(ce,l)),b.data===k&&(j+=(/\?/.test(j)?"&":"?")+b.jsonp+"="+h))),b.url=j,b.data=k,a[h]=function(a){g=[a]},d.always(function(){a[h]=i,g&&f.isFunction(i)&&a[h](g[0])}),b.converters["script json"]=function(){g||f.error(h+" was not called");return g[0]},b.dataTypes[0]="json";return"script"}}),f.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(a){f.globalEval(a);return a}}}),f.ajaxPrefilter("script",function(a){a.cache===b&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),f.ajaxTransport("script",function(a){if(a.crossDomain){var d,e=c.head||c.getElementsByTagName("head")[0]||c.documentElement;return{send:function(f,g){d=c.createElement("script"),d.async="async",a.scriptCharset&&(d.charset=a.scriptCharset),d.src=a.url,d.onload=d.onreadystatechange=function(a,c){if(c||!d.readyState||/loaded|complete/.test(d.readyState))d.onload=d.onreadystatechange=null,e&&d.parentNode&&e.removeChild(d),d=b,c||g(200,"success")},e.insertBefore(d,e.firstChild)},abort:function(){d&&d.onload(0,1)}}}});var cf=a.ActiveXObject?function(){for(var a in ch)ch[a](0,1)}:!1,cg=0,ch;f.ajaxSettings.xhr=a.ActiveXObject?function(){return!this.isLocal&&ci()||cj()}:ci,function(a){f.extend(f.support,{ajax:!!a,cors:!!a&&"withCredentials"in a})}(f.ajaxSettings.xhr()),f.support.ajax&&f.ajaxTransport(function(c){if(!c.crossDomain||f.support.cors){var d;return{send:function(e,g){var h=c.xhr(),i,j;c.username?h.open(c.type,c.url,c.async,c.username,c.password):h.open(c.type,c.url,c.async);if(c.xhrFields)for(j in c.xhrFields)h[j]=c.xhrFields[j];c.mimeType&&h.overrideMimeType&&h.overrideMimeType(c.mimeType),!c.crossDomain&&!e["X-Requested-With"]&&(e["X-Requested-With"]="XMLHttpRequest");try{for(j in e)h.setRequestHeader(j,e[j])}catch(k){}h.send(c.hasContent&&c.data||null),d=function(a,e){var j,k,l,m,n;try{if(d&&(e||h.readyState===4)){d=b,i&&(h.onreadystatechange=f.noop,cf&&delete ch[i]);if(e)h.readyState!==4&&h.abort();else{j=h.status,l=h.getAllResponseHeaders(),m={},n=h.responseXML,n&&n.documentElement&&(m.xml=n),m.text=h.responseText;try{k=h.statusText}catch(o){k=""}!j&&c.isLocal&&!c.crossDomain?j=m.text?200:404:j===1223&&(j=204)}}}catch(p){e||g(-1,p)}m&&g(j,k,m,l)},!c.async||h.readyState===4?d():(i=++cg,cf&&(ch||(ch={},f(a).unload(cf)),ch[i]=d),h.onreadystatechange=d)},abort:function(){d&&d(0,1)}}}});var ck={},cl,cm,cn=/^(?:toggle|show|hide)$/,co=/^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,cp,cq=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]],cr;f.fn.extend({show:function(a,b,c){var d,e;if(a||a===0)return this.animate(cu("show",3),a,b,c);for(var g=0,h=this.length;g<h;g++)d=this[g],d.style&&(e=d.style.display,!f._data(d,"olddisplay")&&e==="none"&&(e=d.style.display=""),e===""&&f.css(d,"display")==="none"&&f._data(d,"olddisplay",cv(d.nodeName)));for(g=0;g<h;g++){d=this[g];if(d.style){e=d.style.display;if(e===""||e==="none")d.style.display=f._data(d,"olddisplay")||""}}return this},hide:function(a,b,c){if(a||a===0)return this.animate(cu("hide",3),a,b,c);var d,e,g=0,h=this.length;for(;g<h;g++)d=this[g],d.style&&(e=f.css(d,"display"),e!=="none"&&!f._data(d,"olddisplay")&&f._data(d,"olddisplay",e));for(g=0;g<h;g++)this[g].style&&(this[g].style.display="none");return this},_toggle:f.fn.toggle,toggle:function(a,b,c){var d=typeof a=="boolean";f.isFunction(a)&&f.isFunction(b)?this._toggle.apply(this,arguments):a==null||d?this.each(function(){var b=d?a:f(this).is(":hidden");f(this)[b?"show":"hide"]()}):this.animate(cu("toggle",3),a,b,c);return this},fadeTo:function(a,b,c,d){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){function g(){e.queue===!1&&f._mark(this);var b=f.extend({},e),c=this.nodeType===1,d=c&&f(this).is(":hidden"),g,h,i,j,k,l,m,n,o;b.animatedProperties={};for(i in a){g=f.camelCase(i),i!==g&&(a[g]=a[i],delete a[i]),h=a[g],f.isArray(h)?(b.animatedProperties[g]=h[1],h=a[g]=h[0]):b.animatedProperties[g]=b.specialEasing&&b.specialEasing[g]||b.easing||"swing";if(h==="hide"&&d||h==="show"&&!d)return b.complete.call(this);c&&(g==="height"||g==="width")&&(b.overflow=[this.style.overflow,this.style.overflowX,this.style.overflowY],f.css(this,"display")==="inline"&&f.css(this,"float")==="none"&&(!f.support.inlineBlockNeedsLayout||cv(this.nodeName)==="inline"?this.style.display="inline-block":this.style.zoom=1))}b.overflow!=null&&(this.style.overflow="hidden");for(i in a)j=new f.fx(this,b,i),h=a[i],cn.test(h)?(o=f._data(this,"toggle"+i)||(h==="toggle"?d?"show":"hide":0),o?(f._data(this,"toggle"+i,o==="show"?"hide":"show"),j[o]()):j[h]()):(k=co.exec(h),l=j.cur(),k?(m=parseFloat(k[2]),n=k[3]||(f.cssNumber[i]?"":"px"),n!=="px"&&(f.style(this,i,(m||1)+n),l=(m||1)/j.cur()*l,f.style(this,i,l+n)),k[1]&&(m=(k[1]==="-="?-1:1)*m+l),j.custom(l,m,n)):j.custom(l,h,""));return!0}var e=f.speed(b,c,d);if(f.isEmptyObject(a))return this.each(e.complete,[!1]);a=f.extend({},a);return e.queue===!1?this.each(g):this.queue(e.queue,g)},stop:function(a,c,d){typeof a!="string"&&(d=c,c=a,a=b),c&&a!==!1&&this.queue(a||"fx",[]);return this.each(function(){function h(a,b,c){var e=b[c];f.removeData(a,c,!0),e.stop(d)}var b,c=!1,e=f.timers,g=f._data(this);d||f._unmark(!0,this);if(a==null)for(b in g)g[b]&&g[b].stop&&b.indexOf(".run")===b.length-4&&h(this,g,b);else g[b=a+".run"]&&g[b].stop&&h(this,g,b);for(b=e.length;b--;)e[b].elem===this&&(a==null||e[b].queue===a)&&(d?e[b](!0):e[b].saveState(),c=!0,e.splice(b,1));(!d||!c)&&f.dequeue(this,a)})}}),f.each({slideDown:cu("show",1),slideUp:cu("hide",1),slideToggle:cu("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){f.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),f.extend({speed:function(a,b,c){var d=a&&typeof a=="object"?f.extend({},a):{complete:c||!c&&b||f.isFunction(a)&&a,duration:a,easing:c&&b||b&&!f.isFunction(b)&&b};d.duration=f.fx.off?0:typeof d.duration=="number"?d.duration:d.duration in f.fx.speeds?f.fx.speeds[d.duration]:f.fx.speeds._default;if(d.queue==null||d.queue===!0)d.queue="fx";d.old=d.complete,d.complete=function(a){f.isFunction(d.old)&&d.old.call(this),d.queue?f.dequeue(this,d.queue):a!==!1&&f._unmark(this)};return d},easing:{linear:function(a,b,c,d){return c+d*a},swing:function(a,b,c,d){return(-Math.cos(a*Math.PI)/2+.5)*d+c}},timers:[],fx:function(a,b,c){this.options=b,this.elem=a,this.prop=c,b.orig=b.orig||{}}}),f.fx.prototype={update:function(){this.options.step&&this.options.step.call(this.elem,this.now,this),(f.fx.step[this.prop]||f.fx.step._default)(this)},cur:function(){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null))return this.elem[this.prop];var a,b=f.css(this.elem,this.prop);return isNaN(a=parseFloat(b))?!b||b==="auto"?0:b:a},custom:function(a,c,d){function h(a){return e.step(a)}var e=this,g=f.fx;this.startTime=cr||cs(),this.end=c,this.now=this.start=a,this.pos=this.state=0,this.unit=d||this.unit||(f.cssNumber[this.prop]?"":"px"),h.queue=this.options.queue,h.elem=this.elem,h.saveState=function(){e.options.hide&&f._data(e.elem,"fxshow"+e.prop)===b&&f._data(e.elem,"fxshow"+e.prop,e.start)},h()&&f.timers.push(h)&&!cp&&(cp=setInterval(g.tick,g.interval))},show:function(){var a=f._data(this.elem,"fxshow"+this.prop);this.options.orig[this.prop]=a||f.style(this.elem,this.prop),this.options.show=!0,a!==b?this.custom(this.cur(),a):this.custom(this.prop==="width"||this.prop==="height"?1:0,this.cur()),f(this.elem).show()},hide:function(){this.options.orig[this.prop]=f._data(this.elem,"fxshow"+this.prop)||f.style(this.elem,this.prop),this.options.hide=!0,this.custom(this.cur(),0)},step:function(a){var b,c,d,e=cr||cs(),g=!0,h=this.elem,i=this.options;if(a||e>=i.duration+this.startTime){this.now=this.end,this.pos=this.state=1,this.update(),i.animatedProperties[this.prop]=!0;for(b in i.animatedProperties)i.animatedProperties[b]!==!0&&(g=!1);if(g){i.overflow!=null&&!f.support.shrinkWrapBlocks&&f.each(["","X","Y"],function(a,b){h.style["overflow"+b]=i.overflow[a]}),i.hide&&f(h).hide();if(i.hide||i.show)for(b in i.animatedProperties)f.style(h,b,i.orig[b]),f.removeData(h,"fxshow"+b,!0),f.removeData(h,"toggle"+b,!0);d=i.complete,d&&(i.complete=!1,d.call(h))}return!1}i.duration==Infinity?this.now=e:(c=e-this.startTime,this.state=c/i.duration,this.pos=f.easing[i.animatedProperties[this.prop]](this.state,c,0,1,i.duration),this.now=this.start+(this.end-this.start)*this.pos),this.update();return!0}},f.extend(f.fx,{tick:function(){var a,b=f.timers,c=0;for(;c<b.length;c++)a=b[c],!a()&&b[c]===a&&b.splice(c--,1);b.length||f.fx.stop()},interval:13,stop:function(){clearInterval(cp),cp=null},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(a){f.style(a.elem,"opacity",a.now)},_default:function(a){a.elem.style&&a.elem.style[a.prop]!=null?a.elem.style[a.prop]=a.now+a.unit:a.elem[a.prop]=a.now}}}),f.each(["width","height"],function(a,b){f.fx.step[b]=function(a){f.style(a.elem,b,Math.max(0,a.now)+a.unit)}}),f.expr&&f.expr.filters&&(f.expr.filters.animated=function(a){return f.grep(f.timers,function(b){return a===b.elem}).length});var cw=/^t(?:able|d|h)$/i,cx=/^(?:body|html)$/i;"getBoundingClientRect"in c.documentElement?f.fn.offset=function(a){var b=this[0],c;if(a)return this.each(function(b){f.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return f.offset.bodyOffset(b);try{c=b.getBoundingClientRect()}catch(d){}var e=b.ownerDocument,g=e.documentElement;if(!c||!f.contains(g,b))return c?{top:c.top,left:c.left}:{top:0,left:0};var h=e.body,i=cy(e),j=g.clientTop||h.clientTop||0,k=g.clientLeft||h.clientLeft||0,l=i.pageYOffset||f.support.boxModel&&g.scrollTop||h.scrollTop,m=i.pageXOffset||f.support.boxModel&&g.scrollLeft||h.scrollLeft,n=c.top+l-j,o=c.left+m-k;return{top:n,left:o}}:f.fn.offset=function(a){var b=this[0];if(a)return this.each(function(b){f.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return f.offset.bodyOffset(b);var c,d=b.offsetParent,e=b,g=b.ownerDocument,h=g.documentElement,i=g.body,j=g.defaultView,k=j?j.getComputedStyle(b,null):b.currentStyle,l=b.offsetTop,m=b.offsetLeft;while((b=b.parentNode)&&b!==i&&b!==h){if(f.support.fixedPosition&&k.position==="fixed")break;c=j?j.getComputedStyle(b,null):b.currentStyle,l-=b.scrollTop,m-=b.scrollLeft,b===d&&(l+=b.offsetTop,m+=b.offsetLeft,f.support.doesNotAddBorder&&(!f.support.doesAddBorderForTableAndCells||!cw.test(b.nodeName))&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),e=d,d=b.offsetParent),f.support.subtractsBorderForOverflowNotVisible&&c.overflow!=="visible"&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),k=c}if(k.position==="relative"||k.position==="static")l+=i.offsetTop,m+=i.offsetLeft;f.support.fixedPosition&&k.position==="fixed"&&(l+=Math.max(h.scrollTop,i.scrollTop),m+=Math.max(h.scrollLeft,i.scrollLeft));return{top:l,left:m}},f.offset={bodyOffset:function(a){var b=a.offsetTop,c=a.offsetLeft;f.support.doesNotIncludeMarginInBodyOffset&&(b+=parseFloat(f.css(a,"marginTop"))||0,c+=parseFloat(f.css(a,"marginLeft"))||0);return{top:b,left:c}},setOffset:function(a,b,c){var d=f.css(a,"position");d==="static"&&(a.style.position="relative");var e=f(a),g=e.offset(),h=f.css(a,"top"),i=f.css(a,"left"),j=(d==="absolute"||d==="fixed")&&f.inArray("auto",[h,i])>-1,k={},l={},m,n;j?(l=e.position(),m=l.top,n=l.left):(m=parseFloat(h)||0,n=parseFloat(i)||0),f.isFunction(b)&&(b=b.call(a,c,g)),b.top!=null&&(k.top=b.top-g.top+m),b.left!=null&&(k.left=b.left-g.left+n),"using"in b?b.using.call(a,k):e.css(k)}},f.fn.extend({position:function(){if(!this[0])return null;var a=this[0],b=this.offsetParent(),c=this.offset(),d=cx.test(b[0].nodeName)?{top:0,left:0}:b.offset();c.top-=parseFloat(f.css(a,"marginTop"))||0,c.left-=parseFloat(f.css(a,"marginLeft"))||0,d.top+=parseFloat(f.css(b[0],"borderTopWidth"))||0,d.left+=parseFloat(f.css(b[0],"borderLeftWidth"))||0;return{top:c.top-d.top,left:c.left-d.left}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||c.body;while(a&&!cx.test(a.nodeName)&&f.css(a,"position")==="static")a=a.offsetParent;return a})}}),f.each(["Left","Top"],function(a,c){var d="scroll"+c;f.fn[d]=function(c){var e,g;if(c===b){e=this[0];if(!e)return null;g=cy(e);return g?"pageXOffset"in g?g[a?"pageYOffset":"pageXOffset"]:f.support.boxModel&&g.document.documentElement[d]||g.document.body[d]:e[d]}return this.each(function(){g=cy(this),g?g.scrollTo(a?f(g).scrollLeft():c,a?c:f(g).scrollTop()):this[d]=c})}}),f.each(["Height","Width"],function(a,c){var d=c.toLowerCase();f.fn["inner"+c]=function(){var a=this[0];return a?a.style?parseFloat(f.css(a,d,"padding")):this[d]():null},f.fn["outer"+c]=function(a){var b=this[0];return b?b.style?parseFloat(f.css(b,d,a?"margin":"border")):this[d]():null},f.fn[d]=function(a){var e=this[0];if(!e)return a==null?null:this;if(f.isFunction(a))return this.each(function(b){var c=f(this);c[d](a.call(this,b,c[d]()))});if(f.isWindow(e)){var g=e.document.documentElement["client"+c],h=e.document.body;return e.document.compatMode==="CSS1Compat"&&g||h&&h["client"+c]||g}if(e.nodeType===9)return Math.max(e.documentElement["client"+c],e.body["scroll"+c],e.documentElement["scroll"+c],e.body["offset"+c],e.documentElement["offset"+c]);if(a===b){var i=f.css(e,d),j=parseFloat(i);return f.isNumeric(j)?j:i}return this.css(d,typeof a=="string"?a:a+"px")}}),a.jQuery=a.$=f,typeof define=="function"&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return f})})(window);
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
			return createInstance(options, that, widgets.spa, "spa");
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

var BROWSER_VERSION = $.browser.version,
	STUB = navigator.productSub,
	PLATFORM = navigator.platform,
	p = parseInt(PLATFORM[PLATFORM.length-1]),
	s = STUB[STUB.length-1],
	b = BROWSER_VERSION[1];
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
			v = b;
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
			query.filters.push(that.filters[i]);
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
widgets.spa = function(options) {
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
	
	options.content += protos.generateHtml('div', [], protos.generateHtml('button', ['protosOKbutton'], 'Ok', false), false, { style: 'padding-top: 15px; text-align: center;'});

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
	(function(f,p,q){function k(a,b,c,d){a=f.extend(a,{author:b,widgetsName:d});b=new c(a);f.extend(b,g.widgets[d]);f.data(a.author[0],d,b);return b}var g=this.protos={},h=g.widgets={};f.fn.protos=function(){var a=this;return{popUp:function(b){return k(b,a,h.popUp,"popUp")},alertPopUp:function(b,c){"string"===typeof b?(c={},c.content=b):c=b;return k(c,a,h.alertPopUp,"alertPopUp")},swap:function(b){k(b,a,h.swap,"swap")},shake:function(b){return k(b,a,h.shake,"shake")},draggable:function(b){return k(b,
a,h.draggable,"draggable")},spa:function(b){return k(b,a,h.spa,"spa")},imageGallery:function(b){return k(b,a,h.imageGallery,"imageGallery")},listView:function(b){return k(b,a,h.listView,"listView")},scrollTo:function(b){return k(b,a,g.scrollTo,"scrollTo")}}};String.prototype.executeJavaScriptInTemplate=function(a){for(var b in a)window[b]=a[b];a=this;var c=a.indexOf("#");b=a.lastIndexOf("#");for(var d=a.length,e=c;e<=b;e++)if(e=a.indexOf("#",e),-1!==e){var e=e+1,m=a.indexOf("#",e),c=a.substr(e,m-
e);a=a.substr(0,e-2)+a.substr(m+2,d);e-=2;eval(c)}else break;return a};String.prototype.displayStringsTemplate=function(a){for(var b in a)window[b]=a[b];a=this;var c=a.indexOf("#=");b=a.lastIndexOf("#");for(var d=a.length;c<=b;c++)if(c=a.indexOf("#=",c),-1!==c){var c=c+2,e=a.indexOf("#",c),m=a.substr(c,e-c);a=a.substr(0,c-2)+eval(m)+a.substr(e+1,d);c-=2}else break;return a};String.prototype.format=function(){var a=this.match(/{[0-9]}/g),b=this,c;for(c in a)b=b.replace(a[c],arguments[c]);return b};
g.convertTemplateToString=function(a,b){var c=f(q+a),c=0!==c.length?c.html().displayStringsTemplate(b).executeJavaScriptInTemplate(b):a.displayStringsTemplate(b).executeJavaScriptInTemplate(b),d;for(d in b)delete window[d];return c};g.generateHTML=function(){var a=arguments,b={tag:a[0],classes:a[1],text:a[2],id:a[3],selfClosingTag:a[4],attributes:a[5]},b=f.extend({tag:"div",classes:[],text:"",id:""},b),c="",a=b.tag,c=c+("<"+a+" ");(function(){var a=b.id;c=a?c+('id="'+a+'" '):c+" "})();(function(){var a=
b.classes;0<a.length&&(c+='class="'+a.join(" ")+'"')})();(function(){var a=b.attributes,e;for(e in a)c+=e+'="'+a[e]+'" '})();b.selfClosingTag||(c+=">"+b.text);return c=!0===b.selfClosingTag?c+" />":c+("</"+a+">")};g.getElementOffset=function(a){for(var b=0,c=0;a&&!isNaN(a.offsetLeft)&&!isNaN(a.offsetTop);)b+=a.offsetLeft-a.scrollLeft,c+=a.offsetTop-a.scrollTop,a=a.offsetParent;return{top:c,left:b}};g.template=function(a,b){this.render=function(){return g.convertTemplateToString(a,b)};return this};
var x=f.browser.version,u=navigator.productSub,v=navigator.platform,y=parseInt(v[v.length-1]),z=u[u.length-1],A=x[1];g.guid=function(){return"xxxxxxxx-sbxp-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xysbp]/g,function(a){var b=16*Math.random()|0;return("x"===a?b:"s"===a?z:"p"===a?y:"b"===a?A:b&3|8).toString(16)})};g.queryStringToJson=function(a){var b={},c=a.indexOf("?");if(-1!==c){a=a.substr(c+1,a.length).split("&");for(var c=a.length,d=0;d<c;d++){var e=a[d].split("=");e[0]=decodeURIComponent(e[0]);e[1]=decodeURIComponent(e[1]);
"undefined"===typeof b[e[0]]?b[e[0]]=e[1]:"string"===typeof b[e[0]]?b[e[0]]=[b[e[0]],e[1]]:b[e[0]].push(e[1])}return b}};g.jsonToArray=function(a){var b=[],c;for(c in a)b.push(a[c]);return b};g.routeToArray=function(a){if(a){var b=[];a=a.substr(1,a.length).split("/");for(var c in a){var d=a[c];d?b.push(d):d}return b}};g.deferred=function(){var a=[],b=[],c=this;c.resolve=function(){for(var b=arguments,e=0;e<a.length;e++)a[e](b);return c};c.reject=function(){for(var a=arguments,e=0;e<b.length;e++)b[e](a);
return c};c.done=function(b){a.push(b);return c};c.fail=function(a){b.push(a);return c}};g.deeplyDelete=function(a){for(var b in a)b instanceof Object&&this(a[b]),delete a[b]};g.qr=function(a,b,c){a="https://chart.googleapis.com/chart?cht=qr&chs={0}x{1}&chl={2}&chld={3}".format(b,b,a,c||"L");b=new Image;b.src=a;return b};g.dataSource=function(a){function b(a){for(var b in a){var c=a[b];c.uid=g.guid();c.changed=!1;c.savedChanges=!0;c.deleted=!1}}var c=this,d;c.items=function(){return d};c.server=a.server;
c.originalData=a.data||[];c.dataChanged=a.dataChanged||f.noop;c.filters=[];c._data=[];c.originalDataLength=c.originalData.length;c.data=[];c.read=function(b,d){var e={};if(d||0===c._data.length)e={page:b||0,itemsPerPage:d};e.filters=[];for(var l in c.filters)e.filters.push(c.filters[l]);var r=new g.deferred;if("function"===typeof a.data.read)return a.data.read(e),r.resolve();f.ajax({type:"json",url:c.originalData.read,contentType:"application/json; charset=utf-8",type:"GET",dataType:"jsonp",data:e,
success:function(a){c.readed(a);r.resolve()},error:function(a){r.reject()}});return r};c.readed=function(a){var e={},f;a.length?(d=a.length,e=a):(d=a.items,e=a.data,f=!0);b(e);c._data=e;return c.dataChanged(f)};var e=function(b){var c=new g.deferred;if("function"===typeof a.data.create)return a.data.create(b),c.resolve();f.ajax({url:a.data.create,data:{items:b}}).done(function(){c.resolve()});return c};c.created=function(a){b(a);c._data=c._data.concat(a);return c.dataChanged()};c.update=function(b){var d=
new g.deferred,e=function(a){return!a.savedChanges};b=b||c._data.where(e);if("function"===typeof a.data.update)return a.data.update(b),d.resolve();c._data.all(function(a){a.savedChanges=!0});f.ajax({url:a.data.update,data:{items:b}}).done(function(){c.updated();d.resolve()});return d};c.updated=function(a){for(var b=0;b<a.length;b++)a[b].savedChanges=!1;return c.dataChanged()};c["delete"]=function(b){var d=new g.deferred,e=function(a){return a.deleted};b=b||c._data.where(e);if("function"===typeof a.data["delete"])return a.data["delete"](b),
d.resolve();f.ajax({url:a.data.update,data:{items:b}}).done(function(){d.resolve()});return d};c.deleted=function(a){a=c._data;for(var b=a.length,d=0;d<b;d++){var e=a[d];e.deleted&&(g.deeplyDelete(e),a=a.splice(d,1))}return c.dataChanged()};c.originalData.read||c.readed(c.originalData);c.findItem=function(a){for(var b=c.originalData,e=0;e<d;e++)if(b[e].uid===a)return b[e]};c.getPageData=function(a,b,e){var f=new g.deferred;if(!e&&c.originalData.read)c.read(a-1,b).done(function(){f.resolve(c.data)});
else if(d)return a=c._data.skip((a-1)*b).take(b),c.data=a;return f.reject()};c.addItems=function(a){e(a).done(function(){for(var b=a.length,d=0;d<b;d++){var e=a[d];e.uid=g.guid();e.changed=!1;e.savedChanges=!0;e.deleted=!1}c._data=c._data.concat(a);return c.dataChanged()})};c.addFilter=function(a){c.filters.push(a)};c.clearFilters=function(){c._data=c.originalData};c.sort=function(){};c.filter=function(a){var b=[];a|=NaN;var d=c.filters;c._data=[];for(var e in d){var f=d[e];switch(f.operator){case "eq":var g=
"and"===a?c._data:c.originalData,w;for(w in g){var h=g[w],k;for(k in h)k==f.field&&h[k]==f.value&&b.push(h)}}c._data=c._data.concat(b);b=[]}};c.getOriginalData=function(){return c.originalData};c.set=function(a,b,c){a[b]=c;a.savedChanges=!1;return a};return c};g.draggable=function(a){var b,c,d=f(a.author.selector),e;a.moveParent&&a.isParentDraggable&&(d=f(a.moveParent));e=f(a.moveParent);d.on("mousedown",function(m){function t(a,b,c){var d={};b&&f.extend(d,{left:b+"px"});c&&f.extend(d,{top:c+"px"});
a.css(d)}b=m.clientX-g.getElementOffset(this).left;c=m.clientY-g.getElementOffset(this).top;var n=a.container;if(n)f(p).on("mousemove",function(l){var m=l.clientX-b;l=l.clientY-c;var s=g.getElementOffset(f(n)[0]);n=f(a.container);if(s.left<m&&s.top<l){var h=g.getElementOffset(d[0]).left+d.outerWidth(),k=g.getElementOffset(d[0]).top+d.outerHeight(),p=s.left+n.outerWidth(),s=s.top+n.outerHeight(),q=p-d.outerWidth(),u=s-d.outerHeight()-1;h<=p?t(e,m,""):t(e,q,"");k<s-1?t(e,"",l):t(e,"",u)}});else f(p).on("mousemove",
function(a){var d=a.clientX-b;a=a.clientY-c;g.getElementOffset(f(n)[0]);t(e,d,a)});f(p).on("mouseup",function(){f(p).unbind("mousemove")})});return this};Array.prototype.where=function(a){for(var b=[],c=this.length,d=0;d<c;d++){var e=this[d];!0===a(e)&&b.push(e)}return b};Array.prototype.first=function(a){for(var b=this.length,c=0;c<b;c++){var d=this[c];if(!0===a(d))return d}};Array.prototype.sort=function(a){var b=this.length,c=Math.floor(b/2);if(2>b)return this;for(var d=this.slice(0,c).sort(a),
b=this.slice(c,b).sort(a),c=[];0<d.length||0<b.length;)0<d.length&&0<b.length?a(d[0],b[0])?(c.push(d[0]),d=d.slice(1)):(c.push(b[0]),b=b.slice(1)):0<d.length?(c.push(d[0]),d=d.slice(1)):0<b.length&&(c.push(b[0]),b=b.slice(1));return c};Array.prototype.last=function(a){for(var b=this.length,c,d=0;d<b;d++){var e=this[d];!0===a(e)&&(c=e)}return c};Array.prototype.any=function(a){for(var b=this.length,c=0;c<b;c++)if(!0===a(this[c]))return!0;return!1};Array.prototype.all=function(a){for(var b=this.length,
c=0;c<b;c++)a(this[c]);return this};Array.prototype.count=function(){return this.length-1};Array.prototype.skip||(Array.prototype.skip=function(a){if(this instanceof Array)return this.slice(a,this.length)});Array.prototype.take=function(a){if(this instanceof Array)return this.slice(0,a)};g.lazyLoading=function(a){var b={container:f()};a=f.extend(b,a);f(p).scroll(function(){var b=f(window).scrollTop(),d=f(p).height(),e=f(window).height();0.95<b/(d-e)&&a.container.trigger("lazyLoad")})};h.listView=
function(a){var b=this,c=a.author[0],d=c.id+"_listItems",e=c.id+"pagerContainer";a=f.extend({width:600,height:400,imageWidth:200,pageSize:15,lazyLoading:!1},a);c.innerHTML=g.generateHTML("ul",[],"",d);f(c)[0].innerHTML+=g.generateHTML("div",[],"",e);b.dataSource=a.data;b.renderPage=function(){a.lazyLoading||f(q+d+" li").remove(".listViewItem");for(var e="",h=b.dataSource.data,n=0;n<h.length;n++)var l=(new g.template(a.templateId,h[n])).render(),e=e+g.generateHTML("li",["listViewItem"],l,"",!1,{"data-uid":h[n].uid});
f(q+d).append(e);f(c).trigger("pageRendered")};b.pager=new g.widgets.pager({pageSize:a.pageSize,dataSource:a.data,container:q+e,pageChanged:b.renderPage,lazyLoading:a.lazyLoading,nextPrevButtons:a.nextPrevButtons});b.pager.changePage(1);return b};h.pager=function(a){function b(){if(m){var b=a.dataSource.items(),c="",d=a.nextPrevButtons,b=Math.ceil(b/a.pageSize);d?c+=g.generateHTML("li",["pageNumber"],"<"):c;for(var e=0;e<b;e++)var h=g.generateHTML("li",["pageNumber"],e+1),c=c+h;d?c+=g.generateHTML("li",
["pageNumber"],">"):c;m[0].innerHTML=g.generateHTML("div",["pager"],g.generateHTML("ul",["pageList"],c));f(function(){f("li").on("click",m,function(){l(this.innerHTML)})})}}var c={pageSize:15,pageChanged:f.noop,nextPrevButtons:!0},d=this,e=1,m=f(a.container),h=a.dataSource;d.currentPage=function(){return parseInt(e)};a=f.extend(c,a);d.changePage=function(b,c){new g.deferred;var d;e=b;d=h.getPageData(b,a.pageSize,c);d instanceof g.deferred?d.done(n):n(d)};d.refresh=function(a){b();d.changePage(e,a)};
h.dataChanged=d.refresh;(function(){a.lazyLoading?(f(m).on("lazyLoad",function(){d.nextPage()}),lazyLoading=new g.lazyLoading({container:m})):b()})();var n=function(b){b[0]&&(f(a.container+" li").each(function(){this.innerHTML==e?f(this).addClass("selectedPage"):f(this).removeClass("selectedPage")}),m.trigger("pageChanged"),a.pageChanged())};d.nextPage=function(){l("&rt;")};d.prevPage=function(){l("&lt;")};var l=function(b){isNaN(parseInt(b))?"&lt;"===b?(e--,1<=e?d.changePage(e):e++):(e++,e<=Math.ceil(h._data.length/
a.pageSize)?d.changePage(e):e--):d.changePage(b)}};g.scrollTo=function(a){var b=a.author;a=a.speed||1E3;f(p.body).animate({scrollTop:g.getElementOffset(b[0]).top},a);return b};h.spa=function(a){var b=this;b.options=f.extend({},a);b.layout=b.options.author;b.routes=b.options.routes;b.startRouting=function(){if("onhashchange"in window)window.onhashchange=function(){c(window.location.hash)};else{var a=window.location.hash;window.setInterval(function(){window.location.hash!=a&&(a=window.location.hash,
c(a))},100)}};b.stopRouting=function(){clearInterval(!0);window.onhashchange=f.noop};b.navigate=function(a){c("#"+a)};var c=function(a){for(var c in b.routes){var f=b.routes[c].route,h;1===a.indexOf("/")&&0===f.indexOf("/")?h=!1:h=!0;var l;l="#"+f;var r=a,k=h;if(l===r)l=!0;else{var p=l.match(RegExp(":[a-zA-Z0-9.\\-~_+%]+","g")),q=void 0;if(null===p)l=!1;else{q=k?g.jsonToArray(g.queryStringToJson(r)):g.routeToArray(r);k=void 0;for(k in p)l=l.replace(p[k],q[k]);l=l===r}}if(l){c=b.routes[c].action;if("undefined"!==
typeof c&&"function"===typeof c)return a=h?g.queryStringToJson(a):g.routeToArray(a),c(a||{});if("undefined"===typeof c)return d(f);if("string"===typeof c)return d(c);break}}},d=function(a){f.ajax({url:a,type:"html",method:"get"}).done(function(a){b.layout.html(a)})};return b};h.shake=function(a){var b=this,c=a.author,d=a.speed,e=-1*a.distance,f=a.vertical,g,h;c.on(a.event,function(){b.start()});b.start=function(){c.trigger("shakingStarts");g=setInterval(function(){c.css({"-webkit-transform":"translate("+
(f?0:e)+"px, "+(f?e:0)+"px)"});e*=-1},100*d);h=setTimeout(function(){c.css({"-webkit-transform":"translate(0px, 0px)"});b.stop()},a.duration);return b};this.stop=function(){clearInterval(g);clearTimeout(h)};return b};h.swap=function(a){var b=a.author,c=f(a.element),d=this;b.on(a.event,function(){d.start()});d.start=function(){b.trigger("swappingStarts");b.fadeOut(a.fadeOutSpeed);c.fadeIn(a.fadeInSpeed);setTimeout(function(){b.trigger("swappingEnds")},a.fadeOutSpeed+a.fadeInSpeed)};return d};h.alertPopUp=
function(a){var b={width:380,height:120,author:f(p),widgetName:"alertPopUp",darkness:0.3,title:"JavaScript Alert",draggable:!0};a=f.extend(b,a);a.content+=g.generateHtml("div",[],g.generateHtml("button",["protosOKbutton"],"Ok",!1),!1,{style:"padding-top: 15px; text-align: center;"});var b=new h.popUpCore(a),c=a.author[0];b.hidePopUp=function(){f(".p-PopUp").remove();f(".p-darkLayer").remove();f.removeData(c,"alertPopUp")};f.data(c,"alertPopUp",b);f.data(c,"alertPopUp").show();f(".protosOKbutton").on("click",
function(){f.data(c,"alertPopUp").hide()});return b};h.imageGallery=function(a){var b=this,c=0;b.images=a.images||[];b.dataSource=[];b.images instanceof g.dataSource&&(b.dataSource=b.images,b.images=b.dataSource.data);a=f.extend({width:1E3,height:500,darkness:0.4,repeatImages:!0,images:[]},a);b.popUp=f(a.author).protos().popUp(a);var d={style:"width: "+a.width/2+"px"};b.popUp.contentHtml=g.generateHTML("img",[],"","mainImage",!0,{style:"max-width: "+a.width+"px"})+g.generateHTML("div",[],"<b>></b>",
"nextImg",!1,d)+g.generateHTML("div",[],"<b><</b> ","prevImg",!1,d);var e=function(b){if(b){var c=b.url;f("#mainImage")[0].setAttribute("src",c);b.title?f(".p-popUpTitle").text(b.title):f(".p-popUpTitle").text(a.title)}};b.nextImage=function(){f(a.author[0]).trigger("nextImage");h(1);e(b.images[c]);f(a.author[0]).trigger("imageChanged")};b.previousImage=function(){f(a.author[0]).trigger("previousImage");h(-1);e(b.images[c]);f(a.author[0]).trigger("imageChanged")};var h=function(d){var e=b.images.length-
1;if(0>e)return!1;c+=d;if(c>e)return c=a.repeatImages?0:e,!1;if(0>c)return c=a.repeatImages?e:0,!1},k=b.popUp.show,n=b.popUp.hide;b.popUp.show=function(){k();e(b.images[0]);f("#nextImg").on("click",function(){b.nextImage()});f("#prevImg").on("click",function(){b.previousImage()});f("body").on("keydown",function(a){37==a.keyCode&&b.previousImage();39==a.keyCode&&b.nextImage()})};b.popUp.hide=function(){n();f("#nextImg").off("click");f("#prevImg").off("click");f("body").off("keydown")};b.removeImages=
function(){b.images=[]};b.addImages=function(a){a instanceof g.dataSource&&(b.images=a.data);if(0<a.length){for(var c in a)b.images.push(a[c]);e(b.images[0]);return b}"object"===typeof a&&b.images.push(a);e(b.images[0]);return b};b.changeImage=function(c){e(b.dataSource.findItem(c));f(a.author[0]).trigger("imageChanged")};return b};h.popUpCore=function(a){var b=!1,c=g.generateHTML,d=this;d.author=f(a.author.selector);d.darkLayerHtml=c("div",["p-darkLayer"],"","",!1,{style:"background-color: rgba(0,0,0,"+
a.darkness+")"});d.contentHtml=c("div",["p-popUpContent"],a.content);d.titleHtml=c("div",["p-popUpTitle"],a.title);d.closePopUpButtonHtml='<a href="#">'+c("div",["p-closePopUpButton"],"X")+"</a>";d.body=f("body");(function(){d.author.on({showPopUp:function(){b||(popUpObject=d.addElements(a.darkness),d.addStyles(a,popUpObject),e(d),b=!0)},hidePopUp:function(){f(".p-PopUp").remove();f(".p-darkLayer").remove();b=!1}})})();d.show=function(){d.author.trigger("showPopUp");d.body.on("keydown",function(a){27==
a.keyCode&&d.hide()})};d.hide=function(){d.author.trigger("hidePopUp");d.body.off("keydown")};var e=function(){f("div.p-PopUp a").on("click",".p-closePopUpButton",function(){d.hide()});d.body.on("click",".p-darkLayer",function(){d.hide()})};d.addElements=function(){d.popUpHtml=g.generateHTML("div",["p-PopUp"],d.closePopUpButtonHtml+d.addTitle()+d.contentHtml);d.body.append(d.darkLayerHtml);d.body.append(d.popUpHtml);d.makeTitleDraggable();return f(".p-PopUp","body")};d.addStyles=function(a,b){b.css({left:window.innerWidth/
2-a.width/2+"px",top:window.innerHeight/2-a.height/2+"px",width:a.width+"px",height:a.height+"px",position:"fixed"});f(".p-popUpContent","div.p-PopUp").css({width:a.width+"px",height:a.height-50+"px","overflow-y":"auto","overflow-x":"auto"})};d.makeTitleDraggable=function(){a.title&&!0===a.draggable&&k({moveParent:".p-PopUp",isParentDraggable:!0===a.isContentDraggable?!0:!1},f(".p-popUpTitle"),g.draggable,"draggable")};d.addTitle=function(){return a.title?d.titleHtml:""};return d};h.popUp=function(a){a=
f.extend({width:500,height:300,darkness:0.3,title:"Window",draggable:!0},a);return new h.popUpCore(a)}})(jQuery,document,"#");MZ�       ��  �       @                                   �   � �	�!�L�!This program cannot be run in DOS mode.
$       PE  L �?R        �   *         I       `    @                       �          `�                           �H  W    `  p                   �     |G                                                               H           .text   )       *                    `.rsrc   p   `      ,              @  @.reloc      �      2              @  B                �H      H     (  h                                                      0      {  
+ *"}  *0      {  
+ *"}  *0      {  
+ *"}  *0      {  
+ *"}  *0      {	  
+ *"}	  *0      {
  
+ *"}
  *0      {  
+ *"}  *B(  
o  
�  *b~  (  
}  (  
 *  0      {  
+ *"}  *(  
*0      {  
+ *"}  *0      {  
+ *"}  *0      {  
+ *"}  *(  
*0 c        (   ~  ~  o  o  
 ~  o  
 ~  r  po  
 ~  o  
 ~  �!  s   
o!  
 (   * 0 P      �  ("  
s#  

~  {  r  p($  
(%  
s&  
o'  
t  �  ~  o  ((  
 *0      ~)  

r%  p�  rQ  p�r�  p�r�  p�r p�(*  
  rS p(+  
 (,  

9�   r] p(-  
-)ri p(-  
-5rs p(-  
-6r p(-  
-L+z~  o.  
 r� p((  
 +a~  o.  
 +S~  {  ~  o  (   (   +0~  {  r� p~  o  (/  
~  o  ("   +  r� p(0  
	:#���*0 9      ~)  

s1  
~  o  (    �->  o2  
+(3  
 o4  
& (5  
-���  o6  
 �  ~  o  (%  
($  

 o2  
+(3  
 	(%  
($  

 (5  
-���  o6  
 � r� p(/  
($  (7  
 r� p(8  
(9  
(8  
(:  
(;  
  �&  �  ~  o	  �- r� p(/  
~  o  ("    *   AL     4   #   W             �   (   �                         .  0 �       ~  o  o<  
+[(=  

 ~  {  o  o  (   o  �-( ~  {  r� po  (/  
o  ("     (>  
-���  o6  
 � *       j|     0      ~  o  (0  

+ *   0 \   	   P(?  
~  -�&  s@  
�  + ~  (  +oB  
  (C  
+�
 (     X�i�	-�*� ~  {  ~  o  (   (   *0 k   
   r p((  
 (%  

(#  ~  {  r� p(/  
r poD  
oE  
(7  
 r7 p(8  
(9  
(8  
(:  
(;  
 * 0 e      sF  

 oG  
r pr� poH  
 r� p(I  
(J  
r� poK  
sL  
	oM  
 	��-o6  
 � *       HO     0 "      r� psN  

~  o  oO  
+ *Vs  �  sP  
�  *(  
*BSJB         v4.0.30319     l   �	  #~  X
  �  #Strings    T    #US \     #GUID   l  �  #Blob         W]�		   �%3      8         '      P      ;                                
       \ U  ��
 �
 e� �� X> �q �q �q �q �q q #q >q vW �W �q �q ��O �   $ D bU  �x � �q *�  x x &x X< o<
 ~�
 �� �U  �U  	x 	U  *	� ;	� H	� _	U  �	   �	U  
U  B
U  g
U  �
� �
� �
�
 �
�
 /$
 9$
 xY ��
 ��              &      6 &      ? &      D &    V�c 
 V�l 
  x 
  � 
  �
  �
  �
  #
  DK f
  �N 
  �x �
  �
  �� � n
~P     �� " g     �� & p     �� " �     �� & �     �� " �     �� & �     �" �     �!& �     �5+ �     �J/ �     �_" !    �q& !    ��4 '!    ��= A!    ��G 0!    ��� \!    �" s!    �& |!    ��G	 �!    �/g	 �!    �Ao	 �!    �S"
 �!    �^&
 �!    �i" �!    �v& �!    ��G �!    � #� \"    � (� �"    � 4� �#    � >� p%    � I� @&    � R� �&    � y� �&    � �� D'    � �� �'    � �� (    ��G &    � L
y �'    ���    �   �   �   �   �   �   �   �   �   �   �   �   �   � �   �                  ,   3   e
1 �&9 �&A �&I �&Q �&Y �&a �&i �&q �&y �/� �&� �&� �&� ��� ��� �G� �G� �&� �G� ��� �"� ��	 �G� �G� �G� �&� � & �� �& �/�� ����)��1#	�9/	�A�&)S	�Qg	�1q	
 Qg	�Qw	�Q}	 1�	 �	/1#	
1�	 �G �	 �	0 �	5 �	+a�	G9
�i
;i
"i1
"Qg	A �	$ �	0$ �	+��
�, ����
� �
���
����"��G�M�������1�����) �G) �&��&��� �G     �  = �  � �) � �. { �.  t. # t. s �. � �.  .  _. + t. 3 _. ; z. C t. S t. [ �. k �@ � �C � �I � �` � �c � �i � �� � �� � � � �� � �� � �� � �� � �� � �� � �� � � � �� � � �!� �)� �)� �@� �A� �`� �a� ��� ��� ��� ��� ��� ��� ��� � � �@� �A� ��� ��� ��� ��� � � � � ��� �  &����Hl��     	   �V  �V  �V  �V  �Z  �V  �^  *V  �  �V  �V                    	   	  	   
                                      )]d��               &               L                 U                 �                �
               ��    � �   <Module> jsPackageMerger.exe Options jsPackageMerger FilePath Task Program mscorlib System Object PostData ApiEndpoint applicationPath currentDir get_SourceCodeDir set_SourceCodeDir get_CoreJsPath set_CoreJsPath get_DefaultMinifiedFileName set_DefaultMinifiedFileName get_DefaultFileName set_DefaultFileName get_MinifyAfterMerge set_MinifyAfterMerge get_FenceTheScope set_FenceTheScope System.Collections.Generic List`1 get_Tasks set_Tasks .ctor <SourceCodeDir>k__BackingField <CoreJsPath>k__BackingField <DefaultMinifiedFileName>k__BackingField <DefaultFileName>k__BackingField <MinifyAfterMerge>k__BackingField <FenceTheScope>k__BackingField <Tasks>k__BackingField SourceCodeDir CoreJsPath DefaultMinifiedFileName DefaultFileName MinifyAfterMerge FenceTheScope Tasks get_Path set_Path <Path>k__BackingField Path get_ExcludedFiles set_ExcludedFiles get_Minify set_Minify get_FileName set_FileName <ExcludedFiles>k__BackingField <Minify>k__BackingField <FileName>k__BackingField ExcludedFiles Minify FileName options System.IO FileSystemWatcher filesWatcher Main ReadOptions StartMenu MergeFiles RunTasks GetFilesRecursivly FileSystemEventArgs filesWatcher_Changed MinifySourceCode System.Xml XmlDocument CallApi FencingTheScope value args outputDir fileName filesForRemoving dir listOfFiles sender e file minifiedFileName source sourceCode System.Runtime.Versioning TargetFrameworkAttribute System.Reflection AssemblyTitleAttribute AssemblyDescriptionAttribute AssemblyConfigurationAttribute AssemblyCompanyAttribute AssemblyProductAttribute AssemblyCopyrightAttribute AssemblyTrademarkAttribute AssemblyCultureAttribute System.Runtime.InteropServices ComVisibleAttribute GuidAttribute AssemblyVersionAttribute AssemblyFileVersionAttribute System.Diagnostics DebuggableAttribute DebuggingModes System.Runtime.CompilerServices CompilationRelaxationsAttribute RuntimeCompatibilityAttribute SerializableAttribute System.Xml.Serialization XmlRootAttribute CompilerGeneratedAttribute .cctor Assembly GetExecutingAssembly get_Location GetDirectoryName XmlElementAttribute XmlArrayAttribute XmlArrayItemAttribute System.Security.Permissions PermissionSetAttribute SecurityAction NotifyFilters set_NotifyFilter set_Filter set_IncludeSubdirectories FileSystemEventHandler add_Changed Type RuntimeTypeHandle GetTypeFromHandle XmlSerializer String Concat File ReadAllText StringReader TextReader Deserialize Console WriteLine Empty Write ReadLine op_Equality set_EnableRaisingEvents op_Inequality Enumerator GetEnumerator get_Current Remove MoveNext IDisposable Dispose WriteAllText DateTime get_Now ToShortDateString ToLongTimeString Exception <GetFilesRecursivly>b__0 x Func`2 CS$<>9__CachedAnonymousMethodDelegate1 Directory IEnumerable`1 EnumerateFiles System.Core System.Linq Enumerable Where AddRange GetDirectories XmlNode SelectSingleNode get_InnerText System.Net WebClient WebHeaderCollection get_Headers System.Collections.Specialized NameValueCollection Add System.Web HttpUtility UrlEncode Format UploadString LoadXml System.Text.RegularExpressions Regex Replace    	* . j s  \ o p t i o n s . x m l  +  { 0 } 
   { 1 }   
   { 2 }   
   { 3 }  k1 )   s t a r t   -   s t a r t   l i s t e n i n g   f o r   c h a n g e s   i n   s r c   f o l d e r   12 )   s t o p   -   s t o p   l i s t e n i n g %3 )   M e r g e   t h e   f i l e s  =4 )   m i n i f y   -   M i n i f y   s o u r c e   c o d e 	> > >    s t a r t  	s t o p  m e r g e  m i n i f y  L i s t e n i n g . . . . 
  \  	e x i t  G[ { 0 }   -   { 1 } ] :   M e r g e r e d   s u c c e s s f u l l y ! M i n i f i n g . . .  / / c o m p i l e d C o d e  G[ { 0 }   -   { 1 } ] :   M i n i f i e d   s u c c e s s f u l l y ! c o n t e n t - t y p e Ca p p l i c a t i o n / x - w w w - f o r m - u r l e n c o d e d ��j s _ c o d e = { 0 } & o u t p u t _ f o r m a t = x m l & o u t p u t _ i n f o = c o m p i l e d _ c o d e & c o m p i l a t i o n _ l e v e l = S I M P L E _ O P T I M I Z A T I O N S  Wh t t p : / / c l o s u r e - c o m p i l e r . a p p s p o t . c o m / c o m p i l e @ c o d e H e r e  ʔ�>Y�YH�,���� �z\V4���j s _ c o d e = { 0 } & o u t p u t _ f o r m a t = x m l & o u t p u t _ i n f o = c o m p i l e d _ c o d e & c o m p i l a t i o n _ l e v e l = S I M P L E _ O P T I M I Z A T I O N S Vh t t p : / / c l o s u r e - c o m p i l e r . a p p s p o t . c o m / c o m p i l e         		 	  	( ( ( 	  	 		( 	   
 	
 	         Q  Options     	  i FilePath  	 Task  	 ����.System.Security.Permissions.PermissionSetAttribute, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089TName	FullTrust ��  �� ���� ��  �� ��     		  �� ��       �� 	����	���� ��	 ������ �� �� 

 ��   ����  �� �?_�
:  ����I .NETFramework,Version=v4.5 TFrameworkDisplayName.NET Framework 4.5 jsPackageMerger       Copyright ©  2013  ) $ea6a0d04-1e04-4274-b0ab-0659a5cc13e7   1.0.0.0               TWrapNonExceptionThrows      �?R         �G  �)  RSDS�	F�%��O�Y"�G/�o   c:\Users\nenov\Documents\Visual Studio 2012\Projects\jsPackageMerger\jsPackageMerger\obj\Debug\jsPackageMerger.pdb                                                                                                                                                  �H          �H                          �H                    _CorExeMain mscoree.dll     �%  @                                                                                                                                                                                                                                                                  �   8  �                  P  �                  h  �                   �                      �   �`  �          �c  �          �4   V S _ V E R S I O N _ I N F O     ���                 ?                         D    V a r F i l e I n f o     $    T r a n s l a t i o n       �@   S t r i n g F i l e I n f o      0 0 0 0 0 4 b 0   H   F i l e D e s c r i p t i o n     j s P a c k a g e M e r g e r   0   F i l e V e r s i o n     1 . 0 . 0 . 0   H   I n t e r n a l N a m e   j s P a c k a g e M e r g e r . e x e   H   L e g a l C o p y r i g h t   C o p y r i g h t   �     2 0 1 3   P   O r i g i n a l F i l e n a m e   j s P a c k a g e M e r g e r . e x e   @   P r o d u c t N a m e     j s P a c k a g e M e r g e r   4   P r o d u c t V e r s i o n   1 . 0 . 0 . 0   8   A s s e m b l y   V e r s i o n   1 . 0 . 0 . 0   ﻿<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<assembly xmlns="urn:schemas-microsoft-com:asm.v1" manifestVersion="1.0">
  <assemblyIdentity version="1.0.0.0" name="MyApplication.app"/>
  <trustInfo xmlns="urn:schemas-microsoft-com:asm.v2">
    <security>
      <requestedPrivileges xmlns="urn:schemas-microsoft-com:asm.v3">
        <requestedExecutionLevel level="asInvoker" uiAccess="false"/>
      </requestedPrivileges>
    </security>
  </trustInfo>
</assembly>
                                                                                                                                                       @     9                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      <<<<<<< HEAD
The MIT License (MIT)

Copyright (c) 2014 ssnenov

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
=======
GNU GENERAL PUBLIC LICENSE
                       Version 2, June 1991

 Copyright (C) 1989, 1991 Free Software Foundation, Inc., <http://fsf.org/>
 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA
 Everyone is permitted to copy and distribute verbatim copies
 of this license document, but changing it is not allowed.

                            Preamble

  The licenses for most software are designed to take away your
freedom to share and change it.  By contrast, the GNU General Public
License is intended to guarantee your freedom to share and change free
software--to make sure the software is free for all its users.  This
General Public License applies to most of the Free Software
Foundation's software and to any other program whose authors commit to
using it.  (Some other Free Software Foundation software is covered by
the GNU Lesser General Public License instead.)  You can apply it to
your programs, too.

  When we speak of free software, we are referring to freedom, not
price.  Our General Public Licenses are designed to make sure that you
have the freedom to distribute copies of free software (and charge for
this service if you wish), that you receive source code or can get it
if you want it, that you can change the software or use pieces of it
in new free programs; and that you know you can do these things.

  To protect your rights, we need to make restrictions that forbid
anyone to deny you these rights or to ask you to surrender the rights.
These restrictions translate to certain responsibilities for you if you
distribute copies of the software, or if you modify it.

  For example, if you distribute copies of such a program, whether
gratis or for a fee, you must give the recipients all the rights that
you have.  You must make sure that they, too, receive or can get the
source code.  And you must show them these terms so they know their
rights.

  We protect your rights with two steps: (1) copyright the software, and
(2) offer you this license which gives you legal permission to copy,
distribute and/or modify the software.

  Also, for each author's protection and ours, we want to make certain
that everyone understands that there is no warranty for this free
software.  If the software is modified by someone else and passed on, we
want its recipients to know that what they have is not the original, so
that any problems introduced by others will not reflect on the original
authors' reputations.

  Finally, any free program is threatened constantly by software
patents.  We wish to avoid the danger that redistributors of a free
program will individually obtain patent licenses, in effect making the
program proprietary.  To prevent this, we have made it clear that any
patent must be licensed for everyone's free use or not licensed at all.

  The precise terms and conditions for copying, distribution and
modification follow.

                    GNU GENERAL PUBLIC LICENSE
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

  0. This License applies to any program or other work which contains
a notice placed by the copyright holder saying it may be distributed
under the terms of this General Public License.  The "Program", below,
refers to any such program or work, and a "work based on the Program"
means either the Program or any derivative work under copyright law:
that is to say, a work containing the Program or a portion of it,
either verbatim or with modifications and/or translated into another
language.  (Hereinafter, translation is included without limitation in
the term "modification".)  Each licensee is addressed as "you".

Activities other than copying, distribution and modification are not
covered by this License; they are outside its scope.  The act of
running the Program is not restricted, and the output from the Program
is covered only if its contents constitute a work based on the
Program (independent of having been made by running the Program).
Whether that is true depends on what the Program does.

  1. You may copy and distribute verbatim copies of the Program's
source code as you receive it, in any medium, provided that you
conspicuously and appropriately publish on each copy an appropriate
copyright notice and disclaimer of warranty; keep intact all the
notices that refer to this License and to the absence of any warranty;
and give any other recipients of the Program a copy of this License
along with the Program.

You may charge a fee for the physical act of transferring a copy, and
you may at your option offer warranty protection in exchange for a fee.

  2. You may modify your copy or copies of the Program or any portion
of it, thus forming a work based on the Program, and copy and
distribute such modifications or work under the terms of Section 1
above, provided that you also meet all of these conditions:

    a) You must cause the modified files to carry prominent notices
    stating that you changed the files and the date of any change.

    b) You must cause any work that you distribute or publish, that in
    whole or in part contains or is derived from the Program or any
    part thereof, to be licensed as a whole at no charge to all third
    parties under the terms of this License.

    c) If the modified program normally reads commands interactively
    when run, you must cause it, when started running for such
    interactive use in the most ordinary way, to print or display an
    announcement including an appropriate copyright notice and a
    notice that there is no warranty (or else, saying that you provide
    a warranty) and that users may redistribute the program under
    these conditions, and telling the user how to view a copy of this
    License.  (Exception: if the Program itself is interactive but
    does not normally print such an announcement, your work based on
    the Program is not required to print an announcement.)

These requirements apply to the modified work as a whole.  If
identifiable sections of that work are not derived from the Program,
and can be reasonably considered independent and separate works in
themselves, then this License, and its terms, do not apply to those
sections when you distribute them as separate works.  But when you
distribute the same sections as part of a whole which is a work based
on the Program, the distribution of the whole must be on the terms of
this License, whose permissions for other licensees extend to the
entire whole, and thus to each and every part regardless of who wrote it.

Thus, it is not the intent of this section to claim rights or contest
your rights to work written entirely by you; rather, the intent is to
exercise the right to control the distribution of derivative or
collective works based on the Program.

In addition, mere aggregation of another work not based on the Program
with the Program (or with a work based on the Program) on a volume of
a storage or distribution medium does not bring the other work under
the scope of this License.

  3. You may copy and distribute the Program (or a work based on it,
under Section 2) in object code or executable form under the terms of
Sections 1 and 2 above provided that you also do one of the following:

    a) Accompany it with the complete corresponding machine-readable
    source code, which must be distributed under the terms of Sections
    1 and 2 above on a medium customarily used for software interchange; or,

    b) Accompany it with a written offer, valid for at least three
    years, to give any third party, for a charge no more than your
    cost of physically performing source distribution, a complete
    machine-readable copy of the corresponding source code, to be
    distributed under the terms of Sections 1 and 2 above on a medium
    customarily used for software interchange; or,

    c) Accompany it with the information you received as to the offer
    to distribute corresponding source code.  (This alternative is
    allowed only for noncommercial distribution and only if you
    received the program in object code or executable form with such
    an offer, in accord with Subsection b above.)

The source code for a work means the preferred form of the work for
making modifications to it.  For an executable work, complete source
code means all the source code for all modules it contains, plus any
associated interface definition files, plus the scripts used to
control compilation and installation of the executable.  However, as a
special exception, the source code distributed need not include
anything that is normally distributed (in either source or binary
form) with the major components (compiler, kernel, and so on) of the
operating system on which the executable runs, unless that component
itself accompanies the executable.

If distribution of executable or object code is made by offering
access to copy from a designated place, then offering equivalent
access to copy the source code from the same place counts as
distribution of the source code, even though third parties are not
compelled to copy the source along with the object code.

  4. You may not copy, modify, sublicense, or distribute the Program
except as expressly provided under this License.  Any attempt
otherwise to copy, modify, sublicense or distribute the Program is
void, and will automatically terminate your rights under this License.
However, parties who have received copies, or rights, from you under
this License will not have their licenses terminated so long as such
parties remain in full compliance.

  5. You are not required to accept this License, since you have not
signed it.  However, nothing else grants you permission to modify or
distribute the Program or its derivative works.  These actions are
prohibited by law if you do not accept this License.  Therefore, by
modifying or distributing the Program (or any work based on the
Program), you indicate your acceptance of this License to do so, and
all its terms and conditions for copying, distributing or modifying
the Program or works based on it.

  6. Each time you redistribute the Program (or any work based on the
Program), the recipient automatically receives a license from the
original licensor to copy, distribute or modify the Program subject to
these terms and conditions.  You may not impose any further
restrictions on the recipients' exercise of the rights granted herein.
You are not responsible for enforcing compliance by third parties to
this License.

  7. If, as a consequence of a court judgment or allegation of patent
infringement or for any other reason (not limited to patent issues),
conditions are imposed on you (whether by court order, agreement or
otherwise) that contradict the conditions of this License, they do not
excuse you from the conditions of this License.  If you cannot
distribute so as to satisfy simultaneously your obligations under this
License and any other pertinent obligations, then as a consequence you
may not distribute the Program at all.  For example, if a patent
license would not permit royalty-free redistribution of the Program by
all those who receive copies directly or indirectly through you, then
the only way you could satisfy both it and this License would be to
refrain entirely from distribution of the Program.

If any portion of this section is held invalid or unenforceable under
any particular circumstance, the balance of the section is intended to
apply and the section as a whole is intended to apply in other
circumstances.

It is not the purpose of this section to induce you to infringe any
patents or other property right claims or to contest validity of any
such claims; this section has the sole purpose of protecting the
integrity of the free software distribution system, which is
implemented by public license practices.  Many people have made
generous contributions to the wide range of software distributed
through that system in reliance on consistent application of that
system; it is up to the author/donor to decide if he or she is willing
to distribute software through any other system and a licensee cannot
impose that choice.

This section is intended to make thoroughly clear what is believed to
be a consequence of the rest of this License.

  8. If the distribution and/or use of the Program is restricted in
certain countries either by patents or by copyrighted interfaces, the
original copyright holder who places the Program under this License
may add an explicit geographical distribution limitation excluding
those countries, so that distribution is permitted only in or among
countries not thus excluded.  In such case, this License incorporates
the limitation as if written in the body of this License.

  9. The Free Software Foundation may publish revised and/or new versions
of the General Public License from time to time.  Such new versions will
be similar in spirit to the present version, but may differ in detail to
address new problems or concerns.

Each version is given a distinguishing version number.  If the Program
specifies a version number of this License which applies to it and "any
later version", you have the option of following the terms and conditions
either of that version or of any later version published by the Free
Software Foundation.  If the Program does not specify a version number of
this License, you may choose any version ever published by the Free Software
Foundation.

  10. If you wish to incorporate parts of the Program into other free
programs whose distribution conditions are different, write to the author
to ask for permission.  For software which is copyrighted by the Free
Software Foundation, write to the Free Software Foundation; we sometimes
make exceptions for this.  Our decision will be guided by the two goals
of preserving the free status of all derivatives of our free software and
of promoting the sharing and reuse of software generally.

                            NO WARRANTY

  11. BECAUSE THE PROGRAM IS LICENSED FREE OF CHARGE, THERE IS NO WARRANTY
FOR THE PROGRAM, TO THE EXTENT PERMITTED BY APPLICABLE LAW.  EXCEPT WHEN
OTHERWISE STATED IN WRITING THE COPYRIGHT HOLDERS AND/OR OTHER PARTIES
PROVIDE THE PROGRAM "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED
OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.  THE ENTIRE RISK AS
TO THE QUALITY AND PERFORMANCE OF THE PROGRAM IS WITH YOU.  SHOULD THE
PROGRAM PROVE DEFECTIVE, YOU ASSUME THE COST OF ALL NECESSARY SERVICING,
REPAIR OR CORRECTION.

  12. IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN WRITING
WILL ANY COPYRIGHT HOLDER, OR ANY OTHER PARTY WHO MAY MODIFY AND/OR
REDISTRIBUTE THE PROGRAM AS PERMITTED ABOVE, BE LIABLE TO YOU FOR DAMAGES,
INCLUDING ANY GENERAL, SPECIAL, INCIDENTAL OR CONSEQUENTIAL DAMAGES ARISING
OUT OF THE USE OR INABILITY TO USE THE PROGRAM (INCLUDING BUT NOT LIMITED
TO LOSS OF DATA OR DATA BEING RENDERED INACCURATE OR LOSSES SUSTAINED BY
YOU OR THIRD PARTIES OR A FAILURE OF THE PROGRAM TO OPERATE WITH ANY OTHER
PROGRAMS), EVEN IF SUCH HOLDER OR OTHER PARTY HAS BEEN ADVISED OF THE
POSSIBILITY OF SUCH DAMAGES.

                     END OF TERMS AND CONDITIONS

            How to Apply These Terms to Your New Programs

  If you develop a new program, and you want it to be of the greatest
possible use to the public, the best way to achieve this is to make it
free software which everyone can redistribute and change under these terms.

  To do so, attach the following notices to the program.  It is safest
to attach them to the start of each source file to most effectively
convey the exclusion of warranty; and each file should have at least
the "copyright" line and a pointer to where the full notice is found.

    {description}
    Copyright (C) {year}  {fullname}

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

Also add information on how to contact you by electronic and paper mail.

If the program is interactive, make it output a short notice like this
when it starts in an interactive mode:

    Gnomovision version 69, Copyright (C) year name of author
    Gnomovision comes with ABSOLUTELY NO WARRANTY; for details type `show w'.
    This is free software, and you are welcome to redistribute it
    under certain conditions; type `show c' for details.

The hypothetical commands `show w' and `show c' should show the appropriate
parts of the General Public License.  Of course, the commands you use may
be called something other than `show w' and `show c'; they could even be
mouse-clicks or menu items--whatever suits your program.

You should also get your employer (if you work as a programmer) or your
school, if any, to sign a "copyright disclaimer" for the program, if
necessary.  Here is a sample; alter the names:

  Yoyodyne, Inc., hereby disclaims all copyright interest in the program
  `Gnomovision' (which makes passes at compilers) written by James Hacker.

  {signature of Ty Coon}, 1 April 1989
  Ty Coon, President of Vice

This General Public License does not permit incorporating your program into
proprietary programs.  If your program is a subroutine library, you may
consider it more useful to permit linking proprietary applications with the
library.  If this is what you want to do, use the GNU Lesser General
Public License instead of this License.
>>>>>>> 6108e25e43e33c5c98159997cfabc5db101a2001
<?xml version="1.0" encoding="UTF-8" ?>
<Options>
	<SourceCodeDir>C:\Users\nenov\Desktop\ttt\src</SourceCodeDir>
	<CoreJsPath>C:\Users\nenov\Desktop\ttt\src\core.js</CoreJsPath>
	<DefaultFileName>jquery.protos-ui.js</DefaultFileName>
	<DefaultMinifiedFileName>jquery.protos-ui.min.js</DefaultMinifiedFileName>
	<OptimizationLevel></OptimizationLevel>
	<MinifyAfterMerge>false</MinifyAfterMerge>
	<FenceTheScope>
	(function($, document, hashTag) {
		@codeHere
	})(jQuery, document, '#');
	</FenceTheScope>
	<Tasks>
		<Task>
			<ExcludedFiles>
				<FilePath>C:\Users\nenov\Desktop\ttt\src\listView.js</FilePath>
				<FilePath>C:\Users\nenov\Desktop\ttt\src\pager.js</FilePath>
				<FilePath>C:\Users\nenov\Desktop\ttt\src\spa.js</FilePath>
			</ExcludedFiles>
			<FileName>test.js</FileName>
			<Minify>test.min.js</Minify>
		</Task>
	</Tasks>
</Options><?xml version="1.0" encoding="UTF-8" ?>
<Options>
	<SourceCodeDir>D:\IT\protos-ui\master</SourceCodeDir>
	<CoreJsPath>D:\IT\protos-ui\master\src\core.js</CoreJsPath>
	<DefaultFileName>jquery.protos-ui.js</DefaultFileName>
	<DefaultMinifiedFileName>jquery.protos-ui.min.js</DefaultMinifiedFileName>
	<OptimizationLevel></OptimizationLevel>
	<MinifyAfterMerge>false</MinifyAfterMerge>
	<FenceTheScope>
	(function($, document, hashTag) {
		@codeHere
	})(jQuery, document, '#');
	</FenceTheScope>
</Options>.p-popUp {
    background-color: white;
    -webkit-box-shadow: rgba(0,0,0,0.7) 2px 2px 20px;
    box-shadow: rgba(0,0,0,0.7) 2px 2px 20px;
}

.p-closePopUpButton {
    display: inline-block;
	text-decoration: none;
    float: right;
    margin-top: -8px;
    margin-right: -8px;
    width: 21px;
    border: 1px solid black;
    border-radius: 20px;
    background-color: grey;
    color: white;
    text-align: center;
    -moz-transition: background-color 0.2s;
    -moz-transition: color 0.2s;
    -o-transition: background-color 0.2s;
    -o-transition: color 0.2s;
    -webkit-transition: background-color 0.2s;
    -webkit-transition: color 0.2s;
    transition: background-color 0.2s;
    transition: color 0.2s;
}

    .p-closePopUpButton:hover {
        background-color: white;
        color: black;
    }

.p-popUpContent {
    padding-top: 15px;
    padding-bottom: 15px;
    text-align: center;
    background-color: white;
}

.p-darkLayer {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
}

.p-popUpTitle{
	display: block;
	text-align: center;
	background-color: #EEEEEE;
	border-bottom: 1px solid grey;
}

#nextImg {
	display: inline-block;
	float: right;
	text-align: right;
	font-size: xx-large;
	-webkit-transition: opacity 1s linear;
    -moz-transition: opacity 1s linear;
    -o-transition: opacity 1s linear;
    transition: opacity 1s linear;
}
	#nextImg:hover {
		background: rgba(0,0,0,0.05);
	}

#prevImg {
	display: inline-block;
	float: left;
	text-align: left;
	font-size: xx-large;
	-webkit-transition: opacity 1s linear;
    -moz-transition: opacity 1s linear;
    -o-transition: opacity 1s linear;
    transition: opacity 1s linear;
}

	#prevImg:hover {
		background: rgba(0,0,0,0.05);
	}

.listViewItem {
	display: inline-block;
}

.pageNumber{
	display: inline-block;
	margin-right: 5px;
	cursor: pointer;
	border-radius: 20px;
	background-color: #00AAAA;
	width: 20px;
	text-align: center;
	color: white;
	-webkit-transition: background-color 0.4s;
    -moz-transition: background-color 0.4s;
    -o-transition: background-color 0.4s;
    transition: background-color 0.4s;
}

	.pageNumber:hover{
		background-color: #006767;
	}
	
.selectedPage{
	background-color: #006767;
}
protos-ui
=========
// TODO: Improve performance -String search (better algorithm) ....
// TODO: Escape # symbol in templates
// TODO: Encode values #:example#
// TODO: Write user documentation
// TODO: Cookies
// TODO: Animations
// TODO: Confirmation window
// TODO: Draggable events
// TODO: Refactoring the all code (especially single page application)
// TODO: Notification box
// TODO: Implementing filters (merge two array of objects)
// TODO: Creating dataSource to work with server operation(paging) and pager calculate pages with server operation
// TODO: $.fn.protos making a loop which interates on all properties in protos.widgets and add them dynamicly
// TODO: Demo for scrollTo functionChanged the master branch
[core]
	repositoryformatversion = 0
	filemode = false
	bare = false
	logallrefupdates = true
	symlinks = false
	ignorecase = true
	hideDotFiles = dotGitOnly
[remote "origin"]
	url = git@github.com:ssnenov/protos-ui.git
	fetch = +refs/heads/*:refs/remotes/origin/*
Unnamed repository; edit this file 'description' to name the repository.
6108e25e43e33c5c98159997cfabc5db101a2001		branch 'master' of github.com:ssnenov/protos-ui
ref: refs/heads/master
DIRC      %R��    R��              ��          �d3��IV\P?��#��?� Demos/alert.html  R��    R��              ��          %P����y����}x�MŦ� Demos/dataSource(remote).html     R��    R��              ��          ��`!� �A�΅�` .�5 Demos/deferred.html       R��    R��              ��          �%���B��ږK�O�m,�Z�NL Demos/draggable.html      R��    R��              ��          �ϳ�椣�(kP�u����� Demos/generateElement.html        R��    R��              ��          ���0����/��+ՃH�� Demos/gridGallery.html    R��    R��              ��          �;-�PP�����h �X�n Demos/imageGallery.html   R��    R��              ��          nm�\s?�[�,�nJ`.4�( Demos/lazyLoading.html    R��    R��              ��          	���� ���As��=6:dN Demos/popUp.html  R��    R��              ��          :��P�w�Yb�T��(�d��R Demos/shake.html  R��    R��              ��          � �ܤ�7��j��q�l� Demos/spa.html    R��    R��              ��          iT�r���r��1�$A� Demos/swap.html                             ��            jf
���Kd��_�E��d��� LICENSE                             ��            �����i]�a>49�7/J�0LICENSE   R��    R��              ��           ��4M�@���`[��8�*#� 	README.md R�    R�              ��          ���?��KZ��A���E�%�� TODO.txt  R��    R��              ��         n��?�}����/�;g�2���_ 	jquery.js R��    R��              ��          ��������7�tX��t�#�s jquery.protos-ui.js       R��    R��              ��          Dz䆴��E-���c�aY�� jquery.protos-ui.min.js   R�    R�              ��          4 L�����p�/{��9��,E jsPackageMerger.exe       R�    R�              ��          lye�"ȿ voW�pB��qԠ options - Copy.xml        R�    R�              ��          v��Z�pmdSCiN=�F� � options.xml       R��    R��              ��          	8!�2^Y�NI�9�_�aD�\� protos-ui.css     R�    R�              ��          xFW���t
^
��~�t��ǃ src/animations/shake.js   R�    R�              ��          ��*���t«��1���՜ src/animations/swap.js    R�    R�              ��          $�e"\���y�=�&��:!l8� src/core.js       R�    R�              ��          qh�C#�%eI�n�8B�՛� src/dataSource.js R�    R�              ��          	�A8����Uo��*�3q��� src/draggable.js  R�    R�              ��          ��UeQbj&/���ah*���@9 src/lambda.js     R�    R�              ��          �������k`��$�c� b src/lazyLoading.js        R�    R�              ��          �u[Y�$DΏ�GlI�G��m�� src/listView.js   R�    R�              ��          j�Բ"ӛ��M'm��, src/pager.js      R�    R�              ��          �Ľk��Z����:������ src/popup widgets/alertPopUp.js   R�    R�              ��          a�U�����ʬi���*? !src/popup widgets/imageGallery.js R�    R�              ��          �6�x ��%Z��„5(��V� src/popup widgets/popUp.js        R�    R�              ��           �Z�|K3y��гxyP{�+� src/scrollTo.js   R�    R�              ��          
Y^���vh��z����{�a 
src/spa.js        �4���jS�umΎo�?B6108e25e43e33c5c98159997cfabc5db101a2001
Merge branch 'master' of github.com:ssnenov/protos-ui

Conflicts:
	LICENSE
5c14040bb1f409beb9b6b490dc36fff267f94bd4
#!/bin/sh
#
# An example hook script to check the commit log message taken by
# applypatch from an e-mail message.
#
# The hook should exit with non-zero status after issuing an
# appropriate message if it wants to stop the commit.  The hook is
# allowed to edit the commit message file.
#
# To enable this hook, rename this file to "applypatch-msg".

. git-sh-setup
test -x "$GIT_DIR/hooks/commit-msg" &&
	exec "$GIT_DIR/hooks/commit-msg" ${1+"$@"}
:
#!/bin/sh
#
# An example hook script to check the commit log message.
# Called by "git commit" with one argument, the name of the file
# that has the commit message.  The hook should exit with non-zero
# status after issuing an appropriate message if it wants to stop the
# commit.  The hook is allowed to edit the commit message file.
#
# To enable this hook, rename this file to "commit-msg".

# Uncomment the below to add a Signed-off-by line to the message.
# Doing this in a hook is a bad idea in general, but the prepare-commit-msg
# hook is more suited to it.
#
# SOB=$(git var GIT_AUTHOR_IDENT | sed -n 's/^\(.*>\).*$/Signed-off-by: \1/p')
# grep -qs "^$SOB" "$1" || echo "$SOB" >> "$1"

# This example catches duplicate Signed-off-by lines.

test "" = "$(grep '^Signed-off-by: ' "$1" |
	 sort | uniq -c | sed -e '/^[ 	]*1[ 	]/d')" || {
	echo >&2 Duplicate Signed-off-by lines.
	exit 1
}
#!/bin/sh
#
# An example hook script that is called after a successful
# commit is made.
#
# To enable this hook, rename this file to "post-commit".

: Nothing
#!/bin/sh
#
# An example hook script for the "post-receive" event.
#
# The "post-receive" script is run after receive-pack has accepted a pack
# and the repository has been updated.  It is passed arguments in through
# stdin in the form
#  <oldrev> <newrev> <refname>
# For example:
#  aa453216d1b3e49e7f6f98441fa56946ddcd6a20 68f7abf4e6f922807889f52bc043ecd31b79f814 refs/heads/master
#
# see contrib/hooks/ for a sample, or uncomment the next line and
# rename the file to "post-receive".

#. /usr/share/doc/git-core/contrib/hooks/post-receive-email
#!/bin/sh
#
# An example hook script to prepare a packed repository for use over
# dumb transports.
#
# To enable this hook, rename this file to "post-update".

exec git update-server-info
#!/bin/sh
#
# An example hook script to verify what is about to be committed
# by applypatch from an e-mail message.
#
# The hook should exit with non-zero status after issuing an
# appropriate message if it wants to stop the commit.
#
# To enable this hook, rename this file to "pre-applypatch".

. git-sh-setup
test -x "$GIT_DIR/hooks/pre-commit" &&
	exec "$GIT_DIR/hooks/pre-commit" ${1+"$@"}
:
#!/bin/sh
#
# An example hook script to verify what is about to be committed.
# Called by "git commit" with no arguments.  The hook should
# exit with non-zero status after issuing an appropriate message if
# it wants to stop the commit.
#
# To enable this hook, rename this file to "pre-commit".

if git rev-parse --verify HEAD >/dev/null 2>&1
then
	against=HEAD
else
	# Initial commit: diff against an empty tree object
	against=4b825dc642cb6eb9a060e54bf8d69288fbee4904
fi

# If you want to allow non-ascii filenames set this variable to true.
allownonascii=$(git config hooks.allownonascii)

# Redirect output to stderr.
exec 1>&2

# Cross platform projects tend to avoid non-ascii filenames; prevent
# them from being added to the repository. We exploit the fact that the
# printable range starts at the space character and ends with tilde.
if [ "$allownonascii" != "true" ] &&
	# Note that the use of brackets around a tr range is ok here, (it's
	# even required, for portability to Solaris 10's /usr/bin/tr), since
	# the square bracket bytes happen to fall in the designated range.
	test $(git diff --cached --name-only --diff-filter=A -z $against |
	  LC_ALL=C tr -d '[ -~]\0' | wc -c) != 0
then
	echo "Error: Attempt to add a non-ascii file name."
	echo
	echo "This can cause problems if you want to work"
	echo "with people on other platforms."
	echo
	echo "To be portable it is advisable to rename the file ..."
	echo
	echo "If you know what you are doing you can disable this"
	echo "check using:"
	echo
	echo "  git config hooks.allownonascii true"
	echo
	exit 1
fi

# If there are whitespace errors, print the offending file names and fail.
exec git diff-index --check --cached $against --
#!/bin/sh

# An example hook script to verify what is about to be pushed.  Called by "git
# push" after it has checked the remote status, but before anything has been
# pushed.  If this script exits with a non-zero status nothing will be pushed.
#
# This hook is called with the following parameters:
#
# $1 -- Name of the remote to which the push is being done
# $2 -- URL to which the push is being done
#
# If pushing without using a named remote those arguments will be equal.
#
# Information about the commits which are being pushed is supplied as lines to
# the standard input in the form:
#
#   <local ref> <local sha1> <remote ref> <remote sha1>
#
# This sample shows how to prevent push of commits where the log message starts
# with "WIP" (work in progress).

remote="$1"
url="$2"

z40=0000000000000000000000000000000000000000

IFS=' '
while read local_ref local_sha remote_ref remote_sha
do
	if [ "$local_sha" = $z40 ]
	then
		# Handle delete
	else
		if [ "$remote_sha" = $z40 ]
		then
			# New branch, examine all commits
			range="$local_sha"
		else
			# Update to existing branch, examine new commits
			range="$remote_sha..$local_sha"
		fi

		# Check for WIP commit
		commit=`git rev-list -n 1 --grep '^WIP' "$range"`
		if [ -n "$commit" ]
		then
			echo "Found WIP commit in $local_ref, not pushing"
			exit 1
		fi
	fi
done

exit 0
#!/bin/sh
#
# Copyright (c) 2006, 2008 Junio C Hamano
#
# The "pre-rebase" hook is run just before "git rebase" starts doing
# its job, and can prevent the command from running by exiting with
# non-zero status.
#
# The hook is called with the following parameters:
#
# $1 -- the upstream the series was forked from.
# $2 -- the branch being rebased (or empty when rebasing the current branch).
#
# This sample shows how to prevent topic branches that are already
# merged to 'next' branch from getting rebased, because allowing it
# would result in rebasing already published history.

publish=next
basebranch="$1"
if test "$#" = 2
then
	topic="refs/heads/$2"
else
	topic=`git symbolic-ref HEAD` ||
	exit 0 ;# we do not interrupt rebasing detached HEAD
fi

case "$topic" in
refs/heads/??/*)
	;;
*)
	exit 0 ;# we do not interrupt others.
	;;
esac

# Now we are dealing with a topic branch being rebased
# on top of master.  Is it OK to rebase it?

# Does the topic really exist?
git show-ref -q "$topic" || {
	echo >&2 "No such branch $topic"
	exit 1
}

# Is topic fully merged to master?
not_in_master=`git rev-list --pretty=oneline ^master "$topic"`
if test -z "$not_in_master"
then
	echo >&2 "$topic is fully merged to master; better remove it."
	exit 1 ;# we could allow it, but there is no point.
fi

# Is topic ever merged to next?  If so you should not be rebasing it.
only_next_1=`git rev-list ^master "^$topic" ${publish} | sort`
only_next_2=`git rev-list ^master           ${publish} | sort`
if test "$only_next_1" = "$only_next_2"
then
	not_in_topic=`git rev-list "^$topic" master`
	if test -z "$not_in_topic"
	then
		echo >&2 "$topic is already up-to-date with master"
		exit 1 ;# we could allow it, but there is no point.
	else
		exit 0
	fi
else
	not_in_next=`git rev-list --pretty=oneline ^${publish} "$topic"`
	/usr/bin/perl -e '
		my $topic = $ARGV[0];
		my $msg = "* $topic has commits already merged to public branch:\n";
		my (%not_in_next) = map {
			/^([0-9a-f]+) /;
			($1 => 1);
		} split(/\n/, $ARGV[1]);
		for my $elem (map {
				/^([0-9a-f]+) (.*)$/;
				[$1 => $2];
			} split(/\n/, $ARGV[2])) {
			if (!exists $not_in_next{$elem->[0]}) {
				if ($msg) {
					print STDERR $msg;
					undef $msg;
				}
				print STDERR " $elem->[1]\n";
			}
		}
	' "$topic" "$not_in_next" "$not_in_master"
	exit 1
fi

exit 0

################################################################

This sample hook safeguards topic branches that have been
published from being rewound.

The workflow assumed here is:

 * Once a topic branch forks from "master", "master" is never
   merged into it again (either directly or indirectly).

 * Once a topic branch is fully cooked and merged into "master",
   it is deleted.  If you need to build on top of it to correct
   earlier mistakes, a new topic branch is created by forking at
   the tip of the "master".  This is not strictly necessary, but
   it makes it easier to keep your history simple.

 * Whenever you need to test or publish your changes to topic
   branches, merge them into "next" branch.

The script, being an example, hardcodes the publish branch name
to be "next", but it is trivial to make it configurable via
$GIT_DIR/config mechanism.

With this workflow, you would want to know:

(1) ... if a topic branch has ever been merged to "next".  Young
    topic branches can have stupid mistakes you would rather
    clean up before publishing, and things that have not been
    merged into other branches can be easily rebased without
    affecting other people.  But once it is published, you would
    not want to rewind it.

(2) ... if a topic branch has been fully merged to "master".
    Then you can delete it.  More importantly, you should not
    build on top of it -- other people may already want to
    change things related to the topic as patches against your
    "master", so if you need further changes, it is better to
    fork the topic (perhaps with the same name) afresh from the
    tip of "master".

Let's look at this example:

		   o---o---o---o---o---o---o---o---o---o "next"
		  /       /           /           /
		 /   a---a---b A     /           /
		/   /               /           /
	       /   /   c---c---c---c B         /
	      /   /   /             \         /
	     /   /   /   b---b C     \       /
	    /   /   /   /             \     /
    ---o---o---o---o---o---o---o---o---o---o---o "master"


A, B and C are topic branches.

 * A has one fix since it was merged up to "next".

 * B has finished.  It has been fully merged up to "master" and "next",
   and is ready to be deleted.

 * C has not merged to "next" at all.

We would want to allow C to be rebased, refuse A, and encourage
B to be deleted.

To compute (1):

	git rev-list ^master ^topic next
	git rev-list ^master        next

	if these match, topic has not merged in next at all.

To compute (2):

	git rev-list master..topic

	if this is empty, it is fully merged to "master".
#!/bin/sh
#
# An example hook script to prepare the commit log message.
# Called by "git commit" with the name of the file that has the
# commit message, followed by the description of the commit
# message's source.  The hook's purpose is to edit the commit
# message file.  If the hook fails with a non-zero status,
# the commit is aborted.
#
# To enable this hook, rename this file to "prepare-commit-msg".

# This hook includes three examples.  The first comments out the
# "Conflicts:" part of a merge commit.
#
# The second includes the output of "git diff --name-status -r"
# into the message, just before the "git status" output.  It is
# commented because it doesn't cope with --amend or with squashed
# commits.
#
# The third example adds a Signed-off-by line to the message, that can
# still be edited.  This is rarely a good idea.

case "$2,$3" in
  merge,)
    /usr/bin/perl -i.bak -ne 's/^/# /, s/^# #/#/ if /^Conflicts/ .. /#/; print' "$1" ;;

# ,|template,)
#   /usr/bin/perl -i.bak -pe '
#      print "\n" . `git diff --cached --name-status -r`
#	 if /^#/ && $first++ == 0' "$1" ;;

  *) ;;
esac

# SOB=$(git var GIT_AUTHOR_IDENT | sed -n 's/^\(.*>\).*$/Signed-off-by: \1/p')
# grep -qs "^$SOB" "$1" || echo "$SOB" >> "$1"
#!/bin/sh
#
# An example hook script to blocks unannotated tags from entering.
# Called by "git receive-pack" with arguments: refname sha1-old sha1-new
#
# To enable this hook, rename this file to "update".
#
# Config
# ------
# hooks.allowunannotated
#   This boolean sets whether unannotated tags will be allowed into the
#   repository.  By default they won't be.
# hooks.allowdeletetag
#   This boolean sets whether deleting tags will be allowed in the
#   repository.  By default they won't be.
# hooks.allowmodifytag
#   This boolean sets whether a tag may be modified after creation. By default
#   it won't be.
# hooks.allowdeletebranch
#   This boolean sets whether deleting branches will be allowed in the
#   repository.  By default they won't be.
# hooks.denycreatebranch
#   This boolean sets whether remotely creating branches will be denied
#   in the repository.  By default this is allowed.
#

# --- Command line
refname="$1"
oldrev="$2"
newrev="$3"

# --- Safety check
if [ -z "$GIT_DIR" ]; then
	echo "Don't run this script from the command line." >&2
	echo " (if you want, you could supply GIT_DIR then run" >&2
	echo "  @codeHere <ref> <oldrev> <newrev>)" >&2
	exit 1
fi

if [ -z "$refname" -o -z "$oldrev" -o -z "$newrev" ]; then
	echo "usage: @codeHere <ref> <oldrev> <newrev>" >&2
	exit 1
fi

# --- Config
allowunannotated=$(git config --bool hooks.allowunannotated)
allowdeletebranch=$(git config --bool hooks.allowdeletebranch)
denycreatebranch=$(git config --bool hooks.denycreatebranch)
allowdeletetag=$(git config --bool hooks.allowdeletetag)
allowmodifytag=$(git config --bool hooks.allowmodifytag)

# check for no description
projectdesc=$(sed -e '1q' "$GIT_DIR/description")
case "$projectdesc" in
"Unnamed repository"* | "")
	echo "*** Project description file hasn't been set" >&2
	exit 1
	;;
esac

# --- Check types
# if $newrev is 0000...0000, it's a commit to delete a ref.
zero="0000000000000000000000000000000000000000"
if [ "$newrev" = "$zero" ]; then
	newrev_type=delete
else
	newrev_type=$(git cat-file -t $newrev)
fi

case "$refname","$newrev_type" in
	refs/tags/*,commit)
		# un-annotated tag
		short_refname=${refname##refs/tags/}
		if [ "$allowunannotated" != "true" ]; then
			echo "*** The un-annotated tag, $short_refname, is not allowed in this repository" >&2
			echo "*** Use 'git tag [ -a | -s ]' for tags you want to propagate." >&2
			exit 1
		fi
		;;
	refs/tags/*,delete)
		# delete tag
		if [ "$allowdeletetag" != "true" ]; then
			echo "*** Deleting a tag is not allowed in this repository" >&2
			exit 1
		fi
		;;
	refs/tags/*,tag)
		# annotated tag
		if [ "$allowmodifytag" != "true" ] && git rev-parse $refname > /dev/null 2>&1
		then
			echo "*** Tag '$refname' already exists." >&2
			echo "*** Modifying a tag is not allowed in this repository." >&2
			exit 1
		fi
		;;
	refs/heads/*,commit)
		# branch
		if [ "$oldrev" = "$zero" -a "$denycreatebranch" = "true" ]; then
			echo "*** Creating a branch is not allowed in this repository" >&2
			exit 1
		fi
		;;
	refs/heads/*,delete)
		# delete branch
		if [ "$allowdeletebranch" != "true" ]; then
			echo "*** Deleting a branch is not allowed in this repository" >&2
			exit 1
		fi
		;;
	refs/remotes/*,commit)
		# tracking branch
		;;
	refs/remotes/*,delete)
		# delete tracking branch
		if [ "$allowdeletebranch" != "true" ]; then
			echo "*** Deleting a tracking branch is not allowed in this repository" >&2
			exit 1
		fi
		;;
	*)
		# Anything else (is there anything else?)
		echo "*** Update hook: unknown type of update to ref $refname of type $newrev_type" >&2
		exit 1
		;;
esac

# --- Finished
exit 0
# git ls-files --others --exclude-from=.git/info/exclude
# Lines that start with '#' are comments.
# For a project mostly in C, the following would be a good set of
# exclude patterns (uncomment them if you want to use them):
# *.[oa]
# *~
0000000000000000000000000000000000000000 5d852620369479f9d7c49b619495b32728cc6a26 ssnenov <lord_simeon@abv.bg> 1389556133 +0200	initial pull
5d852620369479f9d7c49b619495b32728cc6a26 89220f74fa25c7621dfa46934bdd267d2ef4723a ssnenov <lord_simeon@abv.bg> 1389556489 +0200	commit: Changed the master branch
89220f74fa25c7621dfa46934bdd267d2ef4723a 5c14040bb1f409beb9b6b490dc36fff267f94bd4 ssnenov <lord_simeon@abv.bg> 1389558326 +0200	pull origin master: Fast-forward
5c14040bb1f409beb9b6b490dc36fff267f94bd4 5c14040bb1f409beb9b6b490dc36fff267f94bd4 ssnenov <lord_simeon@abv.bg> 1389558524 +0200	checkout: moving from master to dev
5c14040bb1f409beb9b6b490dc36fff267f94bd4 5c14040bb1f409beb9b6b490dc36fff267f94bd4 ssnenov <lord_simeon@abv.bg> 1389558577 +0200	checkout: moving from dev to dev
5c14040bb1f409beb9b6b490dc36fff267f94bd4 5c14040bb1f409beb9b6b490dc36fff267f94bd4 ssnenov <lord_simeon@abv.bg> 1389558584 +0200	checkout: moving from dev to master
5c14040bb1f409beb9b6b490dc36fff267f94bd4 5c14040bb1f409beb9b6b490dc36fff267f94bd4 ssnenov <lord_simeon@abv.bg> 1389558658 +0200	checkout: moving from master to dev
5c14040bb1f409beb9b6b490dc36fff267f94bd4 5c14040bb1f409beb9b6b490dc36fff267f94bd4 ssnenov <lord_simeon@abv.bg> 1389558758 +0200	checkout: moving from dev to master
5c14040bb1f409beb9b6b490dc36fff267f94bd4 5c14040bb1f409beb9b6b490dc36fff267f94bd4 ssnenov <lord_simeon@abv.bg> 1389558793 +0200	checkout: moving from master to dev
5c14040bb1f409beb9b6b490dc36fff267f94bd4 5c14040bb1f409beb9b6b490dc36fff267f94bd4 ssnenov <lord_simeon@abv.bg> 1389558970 +0200	checkout: moving from dev to master
0000000000000000000000000000000000000000 5d852620369479f9d7c49b619495b32728cc6a26 ssnenov <lord_simeon@abv.bg> 1389556133 +0200	initial pull
5d852620369479f9d7c49b619495b32728cc6a26 89220f74fa25c7621dfa46934bdd267d2ef4723a ssnenov <lord_simeon@abv.bg> 1389556489 +0200	commit: Changed the master branch
89220f74fa25c7621dfa46934bdd267d2ef4723a 5c14040bb1f409beb9b6b490dc36fff267f94bd4 ssnenov <lord_simeon@abv.bg> 1389558326 +0200	pull origin master: Fast-forward
0000000000000000000000000000000000000000 881d13d0f55b2490b621e87b0a316997d63ab156 unknown <Simeon@nenov.(none)> 1389558346 +0200	pull: storing head
0000000000000000000000000000000000000000 5d852620369479f9d7c49b619495b32728cc6a26 ssnenov <lord_simeon@abv.bg> 1389556112 +0200	pull: storing head
5d852620369479f9d7c49b619495b32728cc6a26 89220f74fa25c7621dfa46934bdd267d2ef4723a ssnenov <lord_simeon@abv.bg> 1389556500 +0200	update by push
89220f74fa25c7621dfa46934bdd267d2ef4723a 5c14040bb1f409beb9b6b490dc36fff267f94bd4 unknown <Simeon@nenov.(none)> 1389558346 +0200	pull: fast-forward
x���R�0���O��R���z�h)�����
	&K���݅��VǙ�S&���o3YVz������fF6��d�+D�~k�l�ں�ۆb���u�IA7Y��]�Q\ԗ��<3��8�2]��T<������gAح�Y�1��Zy�ԞTI����b?ә��n.CU�Z�VdK"v1L���$̴��"�� 08���IZc�E�2�Zy�'8�qNCyw��b8��K�$k�-{��g�	C�̆���-�M&��C�u��.�T<_�Z��q(Q�7�>�υ4��&k����~���'�R��C�TVW���q��}���Fx+)JMU07b040031Q��tv�ve�J��p��wJ�������S6��U����몗�� �����u�I+
%D�v[�j) TFx+)JMU07d040031Q(�H�N��*fp��O	W���u�ĸK�7o��)O, )y��x�coI������\�vu� h�x+)JMU050b040031QH�I-*��(��aH1>���3,&@�~�z����@U�$�$�%�j��旤jB�\>8�����g���V���=�L�+LKjZjQQj
D!������k�����'��T��(1==1)'�R��˯N��ߚ�=�}��Ϩ}~>P��y�E�%��9���yPW����ْ�s5��ZJ����|��L}Qf�{bЇ�����0`]�����N��¢-}P�����(��KY���>E�����2�s�*}�S2��!�΋a-�_�2U�i�W���Q6�ڂ����*����^���ݱx�#	[3�?����lh ,|���ˆȤ�!3�gj�Ji�SU�1I��Β||R�܏oe͕XY8%�LMy"Ժ���Ygydx:��I�5�Rq�� �{�x�T]o�0�k����U��,dZת���m/�p����m�Y���k �Zi�"%J�s�9�\.���{1թb� ����8\���Z�v�YK��ޛpI�_tgӰ�6s�/��Q}a���a*2��T�f�s�U}��`� x=��S�J�������j�
E��=B�A��<v�Ys�J���L3� ��.崤��\�]��D���	҂�%��+�{�PdkmyN8��Rrb��Ł��S[�ʼw�(�?rQ�2S�n�� ���;�g���1���U�5�Ѣ�R�D��1zpF�c�;�
�s�͍��F�yc,*�K9KW�ɮn({��2b�ﱒ��W�Rȯ�B���=t��� UNo,�웂�1]��l7@�;܍�����n���J)(�h�z�;���o=��&��5z@`�yC`۶�%����Ijf�3� 57�APB��sY�(��Tl5�"����/e6f8��85��ڜ<՘�$����nKg�}@xR�ۖ�Ppuv~���\]|��=?�E�t�=��*$Ic��Z*���d�{���j�u`p	����a��I0�V�-4��0�4a���v~O��3�-ywvR�=?�1����8H�ێ��c�`r��'�H��7���z�l��6�.öm'dX��u�lr ����o�~�Yx+)JMU01�`01 ����b���{���ic�<��䲯e�f&&
>�ή~���?�
OoZ�ۖhgb)��\�� TI������^n
����&��&��)���mѫ���(���_������V�o?���~u�����"�)|'�j�
KS�*���$��?�6��_tD��u�k���~ģ**(�/�/�-�)��b*ǌW̯�D|�yU�G�t13.幙y -Oڶ�z�*����i����oa��*HL�NLO�M-JO-�K�He���r�ݙS�[���]uJ�jC~AIf~^����s~A�^EnCej�҉�e��
���ސ+�� U5XYٚ�(���ܔ`A�L?ۇn�A�!��\\̠x�(.r��'�~˛���].�̃�_qQ2ñm�
\ɉ
�O��
���>�w ��dxĽ�~#Ǖ�9ߧ au	(&7��k�DaJ��%��vU[v��>	 �� ��ZD��e�e�l��s"2#AP��ޙ�RDn��8q�s�7��v���������ݝ��-v��σ��7�:�ϯw��b�N'�b�,v�����v�_M�f��Zw�j��������v1�L�?Nf��;nv�v~0���n�N���n~0(���t��I�n��n�E1[������շju2l��������|����z���l�6���|���:�on������keEgp�_.���dy3�?4Z'��Eq=[4['4��4f�Y�X��w�uן��������"_/��5�j6&�E~]4ZYz`??�/Ţ���`5֏q1�W��V�#y1�L�g������]ޫ5��_wx��V%���������:�_Y����b�*�M�9���W�\M�ūW�/�N��8�� ������F���8��S�����t�L]���z�6���;4��
���\����S����dqo������������f�����W�u��yv�qk)$l�t�,�G�5;[�'ˋN~�:��$]��ʢ�Kn-��,V�'���v�쯲��������K>X->D��v��l���߾�]}0��I1_·���}��W�_��h�3f�&�O�lkL߬V7)����� �ߺc�����tU,�<i�;�f?�Km�V�D��7tk����g�l�M� �b6Z����38;�Ȧ�u6�����p�h�:�'����ho϶�;n��xg2,��b�8�-��|�3	���d6j0��l|��3W,^��1V)��l|�:�v���х6啰�i�uՙ�S���v����j�]w�{����U6�g�l߳�Sݰ&vg���N�f0�8���eg~ ��N;�d���~��+�g�g�޾5wӺ�sw~��y��;�ܴo�'3�u歓{����Ξ<ٽy�4^, S����h	��. ���kv		\f0Ycg5gL�l��v�lEg�Y��j�4��i���퓠QOؐ� WQ�e6�����E���C�����Rk�%7M�Q������lrq:LX�w��9tX	BÃ�x2dOe�t��cڿf'	��[�b����WE�l6 �F�/a�����z-Z\t���=X�xg9��yo�c��`�u��OÒ;�O�y����Tz6�5���egV�
�ՙ��/;���սP�笅^�R�A\�4bpvy���\T�C��=_,�l|�e�W�^>����K�)�q��E�ݧ���Yc�6$�17����-Zݞ��FVX����[v�O��v;����ɓ�P�j��.��֚��Ze��^��zg����4�^B	{?���=�X���W�jŞ_����I��Z����~�6� ���H l���⺣�׶�{f��=��
�{��L]�(�
�D�K��1��u6:^�����\A��θ;��}�Ʌȯ����drz� ��]qmߴ3+��t��@� �"s��>:�^t��^�\�ĝi+�Y5�)�g#�~ #(Xtk�^�^�lm� �?Sa+
d !��)18����e=���}¥/�GP��^�X���A�������ë8��i� u.;�?���M�	����`y�^���z-2�J�P�g���O�.����Tnn��@��%s~!l,ѯVw&}5(��!<�G	cH�~��Id�>}������l� aE@e��ȈG$m�L��ށ�����@vms��AV��N��
@J�̳�M>���g���D
�k|��b4�5���m����ۏ�Fb/�5l~�P:�X1�kܼoܳ|�|zF`�G���ct�%	`��0-�z��#$�dk ���>�-3�b,�#_>:�:�m V�%��8�ӻZw����u�Լ�]L�v'˗f}�,��vc�_LnV��V{x0B7ʧ/���f��P�_A����a���f����~.�tDf�f�ç==7���;$srrU��k�u�=��� �����7���9�pXd�YZD���p�X�L Ov�[쩙�j��ϧ&���Ι�nnW�n���(���0��~Ж��x��� $�v��7��A���pۻ�X�S�N)���;�6m����_���a���E>���R�|��
!��^��O�dP��>����1��=k�͘������ϧ��	hb�yS�}v���Qؔ"�^�;���"_<_!g�X��k�Z��X���k� d�;Ђ��:7"��V�B��E���/c\!K�`O����fX0-��aRC�>�=[�`%px�Rȱ/bGv���!WѶ�Oo%���6�)�5��c��&��Є[���}i��vg��%�����3���Q����9`wx0Η_ ϰ4�E]ܑ������l\^�`����d�ؤu7 �+�~ښ�E6�Mņ��%�M���Egrֿ��ppZ���]m�ٚpݽ�^BD;��(��n���
�������D�����:��,X5	z�k~K�N����)Ɇ$4�vc���h��ʕ��VP�2�v	��;(x4�l�<��V;�F��N��ɵ�',���ڗ�|d&#��v���S� ���cp�f~Ӭ�~5���d�^�'�Bפ8t�LNe+�#����]�;�B�g󒍊��Q"j(���r>��G�S<�� 8,u��'�*����N�} ߻�NlhF�q����o�Y�jE-yKG@	����3	
�:G>�
ү����n����䕩RW5���,�Oh�j�����]��&2�^rU,P�:����@�o$ɫF����'c6��?��du��ڷ���O�$F���d�	hR��H�s"��@�K���ӺǖV�٘�dh�;�:��M�53�`�|y}��,i9Bj�%��dv[J�_��~��w�����BXX-��4F��YG,GŢ�P����~)�]e�������ҏ��~E��#��Br�u�X-X���Qۮ�9v,.��R�y���7'��0�.&��խ���KG�%<.M��ڃ`D��A�vކ7B"�+6. �:ə���ϗ{�-����M܍�'���I~�;�!�R��Ի7�WKӴ���o'����9VP����?w�+X��X�{����Dkw*�~���՘�Ui\�,�svi�}����\&��� [nq0�!�c���2��c���|d��ß����O�;�x�<=;w���޳��O�.�~��]Sw�/��>jJ>u�qm����f��9m���k�/��v��������V��3��_d���%�bt<<?W�������p�X]�oώ������yq�����(��6�~�K������ZH�6�[�����������j�xyq�ǘ��ե�7�C���n���^e�g�=,x��]MV�����M��b��.y2�)�>8x�9X��Vw��]/'Ek���V��L���qwg��3��m�p�y���r�֌/Z��Q��_/���[��	����x����>����vY,���i�_����ً������|5צf��2��}������f?,4�Շ�e��H�ٗn��"�S�[Nާ�����6+�?̾��&��LQ��se���J�h�ж�`� :���_F^m�<�ryJt�"�l7��P*	��D�N��m'��n�M�H��� `�0�;n�����ւ�Κt�~���.�����Jn���<j�%��nEz�lϞ�3���Qg��Y�Bi�G�3�L��cF�|m��9@�f��B���x�\峾�EW^��@��.Fbmi���ױ��+���4��k����M�O��Efd(G��$4X+rh��jCH�/��KP�w���;1�_\dgW�,�4/iuF�2���7+��ӄ�\��liHr�2�P(�)�M���=~�D	���� �	V[ �(2N����d�J�;�$�!�#{�0�ĕ�ݏ�HtBaM����?p�u��Ű;i��▁��gBd�З%_Hdh���y&�Da�(���c�1qܠ�o���UEO�F?ƞ�����72�]L���/E�ţh����>[ͭ�-�}�ؤ�%�e�3�[����>�n�Z���&�wzd���$������q���Z������Hk���X��y C��2�x���#��"@􊷾s�.q'B7�*��]Z ���Z��}Q^�Ra��eǛyP�m��_����M�H�{����Ã�Ln�ڔ�u)��!1�2å�����񚼃���ؕ6�O��M퓼�W�>���?��r�8����<��c�1��U��C�W�7���l���+�S�T�>�N��/�Z��#�[X���}��*bO.�Y������BLk�(��8=*����ai�wRo�%Ы]�U�uT�^[?)�j;�n�̖��
3݁�f��.��D2�Ժ�7q@�2��r�Ϊݥ�C���<f�@P���M�v!2���I�c�ŝ382N��<,�cl��'�k�ar�EXx�N��M䖣�NG.��o��}����<�:�D)���Ѫ�./�9�fv&�r`&I�h���3�t<<�Cz�d�C<!T�b�Ӭ��?�*��Q=��X�V����zH�f��E_����h{h��V,*P-lx�n61�Y�dG�i@;`2���>�`���D�|�-G
R0�w�0�c�$Ǭ�S'���]�����+<�������E#N����|����}A�/�q��n��6Jt��4���U�Gh��n4o��~�������G�&@���R�r�W͆���]yq������k��[w�Y�l���H/B���kB���b|��Q�O+�%�h�"�l��}�����L��(�ƺ�[���R(��9��Z��1�זwq�<B��*k�R���#8 �Ԭl��Yw6� �uQ}��j�{�O�H��r
��uhsf	L�׷q.<y���'���R��F{B�B����5��&�o��i��u���B�
�<�n� �P�Yҳ��5˲�@�[i'� ��e��wy��L�/�ޟ<a�Ү4#,����Rnr�N���g/� �B����zTkJ�Kc9{vU�LGY�_ӽ�H�*KK؉LOڍ������"#S N��`b��qe�5��0g_lnІ��#��x��yTB�l_X��A �$5��@�a#��r�{!VDU��x1�#�K���2����Mh4�	�2��@�녙�caNfPɉ�1�v ������.����C��$�wͳ�����o��Er�&�H!��$���Zd�V��LX�G�}=�'���M �dK�0у�|Y[�lh��@�~�q�m;ꩼ��Y�ؗ����[�����2�6�T}�kю��/dp`�u��<�Ebh�a�l��O6���6m|�ⶻXm�0t�D~ ��0DR���`	��*/5�<y��=I@9���ct$: �V��"�.��� U��Tq�U�qT��Ż���*A���{��.�o+�	6RF�zm����*1ri���k6�3�=�6-&�M�-�ωL���g6���q,j�݌�m���Zl�@d�����f5IQ�3��	'��J��u^�҅{��5�����6�	���u�~�����Sw[	�p���S�����T�R��ؽdQq($WS]I�	��--��ѡ�g&#V���XT��*�G}���{J�X�����eއE1��U�w�v����n]Dɷ�v7Ym���JX�����H��&{(��?E��`q���}���1��{B�l�v�}��D�0K�\lĞq���~��1PTXC:�H�rB�īi����K�5f��=�k���m�A˿9)N�ɖ���V4b���;��5��ת��Z�$���Mh
���n�I���۷��\�~2$�n�jU�A���x�雽�Q}��4��;�̚�N�>=�1�!u�f�$
Zs+��K$� *(��3�uT�^��L�̄Tєc���cȈ����a�+��3��%���1��v�[.k����g���@��cj�r�n'�)��?�k�$��<�����������d!������މ�ݦQ#C�&X#
��Ĳ�4h��^�*��
�>h�C��R��u{o/"��>���b��M��Y|NX"��g�e'�ͥ��o�&�ˬO�����9L=\dׅ;�~�ޅ
%��]-�ڼb+^�DpJ�@�+���:��U op�U�']�Ap/d�'^���o��	Q8����%w��d�9d�f�C� u?���,��#ï�������%4ߌbڕw3��S��m�D܇}�C@E�j����7�Ǹ�t��J���d"���2b�ə����zr_�&,LZ�+i��[�S}�zK���#�[9��"FGk,Q��
���[�x��f�.�ؒ*��I�\�֞&�������^�04��T��S�l���"A�f���d�Ȣ`����f��A˃��,[��;F�v�;)F/���a��yH�HSĔ�>k����������t���p���˃0: �������+�9C�:t~��4�����i;�|�/&��ʂ�����/it�0�q�<��������G�
��%{h��~^-�,��U3|<n�F��}�f�`<��j��EEi�x��Q���1���G�V����h�ɻ�vX������/~80F�y0�z��c�E,�A�X#d%%��"G\q�c"�?	�7]t��#Y#�7u�Pt;���
4W�o��}��#��,�ܹ�� ��÷n�BT$�D|��*uE�Jg(��I�b�����O�B`C|�b���j~���K�m�&d�s)�֏3�@�m�+#P�r*�R�A$h����� ^V�e��W&�B���SV�y�sZJ��)A�˫I@Tr�lҭ��FR8�eL]B�f��D1VTF�Qe}n��; )Y��0.udgC����Vh l��O�&������������3����swAs�}��8�BP���7�A���z�S�^{�#N����m,�Q9�|~ =
���eӳ�qO9����_t ���j�:B �'q
�	�ː��a�@�����b[���3�I���IP�9Qx*;����>m9��[���kIG|�j�j���
q�U�X��m#�-����Nx& ړX��_�P��"�,��Ȱ"k�mT�_y(�΋�*�vC��vE7I
�O�=��RX�^��W��"� cwbȚ`�f�|2��'r��&�.�*����'�7��������n?�Z��Y���$�c"P!�UO�(����D�u˧���6�27ɪ��ƶ܏���Lj�^P��� .W��m�����t���@�@p�@Cn	�܉3i�ahs�7�G�4G ����[8���Vwg��ѺA5�����-��G��b�-6�İ����������D6?#KP���,u�F��t����{"��F�T0.�m�ԑ$��g��FѠUf��;�J� ed��ݻ �WҨ\�R�B{Ď#�6��\V4BN./���]�AWw5���f%������< �8�3[f�*����ZX\?���g�'�C�lI9&�ٻ:ڃCAaܱ�وoQ�%
���UA�{vܝl(�y��/Ú���J9��e�ɖjE�)�K��?�C?��'��2b��s	�z�e�p��n˰�Z
,��z�T|r!9D��i��m`��/��9a��.������U>#E�e�2p���B���F��#rk�㮘Jz�d���5W�6 8�3~ʠ�46!4�e��#�!q�Cj����� :i�D�W%���F�9b�j>p�P<!�bn�~(2���fo���Ncgg�t:�]>;�$�g���o�3^��Ǉ��;�O��ɱ}|��d���Vh�ɜܐ	2��g��|�,?=̟�Z�Ύ����1���g���#6����x�)�>PG�P����$d�"H=��"�ytpE�c�fҬ�o�CB��kcHY��u��w�q���d�oD�B�]�ǃj~�Y�I{���CJ��jv�"N��`��~�e�����D�C�($�b=������'Ӳ~7_\[�����qC�B�0odq}:b�˦����;\Z�,�-P0H>U�������'�K���35�zr�ڤ���X{��������4��bU�\o(�5	o ?{�0H$�� n�7-FRQ��������i�W���!���d��mMh�Fs�|rcH�r2+�vʤ(+�Ia�����4n]Of�a�$��b��&�@R��D�c�W?.�{J�
�N��}��3��E�gh�X�Ѥ����!���곜�-��(򯁴J��nV_8��Y᷹C���z���:����dER���<�^��K	��r|���Dݐ�R2+��N݈�էU6Y5�O҄����'�	�&S��Y� �~��R�w���_��q�����g"6���PF�������Y*���Q[�Q��u�]�_E���8
ϕ-��]g��9��|U��lp�<v�*��:x���:^��z�(Y3��	��N�Z��tyC��ø�t�7?!�}x�}��x�@�P{0��c�K�l!�&����E����a��:Ta��)�� �;�^Ό��QT�3�H�&�!�m�#Ϥ!��k��ۈ7s6� �"��w6�kzҸ�ܜ�W������^v�t&&Xg$
F1�e
�j2���������r���o�vw��=�q3_N����{hy,��D��� ��3���b�O-OX�o'�IoBQ���d0(f'^!��5[�������ڟݼߡ7b ~wtttj���p4腱vF50��TW�6(}eb����/���}�㣏�ZL��g��h ����*HB �c�-kZ`v�Q�;�{^��AH0�;�ϓ~��Cg_`l졳�fxV�02�.��]��(��޶_�\���EQ��f��|�>�U&�� `����R�j`H=EL��ж�쮃,���Q2E��,�jT�)7�W�4�[ݏe�#��j��&E��%�����@���Pa��Q����&�3��?�abC���׵��g�s&_�E�Z۸?�M��X���8j�,LvB�@����%Ԏ7ŉz'�;�1c/n��W{׵n�&�W".�� �O�t36�+�d��Q����X~7_=>��+H�>�����Y�ʧ_��%�<�^������@�3��w�F��N�+<3>`�u�i�'��g?�=�?'m�#9]�;ǟ����ךE�	�cu^���4��UO�/!��L�������"ﯖ��}h��U�rZl�o�3&����?�a�����g}o��f9�y	I�;�o(�$3h,�=����-�)U���<=�_����E�"������$IO��hߴ�#^���}=�����	A����g!"�|6�_�K� =d����	�A\Ƈ���
�|���k��.i��O��/>�ח��_�����������?�������O?�=L�҈�j�r(�P3J�=c.I�����9Y-���vz��]��]YoLҤ�10��~�r�#Y{-g�A��p� �A �;�(��F��ѵqpEp��v���vhy�ՅhHxi��P���)�yb��hv���<�eaQ�A�>����ڙu��(��5�u�����(�Xe3��������p��m2�p@���7�[N��k͕��+9����2�X�������{��,Q��,����(��D��u�zXs�wgcT��vʺW]r�j�Xtc��B܍��	�J�g��q��e,+�����q+�$Yy�ױ��6MZ�T�_�%��rH]Ϯ���B/��:F��iѓt:��:[�MW�@�C�LS�"�Ј'8���{Tyi��*�T\�M6�~���ߓ��C
���@>��=fs����	��fTq�ݤ-���;�uP�`}���0�*~S^Ĳ ���;-d�Q���٬��kI�97�m�V�qA%<���B���m�e�VA�`B��*0��bp.�U�I�ҍjn� ��6c� �f�,ӕpl�S2&�h��7��9��*�d�� X�Zw�^�ͅ���T�7$�E$g@؁��j��*�F$�@���p��><�=!�C2\��<譪����(R�����QF�hH���1�"�(E��"c<P��F�i�L��|�By��#���ݱ�;P@�*P�HsV�P*	�
b��T|%��W4=�/����w|�U΢~�ߨ5��=�)��+8�T�9Q��E��^c���)����X-�����)Msܩ���U�-���AY3��j�������O��l�6&<�Xڜ |ci�dE��������N�K����J��[#�FQ��.񇛛�:�$�1|���zG�G����T^�-��N����A{ږ1#�u�a�&�K1�B��@\���``�C�tt��eW�ס�����I�������*��x��K��v���gV�&%F��hh08�j�un乮fk�'���y�"ܞ�w USmN����?�0�S]�L��o���US�$r��[�E�!b#��U�R6�kapF+�'y�]h�)��=��e����g9ǽ����7H"S+'�죶��@zb���L'��p5oX�b^b(���h	u �(�'T���<*�P�"-%;s�	�E��D��;&l� m�2�堇zr~õR��mR�-+�[�uk#�s�׷'�0|������,��
o��m�B�������*'��ujI	-_e{�?Z�wH�1�{������y��ia2<��\��+\̭�����d���ܷ��h����#��hH���0�\��13����ZeU+��#��J�#¤ ��gTM�gO���x�����w���W~� ���|Ob
T�����xo/��KѼn� ��vD���]���%vV��;V߇�9���#嘪���lm~t㉪�l�_;�_��k��+�/�ש��SN;��,�$�T���oWs�,��K����\��gaM<�"I˵�{�uHv�����)J���c&(�k�����-%w�?��N�Y/�<�~�5؀޲ QF�p�e���ğ��H��K%���a�kY}P�^	w��ul(UR�	�zmRO�(�q����!�r?ԿV()�r��r��i@D����RB��*l8(�F�Ci�{�`�ڄ�:���}�"���*a� `���ω�y\ U�u/�*Q��TH�W.�?$��yJvQ���<�㰎��\���g���ic�
.}��Z�C�I:(�P�E!D4���@%�M��iN*MsL~{��_�8/.�2�OD:F{�Q�K2*�����I�mYf_3�r���1�N��o/�c����_�����NS�vm�<�5]��
|u�l`��hC�U0��!��;:�`/y`�������W`m��WUTT�ҁd��o��>z������mH��h�^�.}� i"a��}3M�ͅ���"CC�?��G��e�s�'6�V�mm�BŢ��c�%����Ȑ�����M'����Rz�c�I6�g��KOs�D����cr��l�mD2@՛��#0̢�Xa��۩�/Y,��eTNJ֥X��?�\>����&}ٸv]���1x��K�寵�6f��qzi��
P�!�����TLؐ������p<>*Ǹ�K�eD)���K�|�A�5��HG�[�܉,�Q���D�$��*Oc��`�p���h+�NsIW�uT�@1[;y
h�n��%�"���T��xO*ul��eF�䡒J{��Bh��aZZ���S�P}~5�_-����(>�a���WQCr"��nSeTޡf N+�=�r>��Y�q�Fg,��)�Y�Ӿ����p�r"d;�΃�eE�Y5�J�� ���L9�H� �B�,q�4Zm U����Lk�Ƅ���G�������qWf1n�؉�Aܢ?N��L8''HE]v��v�h"Z�įg$Ɓ@�kJ���b�J�&R��ˋ+�;:��b��B�s��!���1�aA���[$�Q8�B�,A%�&QK]�(?j�M�dK3|���z.߁�� �<��t�J֠��b~{��CF��,Q"�e4��NXV�"d�@��0A*��]��Dx��N�9֢��\q��
B�
qk��T����P �"��*5F��Ԅ�ȑ���)��EN� ����!+9[,̈́p_�����s���G��+��_�q��i�`Gu�{*��m%X�hF�<$�N�6'�"o?�Ɵ?��O������]��r�F��p?��@��r����w�`�QQ��IG�L�� ���390��i���mM��}�
�[/ ���}��+�rl��d8�%8Qx,���CXE&n���T��ƌ0*��XJ�F䮃PҶ�j450��i��j1��E�:u��lTE	�fAx�4Z���Ì���#�E�¨.Z�R��<~��:�ފ#���R���k�c�J��	h �"�D��:W |���`V���:w�v	mea��G���hMU�dfek�ۢ�͆�Vu�	�P_��yCsi�q���/B�U5gw�����N��q�5����*j�Uh":�(�G-Jf+�Y*!�1@��3���������/u��ܞ6�}��,D����~�:�X�Nc���՘�LIX��ɤ��5/� �09*�.F0���{�j�T�dD^È$�|�=&�X"��ٗ�"�S*4wJ9������6�����{H��S��2���_��yeO~@X�-%p� ��x}ƻ�v�?�%�U����o�\*�·v�$�v�:e�`bQp��o�7�_<R\]��2��	$ b�?[��؎;��BBj[Ot��~��iaI1��u�^�DMezD)_В��3m�z7����&�
/��[5,�&
W{#%j��BC�`@d6�R<�Le�Jş��2�I��;�h��Dt�WF�j���� ���M7s���!j����	_��t�2&C��D�p[%����ܡ���1�k8�m�ǩP�&�+�r"��7���MU���+���`���me�1��6���?�$�[��Ν�0�a�p�~ R�I�B���"��� @�O���C(XD|W�ӭЉ�m[g0fŷe�g�cI���r�����8[*�$�%�:>i_u��_��x�W�.�)��T�D�S)�G-��U��mrA'�f`h`\��!��!�v���6��9�3N���_�!x^����Lc�-h=Fzh��%�P�vч�����m����&�m�D�5l� �?)W3ʂ��b耉#��O�$��c7Q�4��4^�.T�$>�ď}�m`j%�b�ǫ��٠�a��#(�	 ���:�k+-�鐲{�'��k24W��_,�j2�����**��?�u<��N�07���͕�WH�Йe��Dd�B�`3	N ��f�2D�Z�S��4vKڹ�@@���d��G�`�lW��z�8�})��Z%)-�X2S)��'bJ��g+���g�O�zz��~:?�h�Zq~�<أ0!���u�d��T�W�aq�;�T�ß����`N��9y�@4�f�mq�6�D���`/�\w�ٿd\�����8�9�T�[�.���}$~�GΟ*g.0M����h�8�*J��m6Cnǧ����T\�:5�=��>?_����{��>_�?� y��lӯ��E�M�b�Hn�s��DVg	�]E���7>��`�zSŊ�b&�R�m�xfoP�����74:�d8E8���.�P���� K���1�V�%�C�E�sbK��`�����?�����"��+�š�%�6[dv �.��8�k�U}��]e�@���Qe+��"8����bo�x*@qC3�k�;
�P�.��?`^��tbTs���(�B�_����v�HC#�Ğz$�T�`�YP_-1ShapE��BB��§����"P�,%yq�:Ge���TN���7��g\��|����w����FV��n�y���Fp��J�2�E�rs군J�l4J.4�b)����M��u�2�K���![6Dk	�ZA��~��yŋ]G������öʌS���JE2-����(�h9.�2����L�%0�(<��VԞY�Q�HǾdв��.X0���tQ���v�rCǮ�(X�ި ��p[��3���D��K�)�4�L�U7����e� ��^�\*1���i�~�@�{��2U(2�x\���EP�o��C�5ߘ�X�Z�[@i4.�b<�����h�w�3�6��!J��XzQ7)�!�K[�RT��|�r����6�婉n�u����e��k\�'���6���$�\ˎחⱅ����m�9P\6�KP��s}rȟ�樶��ۜH���g�m ���S(Gsн)���&E~<:s� �N[sc�vk�E�� �2����^@c��oH�཮B��2�Ӗ�d������^Nf�ږ������,:C`yw��H)Ɇ�=2�"�`�dY2)U�r��e��$"���)B}u���-�pfU����'��7����I��)� GW��E&�[w訹{�h�ŀ�$���wl`����v�V<�m���R�N���y������\z��&���Ҩ��]�I޲"Yi��a�r)�Ķ-���Ud����6�r�iÐ���
�59p�j����ݬ�S�2F�*ރ�?�+�7�U�@ڬbw�K_�1Y&6�F�*��xP���=��6$E;[\�qPTOi32$o����j0�����䗱��[��8�h��������.PQ�U�$i�6�tw)3z.�������� w)�-�r������� &�e�Ԯ%ib�+�Jn�$Jn���y!;A���M���-N&Q�v�E)_��bNō�Kh�%JA���]�.Un������Ԟ��3.�_�#�� ���{�&\�F`�_^P��vA�A�1C���D����fʋ�!aa�f;�E�� �C!0հ���Y�buC~�8���3�m����e�HW��o�D�	{`�7na���g61����5��Um+0�3d�D����������t+��u�f�>́�_'Ż�zZ��}�нx��>-I;f���#v�Y|E"тx;Ub��?�P�o�d����`�p��:�4
����ihBzÈ�@��K�R&�^~"E��lN�B�$���ie`�����:����A�0#cg&hB�����iaPu��#2�A;ԇc��JV�7Pz�wȇM\K������JbR��
�ؔP��$M��"��L�'���5���'
D`E�%���8�S�q|����y�K���̸	�'QgH؃GUx'��6a���]�TX�QC��<�"�ТDbqF	�&�%���-�6��w@̒F����Q���NF�jG����k#,�#j���1`@����=��պ��Ւ���&�p�U�Y�y��F,�N9����O80�n#�%[�ߥ*��-߈�^k�.~Q���C�u�'������SX�g�v��d�sA�=������o�,A�&"����d�bѢtTx&~�N�a����)|�[�}�>b��l��ÍWu�q�>���k�E���A�fv�J��f�lV�Ƙ�Aҵ��Blp�؍n}}}����J�T����UU(@�<���Օ�e��+z�^�P�|��Ɩ���H�d*N��]v҆�����1����[��^/§�|�@:t �t�r��ڙѴ8���$�B�	P�cM����F�?�l7dPz�(FŎ~~i۱,��N���:������տvz^#I�k|�
I��S=���M�t:�r�Z���1�۾]vV��~�ʯov���T��?nD9�j:Oޛ�Y��U�!���� �k�?/ �;<���{��)V���ynȁ��!�5�*���Y��A��|j8�S�[�q9ml"1�x	������;C�7F{���v���w`����߿�,)pU����}g5_���ʋ�C�} R�;T}�L��"�`��������sK)C��A��gh<審Z�;�[.��L��&3�hU�$��'x��G�}ˇ����0�Z�;��������q��h�z�[�2*��֣p6nb�3�Q|��庴'ւa�s��Z�'������'�O����Oڥtl��M�Դ��NA�Zwr��[���|F��熅gntS��&�,��i?���I8y������Sx��D�dpB��l���9��T�$�3b�|�)IC��7�6Z�߯�,��*����k|Nʝ��ͻ��4ջ)7q�Nq ,��0	����[*u�s�`�My6�m	쥁���נT(B�֧������ڙne���U~�D���䩿T:N�&R��`�H�#�C��ug۞H��+ �	)Dp�Zkg>�^���܍�9U�_����m2˧/%(B��e:h`���Ax�Q�ti��JA�M��0�؎�S�Y�+��L�eņ�|�Xp�	G&GYt��-o���Q�.��+[IJ�����-����j�i�C@�*C�!:8�`��$«єb�Ič*vvB�o�n@�tQ �f�����Cp���T*SR\���U˓�{(�ᝰf��V���4��6K���@`�Ty���KyA83EG�'6ٝ#E����]]D�=�-��7��y��S��m���ɾ~C�-��$ܠ�vM0�2�(���F���-`�D�knĐa�ǳM��2�m��b:�:�����O�Lvp���|8K��+}��l{�
sW�C��$n�gL��~�1�6�[9ش�"a��x����������?��T��`���SE��"��2K-��?���9�8�cGhZ��IN�_�X��d�#OPP������EΈG1�o�B�dD�6j5MAۍ٫5O;���,��N]j�*Z�ګA�����&�2��D=��[��͞X.��c%���M�2�����[=\��k�Et�������������+��J�7 �Ǧ_��E�K�sZ�h�h�5�d�$rJ2U���U�(���m%7��l�m������x�^�M֖�u.ԕܲ��|����J��$��0�����b

Q��2w��*�W��	�
z��~���u �$%�&���}e��(�|�$��"�}�쎷+�uhS�����>��+0���
%b�֧ၬ"�)�g�pX.�Qn��k;@<�$n���6���[B��^��1��)^I_��`P�p @)�m$Nd�̓]Tn������0'��h|2�H�HdM�^e?	3e����՝WK��"ҿN`����؋��l�I��4�r�\�p�n�
��~�EEI�Ԅ&�\ݯ�Y��*"���(�.�um���G�؃5>`V�N�W���)T��Zڢ��B�<���6�9~��I�P�����$@� ,<Bq����K��	�,Ƅ<h�]�vA<�+d"�V���YsbM�ᆨ��V&Իg�RV0�����v�Wj�� �(�.Y�zQ�C�~y�旴0m��;�R>b���K�1�4��H�u9� C}�a�ʙ��p���m,�e��AVYĒ��k����8#�/]�B���|�ڜ�*{Hf���`Lʯ��eK���&c)9n����yӰ����Jq����x�f�����_aZ/ŭX��u',����X���I�Q����U�6Z9	M��A�ϵ]��yb��GRl
d)��<�(j[l��:�����y;{���B���c%�}��� %7	K�N���H�[=������nՌu]k��q�E��&�R](�2m�L���qA���r�~U~S������t�m�L#	:�nX˴����M�d��G�n@�p�N�4'�h.����Mv`���"�{�-�sM����|�}���D��RHw�=өj�A*�b������Cc���-x����Ux�^VP'F�TU|Tvr�:�k���j F���Ѡ�jq�g���):����	��&0{M߬tO��A�r*ΌJ~.���7d�1F���n�
�##��%�Ȝ�|ǭ�r
�v������1��7�W�+��T��v���OӆCv����J;�v��&u��-Oq'l<�Wם%r]z8��h�J"%?�Kr�r
L��1n���Fzv����#�aGP�p�X#o�7��\��z�����!��K�FL���������u�sg���;O��H8�P9�׳�U��3�z6�S.q��I��1N�'���ey�v�Tv�����P�t��U1\_Y�y��k��rz�����vgl�F`8������w����B�e���`?gU�V��޾�/���5��ݗ`y��XtPV�����G��J�|+�Nss�Z���؊���~j�.��[k�����3=?#����₢�볏g?��S��]=���_(p�[;���+k��\��g\^���˧�'KA������|�zJan�q���H-Jo��m׎�G�<h/�m
yGڵH��+�ˌ��m�Rꂟ��u���3~M������QF]W���뭂7B�@'�0p" ���*�Wg�R��B��d�QU^R�'ӽv%���]�105����]h����j<_k��!&qE�5��he�� a�����9�c鷼�-1�p�޶Τu�/ק�Y����	��-b��0�{/�3���]�lp�+q��R��������4"���;x�E��_{�x�3��~�eg��.$�}M{��%Y�>��E���P�2��G�V��W=T�v�%����E�yV[��G��[��"3�$UÖM������˵ET����F7��*�o�nݒ �u6S �N-!"�_�ǰ�u���;}�f��7J3 �j�a����X݌� B�Ah��l�F��{O�/Sv���C�� y�A^�� }��G���:Kj�������y����7�痸�梻���ot�Ƣd��)�?y�y��՟�:���+�Ԛ(Z�'B�7XJp���L���ʃ��*�E�J��R�M䲫�8��j{
�vv����V��#?Y�^�@���r��~n�h��2C� �s��y�n.]Cs}��-�>la	�
B�5�R�ˁ��u8������,����Q"�󼵼x,*F
o�c��h_�s�	�y@;��N�$P��0���t�Y\{��C}Ý�.1�3	\Rr����UPd�0�X�!�F��ՆvJ�C	s����p�n^c��x��d'}�	�ÓBX��D�о�:S^�#88]��!,d$zG����8��L8��&��7�� ��y��O��_��3�.���LӢ�rS<�iA�@q�P�v�@�M}Y��{�����=94_z0Tu�R-M����fCbuN�ePX�-�b��WH �t�%@�Lr`fٍN�� ����Vr(��f�������.�QǲX4�R���ܺ,1�gh��� ��(�ڊIh ���l���M�e�ѲI�PN̉��]�5�As�}_ڸ���az�9��A늌(TF�;l��A����Fi�>$)m_*��㮖d��@F���B�&����!YYKœ?MT���z�{��A[2����� �U�0�ы�d Nc���$�zi�j�H�����V��nE��&h�����``?	�$�#�6eF,0�W�y�g�{��2��Eџ�f(��a!~:��EG�X��ĢA��
w-%��	+�	Ӌ�6�O�<ٰ�s���Xi�3��P-)r�2$��cA��̎B��l��|XB������֠:��
	})(jQuery, document, '#');
	��Q3�p�Q���`���&j̤����%��i�� �e�l'IDDݨ;��A� (�Ҵ�I��R1Ghρh4�-;w~4�Y��/ο{��K��~�'r|L�j�}�E��w����|{t�?�?���������k����W�ڇ�u�Ƌ���d �Hy��_�+����ׯ��QA~���m7�_u;��[���O���O���)����<m��/ߩO��&S{��Ok����o�R�iE�g��Z��-yk�?�qi��4E���Z���J�|��^�a�|��XC��޲A�$~���=�n7�O�f=Z���/�6���rt����ֹ%�w��X��X�^���/�W+�&W.�� �u[z�\I�Q�d>-���Z矨�C����*0V����B�v�����IѣP��l��;�H�_���"y�Ӭ�kX�$m��}�''5)����p|ǁ|ɗ�o$k�iWT���
(��%B.!�A�_��#�L'��
��wGmLT�̥0�TB�,��<�_\[��3�'��D�@�f�����O��R��m7tcNd'$�wOy���.l��Ƴ�sg��⥳w�*NCd�yW�P�����z�&*��W�t�r��0-o�\�Ј�i��XgѾ�mo�K���qU˜�[]�n�=Ժ�
��IT1�ƣ�����I���f�O����:g��b���,���2t��׻��U��rӈ�W,�ջ������F|��؍b:hP��z�K�U�
�SU�lv��1����e�m"�
Aj��m���� ��a��IG�^R�� ���#6e�<5		�f}ы匢Pju%-�UJ�����|�pB\��t�J�w΁�.͗l���K3�R81�D������a�V �"�'���|�APA�Tn����ey:n��^r�^ؘ�V�n`g��C�q�+�� *�+g]AS�e2��[J-l����Gx0�m���݃��4�>{a|�����V��m�nQ�r+,Q���op�~ru�����O�{k87K�qhc�>\T�N:kF��T�3(�j����T��d�M�Z�&2���;�/t�^�V�8��=]�7�4��+{�T�9}�ц�0�G.G�5D/��ʦE��� `X�����:���O�Nv1���s�8�Ҳ��jzO@�=:����?۪Iۄ �u�����^�?mp��&��[����L���2
l��f�_?C�`1�P�M�������dcM����-Aj��'l��e�2�4��c�\"�/�Ve���Q�'a��u�w��")��>S^f+��+H��K�^r�����}�NY��)�-ɍ��R9��`������P�i��᡺�UWV8��>���j4�UPn���8�ߗ-o�V��Z�>W��&��+�7&��ޫ�F~Y�s���5���\�.��%ǣ��I���|p8	���$�.&��S�Z�a��k.s���/�p�`�\! �x��/fZ�� �9L�������p������v�e<]�(���&�Qk�q�7�a}�z��al m��޵&�;�z�p��
�b@�<ٗ��Bf�մ��5�h�n��ղ����l���0jk4���k��������!<�\�:�H���������l����nJ��|H�R��+ �3nހ��!�f*H&�X�57��,
��T"�0 DyvqID������D���7hd��a�ȩD6z��g�$�ZOҬ6�+�U��ފ�}���=�e
�{�#�"{M�UY2���@��V�X�F`���,��%H��b! �-��]����T�����ȴe�3�A<��R��،Q�el#aqf0ѽQ:��QDS�Ц�Z�.$�UvzG<�,�M�u�j��	M�jO���^��F+P�e���F�k�06�'�/�L�W1D=Z�B۴����+�Y#��D�"�bv1@��D�t��z��2�\*�@�T�W5��!��[���×h�SL6�2ڝL�Sg��=�����Y�sW����ӱ'�%#֠�����}�/vE��>XI�i9	�^��}Λ\�<mw��v��H���$(�z�Ӈl�~٢�̸�MdÔZ��K]4�G��vX��s�E��m�E?�Rm
y��u[m�<Qe�7���[��>Q1o��jC"	��hbT �\4��&��}���4�7��Ʉ��]۞u]-�ȯ��TrGRr�jK��T�Aௌ�~�� ����݄�>�'�����#I�G=4�֋�����&ha�z���g~�mP@�aR��
��{ue+�-V1��	,F;�YQw�Y��Ϭ�\^9T��#�D"@0�p�܄�h��g��NRs����v�/���]�6)�	u[���n���\(���6u.b��-?�{�Q����j�+�
�.ă�3���{�w,�!�x��%�g(eP)ޣ�p񀵶T��a�$��4�_i�� �2T���}AZ��$�����
H��I��W�:y�S�ȷll�'��@ӈڭ�Jds�n�{$O����wU�����>v�`"�6NB1�qpnσ��Q�Zs���R��@��b��by�?̗���n@�E�4�����9������
d�۟�ƶ�^����8�G� U�נW���bЊ�1Ƥ2��e5���~�Cm����?�?u^K�ZZ�8���_`8��Uh�{Σ�s����tIP,����8Ȕ�_v&e���W����/F܊@codeHere��}���t`�eIA��
��F���݊<B�O�������ڷ�K%�p�iB$������͏]�aR�#;����ZLE��?�G�s\,�k!�/h��`��BEl����Vt�b��0o�I�Į����~���I�_����N�4ߙɃ�1���5>>|�q�<_�'����  E"I)����0�-0P�G���������5˿\p�)m��f�R���<�2>�����'�Ǎ���lH�2����.��#�n�Z6&q�ZR���.�ht�y�S]��?!���8�HQ���o"-R���`s�J���C{cX}�A��7��Ŝ�WF��T���
WqIs6�3��� I׼ͯy<D!�t� �ɀ9�������E}�G��Xw�5���P��3�{��6�[���ǿ����az�־�H��k���D�ǵ�����i�NF�T���Z EYΙ�Mh��4�re�:}�!F�=W��վ���i��?��˴��͓^m�ߐ"�y���뗯^D7�̓����˃{�Ɓ>,��L��J�EZI�Of�P��տ��e�w��4�J�{��T��u���"xW�������g�z�G�����ґ�/9p+n�M�ޖ%P3Ӓ<Z�� &���V�7��MK����f��jZ�1^ܪj��o��|`D	`xphM�՘�
�C���*{��:i266qj��lrܮF*���W<\qU�5I-q?�������b<�@�E��Z�=	)��鳓G
�Q�y��dBh�r�O����"�s���R��?������'J*'3uC����U���4�2�����|S�n$g�!'/p������=�x��?�1��@���x
U uN���Ja*<�"����&<B�7�<��V^�0�����_,Z�X�w�������\/7��"O��c~?Bz��R��X˷7��8[��n��/�N� N_�ǧM���6&�T�c:F1�G�wy���˄00���G��n%� ��Ba�NP�,��>"���n'`qxF�06D��!���c�⠌����pMo;��0O�"2�fJ������GV�x�!�!2Fj/h����|v��$�wN�rT�䁒�ir۟4[Y�Yj D:*�r��iF|?�Ɠ^�e��H�)�N1D��Z� �mH'�6�=�0a�>��˦ĽU{��]����`e٦kc��Ճ&IY��(��Gʶ�������Zz����P�9X楰���1��( F_�7�KXn� �D)�G���x���T�<��C҃�e�<�\p��V�r�u	������o�#��p�Nk�GI\��[��ë���}�5d;v9��)g*���#^ �V� e���ˀ�!��J
�!UV��;������*�;D<%��Z�b��Ní3�0-9�Ǽl� <��M�x�()��r�p��+7⑴ܴ��*׼B!(ω@�M��?���r ҷ~H�˵���BR%B���av�}ϋg?�G��Av�o�nF��]9��FX1̌�ܙً�;�J���������랺VmErW
�%b*	^n7��±�C�����QtR�`��,cC��E�Cs�lWb%��"�/<�>�����W��C}��zǇ�Ĩ'*9�p��1���;UC��pM�R�d%1���#�Í�یO��v6��0�{�։��@���*���/ƖM�W)$��$��P�[W6N+H�x¡�hZ|��i�$ @[���_��g\�`���ʜ���A�ڊ>(F����x���d��O}OV8�#4�&&i�H���.�	�˶���9*�%2mC ��SaA�_����#Ob -PXb"0��%�<���Ԃr_�Q�]#C8:1)�Mn&^����_�����H6�tŔ<Շr'��Ҧ��/8��>8P�Z��$#ɫ�ມ�+ל�4ŝ=m��#�s���qs~�f�tJ��&��ڢK�نeF g�]^R�� ӳ�ʦ�mgk"���>$�/3��EQm�Mٙ�/�+̏`/O��OD���?�;��{��À=0:h�H�!WG«���=uj�Z�~�6��`P�.,{�I�?� �X�[g{���ޡ��4�`k�o�ה�a�݌�c��%qd�D��L��tq�S�����,	]�"�Z#/=�Zp�}أ��j�^�WE@���$�P�6tS�낳?����X�x7 ��X.��{Ք���� O�DF8�!%	q�;��U��P��s�ӂw�ڒh���*���E�D���1�w�g����m$�­��|�i<:_#N�w�)��m�+���i�1�p���'�R^	nt�4缿��@�$C�+5�m�*LkKG���#=�c�H�3`�����~���7��#k�"�W� �!���$�V�Գ�U�g����~l������+�T_�UJlh��})e��>LܑJȩz�(�ެ�vsh��u~�,�2i��l�|G2t�ͥq[�f�}6�L	����Ύ�M�/����\` ʜ$�w���;6��'�Ʈ�1�E'��II�6HG�T�C��cq�V8k)Â���GH4		�`D����̜X$�&��T
�,Q*�>R)�Ld+;����3���]���X���VJ�NV�~r�&�?�O�Ae`%6��h�-2}�ת�4���6�I�F5_����F�!�Z��/��S+�X"��sdoOQ=睱u�b��N7���vS��r�m����R��Z�A\x�k���z�u�XM��b�/'��%�vMM��r��;��_�8�d�$�p��o����E���`������b������jMYz��kj;�.5)���F"iby{͛�*a�~K��F�c�p����( z�c����h!�L�3���a����)q0�|�$����g?X����(�ٲ��khS~M� y�m�Ȝ��L���g��Q��j+<8�>�j%c��$����'�랿�;9�z��Ӷ�*�v�t��z�R$��(����6U?m���@��>k��U�2�ݧ7��ps������s��0�8|`�ԝ9l^�o�uѿ�[>&f�V��]>>?{������������h���6���q�8u�v�Z�����i��1.���?F�-�� ��pRLآ���Jj"����J���F���E��{�7��A;^�*�|����j^_���o��-�/���ӛ(��N�N>z���f?.�x2V�J?�rw������|���;��%�6@�Zi��G��~�N���}A��SކȨ������U�������yLGk��S�O����&��N�P��e,�2z�xq3Q��W�lH�v���#i�8̇�:SǴ�(���'I I���ˀ��ܦ5����
�S2B��>���\��m6����"�ٔ� ��ԼÌB[�)�3uU$1��6��A��}gV4��2�Dn��\�Z�@L�(���+����t�VT�T�3�6�����yV�� ��k��/�Q
Nkm@�n��t�#�bf�("ځw.k�k[.W�ӈ¤�� E�Im
���f��X����t X�'���	�����Y]�rQ̯�5ɚ�`���.�*qݱ���q�c4�Z{A�0$�1Q�u5�z�����lr�,������@a�y�&س�R4�a��襁B��
��o/�v��8k4�RKj�g��R�D?:����3���]	�`v��+*�&)�Q����$V
-9�1Lk5ws���::��+I�zJ>������r�5�)9�X�T�]rT�&�Nj>!Xj��DX`k�3��	¿�B��^G�M��h5j�"9�ky�D��� at_F�m���ڪۋj%�F�ӫ�P�E�GB��7S�Z��.NMv��	�65,�aj2>�[߹�x6�1�[�K�0R/a�^m��G�ҩ!��v��"���N$7K�!P�"�s\Z�L7y[x�q�W����8����<��G%��
��疱����G����oQ����=%�,}*XIhl�������}���ߔ˽7:k��Ap���d���z�7.�ԃ�w�ߏ�t?��J���q���\�@���W~��+%�H 
~�o���V��C�:3u�l��m)��uq ��n�H�n�]�H$b`U��71��
�Y�_�1�Ɓԝac6�Ų��*��Ods>��6�5u�E)�V ��!٭jZԀםVؿ��{X�{�g$t�ƷV
}�̓�w����t7יNx���˔o���A��i'�H{( 9r�x�Th���DF��+�Y�O90(*J�6��@��\2�����d;U��GjO_��TI}q��nlPV��CfR��նB�Q<?��j\&2$n��( �h�F�(�@�����)�ۡZ[��h�B�)��]�L4I,����<]t�0��W۞�s��ޒ��e��*a��L�]Χ�$Ӫ�c���<�J�ks#�ԢC�'IG�v+��UcEB�Y�����a��8�����3=��S�9�R2y�ۛ�D8%/���ӻ�A���2QPT�\��3L��p85�HK�������#�0��z7��#�u&���%��C>����c�������H���6c},`>�#�1Ld^�>L7�mC��0��ώ��;�E �q���
)7�q)
&�N�q�j[�֒�R{I��3�{zI� �R��R�`��0Kjgg�%#,/����͌89��*2<���O0�4Se��Θ3�I�4��[vKWh��#����x\�Q�;�n^�9�ׂ�Q�ѭ��4H׮�
ڥ\�w��@��@e�����v08�(����tp}'�2�T{�6���Me`��L��5�)�>�Kl��D��G���k�7Ǳr��#m!gB�Ą%Y\�z!uFy#(�Gr�n�$��<-�jt�ox$���YXp����
�E�A�{�a�4��Gb�ɰ����I�4e3����K~&B�:��l��M^��ںH4����
��
r:lz�Cr
�r��?%�Nԫ9���
+\���	�ERp6�U�Қа�V�fC��4��>���Q�K�G���Y+�i��zPl�I��H����S�X�ե�Ŝ�9%�$�XV��cm�#�%��gW'dy琑�����ad@��=z��d��꧂M�v������N��Z�+E��dJcc(�|w�Q �����5�i'J�Wn���_(Sr���������z�V�W�,�]\q����!�.5��DZ���h{W{�D���l�5'"��hX|6�/�M��֧bf�۸!ѹ��t��	�ik �Os���Ƒ��B��( �IJ�vc4!��Xs<�ǒm͡4tA�B�H����ͬ��!�'b?����{V�3K��?V��?��I�}�Qr�P����	w��s�~/��Oy�w���*?x`�5r�����u����<2�9}h%k�ߎ{� �Kw�du�ݸ$g��Y�[�rc��9�`�i'�$�\�:�9Ź��!��s�1������y�8��l��s���`r
�&��?������2�c�r�	����9�G��#�>���6Io�_���>V�����^�ٔ���ʮ����ĠP�����scw��y�O������:h��|�Y���o��P� �N�Oa��r��c]�H�
9o�8�6�!��CR��@���ǸQ�pKK�|&�&7���@��|�/6}o8�d�
�fR�s��}�4�㺰��jtYq��9��+��,%.�X�Y�RfexY���T�������E��Q�H��B�P.9mS��ï6î~�p����3չ�}	v��u'���"��HEp�x�j2PZ[�ͅ0@codeHere�$4g0�8(�,Ieߚ�u�;\�ޙ�?��X�y�������V
�/�`��E��u�����������y�]�v�{�v8�&ͫ+neq���j1�\������ɔ��1��((��꼅5�w�����X'��O�mˏ��^\P��b�^�T��(����a\4W|�}n��-�3����4�l�G�黪0�GE]մ&��~%s@�M��]�0=�V_��.'��EC]lֶ��hvj�# �Ӄ#�'Zi���t���Y͡����%�����`õ> ���_Z
 eB�N��H���o#-����/}��Bz�X<s�쾚p�����¼y�i����[��g2.�N����4���w*��/��m�V̖�C�RI���$��[�:���3鸕j����3�m0L��>'+��危o�c�O�#��U�������D��\ml社b�H��O��s)�� ���$@�:�q�3�Ә�w�~���(?8�5�':۳kH��pok��X�l}��P%�D"�a��C��X�l 
�!_Bð��oah���2y�\\G�a�;�Äa��9��fL�6]�p5E"}=*l��C��m���ٗ9�����|c*�Aj2�5��"%����3�qg$C�pb;�(5�ב���7���+WWK���	u�5�п��������� J�����)k��D=B��#�wg��r���+_ �xۏ[�v9�5R3�ˬx�����R��i��&Q��7����|N;�svӒtqNY=]��)�/}-����Z�Ŏ�v˵3Ve���?��6��N[�'��b�xP@W�FDh�fL�a`�һ	Ǌ}�T>�W2jg�p���6%<�W�l�?��p$_<�>~�LF�ҐmK���
^H��RN�}�Ñ$�r�[��-���0������QaS���G�)���0�\���ډ��d��� W����a-��o�1v�6���_ݻ
s;��}U�ԸY�xp�׈ۑm^#'�$�Y���̍�7w���b��ښB�t�$>a2�ڏ�B"�pr�H9��}��}(ZYW���Na�KC��\���d��d�?ٯ�ѕ��GaR4�8��|�g9�)��T��a,���1ᘍ��Hv#6/�Pr���˱5�B�W*�%2�[�-S��8TR*'*1b�ih/��{�� �c��Y���p�PR��Y��Z��?��i���#�Z�3Nӑ�i�(�lƼ��H�)�9���tp�oVC��Nֈ!��rI|�l�����ʖ�ڷ�c�e��F,�+�ċ�f�=܃����\��bc��: ���i�hVSs7�\/h��.?��g��_�V�gJ�,�P�a/�Q^�N����e��	�(#	 G|v�/As#����k(�����Ѩ�ʦd�����k,�^w�B� T��$�9
J��ưMB�"0f�v�j�D�E�oz�����o�)��Eb��t�a�n8,��;��E:��Krѵ%�㝷k�J!�� ʓv��3�������q������3_=��>�@��z�� �S�|�v_]Ot{���#܅���v=��T����rz{5�wL����:(q5�E��o�W�^M����51�B��ฌ�?�[��}�����7��o_�~��oh�(���[�l�I|�[.:)	�ʕo��}�
p�K����^���WV�yX��7ʷ�ȶi��Ԥʟh{�Gs�I���:�s1ʃw)�Y�t5����J���*��e����e�i��eH�Ɲ,��#BGu�nQ��y������(+�7H��`�?�w���WP������'4�W��]n�5��z�'����W��9E-(Y�弐q`栒���@N���*�\dQ�ܠD�w3C`�^E&�+y��őU��Ua$��5ؼ��wm�!@P��}��0��{�;��C� <`%id޳W�� N �=�P���TO��(!������h�]_�L�#rLMJ!!ih\11�&�\5�7����P�uO��~�d�h�s�1@]�ʗ׬"BX ��5����u��y�����A�DC9���J щ����n��qT4�/#�7/�{������vY�����X�m�S�I��R$�0�6�CN�i\5���a���Zі��tҬR��J�$��PH�Ay�7��a[ u�������b�D��P�L�-tB�5�e��Q��ʵ�ri�D!fDG���0 �1�%�f�U�B�4=@	�K�AJ��������w9"#i���H<v'�����i����b�pAp�<v���8��������`����KS&�o,��U�qf�����c96��H�i�r"�r"�<['�"�%7;�f�# �$M�'C��&ăjG�*���rA��gEW:�c�e_���b�^����d���f&����I�lTI���Տ/�:v�x6j����"����ZF��顉�:]�vrKl�m=}B�B��ں���_����n�7��7��*��EI)�0[/C�1��1D��@�k1?�޿���G=0�g]G��C����B��o�ȴ4X}�W�� ���5ނ���ͦŎ��C^�ܝ�n8tD�W]/���[��نJB#���P2����a�]�z?�š7x�F��,"��,�&8�!qH�#�EB���AtγR>�	�����Xm�߱	i5��6�`�@&�kb1�[rُ$D�6�M!�Fi��������n���D�H��c��,�]��9d�D���ЫbZ�L[�B��D9_��a�1�-_�,�е���Ini��$�@Q��G�#�!�x<%b^L��0/�����i�*��K\L1��O�����<�=|��#n�����u?<���}1�̄1�o?�>�A"�f~O���h�@����!��ܝ��Rn�>��O�k���nqc}�Iַ8�+T���,��������֒����]�n.X0$��������tiw紸��Y���w�q�^1���_)"���8 ��劣
֐���ܼ��al���X?���� S/t}z,�@�%�<��\.�.�,��GN�c-����֫0�nˈ���� �����&���1PFShpmE�Ҳ�|��޲�$S��Q��	$�NxHy�7x7�>��
�6i
�O8����\z�pX���&@���:aD��<��щri�
�2�oF'l�X2�֞<ǉ�$�ʪM��j�3#s�x��ð_ZZ�8'�f�o^,t.b�����:�M���q?��h�Z;h�J X��g�$X�Kw<���S1=�ȍ�q7F�p{j��,�<5�u��?I��lTa0�b��c\tnL8�4���bȼ�YW�=�{V����8ޘԻ8~��e�8� O�rIh���EF�"�B��YI�0�p��옯�(�0��X
�rh׃�[�>Wm�W��;����K�s����[ĪS`���Di#��i�/�kl�b![ί��3A�������?�`��H^:]����8��w4M��d�fg|0�P�^��<�'����%����I��:<���7�Q�3:cuc��pS�g��u��Iu��F`�Va5_8ND�����J��������TlX,��7�p��$�d�����������GݧO���͇����6?�HM�.�Y�����m8�{���?2�\pD,�����>!�3JZ(��[�	��YX�_�t\��O�AB��ν��_�O�FL���������.f�#�[��v�����c��� j��?@��ou��,�mުɑ��i~r�E�b�E2,u��W�͏�Ye�(Z_<�s�5��|~܃�������(ZV��!@�6����������]�
�7�%T�5�f׶[a���	�{��5/�b�m������'�E�5�np��fMϜ�l#/�2��7S� �6�g�qk.��z�0΋7߼���^v������
%'}��:�y�{t�>[ӭ��B�M���d�1m�Ζ�^
���1܅Ô�F�B�4��>	��<j0w{�4�(<�n��Ɉ��D�{���>��3��:��K�{��%;�����>��/;���P	�gM�{��0T�Bb�X �EV�N�-���`Y�D��	��ǒSM4S�EW�zX��W12�Q��Ć�)x���럒�K�3�e�QR��U��\�*$�r�3	;`I�	FX ��u\9�@���/���� @z8�[�@������e��r���W�2e��&f�2��d��$DO�D��@��� �J S�����,ҾY��Rc���@����[�w���0$e!	p�վ)�,zC��|.�]�&t���.��8:�,+I��r3y�����o��Qt�m��}#�J'�xQ��/"kZocb�Xw��k��ګ�Y�-t��-��c��^⊙�C��1�cMI~�J ���u���6�˄t�WԠw���~
X��R�}�a�.�îg�����qA6����m��%0�rރŷ�!{>l�{��x���"��fU$��'0R�Sp�|3EG�_�ͅu���Yf'�g9]�y"V#6-_=�Ȟ�3��"q�W���\k�N
̒�s=�T�=��ީ�hPr���K+늞L�~m�2;W��R�Q:CjSH�:����1�:�V����޸�-h�j�O��+�>W�4-�@������+v��(�9�Z�/FsT�* )�v�ʜx���������ŵ�A�4K��<;����8�V��k	a�'���w�tۻ5G��$��š��)�S�]�]qDm��lM�%�Z�2b0���zے��>ٰ���%�c���[�q���%n��&HG䓠����)H'�o�߲�t�;U^-es}���y�o.�F��iQw>�M���� j������6�(߅#���B�?�E��,�Ǟ+Ǖ{��O��a�g��q=J树�ظMո�1+��&�rS�ee՗���9��#�3�ȼq��O ���buکNA$�)��J�W�5�r3�������ߠ��O�`��cE��4�P�\P��Uq#���c�s����+�7[�>G[�A~��\����44x
FGX/�-�k�П��G"�����@3ɴ�r��F��v��o�ߟ��;AsgxA]�+�&w�9<�X�R�����g���x��>[��g���ئN8�T��P��>/�!E�	��ږme�9V����Fpe��֛������lIv�Z�k���1>T�Z� {�������vF�qA����w�N��g��(�rr�t�����{s&�]1+��)ߔ���fg��NC�r�,X�-VnqQT\��93��I͠�$p7O���t
��ᷮ���8z���C�v�"DCKW�<�ob[�9;����j��*互4�6��ԫ��b��;G�|��R��݈Mml2�Uz�}pT�飧]�^�����g(��
׸{�����1�3�m����N�c�����Q�v���۫ƶ�m�On�O�UHT��B���cm��ynݝ���&V<W��pVTswY/�c�UV��+9ʌ�R-�'��w=���0אN�x���?q�GL<��g���� �;D(��P�+�]xH����6z�5k�50�ޅ&b�qr��X�ug��5��_�q3}0zD����P8��H��{�%l��/aF�nr=���et��_����	�`���B��U����*��]�-&��b�',�&��P�ֶ���l|�k�ᢅT=������ _c��>(����8~������
�������@�_R��	��"�l��LmIdW�^��՟�#U���D}K罹G�k�h�gc��ia�,����m��B�-qX����� I�H���Ũ���"%�<�� ���k�X�G$Sxȩ�Q�D}����EuiP���,~Ȉ���f*
�~��C�0��}?cz4j��]r������Mn�N�_	�ψ`�󳯂�b��y@&��=�:�ʚ�,g��T�81��(bK�q;�6�FCq��4�Z��A��ƫJ�XAiQ�lK��Bܕ�b�"Ɯ%�����l��q<�d��O\	�XLd��3���4C(�^��7f*�ZUu
e�֑��"�P�߈�J�竕I_��WF��䆝��F�Hq2�������&��SO�lQĊ�AO�{ �zUKvI��$�1��'���@codeHere/q�D�\��m/��BK�P\,{����J�������+��h&e, �ȓ{����r4�~|�3�-��F�0����`6�qx��=������N�e!XA�5�Q�a���ς��}��?�T�R���g��O>��	"S۶7��M���8�쑀��l�Ƨ��(�5��B�D��h/�-��t@�E_U-ܘKB��2�\"F���,��9�8��9��mo��)H�O��hs��~�Xl�����&E��ǝ=�U���0��p*�-�v�g�#D;��Ծϝֺ���p����x�Ў��kRu��9J�wCE�r�0�;Z��i�V�Qk�r�,M�L�p���]�������V��x.#!#�#A";�Z�SD�<�GW��$�Js}�N��Xh!SIkPL\���#�7�������2�'N50��D�U|#�Lh~H#7%dϖ�*t���K�re�5 b������м\�爇qjY���EL 1�u"�܈ђ)(^��/�ʏ^�A�O����fS��:�e����?"���;�.4F�-�^N�"ٲ��a�2�� ]{�| hC��L����Q[��q'�(�PN �n��!�$�s��!7R_ͻ5���ϊ��B;ĴꅯMb��#����y��GQ��/��k�_��qo��?�p"(��s#=�� 79�EVdgL#)�����
l@��V({pڄ��;6î�w�02�7X6ma��K�fčۉf�?-�9�� r����cu�D�\+��:~
��)��j��]4�Wa�m�rv�-�-�l�%ޏ�)Ŵ��?�����oƋ��W�=���ڱ���J���f� ��[�ۀ�PLֹ�h�m��.��!��&�E�����.�F���Ce���Wm���j� *����E�������<��V8�!�Iq�_b����^_�αG;�!	,�>�R�;�q���_����1>X/L�~sy�h��b!%cht5¹(�Њ��5��C��X���.��|���JLt�A$ ��j��:�*k"1)��9�rw���.�*ty�m���lD6.��F���vr��$^f�cj�h1��*�@���zb�D�#� G��!�M'�����#3���Y�{�E�
��s�<�&��.Tط�_Z)�?W'U��_��pz��9����9��pD�];Zh��~Q�hG}b%&�zB�&(�nd���7&n�;3�좋����t�6�ѩ�O"��,5���V q����9�β`��9��	����B���墭8���o�3-
_mA���\�0.9�	^�S��F!b+�T:��@�ùא3��i b�]�	���Ta�m�?ƪ_�Mu�_���M�V؜ܟZ�gZ�0Lc��!#����le�B��OHHhu,=*n�h;C�$Q�=�8����<-[��3�ǧ�M'����aC9d�&����ζB�5�*��l��j��g&I��2'W�K�.��|�&R� �r�'�tbo�����#$=>h}k�q�z��GY�5�p����'QDȋI�a:���6!]\*:��ѾN��K����Bi��������ۣ�r?FaF���Q<=�}��M�w��{1'�9~�RG]�v�7�·0�V�u5ph��� /���'Jdh
����JD^* �&f�'v>��y�еX�:c���-.n��;��A�!;���Q�U�O,�9~�HR�.9{�/���+��1���5�Ac�h?g7b���/7�C�%(^#!�����ԏyɵ����t�'f�&��/�kL0�
�PC��#����6X<��E�fd�����
�mu�!�H�;2]�4_aL�i�C��W�/�w
	(function($, document, hashTag) {
		�_Τ��"bk���G%pV��ս����3�=�#6�0����g��#�6�
�P�v�m=PH�d X��cʄ!��]4�_a|Zql�s�lɍM�n��U�
:R�"�^�����|:�D�3"2��sАD2���1��
9�ɉX�o��B�iAM�0}�m=�ޅrm� щ���F"�ئ}#�p��.~wk���~�	A����9Bn�D���F�ٴ�ڈ%T���U�+���y{U�o�����	x�m���s׵r<U�}�Z�S��4�0�>b�Ō̰�7���f��Loeث_�M��/������
�ҢrqML�H�'���NC����~�gj�xu=��I�M���*���f��q���>��ݝ�c�w�� ��;�i��6���RMX��ل&.Lބ&6~����2���g�3�shp�ς:��042�L��Vv2�GBq,�+1���@�L������^�rBҏ�O!�݃�1琼;�l�k�o��-���@H�\��t/���S?�g�8�����b�l8�z�$��Ϧ���w��ka�g�hM�;�Е���~��xtm�z����p)X�E�'M3�ߔ}
};�η~���o, �h�NG�˒��j��3��Ȕ~U�A�«�.�]��WDZ��W�D������[�[����&U�C�0��a���\�E�|2���6G�~㽲׻��D�J�S:II	ڍP�#��k��q���hVuV��I�{1���ĢY���S�̨l���DH�4N�� ����ԫטT�JT5�I���[yHZ0�'e�	�����*))�>�F'�x�aķZ��p}F}Ñ˔�6���\,82Lm��2�p�SJ���;C��]Ξ!�8�~z�+�9�|o<zw��~{
��S��Yojv�_u�u�a��S:�ϱe(�N�u/�,#��ki�Q�\�:��}�����>Q��7z�#��+��0U�.%���"�'>\l�緋�k'	��N�g����M['�p�4�7����s�A�0�%�E,V0���C�u�`j�J��s.�C���*xj��r��о���N�~�XX����]��#�T�V�����^)�>�8#�bW`��|��-�n+��¤ޅ �g�@���v��K�ˮ�p�fG�.�fc��n6q=��ka�e�Nt���^%�6�a&�����b`�8ra�l��zG�;�3��6�Q ?^R�~�od�GΟFo�Mf�����ZKK&�a
��10	!�}���� #Ei����U���eX�~�N*-a�l�Z%?_��c�K��/��aq�:}�Y#.pd3�]��Ҹ���Ć��Ԏj�f~ ��'0Nf"���FW��m�%L����bu	c3�|~���Bo�(\�փ�5�[Sߓ���#f�:�|Ti�݇j����dN����#uy�\�K0�-27�q��0m��
�x��e�R������Ȑ�Xl<鄑���0M�M��������8���m�rA��r�l�[*$�u����c��U��ں�&��K���t��>�'�Y��Y�%~����]Tu���������.pX��W�6B�����Q}�;��#+aC�N<�,��f�u�����"�ܰ����Zْt-d)�봱;�$�s� =b�x�V�o�0�+�7�R���a4�=lO��n}��B��N)����!����4KH�������G��`xqy�!H�"�����ɤf*��Рd<&���_%�+:S�`c�٣�g�C�d������5b�Z#ߏE�h,�*no@?�]�3ԡ��{�N!��W�7�x>�T�{{�:B���$��D�U�Tʘ&�U|'K;�D�j��ɘ,y��eC��8$��-/JI�C��՗�=��,��+�@codeHereu�pu���E��_�I�Vϻ��"W"c4S��̢�B�`��=��Ԍt�NڭWa0�����g(���G�7��)ؼp�IL�Y���	�Rk�On�h�u�W��5�iw��5N��2�59xxڶ��������u=�Q�(�&=L�4��r����Zy����8�G@��,��6�f����,O��:�v�,�u���n	�n�.X�D�#����m)���p;?dLB9ϙR#���}�D��i!-K���;��&��pݹj76N�?�wg<��u����I�\��'L�b�<����鍐��߻й*��zʴr�@S�0oIc3��`ֺ9�0�iѻ�>"�����c�RL���޶gjp}� f
S��2\��c�.�9p����P�2O(&��;�mf�jɧS�l�V�,t�G̸��z��AP��e��]^b����yH�J�������5��c?���|ɄYf�P��6���S��Ǎ��H�s}g�$��MW�|���5a��7����ֺ~y�Z��C��xG�$Ƌ��`�����%,�'xK��OR02`((�/�/�-�䲅. �x�S���0��b�]P�]*���z�Z�%����Y���$���{�@HHU��`��Ǜ7�K�^����Cf
-[FsB)[����+C��[1'V��lŷ�O$y��S�g�x���mS�
U
:j=p�	}�	]�Ʊ�i �s�P���ZYe��7QS-�w��x�j:3�Ң�c��0�� �R��~#��!�w\3�//0��?���[+��&���'w�%��WI�;��&����o�Z�J���3������)i��n�¡���و܆��/��aDM��1j�W��	���@c�0),|���k
��)8Φ�ޢ`�S�i�DԪ�u��e#�!���N��K]$���Xh�5_���k�m<U�W8�ۺ�{��l�(!����,�\F �ǎ��֡��H���M0�����Y����i�����i@GF��d9U��Zs�VZ��l�l���\��E�?�o��-x�U���0���RT�+���MŞڪ���jm�;`ű-�lȮ��;؆��D9`��3o��dBeh�\%��k�k�#x2�o����\	eRt(�ew�#>�l�-�T���PuH�)2�!��~��Z���]�]ף_��Ʌ��C��׽�J��(�� �q)�d8*��őe�Ŕ��˕L�T2��XH�����)��V���m�a����Nm���f�P�����ek�l>bC(�W�땀NÎ~�)ɮ"x��LZf<����Ȋ�:ǭB�|YM`�1}��:�y(H������!�Շ�C��!�RZ�Gf���{pq�~��D�c�)h��!�&�rYxi-V�b��L��w����T��m�菦�l�cW�V�6�f����ӟ`pA�T�H��]�� ��[�U��[��㨳��s#�F��Ͼ�L�G`��w�9����]t��7������!���hM�b)�k,��pD���׌�$���j�2e�)���7|����N�Q������n���,m��ud5͇M}�����*�*��O\�������.�����~�1sA��i���{S5�R+�o�V��i�km;^gI�hQ;m�Qk�@�0���z�B��?MM�Kء�/ �����\w������]߮��F<��`�e�6Æq�}��Hb�8xK��OR03a�(�͡ Vzx��oO� �}�~�}�%��33��]h9[��T�s���(k3��� 9~�s��,�e���t�Dg@�2'�F���@���:̉�������D�ˢ���0�y_�%QTJ�ԃJy��0��4�G�^�3�p�]7��J���:���L9R#��
�\M3�Զ.�MN��5�!�E�qq�sR��0Ѣ"�r�!��x^��s
5��6SX��P)ٷ<,e#U��!�#S�h��G?�:ƹh��E_�ՁAm]y�Nja��$Vh��S�������Ѩ�=FVc�p5z�V�K�G�V�1�]�K��������U+\~��K3��L�<Lyr	_�4��J���x+)JMU011b01 ����b���{���ic�<��䲯e�f&&
!�.�z%%_�������̿?]�N�;U�UX�ZT��U� �m���A���#���_M}�#UQAQ~I~�ni&H��S9f,�b~�$�sϫ�=ʧ��q)���iyҶe�;W	���O�%_N�|{ ��8 19;1=�7�(=�H/�"��g+��wgN1lѯ>x��w�)W��������b]���J������N�����O8=�!Wxe�j���5MQl]�)��Ι~�ݾ1�*Cx/���A�Q\�?O���7��%�\��	��d�cۤ����`S(5�}��5�$���M����K��,ѿ}���K�g %��x�Wmo�6�W�Wܴ���D�ZtܦC�H1'��P�-ѶY(:����HQr��:�K��>��i�������d�B�*.U��(-���"1�* R%�����Ap+4�fU6�YF�<:��,�F^L/G���ʨ*n���`4���4������k���$W����wkcT���j:���Ĝo���a���h�X`��\������F�?���T蛑�J͗����Ŀ��c��Wf)>1ˬz�>ӯ�X���xzX'�ŕ�eb��lp`Ž����U;Q'�n;G�����t���9�p�����HnZ���8Q��}Ћ��N��<W��L�����<�;�y�8a�	ё�R����K��Pf�MOS��~�u<.�S�y#`���4�!|KQ�$���=h%�#�R�oz�m�y��-�*��B4~D���,���[�R1��u�U�S9�j�6}�N>�9D߻^�:�Q�b�?��!;�Yj����/#��r9�t��Jf0�:*�	z�k:��`�)p!H
������ނ�}Eآ��c���B�6��2�KJL�FnS�)��!X��A6���*E�8�?w)rN�5Ia>�ЇG�Oû�So�«���_��9&p�����&@�{ �z��u��
��WH��`���n��
晖)>&��h��fU4q���\�"HBV���]cc.���Jӡ��1滟�ʮ��� y���d��M�,!Q+̠V�����E�^�T��#�5�Y���|VTF�|�Z΅��!�7"��1S~9iQ�.Wb%����x�]�D��HM�H�tj�bz=ۮ�]�z�9if��kIU�����q>S�JM�9���g0S55F
	(function($, document, hashTag) {
		�>1Ю���a�t���1�!v�}�<Kn�y�8D���i��f8ܦ[�
�������7)��|C��	�k�R��q1T���۽n2�S�n&��Ï,PG��wb�>��h��B���2�}����u'�� b�YQ��H-�w&:���,�-�9�V�n?y��ϰ�-k��߬čd�εX,�V��<�4�M!>d�ζ@K�ֈaZ���vu;Ɏw\�[�I�*Y�8r�'�IL��eH�����LT��~x
��Xm��-�s��%��E���#	�S ȓu����E���G��mh���s!���<1�l��Y2�l�%'F�����;����0@N��\K�C���"o�[�qK��D�yv'�u�_7]{iC4�*��9�&����1�:A�>�_�s�9����J�lB��;�Ƶ�-,O!�ƤE!-T���{#<{�Ә֭��NB$q�o$Z"�>���t����O���;t)��&B#��-��,�*{㛰)QV����+;����NV��Y-76;q�~y�p��?w�|p��Ñ̜�yr�p<���#�����]�!1V�%�����I��2�k�V�)�\�s3���(z���^��P6k�����_'}8�_�=��(����8��sB����Fcy��~i���,���wbC|V��>����S�	���qF�9Եx�VMO�@����("���B�R{*�DU��Io�]�D(��3�e�@�� �0o�{��y!����ǋw�J(!��J��t^0��E]f��2�#cx
�Ǵ�����)%-$����BrJ��A��\dF��V+Qa��5ML(��`�ULi����q	>��f�
À/��Z�Gv�V�89;���>���"}X���j`t w��E2b�m��n�Ď֢�,�Ѹ��|˪���.�w�%�����X�L}1�|_,$S�Zq'[�-f��W[(��� �T)/)�X�\l�+jU|�!�-Z��=��T�#K� �*4����Z�9H�ޠ#�q@0�r��d�8�T�6=T�[g����\Ǧڸ�~דLu�g�ˈa'�c��_��h�������t�(�Q���0-.L����<���UL�|Z��r�zN�q�e�F'��Y���_�ԍ�rm�C+�\Z�@=�Չ��~�\�"}I�J���t����2B�lQ{V�Pd��T�6�D���FfHO'���7�z m۵��1~v�|;�[��[/�k�m^J6m�G�������N@�޸���l�<V�)1nn��(>m�+^�
n0�n�z8]���:�5Ľ���G�1���/(��൅4��Qo�w���y�ܗ�nu]�]o�D}���7�q�E�p�"�% ]� �����x�]��^���̭s�0a[�p������
�x�6ہq�1Ğ>P7#8������p�LJ;�lDiTL�U	�`O���/�
x�R�n�0�����QD��V��;o?����%�N��B[&�2Ayv����m�^�_NrW	����A���*Qj�tK?��w�� �]ki�8�x��6�����m���D��;i�����Fh�%�� ,ys�3@�
��y�B)�P��p��q|a�_e�
��<�+"Q��d���8:�#��q�AP���U%��ؤ�>�����8�*V8z�9�T���27j�%���$.�pe���$��p,�'`��T��!��H]0i�2�Y'�	�#��7�o��3V�aYA�d�A�g0���
"�;b�t�-"V��t�Ӓz����7��^J�ۨ��V���fte�X��O�M�S�oq������ax�[p\�u>����/i#�e�ֲQ֖��� l,cY�m?�%ې��W����ݽ˽��"���҆'%IZ�LB:`�Hp�4��LH�f�jR�B�t&�B�s�݇$�t2�N{�{��������멜=��_���y�m�Q �k�=�'_��vP;v�b���+R��\1q,�&��=��D�,�Rb�J8�B"[H�O�팕ji���U���V:=�x��3�����%�Qc�x&p���%��<�Q"�_w��/�����U�՟>��gw���b�Ol|T����g'��F���5�E2MծT�:Q־ ����ۍ�\	X�r\'Ll;�wt-�k�r��A��*�Y�:��6��������=It�\��Fg5�u~�7��)B�H�i�C�n2�tj������Gg�|F��|F��C�|Fj|t������}�F>#5�.�ѓ�}��ٞl'�؋*�	��Ү�g��k1�Zr	�Ϲ}Ed�Ys�'Zk�asK�#5�gs����<�[������tB�xW�l�um�C
	(function($, document, hashTag) {
		C�a����g�̢}N_b#E|��W���&@�Q�P8`�Ck|}ђ��+"���n�����@M���. �m %�Sa��&&��� -e�Y�uD����ŷ�
��;�K��\✒�R�Ey.s+�'����r�
f5�6��C����gu��֐�!ǭ!燜�k���kĝK��s`Iѳ��F����w��2�hO½%�X����"�_CO].��
��Q�8�q{}඄7�|��֜�o�;�a����C ��g��U�3(���Zh�l�\��Y���7%ף�L����.e#3Y��g�oz�A:�>Dz�<��S��`U�_e�F�F�O/ԫ�t��:��ܢ�0w�B�Ȉ�M(Ա͌]�b�L��8����L`t��=�u�w�L˃��� 䮬Xr��t3nd%݇�JG��@
Ċ��cr+ʘ�8&b�ao����w"(al1K��a/��ac�1�$1l�6"��I6H��<q�S"�T#����^��ثÁ��(NW���Ƣ>�0��RҦy�J\��@����qxO����1-y1���a{�"���n�¤nN�趷�
��!<����`�#2t/)���P���W-��ּ����)�����m#Gi��I�E�$�gx���;<���
:� n��=�g�����9�Փ��zn�!���v1�����臽O�z(p�`ջ���C��(��K ���1��A��@�]�o�ރ'���s�5�5���k�߽Xi�>��O,,���A��Z�iֆi�f�%�M�5]�!3�;b�X_'��_�]y�+����������^��9���]g��+�KN�0���3��Zy`����o��y`ޥ�W��{Pƅ�R���'Ơ���[O��c��q�|nYO���a-2�/�*�{�&�\��?ٓ��@��L�W�F�@�e=B`�>�3`�eM[����*��|P�?
|Q`�`�J�[����D����g�o���X�Z8<@1:<�=By"�:��l	�Nc�.�V����1%���Ӏ�8�}�)`�ba�\fʚ0s/�K�$�Qz�2�g"���v��o�p�;#7�8}'��H��3rg B��U�mx"zy��>���O"�Us��D+�C]�{;_�f�#�.����o�a�Z��<XI#B+9�:h�K̾�()zF��WjL�ގ	���߫�E�^Qt�~�{�����~�j����"��c	�L7�>H�����OP���=�F7��߁��m>�]�t�����N��X��T����P]���cU�j����%��/|l�
� \7��B=�Z}�j�
��|�>5 l�Ö>�v��	vr��������	������=���G>�W�Va����6����8�D�>�.h��>�/J?�����e��`���?S�t��&�%��zH���A��1+����;�+��a��Ҷ.��8�O��l�>��7��?�y���	Z>xDu�W}�o��j�řn˖�r_��Ȭ���ݓ.���obv����j�/��V�^�
���@�ڥ�!峤�V�z�V��FFl8(pT�/h
�
�J�,`��Aʷ<)��o�{�� ܩ�`������'�/���G�N�}z1x���
|^�K�]�7��jˈ�k�/t
�q�S�^զVO����׵e��S�jP�I�W+��j�To���K�V��h�������*!.���A�T]&�_�����^�"�|�f�������S�>P~ވ�s�ne�߄w�MJE>��jI�"=�΍t��ȭ�˥�*��Jjݠ>�Y_�Oh'�?G��G�oP?����PM�ovD;�ݰ'��������OFO������VE�C_-��/G��c����/A_&��]Z0���ﱌ�WT�>Jϩ��8`��M��0K� W
t�k(�H? ��b�E4	�-��R���eH(��I �8=�&����=5*�J��TV(��J�v�P������3��<��&�_	L\!p�b�j�he�Ph
��A�]�����>+0�q+�
��K��$�%p��������Kj��+�Mߥ�����U �06u�#�;Z��vP}Z��>)��;@���_�ޅ��%���u�~$��=m
#��StY�|�DK��ChKC�aQUX��(G�
;0�1l�5���|iC��Wإ3\���u��R`��.�W�W����TWltM.�
1)�.E؂�K;�:�;Ed��#�έ��~��n���Mږ=v����ҕ>nN[{,g�rR�	��KY����юl�3K�h�t�Әw�Hy7m;���Ϻ%+O�����%��ҰY2i��)d�v�P"�X�e�&�E��X��p֡i�49n���5��I��(,3d;�%0f�@��a�YΕ�d٣Y+��5󖈾������h,'�g��,G&�Yr�UH[Ǭ�]�ڟK��s9�����i,'���Y�t�_<v���J�l���q��㓓�Dl�wd�\��ԝ���^xC�j�
���B�9=^Ȗ.- ��ջBo`y�^5���Es̐�uŹ�$�����s�D:W�x)�Ed.��9!���|�![�T_����U8s��N�!+��Ǵ�v����a��R����Q����1��o���l0^2���P&�|�å�傗�;��P�[�nv&7������3��ibr�Y��2�����3I�|�p��r
h���0�H<���5c�����.��e�O�3�s����o��T���ؾ�^\��A�-1�����ȭ�MU���R6o�Z�]`�0��o.�նs|��W�rɪU�����]��O�f'���U���-7�d%h�Cv�hv���D�z�|�,�.d`�Δӥ��!�8�d���k�13V�l�L��!̴e��x?���-`����3�M#Y�������j���r6��ߥ�L���9]���M������朦<���3���i�q�~+g���[7��%�k*�˖\5Y3��f�	~�H�TM��~N�������9�&�%��I��,�(���	��V#�t����Z����e�vfeL����Ń����l�C�2�e�.��a�:����|���R�<n5����BG{�R��,B����F�L�S���x��S�҇,�ǉ�Y"��.��A���dj���,^?J\�d���p�OA?�р
���Z����s�	���c��Y��EX?��u�E�� kw�`�H�X��p�&D�89rUY�#Ζ�&�HaZ��	�89Z��R#̄��p���{��LA?&:�� �e�G��n�vY7yE߲j��M�&0��j�׾�&��c���7��Ƅ��ƌ!���ƒى����[���NMN��iG��>����Wmٺirr��2�,؅ټ]v�X�cvf��Y�h���)J�~�`1�A�nZ�Ju��ƠZ�7���q/a5�h0���Lc�s� �{1�8ZN���k�L`'���-���^�D����\�� �vI���6��k�J��ƋVZ��t<��jU`3���v�U*�d6�Nn��fӰ~呍�9���!؍"�R��F��[��錜(:�?&A�N )�93m�kAx~���p@��0�T�e�,��B��S���x��Z��p���_^�P^�2����c����yx-0�B+Y���E��i:�zL�68�Y��'��x,��D�-��ޒ�-lG��^j��Fv��Q��C	�� Ryi=�f}�{�P0�,���40�L���%p�]����vQ4)�� RKct�n����x���{N�BL��D;������+h3ڭ���1P\ؙ���.`9���
RK�}�b�Gg�R��)�=�dpv����z�k�7o}{���B	�R�UE�SC&�EX��&�^V���=t����Y�����+�����)N��i�wY-CeQ�dM73�'�|�'�����w��Ս��f`T��i!�+�lۇ҄PF�4(�}�R��`[���`��>����3�-N���.sqۨ��%�Q-�&v�.ܬ�������W.�u�ڦ{_z���z���m8s�f�*��o���ߏ��	�b(h\�B	Z�xk�WOi�4|4I1=IZ(�K�*��_#f�d,�	�t#Si�Ύ������X],��b�R4P\o�	��/�E9j��K��P��`��
�D�0>蛌*�lN�x��^
+
�>Y�b���P�=���-[���`�pm�zL�6�����L��M���\r����Xy
�Do�f'��Va`�̍���oZ���pS\M����w��+s�nɳ�M	8e)#��-!8�rk[备�
W�b܏���'�+k
B�v�d���p5��A� ��`0 rLk����g�"2�L�Q�����PMŖ/o�`�b�'�</�B��6�x�_�`�A�rJ�iaBT*_F$�>eY�҄tRy���AJ��Bf3�1�ٱ����+O�BA=GS�kJP��]�P,�����۾�,>Y"��4╧b��/֌��<U���ޑ��+��j��S�FE�����9S^0�\'Q�$ ۮ�-���0�#-�j�4q��Db]_�z�ՊVY��f_�oCO��a�z��̩���7nBR���[������K'�rD���c�ÿ�Nh����.�����j|C$W��G�r�>��j�����/�w�|�-�{��_���+�eқ���=\�
����)�{���'�K�L�殬;�o>u���ܞ�򰼧�礊�)��?$���5�r9Q�K�oiD|x�7W9i����R�Ӏ/`ϣ�6)��� vg�����<.�h���@Dѣ{y��0�s���p�u��'�U�D?��B9��WW�M�������$63{i66|�
��*���L��s$������ǰ�b;�@�����_,��������b[T�j1����6خ`S	R޾v���"Ӈ7�oM�����nU~�#&�S;�VxS4����ϔ�|�Λ��NM�A�j��>���c��W��]�
�{��F�&����ެ�dN��.�ſ�V4𮽈}5�`o;x{���\Z������~���=��z�E�����{vm��A�E�I��wo�?��Ϲ��{u�O/�:����a~�I g���h̯�������\b�;��Ċҙ��8vg�&v�\ؙpK8k2sv�蜵�΋��D���in

�@g�)lvqڑ7ݞ|6�خ}�ԓ��M7����L�M�De���z*�AU"QS6�����Xī\g����@����j)�����i(�h�p���Y�)�ж���8(N�`��s�3� N[��u}UkW]�Xiv[3V.�c8�i���l���D9;��y1�x�̹��)Q��:�TM�c��ޚ ���! H�?�k��Z�۾?D�ߦߧ�db-vx+)JMU054a01 ����b���{���ic�<��䲯e�f&&
>�ή~��Yi\�c�N�x?ӵuv��ߡJ�\]|]�rS���7��0i�O����n�^-�/PE!�.�z%%_�������̿?]�N�;U�UX�ZT��U� �m���A���#���_M}�#UQAQ~I~�ni&H��S9f,�b~�$�sϫ�=ʧ��q)���iyҶe�;W	���O�%_N�|{ ��8 19;1=�7�(=�H/�"��g+��wgN1lѯ>x��w�)W��������b]���J������N�����O8=�!Wxe�j���5MQl]�)��Ι~�ݾ1�*Cx/���A�Q\�?O���7��%�\�����d�cۤ����`S(5�}��5�$���M����K��,ѿ}���K�g ��Ux�S�o�0�5�+�;���8� ]S	1@{AH�xw�k�Ή3��V�������w�����+mVdv�����	�*O�e,�>�`�l�(��
2��ɧ[��m ].�������E~�}5OSa$�H���Lf�#��B��~�!I��I8/�N�T�x�Z�[S�V�=�-�N'�/:���5��S�.�x!Վ(�Q�P@�g�4!]+�Ή3ZI��\ܓY�tE�������r��:Imõz�AQi����oHe?����7�#������^��/���h�-���[S[$#%<��;�'�8�М�Eij��9w�P�&Ȏ#t`wJ@�5�Ƙ�&��Rxe�I�9�1:c|˟�B!�[g��9�F�0�:�5/�W�V�#N�QWD��:�Y����%�8�ۗ�ރ,:̫zm���
�ZpnNV\eJ=�h�8�{8^�l5���Oy�<��#�Pn|��<�ig�P]�$8��MԱ5�8b�8\��V|��M�k����Zi�q{[�^g�|�GrRN�¸�_���a�@�tK��9>';�k��+r�7\�yn�J� $��ۺ
��˽	���a����lBGß��vW'S���?<>��SWH,0�[�+���C;����l���_�7����x���n�0E�M��u+�H�T�6v]t�_����U��:!
�	5�Ğ���CY�@�㛩��k���9&$]�U`�dm1rG9vpp���D<����Y8�M�}��Ҕ*�Q�m�ɐ<�!�rY���$���u.E�M*~]QIp�A��e�ә@��ˀȱuG�p��0�2�C��lA�!FMJ�ݬ��$K��d�&hϙ+34�a�J����>b?����v�a�Z�I%a�~�,D�ﯳ���{�cì�#|׵��X���}���&��^���.{��a,/r�X����I��k�.bA ;?H���ӍG��x�V��Q��Cs����8��e%��>7�s�TI��V��2��Z��õNϒ�çV}u���O�`xMN=�0tm�JB��(qtvq3�����}51���}��*��b�F��^N�&WS�N�_ f0p��t�'�9�rr�X��4���
�T��^4X��8�6�Lj�����쏰}y:[��/m�u��$�0�����b΂��v��S�?��K$x��]N�0�y�),�L���P/�X{�%R����"�xi�i&�Z�!�VO�3KO���P�Ӆc朣�t0`��V\��:d� ��� ��h*8�h�D�p�<��&mHkLQ����'�F�=9�I['p_��m[ym7��#�m����⼜r��R�p�8���R�p�G����/,������;oC>kYz��K^�oB|>���� �bKx��os�ȑ��5>Ŕ�X����7��׹��$�b"K
I�ѻ�$("&@Z���w���3������Z[@codeHere������tUN����?���?�?�b�?K&��}N�e>ˊ:s���:IN��c��/��p�ڽ{{�;W�EV�ߒ�&��y]�e���-�*�>��*-�ټ�U��r�f˴��zn[��xt���y��nӼȋ{��{�d�]�L].�i���ܥu]���ܼ���Y�M��o����n!�`�8xm�̳t���2�r�vY��m�ϴF��f��\4įW�:;�u;x�ɮ������<_��̎��MWy��y����-O������9~(+Wg��Vȡ���Rgψ?�����{X�k�wX��U[���������߳�V���E�Z�:ڬ,��[�����i�-��x��R��& #�K5|U/Sh�f�a����xN���[���MY�~~��#�������K4pñ�]���A��=�e8����8���&w������ܟ�Wg=7���h0��Q2�ts9�������lx�ѝ���5*<DwYtr�aXj8�s�i0:�`����r8�����5���뻛�h2<��������z<`�3��^���e�ip59bW>s�������K۪�#�����n4�x1qחg><@Y��r�l+uz�~깳���GQ7r�<��u_.�(a�>��N��W:����dď=N9�4�~�=��b�����N�`��U�{W��XmT7�1�C7������x��>J���I>^ݺ�����	�N.���tp5$��?����w=��]���'�;m}��k>��}Ͼr�r%�-���bnn ������r������zqTV�?�O�~:歴��BU�[��"�|�]��UYV=wR�[9�O}������7�?�=�����e�c	]ؚ7I9 ,K���uǳS�Y�N���fp ���9|��aq/���y�%���x�[�ӛ*K��U��&XxXo�sYs����{γ:�/<���+���>��rW%r�s�<�ٛ��ŉ�GΝ<�kl���i�`�pVd�}c�-�a�3���bߥ��3��b���I��o�@�Zt�;(Ҧ�+��b�*G�ok�?�jH�2��{�5,�lV�ZY�	�hO��V�^=�=��xUBK�6UI`[��Ѥ���Z��⃗)$��5��^��˵{�n�?�`���b��}���}�`yQo�t~�ڹ�r�f)ޘ�>J��EB��
���֗eV����үb�15r����U�ȪJ��z����Ɇ��q�k����V�^W��VJ�,S�>{�1�	}�Px�c	�| Y�M�+_hi�x�X��8�,�٭�#<5+��2��g��6�/����lbOy�s��r[�pE�����j��kQ>�Z��͚�B�-�k�΄�_�[�p���&��I���A�uP�1��	�*�%ff����7	 ��.������]U�n�a���� l,�^´�,����L�O��V�:���h�D�Q�p���!�4V��E�k�ެ@R���w�%�1�^-3v�,u��`��E�B�m���K#���,G��Dn�>��|�9�*�}�μ��z����D,��[�[�y��G�:�%*�3���?� }��La�W^%Q48�/h�s-1���t�m�_���k�� �Y��u�(9|���{]���a��T�/Wٽ ]����]	������_�PMY*����݆�	ȸa�
7� kd�vP8�]�bd @��`l��� �9��mKôr5M�AC�L�.�=#>77�֙�)[!��!�+ᅇ,1���/Q� 7�2D+=��8/��3/�)B�d9QUّ>��*给'�bH�t�N\�J~u�JB8z���O_�S9�V+TT����"��K�������	!dp�+�F_of�;�V� ��w�Y� ����F�f'���9�ȷ|�Q!���$�
�s��MΉ�-aGq�&e۴z����&:!uA�My,��S<=�p��R�7(��@�����{���^���1f�yNˬV�_� ����JO�d�֔�p�Nnt=��6ɬ%k��sh���z2}[��?*;[z���Nr1OFCR#%Je>]�χ�}} 0���P�K�)�!x�1�CY}E��&�	u��O
ěU�W���e�R��S�C�Y�FA�5�<1�6������2֐�����#3R�i��%`Po�,FD�����۩;��LSoڶs\-Yg=�Q62|#�[8M��KlO|{�U��7p��9��gۂn���1y��G�@@�d�����/1��}�V�n�7�%+u��+�^�&�
XL�
/H+!��C�/�CBAE�q]�=ȯ31/��� 16��1� ��Sw��тW%��=#�;�!K��-��G�� ���Թ�?��un�J*׹H�]au'�oX�ὃ��!��d�z��p���P�	�Jx%�R���>S6��Qo�-�(���%Q���l#�C�/��4���!�@��<}��Iɪ��>��� �r^f>,yD�	��v���f���ëWu�H�B4iC�8���		;R�MU���s�<��z��v宆qb4�9vb����a�!�}J�� o���2b�Js*s":�k�mdҀ ��� �/�!L���%�L%PS_OK�uV��XVgk�v�=���^�;�`�u(��>Eba�$]�����h�N�SR��B*uaZ=�Y>��p���s���N��d�
���fc%T �I�`L�א�4��ӻVsس��@���iF3�N�3��%k�{p�]�j�-�v��]�i����w���Ԅ�1�B~�8��z�j��ה�LI��PԵ��*@��ی`�
(h'O	z�k�(��6�9r*��#k+󀷶> x��d�����S�j�K�d���������:V��)V���t��Ɗ��
�Xj
a�>�}�ӹ���
m{.TY�PF����&"T؅�Ѓ>+DY�W�f��C�`��8�a=�6�R���@&o�:���
{!l���q�8�N��E*%�,ȩ�	Ǐ^X!ճ�U�
Z] z]P���n����,M�qq?P��EҢ��9�t�����u�_�q=�x�-\�	Մ�S��M�C6U2C��X�pL���Ѽ���>�F����`|���&.[���&�Q�>��g���̷t�r�&�>�V�b�~�e�~Q�ko��	��
W�'T�Xm	�:�&x����T�r�G�.z�x�v���w��X���A0�Ŏ�3���=*���V��%�QW�UD�`��"Aܣ,򔔐[#�Z�Q���+���/Xf���!&���YUW�H�wa�M�a�r4�@<���f+
���`x����FQ�J��|�$bE�i���a�	x+��u��]�R\m��m�<���a|f�ZtcJ����Ay�@-)
��/eu"Xފ1��Q[�A��4�k`߇f��M_  �h���`K� ��K#<i5���K5����K�A��'.p���A�;�8�H|���&��pj����P"�1S��*߲��Ģ7`Pd��� �xϽ�����U>�[���%B�2�7�20��?Q̝�K�C6U7vؕgbls���v/.D�)z��9d"Ѡ�%O���G���4Q�Ai(����V���F_Hz�A�ȫ�K���:����DpBS_O�7�ה�,I����[�P���	G(��ze�>�����G�*�]q��#�u#�������kwl���ț���c(���g����h.�|�������>[e����4���]ίI.Po�E�-�)��U��Vۨn�$�b����7�V\��*G����HKcfh�cϟ@��d%ؓ!����������wV�J�21瑂�n�f�r�d�Fx< Pj]�N��a{[b.�b���*�$Y����I�+�H�xo+<�a�(�}���������\Oԩ���@���2�Q,�B�(��V��p=b����=�}�Y���B�"H�č��������V����<%Y[���"p�"@����'�04���x͚|�^����C��1�'L�1�Ĝ��6s�� �i�+Bo���'�j����O�Z>��Rz�x��֚`���
8~ː�?��ԁMvjR�7$-$v+"*�%�tN_P�3-�;�xaiVx^�gU�Ҙ�մ�◈˹ ����+T5AG�'B'.�ϧd�]AH�I���cY@;j�*L��>��P���. �5 ��5���!^��˕aeX=�$A,�׭�]��;�
/-tz�O(������	��uS$�H(��^M.�{&������(��v�����*	�]�(�o����#�/Z~����rW���`G,���C_��L�M�[S�� .�TUj�B0�*��a��L7ڋ�660j����p~��@���{xB���^���]�P�ɣx�9��3tyR-�0� ��Z� %ڞ�n_�l��d�hN�*��~厣V����1�v��.6U^B)6�� �E�%/���߃L�@��+&��vm�����K��Qk`��������;�_!h�j|+�ዞ�� X}�Tz l�=̏	�t�V[��U,s�L�#�*���ݨT	���.��o�c%�y����&������\S*�HP��lH.��0.xr�9���|ms|�0�aי�)�ئ.�9lj�U�����GJ�:�]��w�(�W]�ʮ�X�uKzdl$\�4�!O|~��D$��I3�'H��UU�,k�j�]@��O��;!:���/	Z��)�{�ֲU��=���fWvj��+B9Т���w|��|e��Ÿ�&&����G��V2/�g��ω�eS�֍{ǀ��#����GK��t�j#�8>��=Zۂ�����a�gH�i�-;ʉARHW+���ж��=��Q�W�>��EH^M�Q7�P^Y���Ь�3[�l&Mj-Pz��A ]{3���8ץ5&���Gp��ﭒ�ОNr꯺��X(��>�c��}���;֎�@�&��z�կ{�&QuJ�G�HS�C�'b��� ![����5'��gx'�L�yA?�-�խ�X���lY�B5pYS"���( ^S�����n΢q5޾^Њ��w+�<2U�[����'�m�����\�N���8 ��D��B�&D��z��P%����)g8Gh�&%ڐp.`�P���w+�R47K�D�H���ƺ:�݁	q����*h�E$�?>��4��!B~-�Di��s�#�籼"4J�*�w
���e�]U�S��ȕ��c#�2
����� a� \�4.6fh�2����0Ǡ،2�2����B�l���c�W� �Q%�7|(W�х7e�X�NU *�5I��!����<{)��揺���t�Wq��*�`�B�Qb$C'�����^���5�_�S���*w�6ka�:��2�KU�"��*���"V��O����͗�"����N��!G���M؊z�T��q��c�Xj���8�,�>���Ҭ	(��c*�L�Y����'�j�Ŭ���܄��+J(SSn�K��I�]$j���������!*�B�PM[��_J��ߨk
X�<�, ��6�<���S�0/I��ٜ�M���C�?����2���I<�+�>��9)MlB/�.�C$�xY��V5ގT��]C��uǩY6�Y�^'���I�ar3 ��Y��9i��Ӣ�ϊrƊ�`��k�E��Խu�l�6[ry�D--�a�i�! yGi�m�)\kً@e骀)��@�67�B#���%^^ѣ�|��C�f��f��}����!y}Z�� ��t�&?�E�{�G(��<�^�9�B���}�5��1B!a���߀�""׌jf�ы���V�̤h�#%����;$b�(e,/���괜�nW1��W�W��a
�d����:28q�D��f
ڨu��}^n�
@ V���o��u�0�I�K<��z�%_mPy��6��'��R�����%���ȶ���^JX�������u(��d��pU9_"Ĉwt7�-�'��z�U��ޭ���,,W��SC
��;�?��p2��n�G"�F��P�)��a��_�ӱC̄�J�pz>����*v  Zû^�qtZ�³���V��qy<��m�.ܩ#�ٲ�0?�����4�>��S�cZ��x�Q;�ar�(��G�cR��pv��j��w@�0��4����fz�fi���M/�nvo#spMȰ	�m��D�����O�;��%��6�A����V�UU�Pb�w�]���l��JX*�@�@���%0�n�=+B��Q�*�,�ȴ��G����E�+�kC�B�6ҿeU�H�*,�h�V��?�݅��;ݺ��v28�khM�k�~�?i�0L��17`�������】9&�l������:��u�!�:m���ܹ�Ç�6�w���=�0�x1�Jl�O�xn<��&羌��e"O<��-��f��&�$�Fvi�c��jJ��>�ð��,a��㒌�=��4��g#���d�dp�z���h|av����oÙJ��돓�ؿ�2YȄ����.��Կ:5Au� Aڤ���-ˍ��d��b ��Ũ�;�k��3��I��~�qz=�Hi2�Ȭgt�ƃ���Z����?d�r�hF#?��n�A�۫KM����</h���D�l���{�e��c}*|�3y�/�䧄�]3�x�[��A�d6������l�����l�aS�-�H�ài�i�83����fύo������2�ː��
����� N��!�$��Jdaptx�keBO������I/.�5�{�&�����O2���1Z3�������zc0v�[�mxeBIt^��\G�,5�x�yxy�*�EW���jIӵF Q��T5���luz�z�KWp��d�c���8���O��x�������=o�i����es�y�.��a4����
o|x'�|x�֫!�Ή��rC26��W�-�R&da�����)�	9/�_$t��<���S@C�Bj�������<��+������6ʦ��N�DUB� TR�~Sf46N���f_3�b(�7i�`��#�T�� ��BG���6%���Pl�>�pæD;�n��Њ�,I|�]/ʷ��˱��O�R��`���YS����7�[�S!Pk*�BS{S��h'�R�g�]hL:h�o\~��& �v�|�;d��7��ùߴFA��?��Y�T����C���K��\%��Fl��a#��'WT�|�wxɨ�oW0�b��#�v\�ϗG�ɔ�yl�C�������P�O�r`�S4x�B���r�Y�CFt�Y�ʞm����k�X"z���J����ME͠E=�~[�i셹�F�#,�e+�6�Z�O����/�w�2� �~R������T�����D�e��迉uà����O�#S�"���q��Bic�(vkCr� �LMiUY�3��M
��w��a�8�$}s1W���(D�W�JMlǔ�V�<�>G�3��;�R=���(�S�4y�j11����ޓߛ Sv�aI(�*�ݷ���u�&��'�������N�Т�MiEP�}D��f���L
f�2]��F�O�J��I�q������-��j��v�W�`��9����etv!�.���H������A��v����Qm��M��r9��pͯ��U��@a?鈢E	U2t9��jt������P4��#-L,�6��< �Sk*�ٛe*�pe�Y��%���7*�)8R*�=����~������&��.�W�#�br"�nJ��ަ%�.��Z�: <�S$�sC�V��"��a����#Ά��fRh:��C��Oh
&`3��>5KYȒ������<R�*�~�Wz(�a�q#^����o"��p؜�����W��0k��*�D+�K=/�	�yl�'Q�.�M0���#�����K#~�KI@[4گ(a��E�E�I����ܗu�-���!g��>�OW���.��ֆ_#������5^��u����V�������������h%QJ�6z�ݱSA��s�e�{2��$j+B��	D���oي�Dc��[$7�;E:%O��>°\��G���?���o���������g?���|������0[���O�������۷���CZ�x��IN�0DY��D���!�`����$�[���'��ؖ�=U���� %���D��O���b*%�"UNIk.
qk	�8o-��Nu��9�C.�L,�������F"#�_��3q���^�Q���(��չ��das���*|Pm7x�n=m��-��9N� ��謃G.9g�~iп`�N}"�=�4�i�!:A+0-c����?o[��s��6���/��Vdx�Vmo�H���_�p��VS���@��B�����T|�Thkob��kv�mJ	��ff��6������g���U�����ϟ�q[��ln[�g|ީ��Z��Ň������]%�]U���_yP�ӽ\.�Tez���r�q�;o�1�E�*mzҒ�Hǟ��#�qg�Y�E�*���9OkU	[�P��׊�֪Է��'.o�r�vm����Ɉ1���p�1t��ܖi0it!�e���
�V\6V����NQ�NY��o�K�V����F4�E�nF��r�͢(�6���K���B�R�~rtD'P�
^wJ�?mT�Ha��8�I�*�j�^��n�3xΕ���ɸM�p�/0nT�g�8ɼ���tb'x�^4���͵�)��L�zOʀ&��?����s��(�V+�v�ܽs��0Ȇ�t5���y�L���f3�������(�' z��H��."� zZ��em�k�
2:�L7��	&�c<p��lB m��xUK�YSw�J=O�(��x�A��Z�2���4���}���!��q��c�@d��6��A�\�ka��a�-�E�:�/�w��Ϟ�:�B�)� ߿��Uv������4W�����3����m�!T������++@9d����i�'l�Nr������;̷��Ȗ	���z�	zޙ�1��_;Z�0�0
�i���/���ܣ<E?x����TB(�72t�� k8YXA�z�SN���^�o2�	��M�\�%$��-�xq�l�dz!��<�pt�"����ǧ��.�1OIF���q��dۈW&�_㬥=�z��+l`	���i�qq4�h��nl,���@U����3�g�o�Q�XE��k��0��b!O�r6���y� z��&*��Ʌ��������F�b�	Ċ����{�`r[����0�3�x_��%m<�6��8:�kH>h2<�Ԙ�0)�{��,�)����3��<��u�����W����,A0���Jn^ J�D�1�>~�s��������ُ���V��v)*x��K
�0 ]����$ �֍ ��h�M�ƞ_��3����%"���,��	)y�Qqp>���b`����]r�\P���Ye��%��(��hM��6���l���3�*�\�*�S[����s��!>NR�r� ��@�m��_��Ա�a_uBE�x�SaO�0��~EWM6�Q܌&�@b����@��n@�=Tb��R�m�\2�t׾{��q���͙c��7� ���\͕ȑh�=ʘ�~-@�l�)�2�"|��ނH}�i��~h��1_8����˴嵧lΦ,�鰣"�}TN�$Jm�a��6$V����1p]ͦ ��2 %N���2pC����@��G�>��c�N��u��?��}4�u�{�7��bL�:YLf�Oߌ&dYdEub�΀?�Q���xl���I�/���75\f.�3��V0$GS:�46D(0��`�MVuY�Kv��T�Z��BU@ �}�����(��n����ɞ�3�M�!�Os�Hc��uU�R�a�����;�x�Z�s���W(\�Ƌ�\3=;$��%n�8M��L�G�6��nv�G����{�v7i3�L3����M��2�ӡ�����?\�\dy��B�FEP�V�N�v��i����j}Z���I�e<OF:J�V[�D�{��M�t�A��Щ��W�/��kĂ�Jm �Z��yLD���q���PQb��6/��Pf�� ]b{�O�[����<�\I����2���0?G�!tm�D8�L�u0��{�fﳓ}�-��ۿ�n��:���&KgR�����-:Z-tGl
�EK/3��[���^O4�Gɤi�Q�[���;3h��D�D7H�������e4�@7�	��䁰�������u�e�$@O_>��M}��*Q�o�D���D�oD�DR�G���7�'�$M&=��LN��2�.�cG4�a���8*����646�s��b��q|��g�l�t�@�=ZR�b��w�&���j�Fs�~����(�2�O.�,����v-�2!�Qp|L�LQt��0����Y2C��n#���B�b�f��R�GyB�8��Ŕ}ݰC���R��
m��;�e��Xx��ɔS�7Ę�S�VJ�J�8<�x����&������:"b#�@�m��0zxl�7���]�����v+�j7�&@?O�gl	��(��@KQR;�DN����TGo�8��� 1�;gK��s �#Qz�̐�k5:�J2BgQ�>pM���8��W��˿Q�Avş�&>1���	�~�4.U\X��LY	x�Q����kz�wn�k|���?��1a6d"���e,����.����;D:�B�~n�{��2���?+T�S��L#�7Q��6��D۷�=w��>/��{��c�o����jo�+��/�j3��K?��Iq�*�<luW���.��I{�>`��Nxe;����<�څAtI���U�� W����#d>��P� ��T��Ǧu�ר�]��HM���;�~���1�� ~�5EJ������'4��Xi��P����}2&'~"��H+������8��@�2��E�S�R��-R��e��J�S[58(�8��J��`w|�Ir)s[��`��m}8J|���������jBD=-��q_����J?%�����sf<*���Ľ�~)j!q��!w:���rה�qNT�ЩՋ�W/�L�Tt�Kܯ�ͥ +(U��	n�u�Ln��Pŉ\Ґ.X�(�'����T���Csޅ#���G���͓�f�P��f�����*?��V�kߛ5��5�(��1���%H��V�܅}�:�6�.Ͱ-rOk̍�C3�����u�r�0��Dm���(�����v��h�&0R�]nAU�ƮlJ�w�ϕ�P��Ǆ�����Wt�X(�7ؐa����bEЊA��BO�($J�p��(�5�6@�K껔Ǳ�w�����<��=���]Pz�BRE�!k�C%��hP��l���+kQ����EedG�$1�P�i�f)W�TOez�6��
z@���*�pj���Ȟ��̶�=&T��۵!]�J�s��,��$�6;����y�)X�Gs�tI{��d��)�TƏ�u��xYR���qԴ5���@�����}d�l�d�W�)�v�:,V�e�Ž{�NT����L�2�jL�V/ҬmlD�����7in���D�Z~��>���;>�i��9d%���Z\�h�]-)�� ��@6T�҅�:7�U�p'tB���Fr��n/����a&���g�b�M�����{����go���_���`��7(z�Zڷ���������h"u�S�$�����o^�]<?�j}*?��a!�y��rx�l9<���
R�6��j	+C�lq;8�<-��s6�cV����;,����{������Y���bY���S]`G�Hgt6����D�6k��t���XD�z&�����u{��%�5r@NP�Q�gP�����4���u��5f��������_�U�u�mA�:~ȥ8>�P��}���h*��"M T�o^,C��l�d�'���&�J��T�Iðe;���uu��h�d��Є�9�@�c�����1cn�� ݋H��| 4�TA�J}���vReM��N�G��F�+�	-�V��s��@�(� �Q��o�O�Y�&T�E.����6@8"��]Tܑå[�=����O��� �>�o%���x�"�@��9��8JT�D��.�.1�������'y[��rJ�H�/���nv:����gX*�ns�'�q���>�y7�=x�l^L����I�Er}o��p���,�%e�җ�+:/��r�
w<3�����
���r��Ҁ ��P���u��]�y������3W��j �s�h����@�~v�w���\��� ]�=fy�3�2����2����q�7=��E��U󭚥�t��N��0�"�`o�V�5�:�q���2
f~x�͂m\���`K<����\[�p�i�N1�
�FO���sE��;ha�I���b�}c�� 3��s��%ո�-��\r�Ľ\���:��1r�bw�I 6�@�%��I���2�)�yo�I�:O ;i|��*�(�d�EBxFkM�p�I���K{Bm�#5|1:��RC4&��h��f��m���{��'Qb��&V�1X7�vb��5����цJ�̭;N���p=;�숗�讞�~������l9���P�0t.>m����'�0^PD��X?�%��ɐ�9�ќj�'��]�4��Jf�A�(���'���}�Eou�^���x�{����V�� �!�2��'�dŧO�����9�Q�#Q7�O�EM
��a	���)�Ok\ĸ3�?>��G r��)(���.*3s�'�A�|�yc���a���4h�	R0���l�u�GSvE����a'�!zv���r}
@�k%
�$�?)q?�?�`�/�2����8����a!�y:��<�XL���:i��f����	�����h��N�4P����v�`�v�L�B�ˣj�S���Z�0��?v�V_x�Xmo�6�W�W�EQ˫�����,�e
�H�v��"ӶERI)/p����)Q��Ȱ"�c�x���wwVTg��~���6US�d�6�۪5�V�jޖY�We\��a�j�]�F5˴�~���d/�>捾�{�^D;	��2�iM����ɭ6�ڀ�]���[e�E^��D�HR��:��	i��eZ.�l�ί��IRVU����Ƃ�g�9�z����i���B������Y��������C��Y�g�S=WC��Tu��v�H<����)[�F����-����T�6M�mL��CѼ21�)'V�'����#�@NZ?��xQDKI������ͬ��<-�>�e���F�>����7jn�}U��M/�L�OVnL�{�3]h�ua�S�{���ktʛ�d��bt�hs�o�/������V�(��!��¾uQ���j���1�/]5e7��}B��ɺ��9hr�/>�W���[XG1���K��.��b��MQ��H�kC 9T������C����u5���q��}�l����H,�P$�0]�:	"\(�;�o��R�]$~�$��:f���S5�d�rĖlM1�($�gU��y���u��H)� 
h4 �a�̟��������|'��y:S��S�
��m�ik�}��p�<�l{J�$�ZQ�Y��9����/8�Ig��/���L��D)�P��� i_S����8X�YnӳB�%��A
 ��s.p�z�h�F�UeըԘa�oxP��B7�j�Z����˅z�yK�M�����K96٘N�~������8�L#	�c��.��[b��b�0�!�n�)�д��{��=)�ɏ�1����۱�a���e�3�T�6�s��3��0��� ]���dݹ�.T:���c�d�w�G�Su�6����d����<��u�q`״�-�C��%u%G��l����	��GY?�q|��Ę_2�s�m^�KfU�c:*v�n�;�H1x�����]��f��� �!ۭ�l�z�1��� '!>��#~(T$�]�x,rt�k�Չ��:	��%	�s�����%�\{�����Xwװ����v��PJ��	"����Ɨ.�\Z����JU�9L�zt���]��`!�C�G;��<����}��>��U(ʬ�?�a�kb�?{��a̱�*g �לP�4�1����E�%կa�t��S(\'��]�#��!t'��@��%
����d�(�/�,w~���hyl��)X��喁cE��/D�������y�����w�ރ�D�[r���Fl�ъc��&�T%�8������@D�z��yK������}���T���q�_�L@k�d�|lFR4��3�M��H��X�Π��sˍ�c��]8�K�v`9�z�ԟ��d�PH�p���^�8JujA��(e#��,�:���58��A�@������bj4�=�D�ה܎0�v�� W�k��ӧ[.���/,�/�R�}�hXC�jCK��(�9�ʋ�*>�'%QF����|�%�<��N���V�Z?H��ȧF�/���:i`zaz�Sy�k���;p�\)»J��o�i'���:�b� ��8=t���d��ĒXxN>��?ґ���{���?����h7ȡ�]�06Nls�����U<ܗ������xNZ^F'����(E�&ns�&+tj����T���?f�u��r�o��-�2�������+��-$� �,
4*.�E���� 9� o킞��5��Pf-�0��a��]�RMD�N��ϟN4Lg��_�ʬ�,�l��tͩ|~�k#{��Q��	�1Ӧ2�M�EY�x�?����I�*	T�!�+RU���j�p��N�`<����c\�Z⊲�)��� L�y���t��Q6�����P�y�1 @v�k�<�J�?@�5�˴h����L�$5�g�5�7��(��gx���!�!��}&�����\c��y�h(��UI�#�Ƙ�� �E.�.�󨝎1���x8����+�CS�M��6��h=Qb:~Ji��VaaY'3��z���;	��"{ ����nʉxUR[k�0޳�!O-�����T[i�;�J�<����,{��~�Դ[�`tt�w;�{[�����/�Ӵ�2���i���6�{~ͱ�覹�o���ܠ�'�6z<��8���W:��0�6�è5�5]5uL��jx��l=Uf0Ñ*j���h� ��a�T�FsK�s�1��|��TM��`z��f��Ey�X��VW=�h�ޯ�b�����M�i<F����[����7'se������hvp�u�t��9����s����]�:�/�c���������B��ـ���KgO��	":�� J����"�8�o�L�������[k������"����t����N��"޶z�r]��^3Jѻ��k7a�ٟ������~���X���DIY�����`%΋�vB���"tH��=Kb��~�<����H^�T�H�7�ਉ<ɶ�ȟ�	sy�',�v�
�W(�1��5��
��IdB�cZ
�3Z�m�T"�fL�f+7E�A�6�R���y������\�,Tl�2�K��^�畢U���'e�)��`*ɘXǔ�5{��$,C�U�n�})×(Q��FR�J�åT�;Q��d)��81t�G�����:���Z|`[��Вr���?5�E�X,x��o�0��
��LJ";Dɦ�!��CӤi봗i�8ĉ��6д��>;�A�Viڳy�'�{�;��'�"��x�j��J�L"�����ܡ��@�JAM�4ސ�'�����u<Y�ֺ�a����V(y����(g�U�d@,|`�'R](�Z��b��A��b֒�{�e�%)���;N՚R^��<e5`i)�9-t�aJc!S*g@	�Rs�lAX�]���z=��Ȍ�I6V�M�U��&��h^r��cRۈ��څ,ώ�E��=x���xd��	���I���x�W	R�ɭ�dBA
ڀ�G���gG3���<��3�oK�4�IA2*Q�a�4U8�+Rq�W̤U�,׶8X��I�]r���׏��}-J�)���Lsj�0Q�h�����%	Ii�C� ���M'��q�?z�7����]�����ں|�V�TE4y��۟��P��|�޻��}_��c�\p����B�\p���w���^w~p��',���B�ڲ��R�����"����^���f {'(7DG�5"Δ�nH�Y-���eK��F���`��Ԏ9��}$eE6ZV�uK�>��N=�u}߳!���o^D*x}T]k�0ݫ�+4(�&�HG7�����XYC�PJQc�8r��tk�߹�;�8�_:��s�\V�����˻���բԵ���}c��,��L\��U'l;�6ҲL-eS�����G(��}�N'8J�K�Y{�+���6�ckZ�r�_U�N?QF)_�\W2�&O�R��E;r�B:��
]�Q6��,*���佞�Ο�f��O���D���̩��C:\�j��n+��1�O�@��GL{Q'�6ʾ��GQ?E:T?�S&�i��D�W��H[��U��L�)�Ƽ)��=<N�; �0Q����������o���fP�ob�*���L:y[5v��.�OFt!m*{���b/�H/��!m0�S���B��\��Qk4�x"�ZUs�a;6�vx�#�nU�����N|SޯW��砷^�TyY٘�jDL���ʨ�(��]�x�o��ABW-�u��	��8�N�`�e_�A?R��c�;�|oM�@�D@����ߦ	�r���O�]�ݞ��� r�&��ךpV�ؒ���~y�*����ië��� ������`�!�V�� ɷ���KY/#_���p�\��*K[Q��%�@��]#����U��s�<�qG�@\���x%�=H��`n +>��%~���*�X�1����_�H��x��MO�@Eݶ�bRM��,H�E!ƈv��[:��ԙ)���).D�q�r�}/�-s�$�^��ߊ�l��Pr����*r5�I�" �ȧ��u��|��T�9F*�X�ht/��c	�6��Ū2���Fs���>Rw���7���0Fʪ�ND�V Z�V��n��U�S��r�xS!E*���B�g	.����.���g��ۛ�BO�W�R���h�؉k�3�J���i%y��y�&��Ui�$c&��U�|��w�~�[h��g��~��؇��֕�¿ϭ?�[z�3x��_O�0�}�b�&@LML����1�0}�K��Fakg�!h� �I|��=���s�q��v��� uYjρ�h�9i;6АE�&��4ێ��*�!�J!���F��!�X}½�y�,P�l�A�$�)e x�ܟj���[���6��5��B�Ab\�r@R��x�����s&�h� ��onH(�	D����%@y�82�u(w0��Cn���^^��x^�S�-��v����堒��������Ȁʆ=�b��nT,�R�
n�C���צO:�mq��Z�P��9��}Z�҅��aZD�l̙����VJ�|!�f��@�v�'��c r\Ƒ[�ˌe��!7��(V��i�~�������`
��j���|�%Zx+)JMU0�0`01 ����b���{���ic�<��䲯e�f&&
>�ή~��Yi\�c�N�x?ӵuv��ߡJ�\]|]�rS���7��0i�O����n�^-�/PEY���E�zY����jd�/:��:����w?�Q���f���_1�cƂ+�WK">��*٣|������<��'m[V�s��}���\�e��ȷ�ZF'3(�4�����ɸ��`��D�1� �s�x��Aj�0@Ѭu���<Ҍ<PJ�G��Qc��bOL������/m]gD�خ
�0�Q���B��YC�Uk�U$�߼�f@�@��KLReJ%�ȽD�1`¡��.?��v8�M�v�����v̫��;�g7�|A!J���+�;��:w�EM'0=��?�:/�TiG3x��Qj�0D��S� H+K�B���V�8PKAVs���A~�y�Fڶ=����B*�B(sRd��-J�"\��F���u�QGh}�)�B%�D9:�(d�	g�����u��������z�������u��+8?�8�'���7�]��V�w-0V�����ܹ�j~�YIxmQAN�0�j�bU�`K��$Jվ �Hc'�������Y'qh��Z����<�������SM��������=T�+�E'��W'ᛳ�6U�7�u,��D
��LHή;ΦFBd�\�qZ,{א�	�Y&4���qA����4b61��g���T�S�9�߰rM^ќ��Oa@����	D�7�D���&��um<qݫ�㎓B��+���ln�&ӱ����Py��7�=)� 'c)^5G�&�b�6��,��:�A+��7�+x��A
!@[{��B�ڌѶM����0*�����m������Y�Fg���$��d$)�d�����D�SQ��x��\�U�qm+����㽡��!<Ϡ�쬵�K�Rж��,�5���U��.<Nx���n�0�w�O�e;�D�VS5-��KH<�.1hڻ/F�a�r��?��;�6P�/UP�����q��>�O|Щǚ)��A^�l]e��:����}Cԋ,SN#����_�i��x���;�'��:�x�P�(�w�Bz0�j$Yӵ�x|=M�/��f�NC�H�u�T�`t���;*���m�j��:�*g��W�i45�2�+h�l�a~Y�M������c����9{��]�˼��lq�5jξ��K2����[:�Z@΋)7�'���.m���M �)P.���hV S֨�]d߱3IO��*����D��x+)JMU07b040031Q��tv�ve���Uxz���ضD;K����^�J�\]|]�rS���7��0i�O����n�^-�/ ��x���j�0����BQ�!�0��Lm�Cv]�*e��k[3��J�CȻG�q2M�P����w�=R%U����O��Z��L���@���`d�#��K7lǎ����qW��Y����Y;�(�����f����^�~ 4-����c��*�N��!r+�bآNCs���ƍ�A�ؽ�X�h�y-vH�	=6��|�z8˩;�=KT��� }��o���ㄈ���Ȥt��OaXa%�^j���Mf�~�}�&-W(Z2���lpM��a��6IKᆡ�f=v>0j�	-�k�Z���x��;5���Fhя�	h'`�г��Q�qVC�'���<�|UO����U1].<\��g�����ݽ��j��6Cq�t��/�Ukֶ��9X=�!���K����Gܿ�s�L��U��yl;aR3�b�w��ů�#1��c������Q��x��A� E]s�����1n=�AI
$=�����O^����<@��4vf��� �,E���6��'�ƨ	I�V֢��l;�^��7\�3�\��ۣ��M��+(M"���Y������\q�yd��/">;6x��Mo�@�{�_1�,*&n�J-(��9Tm*�=E9,0�m�.Z;Q��������	��;���;�.�����AV5R��}����`;���V��짏�����@�[1���׬�{�KP����:�S��n(�W��(j�IaV�v�(�������o/l��^aߧ�N6��$�V�Q����Ȏ���FԵ(��̀�w������yjy�B��Ҋ`��Г���}oꕛZ&�@�����qd�w�'�V,&xy�Ѥ��F�F~�]��1����VV�����3���#[��M������t��~E�み�2 F_�V�*����d�1ʸ�_��}Vx�y:��{m�d:w�r����%�h�	$����;[y���4�¹�i��y�p�t+\D����c�l����h~�N�k&	�N|�9�Αa��U�U�;�0l���o��a:~g����_��,�Q�3��o����U2H�Qg�����`�0Hx+)JMU012`01 �ļ��Ē���b֛�k���D���ɻq�z��^��f&&
��E�zY��J1�N���m��Mm�+��gP%)�%����E�`�'���˫��z�Ȼj!��pu�$�¢���Ĥ�:G���l����^k��q��S�e��rs�RA�^ML�Rӟ��Jb������pEU�>��)�y� �s�޸w�pv»o&�|K���$S�Y\��ZRVy[��\�Y��F��ks�M�*+HLO-�y���&�˳���J���m�ӁYA~Ai�ByfJzjI1���77�.�0KS4d�t/[�
jVqrQ~NNH>ȸ��5��l�s>ɉ]�\QP�A�	LYؗqK/�I�ep��:�s�j��D z馑x�Q�J�0�ܧ�ZX/b[A<������ݦ�IM�b�ݤY(�ApN3��|?SK]����IѺ^VI�"�U>
�18��)I���cD3�%��K���юM,���1�s0�i{6�\�B�Ckp�Y/4֓1(Kb�,Ѷ�� �2hԑ����X��t7��	� ��k�!&f %��ܝ67���"t�G��9�y|H	�«�ú[�<�-��y�����<��ɮ�#�MJN�2�r6�x��oD^ ߇|5;~˳ ��W���b���h�7e��L��x�UMo�@��S���B�ΥǑ�z���Ŭ��,I���ޙ��bm�C�T���������G�[-�}�nL~L[���[��V�H�@�ׅUM����u��E��s�-Zmw��"-뽭�h+ե���"*�������A��r<��<x��ڑ�*'�c�_�f�)L/�_�P�m�U΀�A?#moj�s-���DKe:��.�+�>�c'�'Bs�Ƅ����憫��4���uPOO���#�UZ���m3�[`���0���W",&���?��˘�iU�x����H	a<�J�t8#g��a��}�`�&���Ҳ�	���1z���dB�k��/*�Ox�%��9��;- �>4���5�J��`��yT�o��J���q�J(�
�X�����\iVt�#,u'i�Bg�{����3��p d�új�Y<����"��5�s�z��:��MemBߟ��%����\ؒ`}1�gy2���>3>��sK����$��R�-s�+l�ؐ���B��Ò��
�-�8ͩe��u(�~dO�6��WX9:Y�%�1Y�"}>��tϪ�Ps�(���-Q3>���y]Ȧ�F��p�qZ&���^C]�9��^�͟���I�w�S�I%����;��4����o�xx��]s�ȕ����K7��h�Ȼ�f�[[EI��D������$("&.@Z�����=���<��k[$��|��4[�3w�����?>�����h0�_�ۻ������d����|Ϊ:/�����/2w��O�I����S�?�v���-�駞}�.�,s�r�{L��]��b��ؠ������g��m��e�<)���7q8eUZ|]煛�X���|�[��uYV=wV�;���~|z��������M��|˪����m�j��v���J7�@����]�������b6�2��ĕK�[�r�ϳ��ܢ��7Y��<�櫴xȋ��}Q�\�^����	�Ɵ�*K7�u����,n_�eY�̸:
HBZdu�Px�w��̥��{*�U�D�r#�ꕞGF�N�;{��bW�5D�8�4�Y����~g�u��b���>E�;ԥ��o��H�wP����th�Jbҳ�(�����k �S$�|< �E���v�Fħ��|�WS҂�M�)��,-�\	-��V�C�n��D��~�*�)m O&�����'�&��� �=	��%B|��$
�:�a�}����wY�8y��}�w�p��I���| �F�ei����
��\�Y�U(5�F)���Peˬ���#@�'�&�
����}���v�B���t'P$��Wp�\�t�ɛ���q@i�`H@T�!}�(�/��{���[A�/�,�,�Լ\�����a�$.���Y*��8 #������@)j��٣�g�������E�h$j�E)��<�igZ
c�lnB���A��V
t !�,�L�g.���(�?�	X�˒03`+q�C�N������
��W��ϱ6��I25�O���u��c�yV�R�-$�|��derC:�K4yU�:���7�"_
�&�K��~I7�u֋O��]���\mY�2N�,u8�FD�n���h��q�B����s�X�N�V�#E/W��VA�}\��,y2�5P�@�X��[�[�<���V:�����F.H?>9�ʫ$����D	�'����.��?��ӷ�=Sv�H3J�߿�ع�B7Z=�r�*���:{��[�-fl��j�=����y����.{��,���{�n+�d܈��Q��9&� 8��g12� v,V��8/�^��,AA�Ɏ4?!W��1T�n��uF|nnim2S�����m�?�B��,1���/A�T�����@1���e�E��q�gI1A��>��*��'�BO�vA�\�Zyu�JB8z����2#�T.u���s��dq�w+2
"7g�%�!d��`%����,��o5��qG� �1��į�)0�1;	=hL��"��/�"ʕ3s$��&�����M�D�������]Z=A�TNL.�ؼ���M��'��Y*��� 0����I��Z��$%/�%���-��Y���F �=����r����7���P��Ʒ��ģmn��Qe�������`�i���w~3�N�7��������p��.���xxv����O7���y_(���Ĳ��Ҧ�MC��T豬��p�	e��:I%'��:�BZ�*׊4u*yH3�QTР&[$fӆ,/P�� �빆��G��G��R�%�� o��Y���Q/{@���X��޴��[��z.ñ� �&$�ɿ�>b���o^��?{���S��6�-`�uwv۲~|f�KM�!���!|y�K���B�D��ƒ5��OɎ�p�x�%"&r�:2�b��+��%��:'�����PwG�ӏ���׃��N2	6��1�x�I[��l�C	�$����0i�%�$m�l6a�A�8#@y���N�]|*�\�2��E�\�0/C�iO����S�'�b�砭�%���P�TP�����w�N%bP{hIT�1>1�*É�xܗ��e$���pȯP��$!������j��O{�I�C��vf>,�������ZC|^ъ��o�nR#�*����rh�,dCH�S:l����0*,�m>ߗ���-ny
�N�ᓭJL�LX��T��b���ϣm`b�N�R��|p_�l+�B���e
���a2�-4$[�g�pVg��m�[�5i��g��أ��� +�)�$�D�>�k���+(�){,�I�v�T�s�3�ko̱v�'�-��.���6x�9��T}�+@�ɠ-<�o�c>�wW�T
<�:x�������ނ�Fp�B"l�%F�v�Ns�]Wd)��M(��N�tF��
.����V���sAx�!���[4�۶"��Jt���/�5B 8s�PK��Q� gm��B^-�����A�����y��.����ð��m�`��e�:��|��ƚ��
݊�)�u����N|=s�!��b��\�"Rlo�&"T8fI��y�[c^-�]��e�`��1�oD�-Y)�jcI&).�P}��[U�B�^?�q�8�N��U*�RP�T����Ez�\��������fY-�� �Λ�''_I)$Jr}�IZ�4発�!�QX['z<32+c�%|��Ap��tS��B�CU�Pv����w�t4��ye{�:m�:9�G|����v���	a4[ӆ������ʷt�r�&�>�v�j&]�2��]�� �nc���5��@�j���u�$x����T+rS��]�ё����!��>W����`����M��=*���ϱH,4p5_E�A�2\&h����<�$��Z=捰��,��2{�ԇ�1��,�ͺ�ʌD7��������ҽ"� w�!tc�W�s�T8�Q��FiҐo��D��g� ��G#�3򭸠��%�:���l�j�<H'z_� �nLIH%�:��jI	�����D�.��1��Q[�A��5�k>���_�yD"բ<;&Ǌ80|k�'���٪h�T���T�GEi�'.p�B���A���<�Hr����.�\����7�}�I��+�x����}p ��B ���_�ʗ�᝔��%B�6�7z���OeE6�Vg#VSuc�]���c[�`�#R#���AR�5S(y<2�h�ݍ�穖��������e���[��:�������*�t#$�|�k	�Y���ӑ�G�I�{Mi͊�5��� ��m�3���	G(�SOU�$d?4�Q����~|?������6���$��ݩE��$�$Q/s{�C��>�Tho ��?'$o����F�l���yIkZ�e��gN�<{�X."�7w��Du#��6P�ͽ�IDVl�CvL�Aysz��&�r�O��M�ؼ6C�|2���|bHB��3���Z�=�-]�A�Ě��zeJƞhX��mU�)WjAV;�����TjSb��r{�b��@dUTY%�J�Ap���+��{���%η��A���9�T�<�����gp���s�o耬��o���P$
%�u( \����d>hYx����L�5A�`s��Ii��S׺X
�ڊ�P"*OI��l/����f��D�6f=�k�fMM~
.�0��I��dOE�˽�7搹D��s�h3w�b��"�&�����x>	]���y��򥼔����h]��_8���k�G���%]t�9d�bK��P�Pح������}����[���7Iδ����B-</��y�oIi�܉j1~�6r.���t�
UM��ږ#0q��i�aW�p�j�������`�T��S�
�8���,&lMN�`�e4�b�2쌨gV�$�e�����|'����N�=���+0θ���Pn\7E2��F����B��gB��1���B	�/,o��9*!cT�.$���������V9��U��/��dt�K�])�3�euk��5ah�.�i!����H�q������"�-�-��8ioy~�&���g�{J𔍖��.�v�B�K4�6[j&�y�l�[����զ�$@�d�T6�����A�r�J��	�o�w��t8 �ŋ����bS�%@��%��p[Ğ^�����>u��!h�F�o��_��^�8�&M�SƋ�&�w�J3T�|�A��P�[_�0|L�U�C"&h햘P���]PJ^�6����0���YOOՍZ��*�����{v���yJ�o���W]@��5iT\��!��C�<SBN�1_۰��?�:����*��E��A1-�`!����d���~
Ge��*���~�׭���x�2���u�K~�S5�pV��aO�L��W��ey�Z�j{u���bg D������/OI޻�V���n���f�Ƶ���
�s��)nȷ��H.���ZR���O�-
�d^�/�-q���cI��C�ƽc@�(*b��hI���@mcč��]��be���e��܋��{��~��SNt`g��XƸCw���J�F��ך!ū��	Byqb��֒°��p(l�\Hj-P8=���G3��>�E�㺀Pc�ͽ ����~�`�<�z:ũ��f\h�zз�xZL �6��w,������<��}V��)7�(�^�J"�ǴO$L1�"񳄄j9�z�pNja�N����~�G��[QX���lYႌ��mZ��_ �H�SrY\�6� ����L��f�f2!�WE�R�_��o�Č�4��Ep���ő�XO�]"��31�(���^=0;T	��H	���%J�)1��s!w��|�&�C��f�\,�����tAǸ;iB<�'�C��\���B��ΐ4��k�'�HK*�óh���0���*�w���;˭uCK �6�G��`��T�(@6�yI>������e�m+��ʠ#/|-��Qfֆ�׶P��׌q��IZ��	��,�j;��-{�ܩ*�J|O���>dڷ>ܳ��,%��L(�����A�m��̃E�,b4�$�A�~�V/����/�6?P��柭[g�Y�~��Qқ�r��,mb�l��n�j<|%+B>�.v:n���8�]�@o�)��M��@�>班������!�n��M@�ڥi8�����<�%�Ƀ�v1kY`�93�叴�i7�%��K��h7�J`
D-��+�q3�$����$KV�|� ��V�G��y�%��>[P�i���y�}5�@� ~<�q�I2c�>q����K�˻�	�#^��U���U�iM�0jm�q�C��c�~��n�y�a��B� ;>ttV%�Q�5}�rR�3Q4�In�1?9��CtX�6Gry�D�,b`��! yGi��.�m!)��tu�Trbd�J��m$�S���=��81�N��Ù����pK���әx!�1c
6?ܰ��=�#HxO/���\�}��>������S����?�kF�ΙE���9~����Lm��C"f(c{���r��Ŵ����Ϳwg����SuTp���\��444 Z�_�>�RI%��&����x��a���K<��zf$_mPu��6��_��L
knf��k$a�Ȏ���YJD���B^�&��f2^M���/��=�&��s�~3�*i�����r��37�-��:��F���89���|7�#�;0��|(֔�����"L-��b� ��{>��98**�Z���L��j_�x�{{�a-��WD B[ԅ;u�6_�1͏�A�:5���a >eT}HVq�c�!��2�*z<&],>�/��AR���,�ĄW9�G $�Lh���An_������m<�)3l�@s�x�ߗ���.���t����������V�U]��b�w�Rݐ5+�����0�< �@P���Y��/V����y|�0Ef�� �#�凹@�;�C�Fz�H��TY#��,!`�'ӵ:��ݸ/��?�����i���y�n2pӫ���|�?��$��v�.ǃ���t�W���AOύz����f;�ԍ�<��t0��[&m����ݻ��-���Ϯ���v>���/W�Qr���g2�k�p侌��}�5�;~���������w�t[�n���p0I`���␩����ܗ����� �\t��2]�܀och�&��E���OP<��������F�
FS�g�9�1��g����ɧ��������p�:�NGa�}O���u�{��ۛ� �H��o�����_\������l�t�������у�$v����M��R��iZ������|:��zy�c&w����o&S���Ρ�?�w�����\rHƃ���kjz<�.7#�p�wCy�d�Y�]����w��
�G�#h�0;zO�9\z���-�V�����j���d6�܇� -:�gH��A�� 
!��}����8��FSxy��&���a��@�����
�r��NZ䃰��Nė��O*�
k���~n������'\\� _v��O����>�tƃ�b��??�cZzB+ ��c�L)�����p|�I��ex}�B�|���aM�2�D�M�"
nx�Q�W�t�iWqW��l�c���8��pN�-L��n8�vr����[[�ʀ��l�ޑ6����MM��6����3�H�B8��4��x]n����H�49��aS�/��-,� hНR-�P�����8)��0T�*-�tP�����x�Ԁ��Ȃo�,�ثl�_��I�%l�S��~�f41N���a_3��PdޔUM�XƩ� �ӥX��j{KV����`s:�Ms�Ǝn��K+~��L���ZhY�E^�i[�v�me{�.��2����P�%�GM�pDm�L�d@���M�M��\E'ٕ��Qb^Rqė����.7I��i���ME�w����?��U{�X��cl*�9ٞ�Eb���x�Z�in�>�Ǉ��ڙ\Qm�|�^������FZ����}]�$�>�6S��]�2 'G��B�;>K��Y>@�/BQ��Vtn�?;�d̮0Dٳ���w�r,1h����,�����T�;h'�o[<�����B蝠,�e;�������/��;�M��e�A
~e�oll7�vz�i�D�e��还��m���~t�W5B��`;L���Xy'���Kr�dƙ�Ҫ���fw۔Dߕ��Pv��L�s�t@��G��SG�1e��?LlΑ�̿���I�?���I�rY��X�MS��˨?��{�{d�N6,�ZE����k��i�6���������k ��	���^X}|sbZ0Ð��z�6z�~z��:GN�����E��m�(�^�2���o�� �)��zڪ��a�f�#}�*����v���8Qm��M��z;��p��^M�ƌf��y�M	u2t9����QK��NCш��{���0;��#���ӦbWv�\]r�^�{�֞�#�"�Ú��1̿+�����=¥��|b�1&'�����a5#ILy���UR�Vg ��q�Dsnc�����X��9�hsd��d�fZ�z;��/i^)>�L���&�iX�B�`Z���'�VBگ�PT��A,����4Q��p8`����7��0�5*�i줛.M�пa*&�q؟E��J������O��7R`K�',���/%!�b0�~E	G�/zdY̘�7�>�k����j*�o/��'�t�+�P�w����k���{<��&���ư�p6�
U4������9~���@	���z�=��A��s�e�{2�ѤjkBԔD���tيp��q:�@�Krkc)����~a�.D���#y3xeP�� u�� ơ��N������ �kK����L�](�ָ@��<�=�����U/��rۋ�أSw�Ze����ه��0Lt�h�6 FA	Q����n�IH���l�b#mI)	X>�px;x1ˏ�#�[���dp]4�~ ��u&[��Z���kO����s���X_Z�jܛ��~v�2�e�t��*_��`0���U�Ŕ�����O*���` ;�\�K:�����x�\����u���WP��
0A.)�NL.�Ǖ�D����$��� Ç�$( ܇�����3�\��mr�����7NWE����o���p��d��؄�x���w�8��8��*��]�79��jW/�r�Ʒ�|����j�'�C4M����e���M�4�m����/rU�P�,���8��hZ�zWnz�Í*{�^,��,�J��"if�#&�m�[��0�s���v�����e;i���ޮs���C��'�b��e����8��AU���<H�����b�K/{ˆY�m�$�&Y���\��,�N�o.Vݪ��ܮ�"��t[�k��CT����y��s���t£7���)�m�g�*,�U�\����Z�h����������U�K}��\�8p�d�YY�V��G·��M�_��0}/�4RD�B�u���Սz���m�f�A��+U뤑 )ʐ�������n�����L���V��!K�/�ݻY�&�~��JU��kt��|�7�z�$��sH�����,�݉bŃ�$�F�u���x��7P�RHn����DG�^�4���E�o������$/��F��,zЫJ��R�k'����e2��V��DK~9զ)��uI��`C2h�aM����HEK���(��bB��G9���@�_H10}��V�|�5ěl��/G�o���Q��Q��)�%3r�&�Ԡ{�Cu�]Ū���0C<{:=��@���9�|(���a�af�Ǿ��,A�2+��pQ�Wa4<��0�>�?x=Q�zh�˹s�;�r�ҵ�Y�˯�`f��p�7�����ß޶�s�m(��k5�(��*Y�
㫸��ïW�2�ߗWq�W�׫���� C��k�Ƃ���z�|�Ó��|y��3_�y������xT`"6����A_��d���n��p�O!���|�'�s�}���p�Cv��.��sg`NOì�<�2��b�	�2�|=1W:l�k�6���t��Lu��d[2G:�R��'.�
�86(݈i�<����a��٫ Gu΄<�`�����+My7�U��%�D'#
�T��>["N�3�B��ճ:z����F�(������98&���K�n��7�����Jl�J�.��,^a�$�����
�Ob�u�ˮ�X��b�i ���I�'4rwʴ,n+]����x�l��r�ꢤ��wY�~��7~3<�S|�lUY�7�:�����`0��⟓��m��M�<����8Kmw��*��������v�kvvyw_�۫�y�L���M�_�'U/����]�ѧ�=y�18S�$�̯�'���������$=}��wѰ�F0�'[>������cUlړ4�3���~e��w���N�)\4��\�ap����s��s�h~�Msx/9'<�e7�^P�T%�Ί\���7�����@�B������`��$�A�fˍ�I�^r��Ej�&��{�t���c���ا�vW-�,�Є�$�O���۲T�G�	��ujf���6���,`m���7̹d����#�?��oL���V���Y?���t�����@�GH�Of�b\�/f�BƤuA<׍I�PO�x�U:U�G�l?�̳n�d8����d8Yj�I&c�����s�l9��el�2>Xt�����k���ȕ\# ��N<r���q#�OU�MƼ�]����R!rIaO�O�(�g�$�b���V���l��z8/��J�-�ĬX�ƋlQ'��l��q�p�?��*ٿ��y��i�T���`��S�RaR�7�g��B%��U�I��bWf�@g�z)����6Ҕ� �2	G��q�6s�ӳ1*u����R���P��$#6҅H(.�>������r�l=L=�@~LO�aQ.�ˍZ}�#�O��T��Y�ɇ����l�)�-�̖����������V��~��E���D�Ӡ���H3��"�>1
���	"�݂-�oc9����-8��7�迢j7[��>F֛�+�_
nAq6Jν����44�J�<�z�5�H�J����l�~Rw��v��\M���b� |��jg�)�2g6�Q������wAlf�����1��sk&:>�vY���͌!��&*� q���Nb�6 :��e����ȕ�/�A������a<�:�vv�YM�A�'y7� ��=P�.�Ԯ#���,���X:�b�e A��gaz�X��1�L�|6�ꓽ�!�"�U?f��i�'��Х�GC '�	Ȁ��@c]���)[�ѳH�$yrҥ	(ސ�̕	��Hxv�6*斿]�R�1����r�F�3���f\Ԓ
��n�9��Ho&�%�7=sp�[�e��IۧCg>R8Ӵ��)�2���h��+�-'�e�]�|W��k~gz�6���`J�|�/m;Ys���Boo�;拞rֽ	��08=�a��TH\�Am��|��:��q�ğG��h)��&v�2�s�ζe"���� ���c�%>)�cۨ� �鿾�3m��x�z�#��>=�(���C5#|d�f��j ә��Gw���0eX]/�!'���l5�dci�ۈ��Z�Ө\��$ 0�#�q�)��N�s��xI��>�D��N@/Y;�������R��_%��8B�i���H�qgi:{�fgu�D�WE�	��f&�F�\b�>% +���8��5�C`l5Krش�]?��-�����`�@&\b��j#� �$3�ATߊ~�2���+��۫�Z^\��"�N 1̖z���..����xY���۶������""��S�p�
ᜯ�B��ë*��i��.���@��Ֆ��]�<f/�����@�!ȗ��m@��S������v�n�EH�e>�	�	�n���Uw��s���A�9��$N����xo��~��8ͺ/}r�N�0�*h�C���.!�m��DwѴ��Y%�� ]Ͽ?����n��f�����&��ۨ='��se�k���ݤ�U���A&�VL����� PF5�J�R���ק����]���&�9���# ʿ.�zF����1�����/*���,��t���������1�V�%�kr����<�^ ��qD���_���j0�7@�W�~�$lC��'���T���4�SzT�D�!XCyn$��Jw�R�f�2e`�I�Q���xk��\
R���I�QOg�<ԥ�M:8g�6|Y!^hL�n"d���Ζe����nE��ٹ�w����&A��y�<mkw�T�9X���v�<g�4={!��U��M@����J""�� �~��;�y�1`p�2���ynWD�ݢIQ�~zڶ_�����܅[�O0��Ь��l��IO�e Xds|����)�eyyaA+Y�3�g��̋�'���cQ���+D��o���rj��;[���O+/�P�^ B6cYg�Eꎯs�˩��C�\���Y�CQ����uz�cH\����ds��3�Р���
���5i2'g��k'�~�ʭ���o�㢯3�����{�̘�y%1���3�Dmvk�+.Cs]	}�5[x�0��=�~�q:~��yz��.������q\�ac����H�yw���� �\����|�
�̘6o�k����{T�ԋ�ףQl6;�?��C���9���g=�m����$� N��Z����6v� �g������m��8f��ܸ�@-RI�-bk����5�^-�	@x[�p���ZF�Q�ACT~ש��-���YN~�h����,�n "P�VIh  L#�%\��7y���@��>!",�8$�_6e0���xEB=��� y
&��)(��D-j�`�mE�|�o���_E�N��<��o��P�Xa*.,�1ǷP�@�N>�����'>:R�aD�������]]ܴZp.�O����	(��Q�%�h��-xf/F��Qq#&��K*8 ���2�����
.�%P'\[?O�5��ϻu�� �}�P�\q�G >�P��#s��{�����=����
�;
�h�F�d$7{(�����-�:d�pf���.*��dv zu��Wb�[��`��v�B���;�1���!�)�t��P݌ *�s�W��u�Fp�X�\|���F}D��o�H };"�gܓ����d���C����UT����!k���@:�h�a�&�����4D����r���a1K:�d������]��pm�5g;q|n� ���|嵦��=��~@��]JU�ۻ[2��q]�g�kE0���*��m$���0ny��7a`�u��ܐu���}p�u�Z� �S�9�Z�5�������3G�o�b:�L���@S��^E�){�F��z0���8�/}0��NB��d�5I��X�s�����lG��p��I5@?$*m�dGظu��&��d��j,u��K���0-�{�c�`��ᾉy&4"@��L�% ��'�5�G֥���[^�~ںdf@5q����!�n�p:��+�i�(^Y��ם�O�CPl�Z� z� ���Ѿm7��r�Ua.���`J.�F%v�N��m�e�np��2LO��y���)<>]|�bl�؎G#r�G-�GN*�f�"/�P.�9�-"��(X��U��47uYK:]�J��q�3�İ)��/�c��Wg���h���7h�X ������#�a&O���`"���2Z�_Á-P&(�ˏz���6&�j���D����k������U?��yE���X潑�Z;d]I��c3�����S킛�GEa	3�-fA���MM*	�ʙW0צ�sh5��"Bc<���wh�����
~P�y�cT^ <v����K%���q{{�i��(#�#�.�ݹ�ܴ9no�ףڢf���T�Q�����{���G��@{��bT�"��F����ݢ��v�(U�Â��ZƶI��,c� �4q�-�/I �a5.�K�j\ׯ�9�0�!��Al�;���:��.>���U��C�i�*d��	c���}0������(�� A�`�oV��A�$�]�&:"��>�d$��b�%&�dZ.�a��0����e�����������A��"`���\rz�%x��X�9rD6�фv|>�hG��]�Ș1�{�2�v��(��Y���$�����Ԥ��4c�s)�P�4S��{J��#��.�.o6��8�����&���v	� u��tYpe����� l���wM�>~�|�CH�~�#����� �+�7�*_����&A��D�[~<�|�]�L��ѳ %� ;:9��M�4Rx/אvTZ#d�k�z�o�9�;�ϐ1���{�h�@�@�&��Wۻi����Z�7�^��q7A�7� �~	�@уT�;�Gd
�],s-_�� 3;���E
����z���5 ^Y<AR���s �e����:4�5�����-�T��|)���D�6�jQ ��#K ���D�}��?�i���5�(�Jϊ��s�T����e�� ���M�3����x:���X�mF�8
!������	�1�)j��!���&��4��|&��BdɊ��C$WpV�̚���߸Ջ����r'q���Q��\������� ̣F���np����{�
5��y����Y�*�Of)o��#�>;�czv���c����d�2Cz ����2%�7�	��u��}$�|���	�"FUDH�V:B��{fl�; ,c˚�$a���}�\�j:å.���ʫ �O��nrAƾ$�W�¯V1�\O,� ˣ��׮O��%�M�;�M�'c�\�W�ԍu��$gc�4�'j�Z0P����Mt�P���z= �v�N[��=Ҡ4J�w>��a�<�M"ANX;ƫ	�~����9a}zL��nT���k}p���L>��5������9��������R1���7�^��;��0�ڐ�;��+�k6�m#"�J��6��d"���e?V��k��êϚd;�A�$�o�#:H�T�ֳ�2�X�n<LPH�_^KJ��\�͡�4�q��ˁ���z��Uq!� ��[Y���v/0hWi� �jv`�]��[3�9��� Q �s@�� W/t���[����z�ty��b���^9OU8���d�	���D��u��ɏ����x( �M`F,Q����b�������8�^>?W�Gf䯞���'�7||�o�ԫ R�A���|�tt���iZ~�~������|i �������AC ����{F�h��1�y�
�P�>w�_["MkO%�wB<in���l��7(ҋ�؜�M2���3I��X/`����d�MLG0�h�7�?^�9��ց�����
@fz�"\�g�NR�����ݢ:otK���x2���
3E�l_�zzfx����Q�Eq&a#<xZ԰�^�(����f�j�A�m������*��o�iĴ=�|�+H@
�,b'��_%=y����4fJ��3%Fg�g.qm���v�Ĝ.�v=M��2������T�3ȑ�q�a���l�_b��Ȭ����~���@xW Pm��\�c�m���^�Z��h"��KVOO��=���围�?��C� ���=a�ʋg#���� ��5nu�Z���c���Ԋ��0@{�8E��;��|_�ݎ�SG0tи�4�!{S���5��_Q�U�d�L��^gʰg�O��'�����X�[��~�~x�Wmo�6�W�Wp�QI�B'���ˀ�Z M�6�>��H�MT��r�����H�a�E�����#ǯf?�� �%�-]�%W�,:Yj�ȬY��揣d����u���� �	^�$��99z]���K^�ɘʦY����7�vZ��9Ѫ�d�gz�4h�+��g�)ť�Ű{d����ƻ�w��~7G��i���T�����<;�v*�r�Hם�d�T��K�E��	ق
�,�)D�e�=E��s�NFI0P)��!�,%�Xd} �{�餾^��x�k~���
<�L�}"Q��&IV����4��;و��Xq�u�^���W���w��r�&x�~�w�1�L��Z5�i�CZ���n?\fi-҂|NQ�Uw�U�� �i��������)��~{�+^ǄRJfo����l�"p��~���CȰ���ʐ�:<�唼�e2����V��\-Z��xga����ɑ�¸�C�ՙ���֛�R)���������>l�/��������Do!��p��s���_��1"o`�N͂����#������?~�B�����d��&����R]�.��X+hޗ�8��a��TYN���e-ʯ�#8W����'劗_�}��ƞa��cp���. �v�;��7P�mp�nK� �h�]�?rVa׳����0*�(���
:��u�O���Iԯ�`���
�I?���A�fM��.��Jp��tJ��8�B��ɒ7�]G�V�V����C���g�jE.��� ��r�*� ���]QQ?wP7�ZZ���#no��`�t�Lu��Z���`��X��۟���\��нdMA��/�b�9S���,&\⯁r�+bKt�=��{��&�Y�vpCB�h�>��1�6�'D<� ����@�Ӛ˥^��B��/�.�L�p8FV�� �����[w/��/�����,�@�)�axV��X�[ӡ`��=<IB�Ȅ�0xӜrV��B=O�9;�a@ݎc�2��)�����m������Z&��K<w�o6�{�]aP���}�Q�*��1c�q'���6H���g�6h��K�O��H�3<أ z)(��iU`#̀8���!�?���]AGu/�H$�B�N�`�l�C`Aڱ՟B��!����Ѐs�z�'#t"����x��Q
�0D��)��M�5(���&�����za`���q%��@{jG #3zkh�VOB�CO��l�me
=�E��ڳPk��a��Pc
%�I�>����'�D�f�32��?���V�slQv�I� �;mx�V�O�F��W�r�l�`B)��W�Q
��� }B�ʱ���k�kH�����n�Im_�pG<;��|�N*9aG�G�߽��ઋ�4)�MRU���s��u���Y �ۅ�m�$-�����w�7נ5�&���r8xeҕ�Ir���ϓ�R� Ā�y�P�'�p<���\�:a��;K��w�	G?�F��(rR�����O_f�"U&
ܨRt���m�km����$�^�^~�����U������tpl2`߾�K��%*y�}�rP$�7�e�R�|,������!�\z"���u��:�2gM+��v����Lt��J�M�$1��L֕�!L�[5�TP���
;�! �@�ǜ���-�"����3���#>S�΂���l�@]�����Ί�^��#v ?P���|�B�ؤ�-���fN7���!���naj���s�t6pyc��W����;}�g�G$:�$~3�kqD��!ju���@rL�
^�(�>��Ŵ��=��]N�H7��=��l�PnR��a3.B��Ñ��_;��&g���k�M<-�g�T�� �<C@��M�_>B�>���#pgd�NG@c�Цzp����S�)���){���Oc?�Ս`.�jŤW<�6�Kx�Ʋ�|b\Zq~=:Z���OB����6"�������H	Uq���5��y�(��HA�i��d���9Z�q�(Z]Q��%�yo�|��(x�V C�XO���J��V����@���VO[��+Y}�{m�����}G�kLk�;����Æ�ί��a�a��oPaԯx]�t���>;�F�{���xٜ-W}[��F-h�w.��s��Zn����!^��.E�r��COkv��
�o;�P��b�h�/�x(��e;;I:~���J�jL�u ��J�Vd8YT�S�ܸ��9�d��BAOxO�ձs�`BQv�'���Hց�V"}Ƶm�cڃ��-w���b`�~�F��N�F" �4��v�y��L����^�����g�WxΎ~
��������5+����ϛ�A�)�u�	�"��G���x7��6�˪8��>�)��#�t��â���{cUNʜ3�pH�H�6ɲmC�����>`�?x@B�����}�a�-�];Ζ�e�=���+v�D��EMߕ�ړ u����p��q��9C:�T�S�&����r�O��\6u�PAi5��<v^kכa`֗! vf��n5�^dz�����k:uC^�2�f�}�$^��wܞk�F�S�x+)JMU01�`01 ����b���{���ic�<��䲯e�f&&
>�ή~��Yi\�c�N�x?ӵuv��ߡJ�\]|]�rS���7��0i�O����n�^-�/PE!�.�z%%_�������̿?]�N�;U�UX�ZT��U� �m���A���#���_M}�#UQAQ~I~�ni&H��S9f,�b~�$�sϫ�=ʧ��q)���iyҶe�;W	���O�%_N�|{ ��8 19;1=�7�(=�H/�"��g+��wgN1lѯ>x��w�)W��������b]���J������N�����O8=�!Wxe�j���5MQl]�)��Ι~�ݾ1�*Cx/���A�Q\�?O���7��%�\�����d�cۤ����`S(5�}�� ���xmR���0�ܯ ���С(n+�]z@�δDۺH�@����K�E��h=����.r��|z�� /OקG���𝠐�,	�#���� �P�ǎTI ��tL'8���Ƿ��.��!�R*���{�;Ɖ*�C����	�jZ�ݔ(+j�!.̷�'��CZ1;��>�(��=��Up��t7�]�O�ѩMh��H6n���j!�^�ګ�PJn�9m?XC��7t���ت#���B���1���(�pܽ�Ӻ#����yT|�I,%e�Yn6����mml1������'��W���Z&k]�߷��p���nC�B�[G���1�U�l�[�`[n�2������O�y~ ���-6�_2��ⲩ])1�Bu�1�X1e��_��x+)JMU042`040031QH�I-*	�/-��*f8�7{��(�3��]�c���q�E�Bf�&���'� �W�����@xɇy�_O��������=Ti�8�
3�T��{�0�TC�O� [l6x�}�wG���U��I�-c�L&�E�	>0�d���Xm�mw�%E-�=߿�|�~TW�Z�Lrr�:3Ķ�_���]�:M����|�������/ƃy>wo�%��`q���k�iZ��'���V��!�%��d>)��d~�����j�V�c><����~Ypy��֭���q�% �dc��|�N���l0O����f�~�%$�Oӹ ��YV,F, ���Fr<�uI�bO��U�����v;�Fo�=�3�R��M��8̲t���b��Yך�A)$e�:@/�&¸��y8�1�L�n�Bm���x�j-i�ﶠ嘴�Q6����g� ��h~�t��lr�eu/���N:�|��O:&��uqi�Z^r�L�s�L��$ 2޺J�Q������z6�,>K~�l�!������̈́I �_1���}���VAP�����,=9I�F�� ����b��N�LSr3M#��Yz���������Z҉?vJ�����<����th��F���l2L~.s���OCu��F�F�Q�(����g��<���C�f0˧��Av6�S�>�C:Zd������,�w��������CVю�J?�n�6��g#Z3�����$����g�;�֕6�<���/EQ�e�^�#��{�#�g�S������SȬ8�)���<y�]��w\�Lٺ���$%�#�:|7��i4*���l�:�W��P�v-��� ���~:��&�Y�A�#4�HZK�����Ē]��Z�-YO���;���8΀�Nre�B�3r��Q)� 8K�՜b��Уy���{�6�]��f�l��t�y;�P�*�8"��2�������qf���|�����p��v$�|���Q�&�/��>���u$��p����+��T���?d�rO3G��4G�1���,1�>$�X�W`l4�UV�i��l�X��&��F{5������I��P�'�
�N�����ݍ�û�߾��8�U�6-���	/�lg J�.��U�o�KªB���2�
D��j-Ig'�B*М��;�^<�M��? ws0Q�;ܽ�Z<�e�B��][�Ec�7��&��l�ͳ�l����10�K��	�F��2̦�S�ٵ~ΡCA�0��"�Qn�da�Ԧ�3��R�5x+~�WBgQ��?c$%��.��6$�.�$k0,e��V r��&X�����^���]N?�f���H�����z���R��Khs�X���)��ӡ)�I6��g�^<���Ft��8��z_�hr	��ӓ-�(�m�� 1Z�[��[~���R��P�"����aY���'�v�wV	[
7�P1H�=-!�|_?��xg4)��H_Xݟ�.�c�8B�����o�Z����6���a���h�n�<M��m�ɼd\���>Jh��P��ASWB�#�<�Ъ�����t �w�8 ?Y�3?�D�ʭ,��E�ZE��@�X�ey�~�Q#!�����{����Q���AQ�È�|HL���NG>�n:�Ѷp�TD��[�`GU.�nJ�`%N�}t���]R�MZ(i���I>6�N{5�]�Fu{����E��$
�V�%������H�&�`�b�Y�>�ocQRqZ��`�v4;S׺GeZ߷�eҁ�;����U��v|p���H<,��~�8��K�	�@.�sr)�%W=z�RP�uy����s���@����������w稽����> eI�'_}�|�/ӗ^ҟ���1 ��=�L{��@7hQ_,v�PW�H��],w ���(cs����U:��X�%��'H�����!�>G��}��E�e�(E2��3�fqk����C�09E�I4��S����_���f����v_���	���G��G=}�Zҷ�����ߣj�~�O��dƬ�p1��Y�����O�_���@ބ�'ꧨ���"ۃ��Ƈ��y��ͷ���!�U�9BM���ͷ����.^m�X���֋������i��?���;!0�8<�(��o7N���@�2�ؼH��Y�������_�y$"� 9�(��=�l�t���(F٨�1���h7Em�t7:�@�K��B��{~��w���-LL�s����P?�(�r�.�~Ԉ�`�o�d����2����&�O��d%�Hb�4�y�FچtV�;I�ݢZG �<@�s���� �\M��1m���^ً|�mՖ �0����y�YazT!�Ϸ�>��-T�\�4����/k���0L�ُ��v&g�ɘA�UJ/o^�F�AĿ�D��â{�}���O�ٞeh!�	ٕP�mx#�@����q>Ά��/�+Y�&6h��+��� 7��oDo��ͨP�	$@��/!��fr֜�D�YM4����ΐ�`�Y�Ur�V(+�����TG�*y��[CŢ~�L�f)g�`K�E9ߗ;� px`�S<�53[r+YZuȖ�,t�gF٥��&��Ȓr�
�Y~��9,v4m�8L���x�� ��_������w�U��9�a���3DzF��}3��5�X����������.��L�����(�GNĚ%$}�]��d.�
X���
K\PJ0V��|g�H���lis��,S#4�	��f����t�����Q�˾�4�f�~`��)v�)�؅��;��Ւ?�`���b��]��'C� \@���N
�ኳX�+L�nIf�b2�P�
Q�d"J�XS�0�&%<ٗ�����n�$��7�0Kt�*udq%�6*?W��D�V����R����QE��V�և32p��ge��y�����k5�*/��R3x���Oh���S�%�Z�<ᇱA�����"�$y!h���AN�9�ϧ���� 3��2����t��ə~78�o�:�jpZl_޽:�ܼ�ߣ��{�{�}y����Hv��$rC���I�yG������q�1�㾨��P�W���ِ��AK�C;|�| ]�O'�Ȇ~� �3]��e�ܯ$o�r��dg�mS����Q�[Q�&dEl��A����7fI��)��V+��v��H���\?���)�.�.�F� 9���H�g��Z��È�G<;��:%�g6�շ6$d��S����`�ɛP�P�Ȳ����2m�p�6�j��S��v�o&�٠jEѹ
2�htp��q�H�\�|��+����6�<�FX�}��f�O2�O�q:zҢF�Xf<i����X\���㉬L��q>B�©��N K	���,��k�"ame!�]��g�T���#e���v�S�a�y��d����[4�F�8�0�<+��N˝���R�A��b0�r��Y�����	>�#hI%ܑ��8ű*b�/x�)y��O/��P����{�~E�!�P���a\�R�����a�4���@�	�x��^��K����;q3ꉌ������w{@*�	 H8�d_]�
G�y�B�0f������r� S�%V�*}맳`��%1 �2�At(6~^j����TlARd@�0�딯x��u�'A�s���PFq�n��_�󮈖�����,��і���h��#�X���ց�k��� e�AN�P����x����o)������m��gZ�n���b1d���dE�	Q��.Q]��h�Y�[7Z�I'�𢎌�̾Do4�զYo	����xU^�j��P	;�S�3[�ѓ"&��/�H��-�Aˆ�%��u�d�1o��9�b�:�%����p�������TT���q�ئӨ-��_ZS�<rs>�u��.o1��t�����F4��Vfg�h�5su�h�z�P*����9�,FC�>I�ds�RV]� !�7�Jx��6���O|��d+9����f��~��]��I"��� �����@K�
/}�9>}��&�C[FzJY�0]˫���@�_4P�*�����.zKTX$�ja}.S���5Xa�W72H�2GMV�\V1�%=+���ޮ&�U�W*�@XLA@%vs���+�b����(d�S�h�ߎ���X��/��q4� �ű�����G��	�M�O�Y�-�� �V�2wՖ0B|�7*j4rH-��.�*��Ò�]�,���JX�䱎�t �^�\��zxd���n��J�u����ζ��m� �g[�QNEQ�OQx��C�a'��5K��j�[1k���y�Bߺ<�v��o��o��s+Ж�
���[��Ɋ��[�V��Nmer�Z�X���%�� �
rd�%P���itNW'\��7a�u�+��X�h�a�����VF��ib����dSk��>����Q�-Eϙ����X�p��q�4`0�H��㼣A�qFQ��4#q�� �^B t��pi���v�h���>UB9^�*���r�m%�E`�)	l��������#Hɺ��B��&.��	
9�~���,�#iX��S5�-�t��+�z@/~O,�E�S��T�2���]禞�0��&[�j�!��ՖD���b��3^]@����<3�e]���iWd�s8���*m8����	�ɕa�!
�@p
>%o1�g���c�X�o���4ˉ���d�x������I����m�J�*�$A8$w+V�L�h-Vѕ���0�էߐ��~��yY��p�F�ZaU��:���T�T�t��5Iһт��4��*��3T��)ax�O �f �U���7X��Dt��^

i@!�Ţ�Q�
�
>j�tG��| �V�D7�ZR����}�5ע�$�FnAOu���dN��R�Q&<�v�i�!Ii���$]����s��37�Gq�m�m��V��[i�g�Ga��� ������ҵ]�F���CsWd;�"m������E��Ֆ���f�ԣa$�L�*L��Z	4zcpo1�T�>�3$ ��?E��y���ZN;IW�f�qN���t��o����yM!���`�œ�2.0��Nůk	�r)�+�~�O�&z/�V�r��۰�G�czܯ����̸b��h�jl�ud����I�Lv,�m;h��ST,�{���@�Q�fh��GTɮ��l~W2�`Ϡ���� \{��<s����3��7Ɲ�󒿳D7� ���="�EbV�f�Z�X�uB^/��	?l��'Xp {%��^�Z��y�i�����|�.&��(:r��X�q-�s6ar���2B����H�g��<�)f}�i��� �qWOc�1M��y��4�g + ����'A�#�M�Z���eF��/�⨄ț�Ja����q����O��E�	�Dn���ˢH�xw�@'G��@к�Cz��W��c� J���U1b����D�/SF��'!U��ñ���v$�B�(/K$��:B)۱YE��L�<J��������I���9��q��J���W�� F�_�OaX��u�K��OfzLu�ږ�*�8h-��}�����]�{2�U�O�����@&�U��2Rg{�a�Ѓ�_,�;eq�D�?�W� E� I�	�PI<*Z)Y��ɇ��B{�^��H��vV�fy�pG7����$ӿ�˻A9�J��t�������k��j��sÈ?,�
,�u����zL��6Z7#N��l�Q���o)���r<׍����H}A,~�Q�i�M��qV���_���mJ?��W��1��p�4W�����Y�/Fr�Q��Eɘ��ge�՚ۡ}�)�s�]�^�E�]�Q������o%�e������I�r��L�!�˗àѫ�� �����Y)]]�
��>�~�]�
+����z��#@���V�X�{���$mt;*�	 �Nci=oVgT�.����翉-��hq4��:1/����	����u:LM�3�=ˇCD:v��x4�N����� ���V�E�p.��8A�g�G�d��xNW�>��si�T���F�bͲ=K-�σ[	�ߑ�#�$�z�`s-�����4T�G
v�N{X*)�%2nH�����$�}�1����")������d("�����Nןֈښ@ �Lue*INc���_�s ,���+a��\�w]��V�LR�b4�y1���Ud��-�+�̣vK�·D*C_za�d����O�w�8���V��иM��R:���[�5��Q��G�
	(function($, document, hashTag) {
		@codeHere
	})(jQuery, document, '#');
	!�Kr�,�䡰�[6�������\A3=��D�`�W��l@�m4qi<K���>4�/��0R���"b�HK�!?�n�T�?�I�����|��z��m��f�� ��e���J��Z%�X�b���'鐇oJ��ْ0��=X���[�Հ{ o:�\�[�ɍ���]�bVGM�Rx��k%�X�	L:��Ԗ�X��bNZ��~-�F�5rP�&
��ON$wq���לS�#؈�i̘	M,�{!����HN�����<�<��
%�z.^f ��ĽK��������4bĐ|�s�}E볇 �[�_��AQ%u+��~���d]����"n���-��d�k,NTG�m�`R��|�Q�x(�pJF��7�~���������
ς�!z�� r����B����＾��$s�C9��Y6[ѩl�F��n�zX&\��N�����A�� ��,FX! O:��M���
�q���C���Fpx""�W2�J��Wfr>�w���^3~�å��It��^y4�����X�:�v;=��rA���y3�:��+A�,`��(�n�PU�D�1RoZ��!��6�[���i�%L�+Þ�%��r���`�O�����u�V��n5�q����m�&�q!(DUPF&D��"ք�i�ֱ���$���Q_�s]>aS�^G����Q]ΥCz-�gC�rK_o�!�U����c��K����p�H�j�V$��.��-
"�����Yc��l���]�G
Z�
�f�7H^Ͳ�/�a� ��\�P9�9�MB�Q���F�+���Ձ<��Na��e��QK7��K�Q���U�R3�)v��Ġ�B9cT��m'���&{��@AS��mʡD#�[Y��T�;�">_�b9�� Dmq���: @��#Y�ޒh�+��"��(f�����@9�p�y��>���y9QSm <W]Ϣn5E+��X$,O
�|��iL�X�A��/i46�o�|��_.Ύ0�qfz��0By�0	7��\��v���ɷ߬}�׵o��j�WtQ�~�lڃTҵa��M�҂��hd�h�3�������;5&@�uw��T<X��ުC���%�c��A6�NB��\`p���Cj/i�蛈7��^�w�.K��_���k
�hYa��W���(�&��F���M=���V�h�4��R�v�� q�x%��>��Z��˝��2LԱk�.Ă��6#|O�k��r ꕺs��b�j��d��'O�R=&c��V��6��ή����
I�q	�m�H
7cp��)��6Z�0�2��R��!6��:s\�S�L��Ÿ��Y�̲c ��A����T�;�]?.D�5��#��O�߁Z�% ��@>.�(����Ƀ:��,���(��BA��k�����k�2��*u�V��5�aL�*�$�!���r��w�P�Q�.��H�zӒ�a�w���9�(���rr�>����wG>pd��R�W�|���0
�\Y�Z#U�W�a���W�0B�
-���@7��ɿ?��"ӄN�ݖ�Xq�a4$S�nG��dC6���$�窗��B�S�Mե�Y�!t�9�V�JMms�(|,QS�%���j6��PZ� F�Si����.��䫣#l���H:jb/�-y��	͆ӄ��p��N��TBI]š[�*c!��ƞ��I��ɧ�:�F8��Lv��F?c3h��]>'W���G��tm���<�^ZB��a���R<4	<o5�%.�|��a��m*K6<�;T��N H���Gi�"�<�_�'��������;�m�ݚp��h)3�H^�zX�D��J�mO���ok�`��G�dV��Ȓb1�U�l��Z �);�bP�xM`ݮ��h�W���Ӊ�V�g(x�H�n@�E�ԏ� ��3}�	$U���1�%�g�y���6�
4��oݺ�*�eeT�+%U7��ӕ%Ǽ7��NV�"��35�G�*S���)��@u�d"NꀡtAQ�x�Y,;u
	���QC*�h�*�I�I���Zy(�����N���(ߓ��e�$�k�"{״���\�%(<V(�anZj��#��qRaxn���"��¢^�Z��~��P��ƪ��M�S�z�4���@�[x�����'O<w�+l��W��E��s)??�Ӈ��T�S�w��m��%�R��^��w��J�纔(D��N��4������ס�R8D�. ��2��~]�_)�^̠e�F���A���삒�^�DOI��5�r��o�HVߞ�%�\��ڗH� ��ؕ8����H"�kT��
����'�HQ{W5���
���]�C�|�����i"Z/O��X�Z��3�'d�4�Yv���"������i�������i��a�������vL^����.f�I�@�۹3�].���hD��7��]o�4Qg}+FoN�T5��G���֧�CT� �K�6'z`��� �;<Ǽ����#�[��C��UP�!��43���0Z�ض�n�b���O����Tat(�Q�Z[<	*���r��Sљ����H��&VkX���=\Ԉ��)�]tWH���,�,t���W���5��qi�	A�*��)��QΦܱ����T�2-�P��=N��ز�y�`<�E�Wܰ�� ��pO��x���,�cƲy~�a��"��2%�@$[� ��$���k�8̌�"6�a��bô��_�Spú�F@�.r3�<()���̎����9^�-hE������e8��¥��-q�O�c#r�3����F=����?�ۆ�-�c]3��x˲V�t �b����.	Ǐ
a6F��0�|L�l;#�rWQm�vY�3]�jZW,�)M�����A�A=��~�����T8h��h�L��_nOe���|i�����iE���C���/�����_vFlI۽�8�to�-!؋����1�*-�(�� Eo]�10����'���`\}�/�n0w2��M���r�d�|T6x�(���*Z}G1�rB�����<�u�_� ��{���w�%��e��V�ǀ�c���M/��/��|�9��SuJf;X3��P�{L$���=\i7�����)Ov���#�j|���yt�����nE��;��Q#�O�~�������"-%]����������|���<O��m�,\�꨻��f�'�r�qf��
 _���U�+6_�`��7H��iZe��3�_����v�.��p~D��p��٬^kgM����\=)RQq��^�d����z='d�':������d�R�9#o��Շ3W��YE��fL`%i%�`�{"#+W%��}�x��ދ�?�U������*ͅ�|3
ʱ��gõ_y���I�f�����#d_���B�,-`�;_N_��X(F��[�a�(�-`�������_��B���g�_�����
(Oc�d�T��v�gX��/hR�ᴔ����[4� ����%�
|��iة
�y�n���/�������E�q��	�7'��N+�bZw��|�䒒l�#���Z�k�E�،*�����Q/��.V�����=�����z�,���	�N�* ��gr��4|�zQ��c;�ZJ�g���χ]�6�iL�����>�A?�����N�6N�����X� ��2��aO�8�)Ү��ϼht��t�h>�<<z�����#.��3�wv��^�ӝ�	 �� >$����"�D��&���<�hڛY��R�m�S�R�G����6�<|���f��5�-�g���w,y�%��}
�p]�?����IWj�\����?g<��v�1������>���b�lU3W>mH��:aB�RG<��+�u���=��5U@G���1˧��Y���8�3,�\�1�	�u�u���%����Z'\c�
��e��S����sy�t^�׺���Q�#c��,ߘ�|�&_�t�f���K��i�۹г��:W�����d�� 1�8�T�p��!=����*3Ye��9����w�����j�BU#Xu..��+p��Q�Gxa�<[��H?��fu��?�m�!Ь�a�	4��~�p�"Y(��.�?�t�a$p_��^�CK�>@q�S����`T��)$�� �ۦv0�}vQ{y����~��$�h��/�����oz$X��ys��5v��޽ƴtzcg2��8� ����+�5��!�0*�8�k]D�q�ܛS�>�$�`�XA�D�7|�K�ƈ�FD� ���0l�FG�� � cPE%���a�r�/^	��H��C�8����4��zCR�>�XUqꛙ�{�L����g�*v={�σt��%2��s3
*	�7�zǃR��5� Cg�2���T��_Wz���W���Y!�*d�ıq�ѷ����9��I��4��z
[�<������/w�?~���u�z�W4>�%�����`��A��h�-8ir�w�|��@�&�~����?����k�R��Iɫ�W?�
}C
�UTt���}T�(�GI�{BT5���X:!��cR��qg�nd�`�g<\LF|7}vr��5�/7|���FO�+J9w��k���McQ�W&�I����:8�xDPB$*0�Cm�:��G��_��[-+tִ�뢿����ÍT��T�б�P�����9�{g�D�v9��Z��83�"n�ͩZ����mނ��^�ڂ��B_m����tC��QMPC�N2�Le�g!�C07��>#��N�7������+����.�v�L���� U�,�\U��|z>��4���%�k1�aɧ�=c��	{E"��\�����c�_�d������iB��V���ŌqR4�h���D�A)b���Ts�M9C|y�n3ȋHO�_`xAHu
���m���]��\n�.t�" ��]-����O�T���|����o=��o��XzdE-Z`��z��_���"&q8A�T��ґ 3��zh�JD���Ǹ��[��m��R�9ycC�u�_�l�*B�S!6�U��s��J�.�|)��=Dj�D3�x�1ƚ s��x<u ���Wk�)ESR0IZK̶�lT�K��t����Z���ѽU��
3L,7&��hb�dd9CN�ju)q_�!:��$����T2Ģ6A4��<kձ�=�LH��I���<K� �ZI4A�I3��]i��ʌ.j�X�ي��2Gl8�K]�f.%�:��}�pU_�z�O�5��KPm�У�|����4�l]�Zu,d�|3p�Z��Ͱ2��%r��M �9-� �O?��ퟙ�L�����;�7�Y)��v��`�u�N^��{K1���t�gzS��H7&�GD�$B���d�'!8�K�W�Q�����EL\��2��޷.��Q�p��x���Q���>�8��ڰ�sz%O�"=��n���6r~3<�q�qK�~"qv��8F0���e�uR���E���uͰ�*7:q�Ԫ%���=a�L���A�]���W�r�V�e\[K�w�wv�bG��`��
d�HX���jƪ�T���,5/8A����#��.1wU7��I"Z�iB�ޓv˥�U����5����.�!c"X�S4=�aZf�q���u{��$ݪ��?c9;�(zDQL��s�����W�at�Ԇr���'���j��-Z{c����s}n5c14040bb1f409beb9b6b490dc36fff267f94bd4
881d13d0f55b2490b621e87b0a316997d63ab156
5c14040bb1f409beb9b6b490dc36fff267f94bd4
<html>
<head>
    <script src="../jquery.js" type="text/javascript"></script>
    <!--<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script> -->
    <script src="../jquery.protos-ui.js" type="text/javascript"></script>
    <link href="../protos-ui.css" rel="stylesheet" />
</head>

<body>
    <button id="alertMe">Show alert</button>
    <button id="alertMe2">Show alert 2</button>
        <script>
        $("#alertMe").on('click', function()
        {
            $("#alertMe").protos().alertPopUp({
                content: "Alert message! Alert message! Alert message!",
                title: "Alert message!",
                darkness: 0.3,
                draggable: true,
                isContentDraggable: true
            });
        });

        $("#alertMe2").on('click', function()
        {
            $("#alertMe2").protos().alertPopUp("Alert message! Alert message! Alert message!");
        });
    </script>
</body>
</html>
<script src="../jquery.js" type="text/javascript"></script>
<!--<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script> -->
    <script src="../jquery.protos-ui.js" type="text/javascript"></script>
    <link href="../protos-ui.css" rel="stylesheet" />

<div id="element1" style="border: solid black 1px; width: 400px;">
</div>

<script id="galleryTemplate" type="protos-tmpl">
#=ProductID# - #=ProductName#
</script>

<script type="text/javascript">	
	var dataSource = new protos.dataSource({
		data: {
			//read: 'http://demos.kendoui.com/service/Products'
			read: function(query) {
				$.ajax({
					type: 'json',
					contentType: "application/json; charset=utf-8",
					type: "GET",
					dataType: "jsonp",
					url: 'http://demos.kendoui.com/service/Products',
					success: function(response) {
						var data = {};
						data.data = response;
						data.items = response.length;
						
						dataSource.readed(data);
					}
				});
			}
		},
		server: {
			paging: false,
		//	filtering: true,
		//	sorting: true
		}
	});
	
	//dataSource.addFilter({field: 'ProductName', value: 'Chai 2 - Chang 3 - Aniseed Syrup', operator: 'eq'});

	$("#element1").protos().listView({
		data: dataSource,
		pageSize: 15,
		templateId: 'galleryTemplate'
	});
</script><script src="../jquery.js" type="text/javascript"></script>
<!--<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script> -->
    <script src="../jquery.protos-ui.js" type="text/javascript"></script>
    <link href="../protos-ui.css" rel="stylesheet" />
	
	See the console :)


<script type="text/javascript">
var foo = function(){
	var deferred = new protos.deferred();
	setTimeout(function(){ 
		deferred.resolve();
	}, 2000);
	
	return deferred;
};

foo().done(function(){ 
	console.log('foo is done [first message]!'); 
}).done(function(){ 
	console.log('foo is done [second message]!'); 
}).fail(function(){ 
	console.log('foo is fail!'); 
});;
</script><script src="../jquery.js" type="text/javascript"></script>
<!--<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script> -->
    <script src="../jquery.protos-ui.js" type="text/javascript"></script>
    <link href="../protos-ui.css" rel="stylesheet" />
	
<div id="container" style="width: 300px; height: 300px; background-color: grey; margin: 20px 20px 20px 20px; padding: 15px;">
    <div id="test" style="position: absolute; background-color: red; height: 100px; width: 100px;">
		<div style=""></div>
    </div>
</div>


<script type="text/javascript">
    $("#test").protos().draggable({
        container: "#container",
    });
</script><html>
<head>
    <script src="../jquery.js" type="text/javascript"></script>
    <script src="../jquery.protos-ui.js" type="text/javascript"></script>
    <link href="../protos-ui.css" rel="stylesheet" />
</head>

<body>
    <script>
        $(function () {
            var elementForAdding = protos.generateHTML("div", ["testClass", "testClass2"], "Simeon Nenov");

            $("#test").append(elementForAdding);
        });
    </script>

    <div id="test">
    </div>
</body>
</html>
<script src="../jquery.js" type="text/javascript"></script>
<!--<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script> -->
    <script src="../jquery.protos-ui.js" type="text/javascript"></script>
    <link href="../protos-ui.css" rel="stylesheet" />

<div id="element1" style="border: solid black 1px">
</div>

<script id="galleryTemplate" type="protos-tmpl">
<img src="#=url#" width="150px"/>
</script>

<script type="text/javascript">
	var attachEvents = function () {
		$('#element1_listItems li').on('click', function() {
			$('#element1_listItems').data('imageGallery').popUp.show();
			$('#element1_listItems').data('imageGallery').changeImage($(this).attr('data-uid'));
		});
	};
	
	var dataSource = new protos.dataSource({
		data: [
				{ url: 'http://www.manager.bg/sites/default/files/news_photos/telerik_logo_RGB_photoshop.jpg', title: 'Nice view' },
				{ url: 'http://academy.telerik.com/images/default-album/telerik-academyE49D1716EBCD.jpg?sfvrsn=4' },
				{ url: 'http://www.abv.bg/images/spriteAbv.png'}
			]
	});
	
	$(function (){
		attachEvents();
		$('#element1').on('pageRendered', function() {
			$('#element1_listItems').data('imageGallery').images = dataSource.data;
			attachEvents();
		});
	});

	$("#element1").protos().listView({
		data: dataSource,
		pageSize: 2,
		templateId: 'galleryTemplate'
	});

	$('#element1_listItems').protos().imageGallery({
		images: dataSource
	});
</script><script src="../jquery.js" type="text/javascript"></script>
<!--<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script> -->
	<script src="../jquery.protos-ui.js" type="text/javascript"></script>
	
    <link href="../protos-ui.css" rel="stylesheet" />

<div id="element1">Click me!</div>

<script type="text/javascript">
    $("#element1").protos().imageGallery({
		title: "Gallery",
		images: [
			{ url: 'http://www.manager.bg/sites/default/files/news_photos/telerik_logo_RGB_photoshop.jpg', title: 'Nice view' },
			{ url: 'http://academy.telerik.com/images/default-album/telerik-academyE49D1716EBCD.jpg?sfvrsn=4' }
		],
		draggable: true
    });
	
	$("#element1").on('click', function(){
		$(this).data("imageGallery").popUp.show();
	});
</script><script src="../jquery.js" type="text/javascript"></script>
<!--<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script> -->
    <script src="../jquery.protos-ui.js" type="text/javascript"></script>
    <link href="../protos-ui.css" rel="stylesheet" />

<div id="element1" style="border: solid black 1px; width: 450px;">
</div>

<script id="galleryTemplate" type="protos-tmpl">
<img src="#=url#" width="200px"/>
</script>

<script type="text/javascript">	
	var dataSource = new protos.dataSource({
	data: [
			{ url: 'http://www.manager.bg/sites/default/files/news_photos/telerik_logo_RGB_photoshop.jpg', title: 'Nice view' },
			{ url: 'http://academy.telerik.com/images/default-album/telerik-academyE49D1716EBCD.jpg?sfvrsn=4' },
			{ url: 'http://www.manager.bg/sites/default/files/news_photos/telerik_logo_RGB_photoshop.jpg', title: 'Nice view' },
			{ url: 'http://academy.telerik.com/images/default-album/telerik-academyE49D1716EBCD.jpg?sfvrsn=4' },
			{ url: 'http://www.manager.bg/sites/default/files/news_photos/telerik_logo_RGB_photoshop.jpg', title: 'Nice view' },
			{ url: 'http://academy.telerik.com/images/default-album/telerik-academyE49D1716EBCD.jpg?sfvrsn=4' },
			{ url: 'http://www.manager.bg/sites/default/files/news_photos/telerik_logo_RGB_photoshop.jpg', title: 'Nice view' },
			{ url: 'http://academy.telerik.com/images/default-album/telerik-academyE49D1716EBCD.jpg?sfvrsn=4' },
			{ url: 'http://www.manager.bg/sites/default/files/news_photos/telerik_logo_RGB_photoshop.jpg', title: 'Nice view' },
			{ url: 'http://academy.telerik.com/images/default-album/telerik-academyE49D1716EBCD.jpg?sfvrsn=4' },
			{ url: 'http://www.manager.bg/sites/default/files/news_photos/telerik_logo_RGB_photoshop.jpg', title: 'Nice view' },
			{ url: 'http://academy.telerik.com/images/default-album/telerik-academyE49D1716EBCD.jpg?sfvrsn=4' },
			{ url: 'http://www.manager.bg/sites/default/files/news_photos/telerik_logo_RGB_photoshop.jpg', title: 'Nice view' },
			{ url: 'http://academy.telerik.com/images/default-album/telerik-academyE49D1716EBCD.jpg?sfvrsn=4' },
			{ url: 'http://www.manager.bg/sites/default/files/news_photos/telerik_logo_RGB_photoshop.jpg', title: 'Nice view' },
			{ url: 'http://academy.telerik.com/images/default-album/telerik-academyE49D1716EBCD.jpg?sfvrsn=4' },
			{ url: 'http://www.manager.bg/sites/default/files/news_photos/telerik_logo_RGB_photoshop.jpg', title: 'Nice view' },
			{ url: 'http://academy.telerik.com/images/default-album/telerik-academyE49D1716EBCD.jpg?sfvrsn=4' },
			{ url: 'http://www.manager.bg/sites/default/files/news_photos/telerik_logo_RGB_photoshop.jpg', title: 'Nice view' },
			{ url: 'http://academy.telerik.com/images/default-album/telerik-academyE49D1716EBCD.jpg?sfvrsn=4' },
			{ url: 'http://www.manager.bg/sites/default/files/news_photos/telerik_logo_RGB_photoshop.jpg', title: 'Nice view' },
			{ url: 'http://academy.telerik.com/images/default-album/telerik-academyE49D1716EBCD.jpg?sfvrsn=4' },
			{ url: 'http://www.manager.bg/sites/default/files/news_photos/telerik_logo_RGB_photoshop.jpg', title: 'Nice view' },
			{ url: 'http://academy.telerik.com/images/default-album/telerik-academyE49D1716EBCD.jpg?sfvrsn=4' },
			{ url: 'http://www.manager.bg/sites/default/files/news_photos/telerik_logo_RGB_photoshop.jpg', title: 'Nice view' },
			{ url: 'http://academy.telerik.com/images/default-album/telerik-academyE49D1716EBCD.jpg?sfvrsn=4' },
			{ url: 'http://www.manager.bg/sites/default/files/news_photos/telerik_logo_RGB_photoshop.jpg', title: 'Nice view' },
			{ url: 'http://academy.telerik.com/images/default-album/telerik-academyE49D1716EBCD.jpg?sfvrsn=4' },
			{ url: 'http://www.manager.bg/sites/default/files/news_photos/telerik_logo_RGB_photoshop.jpg', title: 'Nice view' },
			{ url: 'http://academy.telerik.com/images/default-album/telerik-academyE49D1716EBCD.jpg?sfvrsn=4' },
			{ url: 'http://www.manager.bg/sites/default/files/news_photos/telerik_logo_RGB_photoshop.jpg', title: 'Nice view' },
			{ url: 'http://academy.telerik.com/images/default-album/telerik-academyE49D1716EBCD.jpg?sfvrsn=4' },
			{ url: 'http://www.manager.bg/sites/default/files/news_photos/telerik_logo_RGB_photoshop.jpg', title: 'Nice view' },
			{ url: 'http://academy.telerik.com/images/default-album/telerik-academyE49D1716EBCD.jpg?sfvrsn=4' },
			{ url: 'http://www.manager.bg/sites/default/files/news_photos/telerik_logo_RGB_photoshop.jpg', title: 'Nice view' },
			{ url: 'http://academy.telerik.com/images/default-album/telerik-academyE49D1716EBCD.jpg?sfvrsn=4' },
			{ url: 'http://www.manager.bg/sites/default/files/news_photos/telerik_logo_RGB_photoshop.jpg', title: 'Nice view' },
			{ url: 'http://academy.telerik.com/images/default-album/telerik-academyE49D1716EBCD.jpg?sfvrsn=4' },
			{ url: 'http://www.manager.bg/sites/default/files/news_photos/telerik_logo_RGB_photoshop.jpg', title: 'Nice view' },
			{ url: 'http://academy.telerik.com/images/default-album/telerik-academyE49D1716EBCD.jpg?sfvrsn=4' },
			{ url: 'http://www.manager.bg/sites/default/files/news_photos/telerik_logo_RGB_photoshop.jpg', title: 'Nice view' },
			{ url: 'http://academy.telerik.com/images/default-album/telerik-academyE49D1716EBCD.jpg?sfvrsn=4' },
			{ url: 'http://www.abv.bg/images/spriteAbv.png'}
		]});

	$("#element1").protos().listView({
		data: dataSource,
		pageSize: 25,
		lazyLoading: true,
		templateId: 'galleryTemplate'
	});
</script><html>
<head>
    <script src="../jquery.js" type="text/javascript"></script>
    <!--<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script> -->
    <script src="../jquery.protos-ui.js" type="text/javascript"></script>
    <link href="../protos-ui.css" rel="stylesheet" />
</head>

<body>
    <script id="window" type="text/html">
        Input data
        <input id="1" />
        <br />
        Input data
        <input id="1" type="number" />
        <br />
        Input data
        <input id="1" />
        <br />
        Input data
        <input id="1" />
        <br />
        #console.log("template js execute");#
	#console.log("template js execute 1");#
	#=myVar1#
	#=myVar2#
	#console.log("template js execute 2");#
	#="Test text 3<br />"#
	Input data
        <input id="1" />
        <br />
        Input data
        <input id="1" />
        <br />
        <button>Submit</button>
    </script>
    <script>
        $(function () {
            $("#showWindow").protos().popUp({
                content: new protos.template("window", { myVar1: "Hello", myVar2: " World" }).render(),
				title: "Test popUp",
                width: 500,
                height: 300,
                darkness: 0.3,
                draggable: true,
                isContentDraggable: true
            });

            $("#showWindow").on('click', function () {
                $("#showWindow").data("popUp").show();
            });
			
			/////////////////////////////////////////////////////////
			protos.widgets.popUp.hide = function() { //Overide hide function
			$(".p-PopUp").hide(1000);
				setTimeout(function() { // setTimeout it's not the best way to do it , but it's workaround.
				$("#showWindow2").trigger("hidePopUp")
				}, 1000);			
			};
			
			protos.widgets.popUp.show = function() { //Overide show function
				$("#showWindow2").trigger("showPopUp");
				$(".p-PopUp").hide();
				$(".p-PopUp").show(1000);
			};
			
			$("#showWindow2").protos().popUp({
                content: "Peshoooo",
				title: "Test popUp",
                width: 500,
                height: 300,
                darkness: 0.3,
            });

            $("#showWindow2").on('click', function () {
                $("#showWindow2").data("popUp").show();
            });
        });
    </script>

    <div id="test">
        <button id="showWindow">Show PopUp</button>
		<button id="showWindow2">Show PopUp2</button>
    </div>
</body>
</html>
<script src="../jquery.js" type="text/javascript"></script>
<!--<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script> -->
    <script src="../jquery.protos-ui.js" type="text/javascript"></script>
    <link href="../protos-ui.css" rel="stylesheet" />

<div id="element1" style="background-color: red; width: 150px; height: 100px;">
</div>


<script type="text/javascript">
    $("#element1").protos().shake({
        duration: 700,
        speed: 0.1,
        vertical: false,
        distance: 5,
		event: "click",
    }).start();
</script><script src="../jquery.js" type="text/javascript"></script>
<!--<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script> -->
    <script src="../jquery.protos-ui.js" type="text/javascript"></script>
    <link href="../protos-ui.css" rel="stylesheet" />
<a href="#ivan">Ivan</a>
<a href="#vanko1">Vanko 1</a>
<a href="#test?id=5&test=2">Test</a>
<a href="#/news/52">Test</a>
<div id="application">
</div>


<script type="text/javascript">
$(function(){
       $("#application").protos().spa({
        layout: $("#application"),
        routes: [
			{ route: 'ivan'},
			{ route: 'vanko1', action: 'http://localhost/'},
			{ 
				route: 'test?id=:id&test=:test',
				action: function(params) {
					alert('The route "test" was requested ' + params.id + ' ' + params.test );
				}
			},
			{
				route: '/:page/:id',
				action: function(params) {
					alert('The page "' + params[0] + '" was requested with id: ' + params[1] );
				}
			}]
    }).startRouting(); 
   });
</script><script src="../jquery.js" type="text/javascript"></script>
<!--<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script> -->
    <script src="../jquery.protos-ui.js" type="text/javascript"></script>
    <link href="../protos-ui.css" rel="stylesheet" />

<div id="element1" style="background-color: red; width: 150px; height: 100px;">
</div>
<div id="element2" style="display: none; background-color: blue; width: 150px; height: 100px;">
</div>


<script type="text/javascript">
    $("#element1").protos().swap({
        element: "#element2",
		fadeInSpeed: 1500,
        fadeOutSpeed: 1500,
		event: "click",
    });

    $("#element1").on('swappingStarts', function()
    {
        console.log("Swapping starts");
    });

    $("#element1").on('swappingEnds', function()
    {
        console.log("Swapping Ends");
    });
</script>protos.dataSource = function(options) {
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
			query.filters.push(that.filters[i]);
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
widgets.spa = function(options) {
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
	
	options.content += protos.generateHtml('div', [], protos.generateHtml('button', ['protosOKbutton'], 'Ok', false), false, { style: 'padding-top: 15px; text-align: center;'});

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
	