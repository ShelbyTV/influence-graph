Array.prototype.swap=function(a, b) {
	var tmp=this[a];
	this[a]=this[b];
	this[b]=tmp;
}


var partition = function(array, begin, end, pivot, map) {
	var piv=array[pivot];
	array.swap(pivot, end-1);
	var store=begin;
	var ix;
	for(ix=begin; ix<end-1; ++ix) {
		if(map[array[ix]]<=map[piv]) {
			array.swap(store, ix);
			++store;
		}
	}
	array.swap(end-1, store);

	return store;
}

var qsort = function(array, begin, end, map) {
	if(end-1>begin) {
		var pivot=begin+Math.floor(Math.random()*(end-begin));

		pivot=partition(array, begin, end, pivot, map);

		qsort(array, begin, pivot, map);
		qsort(array, pivot+1, end, map);
	}
}


module.exports = function(array, map) {
	qsort(array, 0, array.length, map);
}
