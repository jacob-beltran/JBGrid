/**
 * JBGrid JavaScript Helper v 1.0.0
 *
 * @author Jacob Beltran - http://jacobbeltran.com
 * @license http://opensource.org/licenses/MIT MIT License
 */
var JBGrid = (function(){
	'use strict';

	function JBGrid() {
		this.sizes = ['xs', 's', 'm', 'l', 'xl'];

		/* The following defined sizes are in em units */
		this.sizesMin = {
			'xs': 0,
			's': 20,
			'm': 35,
			'l': 60,
			'xl': 80
		};
		this.sizesMax = {
			'xs': 20,
			's': 35,
			'm': 60,
			'l': 80,
			'xl': 10000
		};
	}

	JBGrid.prototype.isJquery = function(obj) {
		if( typeof jQuery !== 'undefined' ) {
			return (obj instanceof jQuery);
		}
		return false;
	};

	JBGrid.prototype.isElement = function(obj) {
		try {
			return obj instanceof HTMLElement;
		}
		catch(e){
			return (typeof obj==="object") && (obj.nodeType===1) && (typeof obj.style === "object") && (typeof obj.ownerDocument ==="object");
		}
	};

	JBGrid.prototype.absoluteLeft = function(element) {
		var left = 0;
		do {
			if( !isNaN(element.offsetLeft) ) {
				left += element.offsetLeft;
			}
		} while( (element = element.offsetParent) !== null );
		return left;
	};

	JBGrid.prototype.absoluteTop = function(element) {
		var top = 0;
		do {
			if( !isNaN(element.offsetTop) ) {
				top += element.offsetTop;
			}
		} while( (element = element.offsetParent) !== null );
		return top;
	};

	JBGrid.prototype.setAspectRatio = function(element, aspectRatio) {
		var width = element.offsetWidth;
		var height = null;
		if( aspectRatio === "square" ) {
			height = Math.round(width);
		} else if(aspectRatio) {
			var ratioParts = aspectRatio.split(/[x\/\|\-\:]/);
			var ratioPercent = parseFloat(ratioParts[1]) / parseFloat(ratioParts[0]);
			height = Math.round(width * ratioPercent);
		}
		if( height ) {
			element.style.height = height + 'px';
		}
	};

	JBGrid.prototype.findAspectRatio = function() {
		var html = document.getElementsByTagName('html')[0];
		var fontSize = window.getComputedStyle(html).getPropertyValue('font-size');
		var em = parseInt(fontSize.replace(/px$/, ''));
		var windowWidth = window.innerWidth;

		var withAspectRatio = document.querySelectorAll('[data-aspectratio]');
		for (var i = withAspectRatio.length - 1; i >= 0; i--) {
			var element = withAspectRatio[i];
			var aspectRatio = element.getAttribute('data-aspectratio');
			this.setAspectRatio(element, aspectRatio);
		}

		for (var j = 0; j < this.sizes.length; j++) {
			var size = this.sizes[j];
			var minSize = this.sizesMin[size] * em;
			var maxSize = this.sizesMax[size] * em;
			var withAspectRatioSize = document.querySelectorAll('[data-aspectratio-'+size+']');

			if( windowWidth >= minSize ) {
				for (var l = withAspectRatioSize.length - 1; l >= 0; l--) {
					var match = withAspectRatioSize[l];
					match.style.height = '';
					var aspectRatioMatch = match.getAttribute('data-aspectratio-'+size);
					this.setAspectRatio(match, aspectRatioMatch);
				}
			}
		}
	};

	JBGrid.prototype.setFilledRowHeight = function() {
		var html = document.getElementsByTagName('html')[0];
		var fontSize = window.getComputedStyle(html).getPropertyValue('font-size');
		var em = parseInt(fontSize.replace(/px$/, ''));
		var windowWidth = window.innerWidth;

		var fullHeightRows = document.querySelectorAll('.row.fill-height');
		for (var i = fullHeightRows.length - 1; i >= 0; i--) {
			var row = fullHeightRows[i];
			var fullHeight = 0;
			var children = row.children;
			for (var j = children.length - 1; j >= 0; j--) {
				var column = children[j];
				column.style.height = '';
				if( column.offsetHeight > fullHeight ) {
					fullHeight = Math.round(column.offsetHeight);
				}
			}
			for (var k = children.length - 1; k >= 0; k--) {
				var child = children[k];
				child.style.height = fullHeight + 'px';
			}
		}

		for (var l = 0; l < this.sizes.length; l++) {
			var size = this.sizes[l];
			var minSize = this.sizesMin[size] * em;
			var maxSize = this.sizesMax[size] * em;
			var withSize = document.querySelectorAll('.row.fill-height-'+size);

			if( windowWidth >= minSize ) {
				for (var m = withSize.length - 1; m >= 0; m--) {
					var match = withSize[m];
					var rowHeight = 0;
					var matchChildren = match.children;
					var childColumn;
					for (var n = matchChildren.length - 1; n >= 0; n--) {
						childColumn = matchChildren[n];
						childColumn.style.height = '';
						if( childColumn.offsetHeight > rowHeight ) {
							rowHeight = Math.round(childColumn.offsetHeight);
						}
					}
					for (var o = matchChildren.length - 1; o >= 0; o--) {
						childColumn = matchChildren[o];
						childColumn.style.height = rowHeight + 'px';
					}
				}
			}
		}
	};

	JBGrid.prototype.fluidHeight = function(element) {
		if( this.isJquery(element) ) {
			element.css('min-height', element.css('height'));
			element.css('height', '');
		} else if( this.isElement(element) ) {
			element.style.minHeight = element.style.height;
			element.style.height = '';
		} else if( element ) {
			items = document.querySelectorAll(element);
			for (var i = items.length - 1; i >= 0; i--) {
				item = items[i];
				item.style.minHeight = item.style.height;
				item.style.height = '';
			}
		}
	};

	JBGrid.prototype.initSticky = function() {
		var stickies, sticky, clone;
		var selectors = ['.sticky'];
		var size;
		for (var h = this.sizes.length - 1; h >= 0; h--) {
			size = this.sizes[h];
			selectors.push('.sticky-'+size);
		}

		stickies = document.querySelectorAll(selectors.join(','));
		for (var i = stickies.length - 1; i >= 0; i--) {
			sticky = stickies[i];
			clone = sticky.cloneNode(true);
			clone.className = clone.className.replace(/(?:^|\s)sticky(?!\S)/, '');
			for (var j = this.sizes.length - 1; j >= 0; j--) {
				size = this.sizes[j];
				clone.className = clone.className.replace('sticky-'+size, '');
			}
			clone.className = clone.className + ' sticky-clone';
			clone.style.display = 'none';

			if( sticky.nextSibling ) {
				sticky.parentNode.insertBefore(clone, sticky.nextSibling);
			} else {
				sticky.parentNode.appendChild(clone);
			}
		}
	};

	JBGrid.prototype.setSticky = function() {
		var html = document.getElementsByTagName('html')[0];
		var fontSize = window.getComputedStyle(html).getPropertyValue('font-size');
		var em = parseInt(fontSize.replace(/px$/, ''));
		var windowWidth = window.innerWidth;
		var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		var isSticky = false;
		var makeSticky = [];
		var clearSticky = [];
		var element, sticky, posTop, deltaTop, triggerTop;

		var stickies = document.querySelectorAll('.sticky');
		for (var i = stickies.length - 1; i >= 0; i--) {
			element = stickies[i];
			posTop = this.absoluteTop(element);
			deltaTop = 0;
			if( element.getAttribute('data-sticky-top') ) {
				deltaTop = parseInt(element.getAttribute('data-sticky-top'));
			}
			triggerTop = scrollTop + deltaTop;
			if( posTop <= triggerTop ) {
				makeSticky.push(element);
			} else {
				clearSticky.push(element);
			}
		}

		for (var j = 0; j < this.sizes.length; j++) {
			var size = this.sizes[j];
			var minSize = this.sizesMin[size] * em;
			var maxSize = this.sizesMax[size] * em;
			var stickySize = document.querySelectorAll('.sticky-'+size);

			if( windowWidth >= minSize ) {
				for (var l = stickySize.length - 1; l >= 0; l--) {
					element = stickySize[l];
					posTop = this.absoluteTop(element);
					deltaTop = 0;
					if( element.getAttribute('data-sticky-top-'+size) ) {
						deltaTop = parseInt(element.getAttribute('data-sticky-top-'+size));
					} else if( element.getAttribute('data-sticky-top') ) {
						deltaTop = parseInt(element.getAttribute('data-sticky-top'));
					}
					triggerTop = scrollTop + deltaTop;
					if( posTop <= triggerTop ) {
						makeSticky.push(element);
					} else {
						clearSticky.push(element);
					}
				}
			} else {
				for (var k = stickySize.length - 1; k >= 0; k--) {
					element = stickySize[k];
					clearSticky.push(element);
				}
			}
		}

		for (var m = clearSticky.length - 1; m >= 0; m--) {
			element = clearSticky[m];
			var willSticky = false;
			for (var n = makeSticky.length - 1; n >= 0; n--) {
				sticky = makeSticky[n];
				if( element === sticky ) {
					willSticky = true;
				}
			}
			if( !willSticky ) {
				this.clearSticky(element);
			}
		}
		for (var o = makeSticky.length - 1; o >= 0; o--) {
			element = makeSticky[o];
			this.makeSticky(element);
		}
	};


	JBGrid.prototype.makeSticky = function(element) {
		var sticky = element.nextSibling;
		var posLeft = this.absoluteLeft(element);
		var deltaTop = 0;
		if( element.getAttribute('data-sticky-top') ) {
			deltaTop = parseInt(element.getAttribute('data-sticky-top'));
		} else {
			for (var i = 0; i < this.sizes.length; i++) {
				var size =this.sizes[i];
				if( element.getAttribute('data-sticky-top-'+size) ) {
					deltaTop = parseInt(element.getAttribute('data-sticky-top-'+size));
				}
			}
		}

		element.style.visibility = 'hidden';
		sticky.style.display = 'block';
		sticky.style.width = Math.round(element.offsetWidth)+'px';
		sticky.style.position = 'fixed';
		sticky.style.top = deltaTop + 'px';
		sticky.style.left = posLeft + 'px';
	};

	JBGrid.prototype.clearSticky = function(element) {
		var sticky = element.nextSibling;

		element.style.visibility = '';
		sticky.style.display = 'none';
		sticky.style.position = '';
		sticky.style.top = '';
		sticky.style.left = '';
	};

	JBGrid.prototype.setLayout = function() {
		this.findAspectRatio();
		this.setFilledRowHeight();
		this.setSticky();
	};

	JBGrid.prototype.init = function(){
		this.initSticky();
		this.setLayout();

		var existingResize = window.onresize;
		window.onresize = function(){
			var grid = new JBGrid();
			grid.setLayout();
			if(typeof existingResize === "function") {
				existingResize.call(window);
			}
		};
		var existingScroll = window.onscroll;
		window.onscroll = function(){
			var grid = new JBGrid();
			grid.setSticky();
			if(typeof existingScroll === "function") {
				existingScroll.call(window);
			}
		};
	};

	var jbGrid = new JBGrid();
	jbGrid.init();

	return JBGrid;
})();
