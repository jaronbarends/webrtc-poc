/*
* connectionDisplay.js
* display connections with webrtcfy.js
* @requires wbrtcfy.js
*/

;(function($) {


	//define file-scope variables
	var sgPeer,// reference to peer object in webrtcfy.js, will be passed in
		$sgConnectionCloneSrc;

	var TYPE_FOR_THIS_EXTENSION = 'some representative string here';


	/*-- Start connections window functions --*/


		/**
		* handle clicking close link
		* this will not handle the actual closing of a connection, only the request to do so
		* the actual closing is handled by connectionClosedHandler
		* @param {string} varname Description
		* @returns {undefined}
		*/
		var closeConnectionHandler = function(e) {
			e.preventDefault();
			var $conn = $(e.currentTarget).closest('.connection'),
				conn = $conn.data('connection');

			var eventName = 'close';
			sgPeer.triggerEvent('closeConnection', conn);
		};


		/**
		* remove a connection from the connections window
		* @param {DataConnection} conn The data connection to remove
		* @returns {undefined}
		*/
		var removeDisplayedConnection = function(conn) {
			$('#connectionsWindow').find('li').not('.cloneSrc').each(function() {
				var $connLi = $(this),
					currConn = $connLi.data('connection');

				if ($connLi.data('connection') && $connLi.data('connection').peer === conn.peer) {
					$connLi.slideUp($connLi.remove);
				}
			});
		};
		

		/**
		* display a connection in the connections window
		* @param {DataConnection} conn The data connection to display
		* @returns {undefined}
		*/
		var displayConnection = function(conn) {
			var $conn = Efcs.util.getClone($sgConnectionCloneSrc);
				
			$conn.html($conn.html()+conn.peer)
					.insertBefore($sgConnectionCloneSrc);

			//store a reference to the connection object in the connection li element
			$conn.data('connection', conn);

		};


		/**
		* 
		* @param {string} varname Description
		* @returns {undefined}
		*/
		var initConnectionsWindow = function() {
			var $connectionsWindow = $('#connectionsWindow');

			if ($connectionsWindow.hasClass('disabled')) {

				$connectionsWindow.removeClass('disabled');
				$sgConnectionCloneSrc = $connectionsWindow.find('.cloneSrc');
				$connectionsWindow.on('click', '.close', closeConnectionHandler);

			}
		};




		/**
		* send data to a specific connection
		* @param {DataConnection} conn [optional] Data connection to send data to
		* @returns {undefined}
		*/
		var sendData = function(conn) {
			var data = {
			};

			sgPeer.sendData(data, conn);
		};


	/*-- End connections window functions --*/


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
					break;
			}
		};
		
		
		/**
		* handle closing a peer connection
		* @param {string} varname Description
		* @returns {undefined}
		*/
		var connectionClosedHandler = function(conn) {
			removeDisplayedConnection(conn);
		};


		/**
		* initialize a new connection
		* @param {string} varname Description
		* @returns {undefined}
		*/
		var connectionHandler = function(e, data) {

			var conn = data.connection;

			initConnectionsWindow();

			displayConnection(conn);
			
			conn.on('data', function(data) {
				dataHandler(data, conn);
			});

			conn.on('close', function() {
				connectionClosedHandler(conn);
			});

		};


		/**
		* handle peer object beinig initialized
		* @param {string} varname Description
		* @returns {undefined}
		*/
		var peerreadyHandler = function(e, data) {
			sgPeer = data.peer;
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