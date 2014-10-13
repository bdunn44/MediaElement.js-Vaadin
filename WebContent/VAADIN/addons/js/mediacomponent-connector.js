// Version 1.2.0

com_kbdunn_vaadin_addons_mediaelement_MediaComponent = function () {
	
	// Debugger 
	var debugMode = true;
	this.dumpState = function () {
		console.log("Dumping shared state information....");
		console.log("Player Type: " + this.getState().playerType);
		console.log("Flash Fallback: " + this.getState().flashFallbackEnabled);
		console.log("Silverlight Fallback: " + this.getState().silverlightFallbackEnabled);
		
		console.log("MEJS Options: ");
		var opts = this.getState().options;
		for (var opt in opts) {
			console.log("  " + opt + ": " + opts[opt]);
		};
		
		this.getState().options.enablePluginDebug = true;
		
		console.log("Sources:");
		if (this.getState().sources) {
			for (var i = 0; i < this.getState().sources.length; i++) {
				console.log("  " + this.getState().sources[i].src + " (" + this.getState().sources[i].type + ")'");
			}
		}
		
		console.log("Player state properties:");
		console.log("  paused: " + this.getState().paused);
		console.log("  ended: " + this.getState().ended);
		console.log("  seeking: " + this.getState().seeking);
		console.log("  duration: " + this.getState().duration);
		console.log("  muted: " + this.getState().muted);
		console.log("  volume: " + this.getState().volume);
		console.log("  currentTime: " + this.getState().currentTime);
		
		console.log("Enabled RPC Calls:");
		console.log("  Playback Ended: " + this.getState().playbackEndedRpc);
		console.log("  Can Play: " + this.getState().canPlayRpc);
		console.log("  Loaded Metadata: " + this.getState().loadedMetadataRpc);
		console.log("  Pause: " + this.getState().pauseRpc);
		console.log("  Playing: " + this.getState().playingRpc);
		console.log("  Play: " + this.getState().playRpc);
		console.log("  Seeked: " + this.getState().seekedRpc);
		console.log("  Volume Change: " + this.getState().volumeChangeRpc);
		console.log("  Loaded Data: " + this.getState().loadedDataRpc);
	};
	
	var connector = this;
	// Build additional options objects
	this.rpcOptions = function () {
		this.playbackEndedRpc = connector.getState().playbackEndedRpc;
		this.canPlayRpc = connector.getState().canPlayRpc;
		this.loadedMetadataRpc = connector.getState().loadedMetadataRpc;
		this.pauseRpc = connector.getState().pauseRpc;
		this.playingRpc = connector.getState().playingRpc;
		this.playRpc = connector.getState().playRpc;
		this.seekedRpc = connector.getState().seekedRpc;
		this.volumeChangeRpc = connector.getState().volumeChangeRpc;
		this.loadedDataRpc = connector.getState().loadedDataRpc;
	};
	
	this.mcOptions = function () {
		this.mejsUid = connector.getState().mejsUid;
		this.playerType = connector.getState().playerType;
		this.flash = connector.getState().flashFallbackEnabled;
		this.silverlight = connector.getState().silverlightFallbackEnabled;		
	};
	
	this.mediaComponent = new mejslibrary.MediaComponent(this.getElement(), this.getState().options, new this.mcOptions, new this.rpcOptions);
	
	// RPC call from server to initialize the player
	this.initPlayer = function () {
		console.log("INITIALIZING PLAYER");
		if (debugMode === true) { this.dumpState(); };
		if (this.mediaComponent) { delete this.mediaComponent; console.log("mediaComponent deleted"); };
		this.mediaComponent = new mejslibrary.MediaComponent(this.getElement(), this.getState().options, new this.mcOptions, new this.rpcOptions);
		//this.updateListeners();
		this.updateSource();
	};
	
	// Build the list of enabled RPC listeners from shared state, pass along to component
	/*this.updateListeners = function() {
		connector.mediaComponent.refreshListeners(new this.rpcOptions);
	};*/
	
	// Update the sources of the media player from information in the shared state
	this.updateSource = function() {
		var sources = this.getState().sources;
		if (!sources) { return; };
		for (var i = 0; i < sources.length; i++) {
			if (sources[i].src.indexOf("app://") === 0) {
				sources[i].src = document.location.origin + document.location.pathname +
				sources[i].src.replace("app://", "");
			}
			console.log("Adding source '" + sources[i].src + " (" + sources[i].type + ")'");
		}
		
		this.mediaComponent.setSource(sources);
	};
	
	// Update shared state with player state
	this.updateState = function () {
		var playerState = this.mediaComponent.getState();
		//var sharedState = this.getState();
		connector.updateSharedState(playerState.paused, 
				playerState.ended, 
				playerState.seeking, 
				playerState.duration, 
				playerState.muted, 
				playerState.volume, 
				playerState.currentTime);
		/*sharedState.paused = playerState.paused;
		sharedState.ended = playerState.ended;
		sharedState.seeking = playerState.seeking;
		sharedState.duration = playerState.duration;
		sharedState.muted = playerState.muted;
		sharedState.volume = playerState.volume;
		sharedState.currentTime = playerState.currentTime;*/
	};
	
	// RPC calls from server
	this.play = function () {
		this.mediaComponent.play();
	};
	this.pause = function () {
		this.mediaComponent.pause();
	};
	this.mute = function () {
		this.mediaComponent.mute();
	};
	this.unmute = function () {
		this.mediaComponent.unmute();
	};
	this.setVolume = function (volume) {
		this.mediaComponent.setVolume(volume);
	};
	this.setCurrentTime = function (currentTime) {
		this.mediaComponent.setCurrentTime(currentTime);
	};
	
	// RPC calls to server
	mejslibrary.MediaComponent.prototype.notifyPlaybackEnded = function () {
		connector.updateState();
		if (connector.debugMode === true) { dumpState(); };
		connector.notifyPlaybackEnded();
	};
	mejslibrary.MediaComponent.prototype.notifyCanPlay = function () {
		connector.updateState();
		if (connector.debugMode === true) { dumpState(); };
		connector.notifyCanPlay();
	};
	mejslibrary.MediaComponent.prototype.notifyLoadedData = function () {
		connector.updateState();
		if (connector.debugMode === true) { dumpState(); };
		connector.notifyLoadedData();
	};
	mejslibrary.MediaComponent.prototype.notifySeeked = function () {
		connector.updateState();
		if (connector.debugMode === true) { dumpState(); };
		connector.notifySeeked();
	};
	mejslibrary.MediaComponent.prototype.notifyPlaying = function () {
		connector.updateState();
		if (connector.debugMode === true) { dumpState(); };
		connector.notifyPlaying();
	};
	mejslibrary.MediaComponent.prototype.notifyPaused = function () {
		connector.updateState();
		if (connector.debugMode === true) { dumpState(); };
		connector.notifyPaused();
	};
	mejslibrary.MediaComponent.prototype.notifyPlayed = function () {
		connector.updateState();
		if (connector.debugMode === true) { dumpState(); };
		connector.notifyPlayed();
	};
	mejslibrary.MediaComponent.prototype.notifyLoadedMetadata = function () {
		connector.updateState();
		if (connector.debugMode === true) { dumpState(); };
		connector.notifyLoadedMetadata();
	};
	mejslibrary.MediaComponent.prototype.notifyVolumeChanged = function () {
		connector.updateState();
		if (connector.debugMode === true) { dumpState(); };
		connector.notifyVolumeChanged();
	};
};