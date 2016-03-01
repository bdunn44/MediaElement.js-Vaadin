com_kbdunn_vaadin_addons_mediaelement_MediaElementPlayer = function () {
	
	var t = this;
	var l = 'com.kbdunn.vaadin.addons.mediaelement.mejs-player-connector: ';
	var e = t.getElement();
	var	s = t.getState();
	var	o = s.options;
	var	d = false; /* debugger */
	var	p;
	
	if (d) {
		console.log(l + 'Creating an mejs-player component');
		dumpState();
		o.enablePluginDebug = true;
	}
	
	function dumpState() {
		console.log(l + 'Dumping shared state information....');
		console.log(l + 'Player Type: ' + s.playerType);
		console.log(l + 'Flash Fallback: ' + s.flashFallbackEnabled);
		console.log(l + 'Silverlight Fallback: ' + s.silverlightFallbackEnabled);
		
		console.log(l + 'MEJS Options: ');
		for (var opt in o) {
			console.log(l + '  ' + opt + ': ' + o[opt]);
		}
		
		console.log(l + 'Source:');
		if (s.source) {
			console.log(l + '  ' + s.source.src + ' (' + s.source.type + ')');
		}
		
		console.log(l + 'Player state properties:');
		console.log(l + '  paused: ' + s.paused);
		console.log(l + '  ended: ' + s.ended);
		console.log(l + '  seeking: ' + s.seeking);
		console.log(l + '  duration: ' + s.duration);
		console.log(l + '  muted: ' + s.muted);
		console.log(l + '  volume: ' + s.volume);
		console.log(l + '  currentTime: ' + s.currentTime);
		
		console.log(l + 'Enabled RPC Calls:');
		console.log(l + '  Playback Ended: ' + s.playbackEndedRpc);
		console.log(l + '  Can Play: ' + s.canPlayRpc);
		console.log(l + '  Loaded Metadata: ' + s.loadedMetadataRpc);
		console.log(l + '  Pause: ' + s.pauseRpc);
		console.log(l + '  Playing: ' + s.playingRpc);
		console.log(l + '  Play: ' + s.playRpc);
		console.log(l + '  Seeked: ' + s.seekedRpc);
		console.log(l + '  Volume Change: ' + s.volumeChangeRpc);
		console.log(l + '  Loaded Data: ' + s.loadedDataRpc);
	}
	
	/* Split options into separate objects */
	var rpco = {
		playbackEndedRpc: s.playbackEndedRpc,
		canPlayRpc: s.canPlayRpc,
		loadedMetadataRpc: s.loadedMetadataRpc,
		pauseRpc: s.pauseRpc,
		playingRpc: s.playingRpc,
		playRpc: s.playRpc,
		seekedRpc: s.seekedRpc,
		volumeChangeRpc: s.volumeChangeRpc,
		loadedDataRpc: s.loadedDataRpc
	}
	
	var mpo = {
		uid: s.uid,
		playerType: s.playerType,
		flash: s.flashFallbackEnabled,
		silverlight: s.silverlightFallbackEnabled
	}
	
	/* RPC call from server to initialize the player */
	t.initPlayer = function() {
		if (d) console.log(l + 'INITIALIZING PLAYER');
		p = new mejsplayer.player(e, o, mpo, rpco);
		if (s.source) t.updateSource();
	}
	
	/* Update the sources of the media player from information in the shared state */
	t.updateSource = function() {
		if (d) console.log(l + 'updateSource(). Source is ' + s.source.src + ' [' + s.source.type + ']');
		if (!s.source) { 
			if (d) console.log(l + 'updateSource() was called, but no source is set in the shared state.'); 
			return; 
		}
		if (!p) { 
			if (d) console.log(l + 'updateSource() was called, but the player has not been initialized.'); 
			return; 
		}
		/* Copy shared state source */
		var src = {
				src: s.source.src,
				type: s.source.type
		}
		/* Complete the src path based on resource type */
		if (src.src.indexOf('app://') === 0) { 
			/* File resource */
			src.src = getURL() + src.src.replace('app://', '');
			
		} else if (src.src.indexOf('theme://') === 0) { 
			/* Theme resource */
			src.src = getURL() + src.src.replace('theme://', 'VAADIN/');
		} else if (src.src.indexOf('youtube.com') !== -1 || src.src.indexOf('youtu.be') !== -1) {
			src.type = 'video/youtube';
		}
		p.setSource(src);
	}
	
	/* Get window URL */
	function getURL() {
		/* IE fix */
		if (!window.location.origin) {
			window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
		}
		return window.location.origin + window.location.pathname;
	}
	
	/* Update shared state with player state */
	t.updateState = function() {
		if (d) console.log(l + 'Updating shared state');
		var ps = p.getState();
		t.updateSharedState(ps.paused, 
				ps.ended, 
				ps.seeking, 
				ps.duration, 
				ps.muted, 
				ps.volume, 
				ps.currentTime,
				p.getPlayerType());
	}
	
	/* RPC calls from server */
	t.play = function() {
		if (d) console.log(l + 'Received play() RPC call');
		p.play();
	}
	t.pause = function() {
		if (d) console.log(l + 'Received pause() RPC call');
		p.pause();
	}
	t.mute = function () {
		if (d) console.log(l + 'Received mute() RPC call');
		p.mute();
	}
	t.unmute = function () {
		if (d) console.log(l + 'Received unmute() RPC call');
		p.unmute();
	}
	t.setVolume = function (volume) {
		if (d) console.log(l + 'Received setVolume() RPC call');
		p.setVolume(volume);
	}
	t.setCurrentTime = function (currentTime) {
		if (d) console.log(l + 'Received setCurrentTime() RPC call');
		p.setCurrentTime(currentTime);
	}
	
	/* RPC calls to server */
	mejsplayer.player.prototype.notifyPlaybackEnded = function () {
		t.updateState();
		t.notifyPlaybackEnded();
	}
	mejsplayer.player.prototype.notifyCanPlay = function () {
		t.updateState();
		t.notifyCanPlay();
	}
	mejsplayer.player.prototype.notifyLoadedData = function () {
		t.updateState();
		t.notifyLoadedData();
	}
	mejsplayer.player.prototype.notifySeeked = function () {
		t.updateState();
		t.notifySeeked();
	}
	mejsplayer.player.prototype.notifyPlaying = function () {
		t.updateState();
		t.notifyPlaying();
	}
	mejsplayer.player.prototype.notifyPaused = function () {
		t.updateState();
		t.notifyPaused();
	}
	mejsplayer.player.prototype.notifyPlayed = function () {
		t.updateState();
		t.notifyPlayed();
	}
	mejsplayer.player.prototype.notifyLoadedMetadata = function () {
		t.updateState();
		t.notifyLoadedMetadata();
	}
	mejsplayer.player.prototype.notifyVolumeChanged = function () {
		t.updateState();
		t.notifyVolumeChanged();
	}
}