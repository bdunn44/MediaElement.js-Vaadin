package com.kbdunn.vaadin.addons.mediaelement;

import com.vaadin.shared.ui.JavaScriptComponentState;

public class MediaElementPlayerState extends JavaScriptComponentState {
	public static final long serialVersionUID = 1443920175588070872L;
	
	// Audio/Video sources
	public MediaSource source; 
	
	// MediaElementJS options
	//public Map<String, Object> options;
	public MediaElementPlayerOptions options;
	
	// HTML5 player type (audio/video)
	public String playerType;
	
	// ID of element
	public String uid;
	
	// Configure Flash and Silverlight fallback
	public boolean flashFallbackEnabled;
	public boolean silverlightFallbackEnabled;
	
	// Enable or disable RPC calls from client
	public boolean playbackEndedRpc = false;
	public boolean canPlayRpc = false;
	public boolean loadedMetadataRpc = false;
	public boolean pauseRpc = false;
	public boolean playingRpc = false;
	public boolean playRpc = false;
	public boolean seekedRpc = false;;
	public boolean volumeChangeRpc = false;
	public boolean loadedDataRpc = false;
}