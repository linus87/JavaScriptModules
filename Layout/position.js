//**********************************************************************************************************************************************************
/**
 * Figure out if current document is in quirks mode.
 * @param a: document object
 */
function isQuirksMode(doc) {
	// In IE6,IE7,IE8,IE9,IE10 Firefox and Chrome browsers, document.compatMode has two values: "BackCompat", "CSS1Compat".
	return doc.compatMode && doc.compatMode.indexOf("CSS") != -1;
}

/** 
 * the x coordinate when no parent has scroll left.
 */
function absLeft(node) {
	// original absolute x position of element in document
	return node.offsetLeft + (node.offsetParent && node.offsetParent.nodeType == 1 ? absLeft(node.offsetParent) : 0);
}

/**
 * how much does element's parent scroll left.
 */
function absLeftOffset(node) {
	// offset in x coordinate in window because parent node has scrollbar.
	return (node.parentNode && node.parentNode.nodeType == 1 ? absLeftOffset(node.parentNode) : 0) + (node.nodeName.toLowerCase() != "html" && node.nodeName.toLowerCase() != "body" && node.scrollLeft ? -node.scrollLeft : 0);
}

/**
 * Calculate the node's x coordinate in whole page, ignore the scroll of body or html element.
 */
absXPosInPage = function (node) {
	if (node.getBoundingClientRect) {
		return node.getBoundingClientRect().left + (Math.max(node.ownerDocument.documentElement.scrollLeft, node.ownerDocument.body.scrollLeft) - Math.max(node.ownerDocument.documentElement.clientLeft, node.ownerDocument.documentElement.offsetLeft));
	} else {
		// absolute x coordinate minus parent node's left scroll.
		return absLeft(node) + absLeftOffset(node);
	}
};

/** 
 * the y coordinate when no parent has scroll left.
 */
function absTop(node) {
	// original absolute y coordinate of element in document
	return node.offsetTop + (node.offsetParent && node.offsetParent.nodeType == 1 ? absTop(node.offsetParent) : 0)
}

function absTopOffset(node) {
	// offset in y coordinate in window because of parent node has scrollbar.
	return (node.parentNode && node.parentNode.nodeType == 1 ? absTopOffset(node.parentNode) : 0) + (node.nodeName.toLowerCase() != "html" && node.nodeName.toLowerCase() != "body" && node.scrollTop ? -node.scrollTop : 0)
}

/**
 * Calculate the node's y coordinate in whole page, ignore the scroll of body or html element.
 */
absYPosInPage = function (node) {
	if (node.getBoundingClientRect)
		return node.getBoundingClientRect().top + (Math.max(node.ownerDocument.documentElement.scrollTop, node.ownerDocument.body.scrollTop) - Math.max(node.ownerDocument.documentElement.clientTop, node.ownerDocument.documentElement.offsetTop));
	else
		return absTop(a) + absTopOffset(a)
};

/**
 * Calculate the node's x and y coordinate in whole page, ignore the scroll of body or html element.
 */
getPositionInPage = function(node) {
	var left = 0, top = 0;
	if (node.getBoundingClientRect) {
		left += node.getBoundingClientRect().left + (Math.max(node.ownerDocument.documentElement.scrollLeft, node.ownerDocument.body.scrollLeft) - Math.max(node.ownerDocument.documentElement.clientLeft, node.ownerDocument.documentElement.offsetLeft));
		top += node.getBoundingClientRect().top + (Math.max(node.ownerDocument.documentElement.scrollTop, node.ownerDocument.body.scrollTop) - Math.max(node.ownerDocument.documentElement.clientTop, node.ownerDocument.documentElement.offsetTop));
	} else {
		left += absLeft(node) + absLeftOffset(node);
		top += absTop(a) + absTopOffset(a);
	}

	return {
		top: top,
		left: left
	}
}

/**
 * Get the abs x coordinate and y coordinate of node in viewport. This is different from getPositionInPage, because it doesn't ignore html or body's scroll.
 * Scroll is considered in this function.
 * @param node
 * @return {top: xxx, left: xxx}
 */
getPositionInViewPort = function(node) {
	if (node.getBoundingClientRect)	{
		return node.getBoundingClientRect();
	} else {
		var left = 0, top = 0;
		while (node && !isNaN(node.offsetLeft) && !isNaN(node.offsetTop)) {
			left += node.offsetLeft - node.scrollLeft;
			top += node.offsetTop - node.scrollTop;
			node = node.offsetParent;
		}
		return {
			top : top,
			left : left
		}
	}
}

//*********************************************************************************************************************************************************

/**
 * Get the visible height of the whole document or window.
 */
function getVisibleHeight(doc) {
	// in IE quirks mode, documentElement.clientHeight == 0
	return isQuirksMode(a) ? doc.body.clientHeight : doc.documentElement.clientHeight;
}

/**
 * Get the visible height of the whole document or window.
 */
function getVisibleWidth(doc) {
	var result = 0;
	
	if (window.innerWidth) {
		// In IE6, IE7 and IE8, window object doesn't have innerWidth property.
		result = window.innerWidth;
	}

	result = Math.max(result, doc.documentElement.clientWidth);
	result = Math.max(doc.body.clientWidth, result);

	return result;
}

/**
 * Get the page height, if content's height is smaller than window's height, use window's height.
 */
function getPageHeight(doc) {
	// for IE and Firefox, use documentElement.scrollHeight, Chrome use body.scrollHeight.
	return Math.max(doc.documentElement.scrollHeight, doc.body.scrollHeight);
}

/**
 * Get the page height, if content's height is smaller than window's height, use window's height.
 */
function getPageWidth(doc) {
	// for IE and Firefox, use documentElement.scrollHeight, Chrome use body.scrollHeight.
	return Math.max(doc.documentElement.scrollWidth, doc.body.scrollWidth);
}

/**
 * Get whole page's size
 * 
 * @return {height: xxx, width: xxx}
 */
function getPageSize(doc) {
	return {
		height: Math.max(doc.documentElement.scrollHeight, doc.body.scrollHeight),
		width:  Math.max(doc.documentElement.scrollWidth, doc.body.scrollWidth)
	};
}

/**
 * Check if specified element in view port.
 * @param ele: element
 * @return boolean
 */
function isElementInViewport(ele) {
	var a = ele.getBoundingClientRect();
	return a.top >= 0 && a.left >= 0 && a.bottom <= (window.innerHeight || document.documentElement.clientHeight) && a.right <= (window.innerWidth || document.documentElement.clientWidth);
};

exports = {
	absXPosInPage: absXPosInPage,
	absYPosInPage: absYPosInPage,
	getPositionInPage: getPositionInPage,
	getPositionInViewPort: getPositionInViewPort,
	getVisibleHeight: getVisibleHeight,
	getVisibleWidth: getVisibleWidth,
	getPageHeight: getPageHeight,
	getPageWidth: getPageWidth,
	getPageSize: getPageSize
};