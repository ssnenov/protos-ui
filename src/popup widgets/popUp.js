widgets.popUpCore = function (options) {
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
