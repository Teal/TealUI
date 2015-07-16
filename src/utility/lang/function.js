
// #region @Function.empty

/**
 * 空函数。
 */
Function.empty = function () { };

// #endregion

// #region @Function.from

/**
 * 返回一个值，这个值是当前的参数。
 */
Function.from = function (value) {
    return function () {
        return value;
    };
};

// #endregion
