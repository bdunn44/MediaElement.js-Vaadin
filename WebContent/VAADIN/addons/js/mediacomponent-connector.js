com_kbdunn_vaadin_addons_mediaelement_MediaComponent = function () {
	
	// Debugger 
	var debugMode = false;
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
		console.log("  Paused: " + this.getState().pausedRpc);
		console.log("  Playing: " + this.getState().playingRpc);
		console.log("  Seeked: " + this.getState().seekedRpc);
		console.log("  Volume Change: " + this.getState().volumeChangeRpc);
		console.log("  Loaded Data: " + this.getState().loadedDataRpc);

	};
	
	//if (debugMode === true) { this.dumpState(); };
	
	var connector = this;
	// Build additional options objects
	this.rpcOptions = function () {
		this.playbackEndedRpc = connector.getState().playbackEndedRpc;
		this.canPlayRpc = connector.getState().canPlayRpc;
		this.loadedMetadataRpc = connector.getState().loadedMetadataRpc;
		this.pausedRpc = connector.getState().pausedRpc;
		this.playingRpc = connector.getState().playingRpc;
		this.seekedRpc = connector.getState().seekedRpc;
		this.volumeChangeRpc = connector.getState().volumeChangeRpc;
		this.loadedDataRpc = connector.getState().loadedDataRpc;
	};
	
	this.mcOptions = function () {
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
		//this.updateSource();
	};
	
	// Updates the sources of the media player from information in the shared state
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
		
		this.initPlayer();
		this.mediaComponent.setSource(sources);
	};
	
	// Update shared state with player state
	this.updateState = function () {
		var playerState = new this.mediaComponent.playerState();
		this.getState().paused = playerState.paused;
		this.getState().ended = playerState.ended;
		this.getState().seeking = playerState.seeking;
		this.getState().duration = playerState.duration;
		this.getState().muted = playerState.muted;
		this.getState().volume = playerState.volume;
		this.getState().currentTime = playerState.currentTime;
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
	this.setVolume = function (volume) {
		this.mediaComponent.setVolume(volume);
	};
	this.setCurrentTime = function (currentTime) {
		this.mediaComponent.setCurrentTime(currentTime);
	};
	
	// RPC calls to server
	mejslibrary.MediaComponent.prototype.notifyEnded = function () {
		connector.updateState();
		if (connector.debugMode === true) { dumpState(); };
		connector.playbackEnded();
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
	mejslibrary.MediaComponent.prototype.notifyPause = function () {
		connector.updateState();
		if (connector.debugMode === true) { dumpState(); };
		connector.notifyPause();
	};
	mejslibrary.MediaComponent.prototype.notifyLoadedMetadata = function () {
		connector.updateState();
		if (connector.debugMode === true) { dumpState(); };
		connector.notifyLoadedMetadata();
	};
	mejslibrary.MediaComponent.prototype.notifyVolumeChange = function () {
		connector.updateState();
		if (connector.debugMode === true) { dumpState(); };
		connector.notifyVolumeChange();
	};
};