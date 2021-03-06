com_kbdunn_vaadin_addons_mediaelement_MediaElementPlayer = function () {
    
    var t = this;
    var e = t.getElement();
    var s = t.getState();
    var o = s.options;
    var d = false; /* debugger */
    var p;
    
    if (d) {
        console.log('Creating an mejs-player component');
        dumpState();
        o.enablePluginDebug = true;
    }
    
    function dumpState() {
        console.log('Dumping shared state information....');
        console.log('Player Type: ' + s.playerType);
        console.log('Flash Fallback: ' + s.flashFallbackEnabled);
        console.log('Silverlight Fallback: ' + s.silverlightFallbackEnabled);
        
        console.log('MEJS Options: ');
        for (var opt in o) {
            console.log('  ' + opt + ': ' + o[opt]);
        }
        
        console.log('Source:');
        if (s.source) {
            console.log('  ' + s.source.src + ' (' + s.source.type + ')');
        }
        
        console.log('Player state properties:');
        console.log('  paused: ' + s.paused);
        console.log('  ended: ' + s.ended);
        console.log('  seeking: ' + s.seeking);
        console.log('  duration: ' + s.duration);
        console.log('  muted: ' + s.muted);
        console.log('  volume: ' + s.volume);
        console.log('  currentTime: ' + s.currentTime);
        
        console.log('Enabled RPC Calls:');
        console.log('  Playback Ended: ' + s.playbackEndedRpc);
        console.log('  Can Play: ' + s.canPlayRpc);
        console.log('  Loaded Metadata: ' + s.loadedMetadataRpc);
        console.log('  Pause: ' + s.pauseRpc);
        console.log('  Playing: ' + s.playingRpc);
        console.log('  Play: ' + s.playRpc);
        console.log('  Seeked: ' + s.seekedRpc);
        console.log('  Volume Change: ' + s.volumeChangeRpc);
        console.log('  Loaded Data: ' + s.loadedDataRpc);
    }
    
    function rpcOptions() {
        return {
            playbackEndedRpc: s.playbackEndedRpc,
            canPlayRpc: s.canPlayRpc,
            loadedMetadataRpc: s.loadedMetadataRpc,
            pauseRpc: s.pauseRpc,
            playingRpc: s.playingRpc,
            playRpc: s.playRpc,
            seekedRpc: s.seekedRpc,
            volumeChangeRpc: s.volumeChangeRpc,
            loadedDataRpc: s.loadedDataRpc
        };
    };
    
    function playerOptions() {
        return {
            uid: s.uid,
            playerType: s.playerType,
            flash: s.flashFallbackEnabled,
            silverlight: s.silverlightFallbackEnabled
        };
    }
    
    /* RPC call from server to initialize the player */
    t.initPlayer = function() {
        if (d) console.log('INITIALIZING PLAYER');
        if (d) console.log('Player options ' + JSON.stringify(playerOptions()));
        if (d) console.log('RPC options ' + JSON.stringify(rpcOptions()));
        p = new mejsplayer.player(e, o, playerOptions(), rpcOptions());
        if (s.source) t.updateSource();
    };
    
    /* Update the sources of the media player from information in the shared state */
    t.updateSource = function() {
        if (d) console.log('updateSource(). Source is ' + s.source.src + ' [' + s.source.type + ']');
        if (!s.source) { 
            if (d) console.log('updateSource() was called, but no source is set in the shared state.'); 
            return; 
        }
        if (!p) { 
            if (d) console.log('updateSource() was called, but the player has not been initialized.'); 
            return; 
        }
        /* Copy shared state source */
        var src = {
                src: s.source.src,
                type: s.source.type
        };
        
        if (src.src.indexOf('app://') === 0 || src.src.indexOf('theme://') === 0) { 
        	src.src = t.translateVaadinUri(src.src);
        } else if (src.src.indexOf('youtube.com') !== -1 || src.src.indexOf('youtu.be') !== -1) {
            src.type = 'video/youtube';
        } else if (src.src.indexOf('vimeo.com') !== -1) {
        	src.type = 'video/vimeo';
        }
        p.setSource(src);
    };
    
    /* Update shared state with player state */
    t.updateState = function() {
        debounce(function() {
            if (d) console.log('Sending player state update');
            t.updatePlayerState(t.stateObject());
        }, 100).apply();
    };
    
    t.stateObject = function() {
        var ps = p.getState();
        return {
	        paused: ps.paused,
	        ended: ps.ended,
	        seeking: ps.seeking,
	        duration: ps.duration,
	        muted: ps.muted,
	        volume: ps.volume,
	        currentTime: ps.currentTime
        };
    };
    
    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };
    
    /* RPC calls from server */
    t.play = function() {
        if (d) console.log('Received play() RPC call');
        p.play();
    };
    t.pause = function() {
        if (d) console.log('Received pause() RPC call');
        p.pause();
    };
    t.mute = function () {
        if (d) console.log('Received mute() RPC call');
        p.mute();
    };
    t.unmute = function () {
        if (d) console.log('Received unmute() RPC call');
        p.unmute();
    };
    t.setVolume = function (volume) {
        if (d) console.log('Received setVolume() RPC call');
        p.setVolume(volume);
    };
    t.setCurrentTime = function (currentTime) {
        if (d) console.log('Received setCurrentTime() RPC call');
        p.setCurrentTime(currentTime);
    };
    
    /* RPC calls to server */
    mejsplayer.player.prototype.notifyPlaybackEnded = function () {
        t.notifyPlaybackEnded(t.stateObject());
    };
    mejsplayer.player.prototype.notifyCanPlay = function () {
        t.notifyCanPlay(t.stateObject());
    };
    mejsplayer.player.prototype.notifyLoadedData = function () {
        t.notifyLoadedData(t.stateObject());
    };
    mejsplayer.player.prototype.notifySeeked = function () {
        t.notifySeeked(t.stateObject());
    };
    mejsplayer.player.prototype.notifyPlaying = function () {
        t.notifyPlaying(t.stateObject());
    };
    mejsplayer.player.prototype.notifyPaused = function () {
        t.notifyPaused(t.stateObject());
    };
    mejsplayer.player.prototype.notifyPlayed = function () {
        t.notifyPlayed(t.stateObject());
    };
    mejsplayer.player.prototype.notifyLoadedMetadata = function () {
        t.notifyLoadedMetadata(t.stateObject());
    };
    mejsplayer.player.prototype.notifyVolumeChanged = function () {
        t.notifyVolumeChanged(t.stateObject());
    };
};