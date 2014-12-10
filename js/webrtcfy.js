/*
* webrtcfy.js
*
* for creating webrtc connections
*
*/

;(function($) {

	//define file-scope variables
	var fsPluginname = 'webrtcfy',
		fsPeerJSApiKey = 'a7f838qn54eljtt9',
		fsPeer = {
			id: '',
			peer: {},
			connections: [],
			sendData: function(){}
		};//peer object, reference to this object can be passed around in other plugins
	


	/*-- Start peer and connection functions --*/


		/**
		* create peer object
		* @param {string} varname Description
		* @returns {undefined}
		*/
		var initPeer = function() {

			fsPeer.sendData = sendData;
			fsPeer.triggerEvent = triggerEvent;

			fsPeer.peer = new Peer({key: fsPeerJSApiKey});

			fsPeer.peer.on('open', function(id) {
				fsPeer.id = id;
				$('#yourConnectionId').val(id);

				triggerEvent('peerready', {peer:fsPeer});
			});

			//handle incomming connections
			fsPeer.peer.on('connection', checkConnection);

		};


		/**
		* 
		* @param {misc} data Data object
		* @param {DataConnection object} conn DataConnection that sent the data
		* @returns {undefined}
		*/
		var dataHandler = function(data, conn) {
			var type = data.type;

			switch(type) {
			}

		};


		/**
		* send data to one or more data connections; this function will be made available to plugins
		* through the fsPeer object
		* @param {object} data The data to be sent
		* @param {DataConnection} conn [optional] The connection to send the message to; when conn is not provided, send to all connections
		* @returns {undefined}
		*/
		var sendData = function(data, conn) {
			if (conn) {
				conn.send(data);
			} else {
				for (var i=0, len = fsPeer.connections.length; i<len; i++) {
					conn = fsPeer.connections[i];
					conn.send(data);
				}
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
		* initialize a connection with a peer
		* @param {DataConnection object} conn DataConnection object for the connection with this peer (every peer has its own DataConnection object)
		* @returns {undefined}
		*/
		var initConnection = function(conn) {
			fsPeer.connections.push(conn);

			conn.on('data', function(data) {
				dataHandler(data, conn);
			});

			conn.on('close', function() {connectionClosedHandler(conn);});

			//send event to let other scripts know a connection is ready
			//somehow, we can't send data immediately, even if conn is open?
			setTimeout(function() {
				var data = {
					connection: conn
				};
				triggerEvent('connectionready', data);

			});

		};



		/**
		* check if a new connection is open and ready
		* @param {string} varname Description
		* @returns {undefined}
		*/
		var checkConnection = function(conn) {
			if (conn.open) {
				initConnection(conn);
			} else {
				setTimeout(function() {checkConnection(conn);}, 100);
			}
		};


		/**
		* start Connection with another peer
		* @param {string} varname Description
		* @returns {undefined}
		*/
		var startConnection = function(peerId) {
			var uObject = getUserObject(),
				options = {
				metadata: {
					users: [uObject]
				}
			};
			var conn = fsPeer.peer.connect(peerId, options);//returns DataConnection object
			checkConnection(conn);
		};


		/**
		* 
		* @param {string} varname Description
		* @returns {undefined}
		*/
		var startConnectionHandler = function(e) {
			e.preventDefault();
			var peerConnectionId = $('#peerConnectionId').val();
			startConnection(peerConnectionId);
		};


		/**
		* 
		* @param {string} varname Description
		* @returns {undefined}
		*/
		var initConnectionForm = function() {
			$('#yourConnectionId').on('click', function(e) {
				e.currentTarget.select();
			});

			$('#connectionForm').on('submit', startConnectionHandler);
		};


		/**
		* handle request to close a connection
		* peerjs will let the connection send a close event when the connection is closed
		* @param {DataConnection} conn The data connection to remove
		* @returns {undefined}
		*/
		var closeConnectionHandler = function(e, conn) {
			conn.close();
		};
		


		/**
		* addEventListeners
		* @param {string} varname Description
		* @returns {undefined}
		*/
		var addEventListeners = function() {
			//listen for requests to close a connection
			$(document).on('closeConnection.'+fsPluginname, closeConnectionHandler);
		};
		


	/*-- End peer and connection functions --*/



	/*-- Start event sending functions --*/


		/**
		* send an event
		* @param {string} eventName The name of the event to send; pluginname will be added
		* @param {object} data [optional] Data to send along with the event
		* @returns {undefined}
		*/
		var triggerEvent = function(eventName, data) {
			eventName += '.'+fsPluginname;
			$(document).trigger(eventName, data);
		};
		

	/*-- End event sending functions --*/

	

	/*-- Start general functions --*/


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
		* get an object containing user data
		* @returns {object} object containing peer id and name
		*/
		var getUserObject = function() {
			var uObject = {
				peer: fsPeer.id,
				name: $('#nickname').val()
			};

			return uObject;
		};


	/*-- End general functions --*/
	


	/**
	* initialize all
	* @param {string} varname Description
	* @returns {undefined}
	*/
	var init = function() {
		initPeer();
		addEventListeners();
		initConnectionForm();
	};


	$(document).ready(init);
	
	
})(jQuery);