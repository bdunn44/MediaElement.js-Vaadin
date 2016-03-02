var mejsplayer = mejsplayer || {};

mejsplayer.player = function (element, mejsOptions, mcOptions, rpcOptions) {
	
	var t = this;
	var d = mejsOptions.enablePluginDebug === true;
	
	/* Create the HTML5 audio or video element */
	function initializeDOM(f) {
		if (mcOptions.playerType === 'audio') {
			createAudio();
		} else if (mcOptions.playerType === 'video') {
			createVideo();
		}
		if (f === true) {
			addFallback();
		}
	}
	
	/* Create audio/video HTML5 players */
	function createAudio() {
		if (d) console.log('Creating an Audio player');
		element.innerHTML = '<audio id="' + mcOptions.uid + '" controls="controls" preload="none">'
					+ '<source type="audio/mp3" src="nothing" />'
					+ '</audio>';
	}
	
	function createVideo() {
		if (d) console.log('Creating a Video player');
		element.innerHTML = '<video id="' + mcOptions.uid  + '" style="width:100%;height:100%;" controls="controls" preload="none">'
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
			if (d) console.log('Adding Flash and Silverlight fallback');
			$('#' + mcOptions.uid).append(flashFallback);
			$('#' + mcOptions.uid).append(silverlightFallback);
			mejsOptions.plugins = ['flash', 'silverlight'];
			
		} else if (mcOptions.flash == true) {
			if (d) console.log('Adding Flash fallback');
			$('#' + mcOptions.uid).append(flashFallback);
			mejsOptions.plugins = ['flash'];
			
		} else if (mcOptions.silverlight == true) {
			if (d) console.log('Adding Silverlight fallback');
			$('#' + mcOptions.uid).append(silverlightFallback);
			mejsOptions.plugins = ['silverlight'];
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
    }
    
	/* Create MEJS player */
    initializeDOM(true);
	var mejsplayer = new MediaElementPlayer($('#' + mcOptions.uid), mejsOptions);
	
	/* Set player source */
	t.setSource = function(source) {
		mejsplayer.pause();
		
		var el = $('#' + mcOptions.uid);
		var yt = source.type === 'video/youtube';// || source.type === "video/vimeo";
		var tp = (source.type.indexOf("video") != -1 || yt) ? 'video' : 'audio';
		var oyt = $('#' + mcOptions.uid).attr('type') === 'video/youtube';
		
		/* Re-create the MEJS Player if the type has changed or if YouTube */
		if (mcOptions.playerType !== tp || yt || oyt) {
			if (d) console.log('Replacing MediaElementPlayer');
			mcOptions.playerType = tp;
			el.first().get(0).player.remove();
			initializeDOM(!yt); // Don't add fallback if YouTube
			el = $('#' + mcOptions.uid);
			el.attr('type', source.type).attr('src', source.src);
			if (yt) {
				mejsOptions.plugins.reverse();
				mejsOptions.plugins.push('youtube');
				mejsOptions.plugins.reverse();
				if (d) console.log('Enabled plugins: ' + mejsOptions.plugins);
			}
			mejsplayer = new MediaElementPlayer(el, mejsOptions);
		} 
		/* Set the source if not YouTube */
		if (!yt) {
			if (d) console.log('Setting mejs-player #' + mcOptions.uid + ' source to ' + source.src + ' [' + source.type + ']');
			mejsplayer.setSrc(source.src);
			$('#' + mcOptions.uid + ' object param[name="flashvars"]').attr('value', 'controls=true&amp;file=' + source.src);
		}
		mejsplayer.load();
	}
	
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
		if (d) console.log('Client notification: playbackended');
		t.notifyPlaybackEnded();
	}
	function loadeddata () {
		if (d) console.log('Client notification: loadeddata');
		t.notifyLoadedData();
	}
	function seeked () {
		if (d) console.log('Client notification: seeked');
		t.notifySeeked();
	}
	function canplay () {
		if (d) console.log('Client notification: canplay');
		t.notifyCanPlay();
	}
	function playing () {
		if (d) console.log('Client notification: playing');
		t.notifyPlaying();
	}
	function pause () {
		//if (d) 
			console.log('Client notification: pause');
		t.notifyPaused();
	}
	function play () {
		if (d) console.log('Client notification: play');
		t.notifyPlayed();
	}
	function loadedmetadata () {
		if (d) console.log('Client notification: loadedmetadata');
		t.notifyLoadedMetadata();
	}
	function volumechange () {
		if (d) console.log('Client notification: volumechange');
		t.notifyVolumeChanged();
	}
}