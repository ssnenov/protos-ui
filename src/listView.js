widgets.listView = function (options) {
	var defaultOptions = {
		width: 600,
		height: 400,
		imageWidth: 200,
		pageSize: 15,
		lazyLoading: false
	},
		that = this,
		author = options.author[0] || {},
		LIST_VIEW_ITEM = 'listViewItem',
		listItemElement = author.id + '_listItems',
		pagerContatinerElement = author.id + 'pagerContainer';
		
	options = $.extend(defaultOptions, options);
	author.innerHTML += protos.generateHTML('ul', [], '', listItemElement);
	author.innerHTML += protos.generateHTML('div', [], '', pagerContatinerElement);
	that.dataSource = options.data;
	
	// TODO: minification improvement
	var attachActionEvents = function () {
		var itemsSelector = hashTag + listItemElement + ' li .';
		$(itemsSelector + 'itemEdit').each(function (i, element) {
			$(element).on('click', function () {
				var itemElement = $(this).closest('.listViewItem')
					, uid = itemElement.attr('data-uid')
					, dataItem = that.dataSource.findItem(uid)
					, popUp = itemElement.data('popUp');

				if (!popUp) {
					var editTemplate = protos.template(options.editTemplate, { action: 'update', data: dataItem }).render()
						, content = protos.generateHTML('form', [], editTemplate, 'editForm');
						
					itemElement.protos().popUp(
						$.extend({
							content: content,
							title: 'Edit item'
						}, options.popUp || {})
					);
					popUp = itemElement.data('popUp');
				}
				
				itemElement.off('popUpShowed').on('popUpShowed', function () {
					protos.formFiller($('#editForm'), dataItem);
					$('#editForm').off('submit').on('submit', function (e) {
						e.preventDefault();
						
						$.extend(dataItem, $('#editForm').serializeJson());
						
						popUp.hide();
						that.dataSource.update();
					});
				});
				
				popUp.show();
			});
		});
		
		$(itemsSelector + 'itemDelete').each(function(i, element) {
			$(element).on('click', function() {
				var itemElement = $(this).closest('.listViewItem')
					, uid = itemElement.attr('data-uid')
					, dataItem = that.dataSource.findItem(uid);
				
				dataItem.deleted = true;
				that.dataSource.delete();
			});
		});
	
		$(hashTag + author.id + ' .itemCreate').on('click', function() {
			var listViewElement = $(this)			
			, popUp = listViewElement.data('popUp');
			
			if(!popUp) {
				var editTemplate = protos.template(options.editTemplate, { action: 'create' }).render()
					, content = protos.generateHTML('form', [], editTemplate, 'createForm');
					
				listViewElement.protos().popUp(
					$.extend({
						content: content,
						title: 'Add an item'
					}, options.popUp || {})
				);
				popUp = listViewElement.data('popUp');
			}

			listViewElement.off('popUpShowed').on('popUpShowed', function() {
				$("#createForm").off('submit').on('submit', function(e) {
					e.preventDefault();
					
					var data = $(this).serializeJson();
					popUp.hide();
					that.dataSource.create(data);
				});
			});
			
			popUp.show();
		});
	};
	
	that.renderPage = function () {
		if(!options.lazyLoading) {
			$(hashTag + listItemElement + ' li').remove('.' + LIST_VIEW_ITEM);
		}
		
		var html = '',
			data = that.dataSource.currentPageData,
			imgWidth = options.imageWidth;
			
		for(var i = 0; i < data.length; i++) {
			var itemHtml = new protos.template(options.templateId, data[i]).render();
			html += protos.generateHTML('li', [LIST_VIEW_ITEM], itemHtml, '', false, {'data-uid': data[i].uid});
		}
		
		$(hashTag + listItemElement).append(html);
		$(author).trigger('pageRendered');
		attachActionEvents();
	};
	
	that.pager = new protos.widgets.pager({
		pageSize: options.pageSize,
		dataSource: options.data,
		container: hashTag + pagerContatinerElement,
		pageChanged: that.renderPage,
		lazyLoading: options.lazyLoading,
		nextPrevButtons: options.nextPrevButtons
	});
	
	(function() {
		options.data.read();
	})();
	
	return that;
};
