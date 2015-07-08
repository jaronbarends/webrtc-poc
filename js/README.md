#webrtcfy.js

A wrapper for creating and handling webrtc connections. 

Requires peerjs (http://peerjs.com/) for establishing the peer connection

##How it works - overview

###peerWrapper-object

The js creates a peerWrapper-object __sgPeerWrapper__. A reference to this object can be passed around to other functionalities on the same page. (every page has its own peerWrapper object)

The peerWrapper can initialize and receive connections with other peer-objects (usually in other browser windows)

A form is set up to create connections (this has to be moved to its own separate file)

##Events the script sends

The script sends events that other functionalities on this page can listen for.  
All events sent by the script are suffixed with __.webrtcfy__.

###peerready.webrtcfy

Sent when the peerWrapper object has been initialized

__data-object properties:__   
`peer`: the peerWrapper object

###connectionready.webrtcfy

Sent when a connection to another peerWrapper is initalized and ready to send and receive data

__data-object properties:__  
`connection`: a peerjs connection that can be used by another script.


##Events the script listens for

The script itself also listens for events sent by add-ons.

###close.webrtcfy

expected data:  the peerjs connection-object to close

##peerWrapper-object methods

The sgPeerWrapper object that gets passed around has the following methods that can be called by add-ons:

###sendData

Can be used to send data to all or one specific connection

`sendData(data, conn)`

