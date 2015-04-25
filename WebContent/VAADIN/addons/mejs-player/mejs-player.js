// Version 1.2.4

// Define the namespace
var mejsplayer = mejsplayer || {};

mejsplayer.player = function (element, mejsOptions, mcOptions, rpcOptions) {
	
	var 
		t = this,
		d = mejsOptions.enablePluginDebug === true;
	
	/* Create the HTML5 audio or video element */
	function initialize(f) {
		if (mcOptions.playerType === "audio") {
			createAudio();
		} else if (mcOptions.playerType === "video") {
			createVideo();
		}
		if (f === true) addFallback();
	}
	
	// Create audio/video HTML5 players
	function createAudio() {
		if (d) console.log("Creating an Audio player");
		element.innerHTML = '<audio id="' + mcOptions.uid + '" controls="controls" preload="none">'
					+ '<source type="audio/mp3" src="nothing" />'
					+ '</audio>';
	}
	
	function createVideo() {
		if (d) console.log("Creating a Video player");
		element.innerHTML = '<video id="' + mcOptions.uid  + '" controls="controls" preload="none">'
					+ '<source type="video/mp4" src="nothing" />'
					+ '</video>';
	}
	
	function addFallback() { 
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
		
		/* Enable Flash and/or Silverlight fallback */
		if (mcOptions.flash == true && mcOptions.silverlight == true) {
			if (d) console.log("Adding Flash and Silverlight fallback");
			$("#" + mcOptions.uid).append(flashFallback);
			$("#" + mcOptions.uid).append(silverlightFallback);
			mejsOptions.plugins = ["flash", "silverlight"];
			
		} else if (mcOptions.flash == true) {
			if (d) console.log("Adding Flash fallback");
			$("#" + mcOptions.uid).append(flashFallback);
			mejsOptions.plugins = ["flash"];
			
		} else if (mcOptions.silverlight == true) {
			if (d) console.log("Adding Silverlight fallback");
			$("#" + mcOptions.uid).append(silverlightFallback);
			mejsOptions.plugins = ["silverlight"];
		}
	}
	
	mejsOptions.success = function (mediaElement, domObject) {
		
        /* Add RPC event listeners */
		if (rpcOptions.playbackEndedRpc) { mediaElement.addEventListener('ended', ended, false); }
		if (rpcOptions.canPlayRpc) { mediaElement.addEventListener('canplay', canplay, false); }
		if (rpcOptions.loadedMetadataRpc) { mediaElement.addEventListener('loadedmetadata', loadedmetadata, false); }
		if (rpcOptions.pauseRpc) { mediaElement.addEventListener('pause', pause, false); }
		if (rpcOptions.playingRpc) { mediaElement.addEventListener('playing', playing, false); }
		if (rpcOptions.playRpc) { mediaElement.addEventListener('play', play, false); }
		if (rpcOptions.seekedRpc) { mediaElement.addEventListener('seeked', seeked, false); }
		if (rpcOptions.volumeChangeRpc) { mediaElement.addEventListener('volumechange', volumechange, false); }
		if (rpcOptions.loadedDataRpc) { mediaElement.addEventListener('loadeddata', loadeddata, false); }
    };
    
	/* Create MEJS player */
    initialize(true);
	var mejsplayer = new MediaElementPlayer($("#" + mcOptions.uid), mejsOptions);
	
	/* Set player source */
	t.setSource = function(source) {
		mejsplayer.pause();
		
		var el = $("#" + mcOptions.uid);
		var ex = source.type === "video/youtube";// || source.type === "video/vimeo";
		var tp = (source.type.indexOf("video") != -1 || ex) ? "video" : "audio";
		
		/* Re-create the MEJS Player if the type has changed or if it's an external source */
		if (mcOptions.playerType !== tp || ex) {
			if (d) console.log("Replacing MediaElementPlayer");
			mcOptions.playerType = tp;
			el.first().get(0).player.remove();
			initialize(!ex); // Don't add fallback if external
			el = $("#" + mcOptions.uid);
			el.attr("type", source.type).attr("src", source.src);
			mejsplayer = new MediaElementPlayer(el, mejsOptions);
		} 
		/* Set the source if not external */
		if (!ex) {
			if (d) console.log("Setting mejs-player #" + mcOptions.uid + " source to " + source.src + " [" + source.type + "]");
			mejsplayer.setSrc(source.src);
			$("#" + mcOptions.uid + " object param[name='flashvars']").attr("value", "controls=true&amp;file=" + source.src);
		}
		mejsplayer.load();
	};
	
	/* Get player state */
	t.getState = function() {  
		return mejsplayer.media;
	}
	
	t.getPlayerType = function() {
		return mcOptions.playerType;
	}
	
	/* RPC calls from server */
	t.play = function () {
		mejsplayer.play();
	}
	t.pause = function () {
		mejsplayer.pause();
	}
	t.mute = function () {
		mejsplayer.setMuted(true);
	}
	t.unmute = function () {
		mejsplayer.setMuted(false);
	}
	t.setVolume = function (volume) {
		mejsplayer.setVolume(volume);
	}
	t.setCurrentTime = function (currentTime) {
		mejsplayer.setCurrentTime(currentTime);
	}
	
	/* RPC calls to server (client-side events) */
	function ended () {
		if (d) console.log("Client notification: playbackended");
		t.notifyPlaybackEnded();
	}
	function loadeddata () {
		if (d) console.log("Client notification: loadeddata");
		t.notifyLoadedData();
	}
	function seeked () {
		if (d) console.log("Client notification: seeked");
		t.notifySeeked();
	}
	function canplay () {
		if (d) console.log("Client notification: canplay");
		t.notifyCanPlay();
	}
	function playing () {
		if (d) console.log("Client notification: playing");
		t.notifyPlaying();
	}
	function pause () {
		if (d) console.log("Client notification: pause");
		t.notifyPaused();
	}
	function play () {
		if (d) console.log("Client notification: play");
		t.notifyPlayed();
	}
	function loadedmetadata () {
		if (d) console.log("Client notification: loadedmetadata");
		t.notifyLoadedMetadata();
	}
	function volumechange () {
		if (d) console.log("Client notification: volumechange");
		t.notifyVolumeChanged();
	}
}