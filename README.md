#webRTCify

A wrapper for handling WebRTC connections

Requires peerjs (http://peerjs.com/) for establishing the peer connection.

##Events
WebRTCify triggers events when anything significant happens. Events are triggered on the document node. Every event is namespaced with .webrtcify

###peerready.webrtcify
Triggered when an object for peer connections has been set up