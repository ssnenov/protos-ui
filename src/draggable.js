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
};