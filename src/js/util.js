/**
 * add handler to element
 */
function addHandler(element, type, handler) {
    if(element.addEventListener) {
        addHandler = function(element, type, handler) {
            element.addEventListener(type, handler, false);
        };
    } else if (element.attachEvent) {
        addHandler = function(element, type, handler) {
            element.attachEvent("on"+type, handler);
        };
    } else {
        addHandler = function(element, type, handler) {
            element["on"+type] = handler;
        };
    }
    return addHandler(element, type, handler);
};

/**
 * remove handler
 */
function removeHandler(element, type, handler){
    if(element.removeEventListener) {
        removeHandler = function(element, type, handler) {
            element.removeEventListener(type,handler,false);
        };
    } else if (element.detachEvent) {
        removeHandler = function (element, type, handler) {
            element.detachEvent("on"+type,handler);
        };
    }else{
        removeHandler = function (element, type, handler) {
            element["on"+type]=null;
        };
    }
    return removeHandler(element, type, handler);
};

/**
 * get target from event
 */
function getTarget(event) {
    event = event || window.event;
    return event.target || event.srcElement;
};

/**
 * prevent default
 */
function preventDefault(event) {
    event = event || window.event;
    if(event.preventDefault) {
        preventDefault = function(event) {
            event.preventDefault();
        }
    } else {
        preventDefault = function(event) {
            event.returnValue = false;
        }
    }
    return preventDefault(event);
};

/**
 * stop bubble
 */
function stopPropagation(event) {
    event = event || window.event;
    if(event.stopPropagation) {
        stopPropagation = function(event) {
            event.stopPropagation();
        }
    } else {
        stopPropagation = function(event) {
            event.cancelBubble = true;
        }
    }
    return stopPropagation(event);
};

function trim(word) {
    return word.replace(/^\s+|\s+$/g,"");
};

function hasClassName(element, className) {
    return Array.prototype.indexOf.call(element.className.split(' '), className) + 1;
};

function addClassName(element, className) {
    if(!hasClassName(element, className)) {
        element.className += (element.className == '' ? className : ' ' + className);
    }
};

function removeClassName(element, className) {
    var index = hasClassName(element, className) - 1,
        classNameArray = element.className.split(' ');
    if(index !== -1) {
        classNameArray.splice(index, 1);
        element.className = classNameArray.join(' ');
    }
};

/**
 * transform angle to radian
 * @param  {Number} angle
 * @return {Number}
 */
function angle2radian(angle) {
    return (-2 * Math.PI / 360 * angle);
};

/**
 * @param  {Number} year
 * @param  {Number} month
 * @return {Number}
 */
function getFirstDayOfMouth(year, month) {
    var date = new Date(year, month);
    var day = date.getDay();

    return day;
};

/**
 * @param  {Number} year
 * @param  {Number} month
 * @return {Number}
 */
function getDateCount(year, month) {
    var monthArr = [0, 2, 4, 6, 7, 9, 11];

    if(month == 1) {
        return ((year % 4 == 0 && year % 100 !== 0) || (year % 400 == 0))? 29 : 28;
    } else if (monthArr.some(function (item, index, array) {return month == item;})) {
        return 31;
    } else {
        return 30;
    }
};

/**
 * compare two arrays for each item
 * @param  {Array} arr1
 * @param  {Array} arr2
 * @return {Array}
 */
function compareArray(arr1, arr2) {
    var len1 = arr1.length,
        len2 = arr2.length,
        len,
        i;

    for(i = 0, len = Math.min(len1, len2); i < len; ++i) {
        if(parseInt(arr1[i], 10) < parseInt(arr2[i], 10)) {
            return [arr1, arr2];
        } else if (parseInt(arr1[i], 10) > parseInt(arr2[i], 10)) {
            return [arr2, arr1];
        }
    }
    if(len1 <= len2) {
        return [arr1, arr2];
    } else {
        return [arr2, arr1];
    }
};

/**
 * calculate days between two dates
 * @param  {String} date1 'year-month-date'
 * @param  {String} date2 'year-month-date'
 * @param  {String} delimiter '-' or other delimiters
 * @return {Number}
 */
function dateDiff(date1, date2, delimiter) {
    var dateArr1 = date1.split(delimiter),
        dateArr2 = date2.split(delimiter),
        dateObj1 = new Date(dateArr1[1] + '/' + dateArr1[2] + '/' + dateArr1[0]),
        dateObj2 = new Date(dateArr2[1] + '/' + dateArr2[2] + '/' + dateArr2[0]);

    return (Math.abs(dateObj2 - dateObj1) / 1000 / 60 / 60 / 24);
};

/**
 * find the index of ancester task node
 * @param  {Number} index
 * @param  {NodeList} tasks
 * @return {Number}
 */
function findBasicTask(index, tasks) {
    var resultIndex = index;
    while(tasks[resultIndex].parentIndex != -1) {
        resultIndex = tasks[resultIndex].parentIndex;
    }
    return resultIndex;
};

function isString(obj) {
    return "[object String]" === Object.prototype.toString.call(obj);
};

function isArray(obj) {
    return "[object Array]" === Object.prototype.toString.call(obj);
};

function isPlain(obj) {
    if(!obj || Object.prototype.toString.call(obj) !== "[object Object]" || !("isPrototypeOf" in obj)) {
        return false;
    }
    return true;
};
