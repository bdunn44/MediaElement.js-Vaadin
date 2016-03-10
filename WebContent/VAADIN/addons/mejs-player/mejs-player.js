var mejsplayer = mejsplayer || {};

/* Add plugin MIME types */
mejs.plugins.silverlight[0].types.push("wmv", "video/x-ms-wmv");
mejs.plugins.silverlight[0].types.push("avi", "video/x-msvideo");
mejs.plugins.silverlight[0].types.push("wma", "audio/x-ms-wma");
mejs.plugins.silverlight[0].types.push("wav", "audio/x-wav");
mejs.plugins.silverlight[0].types.push("mp3", "audio/mpeg");
mejs.plugins.silverlight[0].types.push("aac", "audio/x-aac");
mejs.plugins.flash[0].types.push("mp4", "video/mp4");
mejs.plugins.flash[0].types.push("flv", "video/x-flv");
mejs.plugins.flash[0].types.push("mp3", "audio/mpeg");
mejs.plugins.flash[0].types.push("aac", "audio/x-aac");

mejsplayer.player = function (element, mejsOptions, mcOptions, rpcOptions) {
    
    var t = this;
    var p = 'VAADIN/addons/mejs-player/mediaelement-2.20.0/';
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
        element.innerHTML = 
        			'<video id="' + mcOptions.uid + '" style="width:100%;height:100%;" controls="controls" preload="none">'
                    	+ '<source type="video/mp4" src="nothing" />'
                    + '</video>';
    }
    
    function addFallback() { 
        var flashFallback = //width="100%" height="100%" 
            '<object type="application/x-shockwave-flash" data="' + p + 'flashmediaelement.swf">' +
                '<param name="movie" value="' + p + 'flashmediaelement.swf" />' +
                '<param name="flashvars" value="controls=true&amp;file=nothing" />' +
            '</object>';
        var silverlightFallback = 
            '<object type="application/x-silverlight-2" data="' + p + 'silverlightmediaelement.xap">' +
                '<param name="movie" value="' + p + 'silverlightmediaelement.xap" />' +
                '<param name="flashvars" value="controls=true&amp;file=nothing" />' +
            '</object>';
        
        /* Enable Flash and/or Silverlight fallback */
        if (mcOptions.flash == true && mcOptions.silverlight == true) {
            if (d) console.log('Adding Flash and Silverlight fallback');
            $('#' + mcOptions.uid).append(flashFallback);
            $('#' + mcOptions.uid).append(silverlightFallback);
            mejsOptions.plugins = ['flash', 'silverlight'];
            mejsOptions.pluginPath = p;
            mejsOptions.flashName = 'flashmediaelement.swf';
            mejsOptions.silverlightName = 'silverlightmediaelement.xap';
            
        } else if (mcOptions.flash == true) {
            if (d) console.log('Adding Flash fallback');
            $('#' + mcOptions.uid).append(flashFallback);
            mejsOptions.plugins = ['flash'];
            mejsOptions.pluginPath = p;
            mejsOptions.flashName = 'flashmediaelement.swf';
            
        } else if (mcOptions.silverlight == true) {
            if (d) console.log('Adding Silverlight fallback');
            $('#' + mcOptions.uid).append(silverlightFallback);
            mejsOptions.plugins = ['silverlight'];
            mejsOptions.pluginPath = p;
            mejsOptions.silverlightName = 'silverlightmediaelement.xap';
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
        
        if (d) console.log("MediaElement.js player created");
    };
    
    mejsOptions.error = function () {
    	if (d) console.log("Error creating MediaElement.js player!")
    	var e = $('#' + mcOptions.uid).siblings('.me-cannotplay');
    	e.css('text-align', 'center');
    	e.children('a').css('font-weight', 'normal').css('display', 'block').css('height', '100%');
    	e.find('span').css('line-height', '200%').css('padding', '0').text('Unsupported Format - Download File');
    }
    
    /* Create MEJS player */
    initializeDOM(true);
    var mejsplayer = new MediaElementPlayer($('#' + mcOptions.uid), mejsOptions);
    
    /* Set player source */
    t.setSource = function(source) {
        mejsplayer.pause();
        
        var el = $('#' + mcOptions.uid);
        var s = source.src;
        var t = source.type;
        var tc = $('#' + mcOptions.uid).attr('type') !== t;
        var pt = (t.indexOf("video") != -1 || yt || vm) ? 'video' : 'audio';
        var yt = t === 'video/youtube';// || $('#' + mcOptions.uid).attr('type') === 'video/youtube';
        var vm = t === 'video/vimeo';// || $('#' + mcOptions.uid).attr('type') === 'video/vimeo';
        
        /* Re-create the MEJS Player if the type has changed or if YouTube/Vimeo */
        if (tc || yt || vm) {
            if (d) console.log('Replacing MediaElementPlayer');
            mcOptions.playerType = pt;
            el.first().get(0).player.remove();
            initializeDOM(!yt && !vm); // Don't add fallback if YouTube/Vimeo
            el = $('#' + mcOptions.uid);
            el.attr('src', s).attr('type', t);
            el.children('source').attr('src', s).attr('type', t);
            $('#' + mcOptions.uid + ' object param[name="flashvars"]').attr('value', 'controls=true&amp;file=' + s);
            if (yt || vm) {
                mejsOptions.plugins.reverse();
                mejsOptions.plugins.push(yt ? 'youtube' : 'vimeo');
                mejsOptions.plugins.reverse();
                if (d) console.log('Enabled plugins: ' + mejsOptions.plugins);
            } else {
            	for(var i = mejsOptions.plugins.length - 1; i >= 0; i--) {
            	    if(mejsOptions.plugins[i] === 'youtube' || mejsOptions.plugins[i] === 'vimeo') {
            	       array.splice(i, 1);
            	    }
            	}
            }
            mejsplayer = new MediaElementPlayer(el, mejsOptions);
        } 
        /* Set the source if not YouTube/Vimeo */
        if (!yt && !vm) {
            if (d) console.log('Setting mejs-player #' + mcOptions.uid + ' source to ' + s + ' [' + t + ']');
            try {
            	mejsplayer.setSrc(s);
            } catch (err) {
            	// This should only happen if using a plugin (flash/silverlight)
            	if (d) console.log('Error setting source. The Flash or Silverlight plugin is in use.');
            	el.parent().parent().parent().trigger('click');
            }
        }
        mejsplayer.load();
        
        /* Vimeo fix */
        if (vm) {
        	el.parent().siblings('.mejs-controls').css('display', 'none');
        	el.siblings('.me-plugin').css('height', '100%').css('width', '100%')
        		.children('.mejs-shim').css('height', '100%').css('width', '100%');
        }
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
        if (d) console.log('Client notification: pause');
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