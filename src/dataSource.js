
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
		
		if(typeOfRequest === 'function') {
			request(query, deferred);
			return;
		}
		
		var queryOptions = {
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			type: "GET",
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
		
		if(options.prepareData) {
			query = options.prepareData(query);
		}
		
		if(options.data.type === 'aspnet') {
			if(queryOptions.type === 'GET') {
				query = $.param(query);
			}
			else
			{
				query = JSON.stringify(query);
			}
		}
		
		queryOptions.data = query;
		
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
			that.dataChanged(true);
		});
		
		if(options.server && options.server.paging) {
			query = $.extend({
					Pagination: {
						Page: 1,
						PageSize: that._pageSize 
					}
				}, query);
		}
		
		resolveRequest(options.data.read, query, deferred);
		
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
	
	that.filter = function(filters) {
		if(options.server && options.server.filtering) {
			return that.read({
				Filters: filters
			});
		}
		
		// TODO:
		// that.localRepository = performQuery(remoteRepository);
		// that.dataChanged(true);
	};
	
	that.sort = function() {
		// TODO
	};
	
	that.findItem = function(guid) {
		return remoteRepository.first(function(dataItem) { return dataItem.uid == guid; });
	};
	
	return that;
};
