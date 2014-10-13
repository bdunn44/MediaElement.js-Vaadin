// Version 1.2.0

// Define the namespace
var mejslibrary = mejslibrary || {};

mejslibrary.MediaComponent = function (element, mejsOptions, mcOptions, rpcOptions) {
	
	// Clean up
	while (element.firstChild) {
		var clone = element.firstChild.cloneNode(true);
		element.replaceChild(clone, element.firstChild);
		element.removeChild(clone);
	};
	
	// Store MEJS player state
	var playerState = {
		paused: undefined,
		ended: undefined,
		seeking: undefined,
		duration: undefined,
		muted: undefined,
		volume: undefined,
		currentTime: undefined
	};
	
	this.getState = function() {  
		return playerState;
	};
	
	var mejsid = mcOptions.mejsUid;
	
	var videoElement = 
		'<video id="' + mejsid  + '" controls="controls" preload="none">' +
			'<source type="video/mp4" src="nothing" />' +
		'</video>';
	var audioElement = 
		'<audio id="' + mejsid + '" controls="controls" preload="none">' +
			'<source type="audio/mp3" src="nothing" />' +
		'</audio>';
	
	// Create the HTML5 audio or video element
	if (mcOptions.playerType == "audio") {
		console.log("Creating an Audio player");
		element.innerHTML = audioElement;
	} else if (mcOptions.playerType == "video") {
		console.log("Creating a Video player");
		element.innerHTML = videoElement;
	};
	
	var flashFallback = 
		'<object type="application/x-shockwave-flash" data="media-element/flashmediaelement.swf">' +
			'<param name="movie" value="media-element/flashmediaelement.swf" />' +
			'<param name="flashvars" value="controls=true&file=nothing" />' +
		'</object>';
	var silverlightFallback = 
		'<object type="application/x-silverlight-2" data="media-element/silverlightmediaelement.xap">' +
			'<param name="movie" value="media-element/silverlightmediaelement.xap" />' +
			'<param name="flashvars" value="controls=true&file=nothing" />' +
		'</object>';
	
	// Enable Flash and/or Silverlight fallback
	if (mcOptions.flash == true && mcOptions.silverlight == true) {
		$("#" + mejsid).append(flashFallback);
		$("#" + mejsid).append(silverlightFallback);
		mejsOptions.plugins = ["flash", "silverlight"];
	}
	else if (mcOptions.flash == true) {
		console.log("Adding Flash fallback");
		$("#" + mejsid).append(flashFallback);
		mejsOptions.plugins = ["flash"];
	}
	else if (mcOptions.silverlight == true) {
		console.log("Adding Silverlight fallback");
		$("#" + mejsid).append(silverlightFallback);
		mejsOptions.plugins = ["silverlight"];
	};
	
	mejsOptions.success = function (mediaElement, domObject) {

		// Add client-side listeners to update state
		mediaElement.addEventListener('ended', function(e) { updateState(mediaElement); });
		mediaElement.addEventListener('canplay', function(e) { updateState(mediaElement); });
		mediaElement.addEventListener('loadedmetadata', function(e) { updateState(mediaElement); });
		mediaElement.addEventListener('pause', function(e) { updateState(mediaElement); });
		mediaElement.addEventListener('playing', function(e) { updateState(mediaElement); });
		mediaElement.addEventListener('play', function(e) { updateState(mediaElement); });
		mediaElement.addEventListener('seeked', function(e) { updateState(mediaElement); });
		mediaElement.addEventListener('volumechange', function(e) { updateState(mediaElement); });
		mediaElement.addEventListener('loadeddata', function(e) { updateState(mediaElement); });
		mediaElement.addEventListener('timeupdate', function(e) { updateState(mediaElement); });
		
        // Add RPC event listeners
		if (rpcOptions.playbackEndedRpc == true) { mediaElement.addEventListener('ended', ended, false); };
		if (rpcOptions.canPlayRpc == true) { mediaElement.addEventListener('canplay', canplay, false); };
		if (rpcOptions.loadedMetadataRpc == true) { mediaElement.addEventListener('loadedmetadata', loadedmetadata, false); };
		if (rpcOptions.pauseRpc == true) { mediaElement.addEventListener('pause', pause, false); };
		if (rpcOptions.playingRpc == true) { mediaElement.addEventListener('playing', playing, false); };
		if (rpcOptions.playRpc == true) { mediaElement.addEventListener('play', play, false); };
		if (rpcOptions.seekedRpc == true) { mediaElement.addEventListener('seeked', seeked, false); };
		if (rpcOptions.volumeChangeRpc == true) { mediaElement.addEventListener('volumechange', volumechange, false); };
		if (rpcOptions.loadedDataRpc == true) { mediaElement.addEventListener('loadeddata', loadeddata, false); };
    };
    
	// Create the MEJS player
	var mejsplayer = new MediaElementPlayer($("#" + mejsid), mejsOptions);
	
	// Sets a new source
	this.setSource = function (sources) {
		console.log("Setting source to " + sources[0].src + " for mejs id #" + mejsid);
		mejsplayer.setSrc(sources[0].src);
		$("#" + mejsid + " object param[name='flashvars']").attr("value", "controls=true&amp;file=" + sources[0].src);
		mejsplayer.load();
	};
	
	// Keep track of added event listeners
	/*var addedListeners = {};
	function addEventListener(eventType, func) {
		if (addedListeners[eventType]) return;
		console.log("Adding listener " + eventType);
		addedListeners[eventType] = func;
		$("#" + mejsid).bind(eventType, func);
		//mejsplayer.addEventListener(eventType, func, false);
	}*/
	
	// Only add event listeners that have been enabled
	/*this.refreshListeners = function(rpcOptions) {
		console.log("Refreshing Listeners...");
		if (rpcOptions.playbackEndedRpc == true) { addEventListener('ended', ended); };
		if (rpcOptions.canPlayRpc == true) { addEventListener('canplay', canplay); };
		if (rpcOptions.loadedMetadataRpc == true) { addEventListener('loadedmetadata', loadedmetadata); };
		if (rpcOptions.pauseRpc == true) { addEventListener('pause', pause); };
		if (rpcOptions.playingRpc == true) { addEventListener('playing', playing); };
		if (rpcOptions.playRpc == true) { addEventListener('play', play); };
		if (rpcOptions.seekedRpc == true) { addEventListener('seeked', seeked); };
		if (rpcOptions.volumeChangeRpc == true) { addEventListener('volumechange', volumechange); };
		if (rpcOptions.loadedDataRpc == true) { addEventListener('loadeddata', loadeddata); };
	};*/
	
	// Testing currenttime - WORKING
	/*setInterval(outTime, 1000);
	function outTime() {
		console.log(playerState.currentTime);
	};*/
	
	// RPC calls from server
	this.play = function () {
		mejsplayer.play();
	};
	this.pause = function () {
		mejsplayer.pause();
	};
	this.mute = function () {
		mejsplayer.setMuted(true);
	};
	this.unmute = function () {
		mejsplayer.setMuted(false);
	};
	this.setVolume = function (volume) {
		mejsplayer.setVolume(volume);
	};
	this.setCurrentTime = function (currentTime) {
		mejsplayer.setCurrentTime(currentTime);
	};

	var self = this;
	
	function updateState(mediaElement) {
		playerState.paused = mediaElement.paused;
		playerState.ended = mediaElement.ended;
		playerState.seeking = mediaElement.seeking;
		playerState.duration = mediaElement.duration;
		playerState.muted = mediaElement.muted;
		playerState.volume = mediaElement.volume;
		playerState.currentTime = mediaElement.currentTime;
	};
	
	// RPC calls to server (events)
	function ended () {
		console.log("Client notification: playbackended");
		self.notifyPlaybackEnded();
	};
	function loadeddata () {
		console.log("Client notification: loadeddata");
		self.notifyLoadedData();
	};
	function seeked () {
		console.log("Client notification: seeked");
		self.notifySeeked();
	};
	function canplay () {
		console.log("Client notification: canplay");
		self.notifyCanPlay();
	};
	function playing () {
		console.log("Client notification: playing");
		self.notifyPlaying();
	};
	function pause () {
		console.log("Client notification: pause");
		self.notifyPaused();
	};
	function play () {
		console.log("Client notification: play");
		self.notifyPlayed();
	};
	function loadedmetadata () {
		console.log("Client notification: loadedmetadata");
		self.notifyLoadedMetadata();
	};
	function volumechange () {
		console.log("Client notification: volumechange");
		self.notifyVolumeChanged();
	};
};