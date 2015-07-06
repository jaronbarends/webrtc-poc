/*
* avatar.js
* webrtc avatar display
* @requires efcs.util.js
* @requires wbrtcfy.js
*/

;(function($) {


	//define file-scope variables
	var sgPeer,// reference to peer object in webrtcfy.js, will be passed in
		$sgAvatarWindow,
		$sgAvatar;

	var TYPE_AVATAR_INIT = 'avatar init'
		TYPE_AVATAR_MOVE = 'avatar';


	/*-- Start avatar functions --*/

		/**
		* Add an avatar representing a connection
		* @param {object} data Avatar data (pos, color)
		* @param {DataConnection} conn The data connection this avatar represents
		* @returns {undefined}
		*/
		var addAvatar = function(data, conn) {
			var $avatar = Efcs.util.getClone($sgAvatar).removeAttr('id');

			var css = {
				left: data.left,
				top: data.top,
				backgroundColor: data.backgroundColor
			}

			$avatar.css(css)
				.attr('data-connection-id', conn.peer)
				.appendTo($sgAvatarWindow)
				.hide()
				.fadeIn();
		};


		/**
		* Remove an avatar representing a connection
		* @param {DataConnection} conn The data connection this avatar represents
		* @returns {undefined}
		*/
		var removeAvatar = function(conn) {
			var connId = conn.peer;
			var $avatar = $sgAvatarWindow.find('[data-connection-id="'+connId+'"]');
			if ($avatar.length) {
				$avatar.fadeOut($avatar.remove);
			}
		};


		/**
		* 
		* @param {string} varname Description
		* @returns {undefined}
		*/
		var moveAvatar = function(data, conn) {
			var connectionId = conn.peer
			var $avatar = $sgAvatarWindow.find('[data-connection-id="'+connectionId+'"]');

			var css = {
				left: data.left,
				top: data.top
			};

			$avatar.css(css);
		};


		/**
		* return avatar data
		* @param {DataConnection} varname Description
		* @returns {object} avatarData
		*/
		var getAvatarData = function() {
			var avatarData = {
				top: $sgAvatar.css('top'),
				left: $sgAvatar.css('left'),
				backgroundColor: $sgAvatar.css('backgroundColor')
			};
			return avatarData;
		};
		

		/**
		* send avatar data to a specific connection
		* @param {DataConnection} varname Description
		* @returns {undefined}
		*/
		var sendAvatarInitData = function(conn) {
			var data = {
				type: TYPE_AVATAR_INIT,
				top: $sgAvatar.css('top'),
				left: $sgAvatar.css('left'),
				backgroundColor: $sgAvatar.css('backgroundColor')
			};

			sgPeer.sendData(data, conn);
		};


		/**
		* 
		* @param {string} varname Description
		* @returns {undefined}
		*/
		var moveAvatarHandler = function(e, data) {
			var color = $(data.targetElm).data('color');
			var avData = {
				type: TYPE_AVATAR_MOVE,
				left: data.left,
				top: data.top,
				color: data.color
			};

			sgPeer.sendData(avData);
		};


		/**
		* 
		* @param {string} varname Description
		* @returns {undefined}
		*/
		var initAvatarWindow = function() {
			$sgAvatarWindow = $('#avatarWindow');
			$sgAvatar = $('#yourAvatar');

			var left = Math.floor( ($sgAvatarWindow.width() - $sgAvatar.width())*Math.random() ),
				top = Math.floor( ($sgAvatarWindow.height() - $sgAvatar.height())*Math.random() );

			var r = Math.floor(16*Math.random()).toString(16),
				g = Math.floor(16*Math.random()).toString(16),
				b = Math.floor(16*Math.random()).toString(16),
				color = '#'+r+g+b;

			var css = {
				left: left,
				top: top,
				backgroundColor: color
			};

			$sgAvatar.drags().css(css).data('color', color);

			$(document).on('move.drags', moveAvatarHandler);
		};


	/*-- End avatar functions --*/


	/*-- Start peer functions --*/


		/**
		* handle incoming data
		* @param {string} varname Description
		* @returns {undefined}
		*/
		var dataHandler = function(data, conn) {
			var type = data.type;

			switch(type) {
				case TYPE_AVATAR_INIT:
					addAvatar(data, conn);
					break;
				case TYPE_AVATAR_MOVE:
					moveAvatar(data, conn);
					break;
			}
		};
		
		
		/**
		* handle closing a peer connection
		* @param {string} varname Description
		* @returns {undefined}
		*/
		var connectionClosedHandler = function(conn) {
			removeAvatar(conn);
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

			setTimeout(function() {sendAvatarInitData(conn);},200);
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
			initAvatarWindow();
			addInitEventListeners();
		};


	/*-- End general init functions --*/
	

	$(document).ready(init);

})(jQuery);