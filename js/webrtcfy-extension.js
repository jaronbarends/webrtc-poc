/*
* webcrtfy-extension.js
* basic code for creating extension to work with webrtcfy.js
* @requires wbrtcfy.js
*/

;(function($) {


	//define file-scope variables
	var fsPeer;// reference to peer object in webrtcfy.js, will be passed in

	var TYPE_FOR_THIS_EXTENSION = 'some representative string here';


	/*-- Start extension functions --*/


		/**
		* send data to a specific connection
		* @param {DataConnection} conn [optional] Data connection to send data to
		* @returns {undefined}
		*/
		var sendData = function(conn) {
			var data = {
			};

			fsPeer.sendData(data, conn);
		};


	/*-- End extension functions --*/


	/*-- Start peer functions --*/


		/**
		* handle incoming data
		* @param {string} varname Description
		* @returns {undefined}
		*/
		var dataHandler = function(data, conn) {
			var type = data.type;

			switch(type) {
				case TYPE_FOR_THIS_EXTENSION:
					console.log('data received:', data, conn);
					break;
			}
		};
		
		
		/**
		* handle closing a peer connection
		* @param {string} varname Description
		* @returns {undefined}
		*/
		var connectionClosedHandler = function(conn) {
			console.log('connection closed with '+conn.peer);
		};


		/**
		* initialize a new connection
		* @param {string} varname Description
		* @returns {undefined}
		*/
		var connectionHandler = function(e, data) {
			var conn = data.connection;
			
			conn.on('data', function(data) {
				dataHandler(data, conn);
			});

			conn.on('close', function() {
				connectionClosedHandler(conn);
			});

			console.log('new connection with '+conn.peer);
		};


		/**
		* handle peer object beinig initialized
		* @param {string} varname Description
		* @returns {undefined}
		*/
		var peerreadyHandler = function(e, data) {
			fsPeer = data.peer;
		};


	/*-- End peer functions --*/
	
	

	/*-- Start general init functions --*/

	
		/**
		* set up event listeners for initialising the peer connection
		* the other events can be bound to the connection that will be passed in
		* @param {string} varname Description
		* @returns {undefined}
		*/
		var addInitEventListeners = function() {
			$(document).on('peerready.webrtcfy', peerreadyHandler);
			$(document).on('connectionready.webrtcfy', connectionHandler);
		};
		

		/**
		* initialize app
		* @param {string} varname Description
		* @returns {undefined}
		*/
		var init = function() {
			addInitEventListeners();
		};


	/*-- End general init functions --*/
	

	$(document).ready(init);

})(jQuery);