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
