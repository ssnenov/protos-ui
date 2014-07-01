
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
		var typeOfRequest = typeof(request);
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
				deferred.resolve(data);
			},
			error: function(data) {
				deferred.reject(data);
			}
		};
		
		if(typeOfRequest === 'string') {
			queryOptions.url = request;
		}
		else
		{
			queryOptions = $.extend(request, queryOptions);
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
			if(data[0].Total) {
				itemsCount = data[0].Total;
				remoteRepository = data[0].Data;
			}
			else
			{
				remoteRepository = data[0];
			}
			setProperties(remoteRepository);
			that.localRepository = performQuery(remoteRepository);
			that.dataChanged(true); // true || false
		});
		
		if(options.server && options.server.paging) {
			query = $.extend({ page: 1, pageSize: that._pageSize }, query);
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
		var deferred = new protos.deferred();
		
		return dataChanged();
	};
	
	that.addItems = function(items) {
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
		var deferred = new protos.deferred();
		
		deferred.done(function() {
			that.read();
		});
	};

	that.getPageData = function (page, itemsPerPage, abortReadingData) {
		if(options.server && options.server.paging) {
			if(abortReadingData) {
				return that.currentPageData = that.localRepository;
			}
			return that.read({
				page: page,
				pageSize: itemsPerPage
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
	that.filter = function() {
		if(options.server && options.server.filtering) {
			return that.read();
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
