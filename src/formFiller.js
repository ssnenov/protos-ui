protos.formFiller = function(form, json) {
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
};