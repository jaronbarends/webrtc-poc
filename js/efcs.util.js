/*
* efcs.util.js
* creates object util in global efcs object with util functions
*/
;(function($) {




	/**
	* get an element from a cloneSrc
	* @param {string of jQuery object} selector The selector for the cloneSrc, or the sloneSrc element itself
	* @returns {jQuery object} The cloned element
	*/
	var getClone = function(selector) {
		var $clone;
		if (typeof selector === 'string') {
			$clone = $(selector).clone();
		} else {
			$clone = selector.clone();
		}
		$clone.removeClass('cloneSrc');

		return $clone;
	};


	/**
	* 
	* @param {string} varname Description
	* @returns {undefined}
	*/
	var addFunctions = function() {
		var u = Efcs.util;//for easy typing

		u.getClone = getClone;
	};
	
	

	/**
	* 
	* @param {string} varname Description
	* @returns {undefined}
	*/
	var init = function() {
		window.Efcs = window.Efsc || {};
		Efcs.util = Efcs.util || {};

		addFunctions();
	};
	

	$(document).ready(init);

})(jQuery);