// Define the namespace
var mejslibrary = mejslibrary || {};

mejslibrary.MediaComponent = function (element, mejsOptions, mcOptions, rpcOptions) {
	
	// Clean up
	while (element.firstChild) {
		var clone = element.firstChild.cloneNode(true);
		element.replaceChild(clone, element.firstChild);
		element.removeChild(clone);
	}
	
	var videoElement = 
		'<video id="mejsplayer" controls="controls" preload="none">' +
			'<source type="video/mp4" src="nothing" />' +
		'</video>';
	var audioElement = 
		'<audio id="mejsplayer" controls="controls" preload="none">' +
			'<source type="audio/mp3" src="nothing" />' +
		'</audio>';
	
	// Create the HTML5 audio or video element
	if (mcOptions.playerType == "audio") {
		console.log("Creating an Audio player");
		element.innerHTML = audioElement;
	} 
	else if (mcOptions.playerType == "video") {
		console.log("Creating a Video player");
		element.innerHTML = videoElement;
	}
	
	var flashFallback = 
		'<object type="application/x-shockwave-flash" data="media-element/flashmediaelement.swf">' +
			'<param name="movie" value="media-element/flashmediaelement.swf" />' +
			'<param name="flashvars" value="controls=true&file=nothing" />' +
		'</object>';
	var silverlightFallback = 
		'<object type="application/x-silverlight-2" data="media-element/silverlightmediaelement.xap">' +
			'<param name="movie" value="media-element/silverlightmediaelement.xap" />' +
			'<param name="flashvars" value="controls=true&file=myvideo.wmv" />' +
		'</object>';
	
	// Enable Flash and/or Silverlight fallback
	if (mcOptions.flash == true) {
		console.log("Adding Flash fallback");
		$("#mejsplayer").append(flashFallback);
	}
	if (mcOptions.silverlight == true) {
		console.log("Adding Silverlight fallback");
		$("#mejsplayer").append(silverlightFallback);
	}
	
	// Create success function
	mejsOptions.success = function (mediaElement, domObject) {
        // add event listeners
		if (rpcOptions.playbackEndedRpc == true) { mediaElement.addEventListener('ended', ended, false); };
		if (rpcOptions.canPlayRpc == true) { mediaElement.addEventListener('canplay', canplay, false); };
		if (rpcOptions.loadedMetadataRpc == true) { mediaElement.addEventListener('loadedmetadata', ended, false); };
		if (rpcOptions.pausedRpc == true) { mediaElement.addEventListener('pause', ended, false); };
		if (rpcOptions.playingRpc == true) { mediaElement.addEventListener('playing', playing, false); };
		if (rpcOptions.seekedRpc == true) { mediaElement.addEventListener('seeked', seeked, false); };
		if (rpcOptions.volumeChangeRpc == true) { mediaElement.addEventListener('volumechange', ended, false); };
		if (rpcOptions.loadedDataRpc == true) { mediaElement.addEventListener('loadeddata', loadeddata, false); };
    };
	
	var mejsplayer = new MediaElementPlayer($("#mejsplayer"), mejsOptions);
	
	// Sets a new source
	this.setSource = function (sources) {
		mejsplayer.setSrc(sources);
		$("#mejsplayer object param[name='flashvars']").attr("value", "controls=true&amp;file=" + sources[0].src);
		mejsplayer.load();
	};
	
	// Builds the current state of the MEJS player
	this.playerState = function () {
		this.paused = mejsplayer.paused;
		this.ended = mejsplayer.ended;
		this.seeking = mejsplayer.seeking;
		this.duration = mejsplayer.duration;
		this.muted = mejsplayer.muted;
		this.volume = mejsplayer.volume;
		this.currentTime = mejsplayer.currentTime;
	};
	
	// RPC calls from server
	this.play = function () {
		mejsplayer.play();
	};
	this.pause = function () {
		mejsplayer.pause();
	};
	this.mute = function () {
		mejsplayer.mute();
	};
	this.setVolume = function (volume) {
		mejsplayer.setVolume(volume);
	};
	this.setCurrentTime = function (currentTime) {
		mejsplayer.setCurrentTime(currentTime);
	};
	
	// RPC calls to server (events)
	var self = this;
	function ended () {
		console.log("Client notification: ended");
		self.notifyEnded();
	};
	function loadeddata () {
		console.log("Client notification: loadeddata");
		self.notifyLoadedData();
	}
	function seeked () {
		console.log("Client notification: seeked");
		self.notifySeeked();
	}
	function canplay () {
		console.log("Client notification: canplay");
		self.notifyCanPlay();
	}
	function playing () {
		console.log("Client notification: playing");
		self.notifyPlaying();
	}
	function pause () {
		console.log("Client notification: pause");
		self.notifyPause();
	}
	function loadedmetadata () {
		console.log("Client notification: loadedmetadata");
		self.notifyLoadedMetadata();
	}
	function volumechange () {
		console.log("Client notification: volumechange");
		self.notifyVolumeChange();
	}
};