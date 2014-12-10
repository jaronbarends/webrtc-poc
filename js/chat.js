/*
* chat.js
* webrtc chat
* @requires efcs.util.js
* @requires wbrtcfy.js
*/

;(function($) {


	//define file-scope variables
	var fsPeer,// reference to peer object in webrtcfy.js, will be passed in
		$fsChatWindow,
		$fsChatMessageCloneSrc;

	var TYPE_MESSAGE = 'message';


	/*-- Start chat functions --*/


		/**
		* Display a chat message
		* @param {string} sender Sender of the message
		* @param {string} msg The message to display
		* @returns {undefined}
		*/
		var displayChatMessage = function(sender, msg) {
			
			var $msg = Efcs.util.getClone($fsChatMessageCloneSrc);

			$msg.find('.sender .nickname')
				.text(sender)
				.end()
				.find('.message')
				.text(msg);

			$fsChatMessageCloneSrc.before($msg);
		};


		/**
		* send a message to one or more data connections
		* @param {string} msg The message to send
		* @param {DataConnection} conn [optional] The connection to send the message to; when conn is not provided, send to all connections
		* @returns {undefined}
		*/
		var sendMessage = function(msg, conn) {
			var data = {
				type: TYPE_MESSAGE,
				message: msg
			};

			fsPeer.sendData(data, conn);

			displayChatMessage('You', msg);
		};


		/**
		* initialize chat window
		* @returns {undefined}
		*/
		var initChatWindow = function() {
			$fsChatWindow.removeClass('disabled');
			$fsChatMessageCloneSrc = $fsChatWindow.find('.cloneSrc.messageLine');

			$('#chatForm').on('submit', function(e) {
				e.preventDefault();
				var msg = $('#message').val();
				sendMessage(msg);
			});
		};


	/*-- End chat functions --*/



	/*-- Start peer functions --*/


		/**
		* handle incoming data
		* @param {string} varname Description
		* @returns {undefined}
		*/
		var dataHandler = function(data, conn) {
			var type = data.type;
			if (type === TYPE_MESSAGE) {
				var sender = conn.peer;
				displayChatMessage(sender, data.message);
			}
		};
		
		
		/**
		* handle closing a peer connection
		* @param {string} varname Description
		* @returns {undefined}
		*/
		var connectionClosedHandler = function(conn) {
		};


		/**
		* initialize a new connection
		* @param {string} varname Description
		* @returns {undefined}
		*/
		var connectionHandler = function(e, data) {
			if ($fsChatWindow.hasClass('disabled')) {
				initChatWindow();
			}

			var conn = data.connection;

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
			//console.log('')
			fsPeer = data.peer;
		};


	/*-- End peer functions --*/
	
	

	/*-- Start general init functions --*/


		/**
		* 
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
			$fsChatWindow = $('#chatWindow');
			addInitEventListeners();
		};


	/*-- End general init functions --*/
	

	$(document).ready(init);

})(jQuery);