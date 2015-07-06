;(function($) {

	//define file-scope variables
	var sgPeerJSApiKey = 'a7f838qn54eljtt9',
		sgPeer,
		sgPeerId,//will contain this user's peer id
		sgConns = [],//array containing all connections
		$sgChatWindow,
		$sgChatMessageCloneSrc,
		$sgConnectionCloneSrc,
		$sgAvatarWindow,
		$sgAvatar;

	var TYPE_MESSAGE = 'message',
		TYPE_AVATAR_INIT = 'avatar init'
		TYPE_AVATAR_MOVE = 'avatar';
	


	/*-- Start peer and connection functions --*/


		/**
		* create peer object
		* @param {string} varname Description
		* @returns {undefined}
		*/
		var initPeer = function() {
			sgPeer = new Peer({key: sgPeerJSApiKey});

			sgPeer.on('open', function(id) {
				sgPeerId = id;
				$('#yourConnectionId').val(id);
			});

			//handle incomming connections
			sgPeer.on('connection', checkConnection);

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
				case TYPE_MESSAGE:
					sender = conn.peer;
					displayChatMessage(sender, data.message);
					break;
				case TYPE_AVATAR_INIT:
					addAvatar(data, conn);
					break;
				case TYPE_AVATAR_MOVE:
					moveAvatar(data, conn);
					break;
			}

		};


		/**
		* send data to one or more data connections
		* @param {object} data The data to be sent
		* @param {DataConnection} conn [optional] The connection to send the message to; when conn is not provided, send to all connections
		* @returns {undefined}
		*/
		var sendData = function(data, conn) {
			if (conn) {
				conn.send(data);
			} else {
				for (var i=0, len = sgConns.length; i<len; i++) {
					conn = sgConns[i];
					conn.send(data);
				}
			}
		};
		
		
		/**
		* 
		* @param {string} varname Description
		* @returns {undefined}
		*/
		var connectionClosedHandler = function(conn) {
			removeDisplayedConnection(conn);
			removeAvatar(conn);
		};
		

		/**
		* initialize a connection with a peer
		* @param {DataConnection object} conn DataConnection object for the connection with this peer (every peer has its own DataConnection object)
		* @returns {undefined}
		*/
		var initConnection = function(conn) {
			sgConns.push(conn);

			//IN A PRODUCTION APP, YOU'LL WANT TO SEND A NEW CONNECTION EVENT HERE
			displayConnection(conn);
			console.log(conn);

			conn.on('data', function(data) {
				dataHandler(data, conn);
			});

			conn.on('close', function() {connectionClosedHandler(conn);});

			//somehow, we can't send data immediately, even if conn is open?
			setTimeout(function() {sendAvatarData(conn);}, 500);

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
		* handle clicking close link
		* @param {string} varname Description
		* @returns {undefined}
		*/
		var closeConnectionHandler = function(e) {
			e.preventDefault();
			var $conn = $(e.currentTarget).closest('.connection'),
				conn = $conn.data('connection');

			conn.close();
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
			var conn = sgPeer.connect(peerId, options);//returns DataConnection object
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


	/*-- End peer and connection functions --*/

	

	/*-- Start connections window functions --*/


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
			var $conn = getClone($sgConnectionCloneSrc);
				
			$conn.html($conn.html()+conn.peer)
					.insertBefore($sgConnectionCloneSrc);

			//store a reference to the connection object in the connection li element
			$conn.data('connection', conn);

			var avatarData = conn.metadata.avatar;
		};


		/**
		* 
		* @param {string} varname Description
		* @returns {undefined}
		*/
		var initConnectionsWindow = function() {
			var $connectionsWindow = $('#connectionsWindow');

			$sgConnectionCloneSrc = $connectionsWindow.find('.cloneSrc');

			$connectionsWindow.on('click', '.close', closeConnectionHandler)
		};


	/*-- End connections window functions --*/



	/*-- Start chat functions --*/


		/**
		* Display a chat message
		* @param {string} sender Sender of the message
		* @param {string} msg The message to display
		* @returns {undefined}
		*/
		var displayChatMessage = function(sender, msg) {
			
			var $msg = getClone($sgChatMessageCloneSrc);

			$msg.find('.sender .nickname')
				.text(sender)
				.end()
				.find('.message')
				.text(msg);

			$sgChatMessageCloneSrc.before($msg);
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

			sendData(data, conn);

			displayChatMessage('You', msg);
		};


		/**
		* initialize chat form
		* @param {string} varname Description
		* @returns {undefined}
		*/
		var initChatForm = function() {
			$('#chatForm').on('submit', function(e) {
				e.preventDefault();
				var msg = $('#message').val();
				sendMessage(msg);
			})
		};


		/**
		* initialize chat window
		* @returns {undefined}
		*/
		var initChatWindow = function() {
			$sgChatWindow = $('#chatWindow');
			$sgChatMessageCloneSrc = $sgChatWindow.find('.cloneSrc.messageLine');
		};


	/*-- End chat functions --*/



	/*-- Startavatar functions --*/

		/**
		* Add an avatar representing a connection
		* @param {object} data Avatar data (pos, color)
		* @param {DataConnection} conn The data connection this avatar represents
		* @returns {undefined}
		*/
		var addAvatar = function(data, conn) {
			var $avatar = getClone($sgAvatar).removeAttr('id');

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
		var sendAvatarData = function(conn) {
			var data = {
				type: TYPE_AVATAR_INIT,
				top: $sgAvatar.css('top'),
				left: $sgAvatar.css('left'),
				backgroundColor: $sgAvatar.css('backgroundColor')
			};
			sendData(data, conn);
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

			sendData(avData);
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
				peer: sgPeerId,
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
		initConnectionForm();
		initConnectionsWindow();
		initChatForm();
		initChatWindow();
		initAvatarWindow();
	};


	$(document).ready(init);
	
	
})(jQuery);