/**
 *   @author 
 */

var Sorter = Sorter || {};

/**
 *   默认比较的函数。
 *   @param {Object} a 比较的参数。
 *   @param {Object} b 比较的参数。
 *   @return {Boolean} 布尔。表示 a 是否比 b 大。
 *   @private
 */
Sorter._defaultSorter = function (a, b) {
	return a < b; 
};

Sorter._createFn = function (sortFn) {
	return function (iteratable, compareFn, start, end) {
		//assert.isNumber(iteratable && iteratable.length, "Sorter.sort(iteratable, start, end, compareFn): 参数 {iteratable} 必须有 length 属性。");

		compareFn = compareFn || Sorter._defaultSorter;
		start = start || 0;
		end = end || iteratable.length;

		//assert(start >= 0 && start <= end, "Sorter.sort(iteratable, start, end, compareFn): 参数 {start} ~。");
		//assert(end <= iteratable.length, "Sorter.sort(iteratable, start, end, compareFn): 参数 {end} ~。");
		//assert.isFunction(compareFn, "Sorter.sort(iteratable, start, end, compareFn): 参数 {compareFn} ~。");


		sortFn(iteratable, compareFn, start, end);
		return iteratable;

	};
};

/**
 * 冒泡排序。
 * @param {Object} iteratable 集合。
 * @param {Number} start 开始排序的位置。
 * @param {Number} end 结束排序的位置。
 * @param {Function} compareFn 比较函数。
*/
Sorter.bubble = Sorter._createFn(function (iteratable, compareFn, start, end) {

	for (; start < end; start++)
		for (var k = start + 1; k < end; k++)
			if (compareFn(iteratable[k], iteratable[start])) {
				var c = iteratable[start];
				iteratable[start] = iteratable[k];
				iteratable[k] = c;
			}

	return iteratable;
}),

/**
 *  对集合进行希尔排序。
 *  @param {Object} iteratable 集合。
 *  @param {Number} start 开始排序的位置。
 *  @param {Number} end 结束排序的位置。
 *  @param {Function} compareFn 比较函数。
 *  @memberOf JPlus.Sorter
 */
Sorter.shell = Sorter._createFn(function (iteratable, compareFn, start, end) {

	for (var gap = (end - start) >> 1; gap > 0; gap = gap >> 1) {
		for (var i = gap + start; i < end; i++) {
			for (var temp = iteratable[i], j = i; (j - gap >= start) && compareFn(temp, iteratable[j - gap]) ; j -= gap) {
				iteratable[j] = iteratable[j - gap];
			}
			iteratable[j] = temp;
		}
	}

	return iteratable;
}),

/**
 *  对集合进行快速排序。
 *  @param {Object} iteratable 集合。
 *  @param {Number} start 开始排序的位置。
 *  @param {Number} end 结束排序的位置。
 *  @param {Function} compareFn 比较函数。
 *  @memberOf JPlus.Sorter
*/
Sorter.quick = Sorter._createFn(function (iteratable, compareFn, start, end) {

	if (start >= end)
		return;

	var temp = iteratable[start], low = start, high = end;
	do {
		while (high > low && !compareFn(iteratable[high], temp))
			high--;

		if (low < high)
			iteratable[low++] = iteratable[high];


		while (low < high && compareFn(iteratable[low], temp))
			low++;

		if (low < high)
			iteratable[high--] = iteratable[low];

	} while (low < high);
	iteratable[low] = temp;

	var qsort = arguments.callee;
	qsort(iteratable, compareFn, start, high - 1);
	qsort(iteratable, compareFn, high + 1, end);

});

//Sorter.mergeSort = (function () {
//	function merge(left, right) {
//		var result = [];

//		while (left.length > 0 && right.length > 0) {
//			if (this.comparator((left[0]).get(this.col), (right[0]).get(this.col)) <= 0) {
//				result.push(left[0]);
//				left = left.slice(1);
//			} else {
//				result.push(right[0]);
//				right = right.slice(1);
//			}
//		}
//		while (left.length > 0) {
//			result.push(left[0]);
//			// left = left.slice(1);
//		}
//		while (right.length > 0) {
//			result.push(right[0]);
//			right = right.slice(1);
//		}
//		return result;
//	}

//	return function (iteratable, compareFn, start, end) {
//		var middle = (iteratable.length) / 2,
//			left = iteratable.slice(0, middle),
//			right = iteratable.slice(middle),
//			result;
//			left = this.mergeSort(left);
//			right = this.mergeSort(right);
//			result = this.merge(left, right);
//			return result;
//	};
//})()

