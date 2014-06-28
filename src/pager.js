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
		else
		{
			drawPager();
		}
	})();
	
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
