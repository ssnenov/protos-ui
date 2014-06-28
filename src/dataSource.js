
protos.dataSource = function(options) {
	var options = options || {}
	, that = this
	, remoteRepository // When data is readed (wherever) it stores here
	, itemsCount = null;
	
	that.dataChanged = $.noop;
	// In the local repo, stored data is that data that it comes (after filtering & sorting) from remote repo
	that.localRepository = null; // TODO: Think about to be with private
	// In currentPageData filed is stored the data from local repo but it's paged 
	that.currentPageData = null; // TODO: Think about to be with private with getter method
	
	var resolveRequest = function(request, query, deferred) {
		if(typeof(request) == 'function') {
			request(query, deferred);
			return;
		}
		
		$.ajax({
			url: options.data.read,
			contentType: "application/json; charset=utf-8",
			type: "GET",
			dataType: "jsonp",
			data: query,
			success: function(data) {
				deferred.resolve(data);
			},
			error: function(data) {
				deferred.reject(data);
			}
		});
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
	, setProperties = function () {
		for(var i in remoteRepository)
		{
			var item = remoteRepository[i];
			
			item.uid = protos.guid();
			item.changed = false; // Property for MVVM framework
			item.savedChanges = true;
			item.deleted = false;
		}
	};
	
	that.read = function() {
		var deferred = new protos.deferred();
		
		deferred.fail(function(data){ /*TODO*/ console.log(data); });
		deferred.done(function(data) {
			// Request was done
			var data = data[0]; // Why [0] ???
			
			if(data.items) {
				itemsCount = data.items;
				remoteRepository = data.data;
			}
			else
			{
				remoteRepository = data[0];
			}
			setProperties();
			that.localRepository = performQuery(remoteRepository);
			that.dataChanged(true); // true || false
		});
		
		if(!remoteRepository) {
			resolveRequest(options.data.read, {}, deferred);
		}
		
		return deferred;
	};
	
	that.itemsCount = function() {
		return itemsCount !== null ? itemsCount : that.localRepository.length;
	};
	
	that.update = function() {
		var deferred = new protos.deferred();
		
		return dataChanged();
	};
	
	that.create = function() {
		// Insert items only in remoteRepo. After that call that.refresh()
		var deferred = new protos.deferred();
		
		return dataChanged();
	};
	
	that.delete = function() {
		var deferred = new protos.deferred();
		
		deferred.done(function() {
			that.read();
		});
	};

	that.getPageData = function (page, itemsPerPage, abortReadingData) {
		// if(abortReadingData) {
			// return that.localRepository;
		// }

		if(options.server && options.server.paging) {
			return that.read();
		}
		
		return that.currentPageData = that.localRepository
			.skip((page - 1) * itemsPerPage)
			.take(itemsPerPage);
	};
	
	that.refresh = function() {
		var server = options.server;
		
		if(server && (server.filtering || server.paging || server.sorting)) {
			that.read();
		}
		that.localRepository = performQuery(remoteRepository);
		that.dataChanged(true);
	};
	
	// TODO: TEST IT!
	that.filter = function() {
		if(options.server && options.server.filtering) {
			return that.read();
		}
	};
	
	(function() {
		if(options.data.read) {
			that.read();
		}
	})();
};