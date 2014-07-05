Array.prototype.where = function (expression) {
	var result = [],
		length = this.length;
		
	for(var i = 0; i < length; i++) {
		var item = this[i];
		if(expression(item) === true) {
			result.push(item);
		}
	}
	return result;
};

Array.prototype.first = function (expression) {
	var length = this.length;
	for(var i = 0; i < length; i++) {
		var item = this[i];
		if(expression(item) === true) {
			return item;
		}
	}
};

Array.prototype.sort = function (compare) {

	var length = this.length,
		middle = Math.floor(length / 2);

	if (length < 2)
	  return this;

	return merge(this.slice(0, middle).sort(compare), this.slice(middle, length).sort(compare), compare);
  }

var merge = function (left, right, compare) {

var result = [];

while (left.length > 0 || right.length > 0) {
  if (left.length > 0 && right.length > 0) {
	if (compare(left[0], right[0])) {
	  result.push(left[0]);
	  left = left.slice(1);
	}
	else {
	  result.push(right[0]);
	  right = right.slice(1);
	}
  }
  else if (left.length > 0) {
	result.push(left[0]);
	left = left.slice(1);
  }
  else if (right.length > 0) {
	result.push(right[0]);
	right = right.slice(1);
  }
}
return result;
}

Array.prototype.last = function (expression) { // TODO: Just inverse the loop
	var length = this.length,
		lastValue;
		
	for(var i = 0; i < length; i++) {
		var item = this[i];
		if(expression(item) === true) {
			lastValue = item;
		}
	}
	
	return lastValue;
};

Array.prototype.any = function (expression) {
	var length = this.length;
	for(var i = 0; i < length; i++) {
		var item = this[i];
		if(expression(item) === true) {
			return true;
		}
	}
	return false;
};

Array.prototype.all = function (func) {
	var length = this.length;
	for(var i = 0; i < length; i++) {
		func(this[i]);
	}
	return this;
};

Array.prototype.count = function () {
	return this.length - 1;
};

//$(function() {
if (!Array.prototype.skip) {
	Array.prototype.skip = function(count) {
		if(this instanceof Array)
		{
			return this.slice(count, this.length);
		}
	};
}

Array.prototype.take = function(count) {
	if(this instanceof Array)
	{
		return this.slice(0, count);
	}
};

Array.prototype.remove = function(expression) {
	var length = this.length;
	for(var i = 0; i < length; i++) {
		var item = this[i];
		if(expression(item) === true) {
			this.splice(i,1);
		}
	}
};
//});
