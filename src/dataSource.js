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
