;(function($) {

	'use strict';

	var $sgLogwin = $('#logwin'),
		sgCounter = 0;

	/**
	* 
	* @param {string} varname Description
	* @returns {undefined}
	*/
	var moveHandler = function(e) {
		sgCounter++;
		$sgLogwin.text(sgCounter);
	};
	


	/**
	* 
	* @param {string} varname Description
	* @returns {undefined}
	*/
	var init = function() {
		$('#yourAvatar').drags();

		$(document).on('move.drags', moveHandler);
	};
	

	$(document).ready(init);

})(jQuery);