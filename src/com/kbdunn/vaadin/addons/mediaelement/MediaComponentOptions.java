package com.kbdunn.vaadin.addons.mediaelement;

import java.io.Serializable;

public class MediaComponentOptions implements Serializable {
	
	private static final long serialVersionUID = 1L;

	// MediaElementJS options
	//private int defaultVideoWidth;
	//private int defaultVideoHeight;
	private int videoWidth;
	private int videoHeight;
	private int audioWidth;
	private int audioHeight;
	private int startVolume;
	private boolean loop;
	private boolean enableAutosize;
	private String[] features;
	private boolean alwaysShowControls;
	private boolean iPadUseNativeControls;
	private boolean AndroidUseNativeControls; // Intentionally upper-case
	private boolean alwaysShowHours;
	private boolean showTimecodeFrameCount;
	private int framesPerSecond;
	private boolean enableKeyboard;
	private boolean pauseOtherPlayers;
	private String[] keyActions;
	
	// List of valid values for the "features" array
	public static final String PLAY_PAUSE_FEATURE = "playpause";
	public static final String PROGRESS_FEATURE = "progress";
	public static final String CURRENT_FEATURE = "current";
	public static final String DURATION_FEATURE = "duration";
	public static final String TRACKS_FEATURE = "tracks";
	public static final String VOLUME_FEATURE = "volume";
	public static final String FULLSCREEN_FEATURE = "fullscreen";
	
	public MediaComponentOptions() { }
	
	/*public int getDefaultVideoWidth() {
		return defaultVideoWidth;
	}
	
	public void setDefaultVideoWidth(int defaultVideoWidth) {
		this.defaultVideoWidth = defaultVideoWidth;
		
	}
	
	public int getDefaultVideoHeight() {
		return defaultVideoHeight;
	}
	
	public void setDefaultVideoHeight(int defaultVideoHeight) {
		this.defaultVideoHeight = defaultVideoHeight;
		
	}*/
	
	protected int getVideoWidth() {
		return videoWidth;
	}
	
	protected void setVideoWidth(int videoWidth) {
		this.videoWidth = videoWidth;
		
	}
	
	protected int getVideoHeight() {
		return videoHeight;
	}
	
	protected void setVideoHeight(int videoHeight) {
		this.videoHeight = videoHeight;
		
	}
	
	protected int getAudioWidth() {
		return audioWidth;
	}
	
	protected void setAudioWidth(int audioWidth) {
		this.audioWidth = audioWidth;
		
	}
	
	protected int getAudioHeight() {
		return audioHeight;
	}
	
	protected void setAudioHeight(int audioHeight) {
		this.audioHeight = audioHeight;
		
	}
	
	public int getStartVolume() {
		return startVolume;
	}
	
	public void setStartVolume(int startVolume) {
		this.startVolume = startVolume;
		
	}
	
	public boolean getLoop() {
		return loop;
	}
	
	public void setLoop(boolean loop) {
		this.loop = loop;
		
	}
	
	public boolean getEnableAutosize() {
		return enableAutosize;
	}
	
	public void setEnableAutosize(boolean enableAutosize) {
		this.enableAutosize = enableAutosize;
		
	}
	
	public String[] getFeatures() {
		return features;
	}
	
	public void setFeatures(String[] features) {
		this.features = features;
		
	}
	
	public boolean getAlwaysShowControls() {
		return alwaysShowControls;
	}
	
	public void setAlwaysShowControls(boolean alwaysShowControls) {
		this.alwaysShowControls = alwaysShowControls;
		
	}
	
	public boolean getiPadUseNativeControls() {
		return iPadUseNativeControls;
	}
	
	public void setiPadUseNativeControls(boolean iPadUseNativeControls) {
		this.iPadUseNativeControls = iPadUseNativeControls;
		
	}
	
	public boolean getAndroidUseNativeControls() {
		return AndroidUseNativeControls;
	}
	
	public void setAndroidUseNativeControls(boolean androidUseNativeControls) {
		AndroidUseNativeControls = androidUseNativeControls;
		
	}
	
	public boolean getAlwaysShowHours() {
		return alwaysShowHours;
	}
	
	public void setAlwaysShowHours(boolean alwaysShowHours) {
		this.alwaysShowHours = alwaysShowHours;
		
	}
	
	public boolean getShowTimecodeFrameCount() {
		return showTimecodeFrameCount;
	}
	
	public void setShowTimecodeFrameCount(boolean showTimecodeFrameCount) {
		this.showTimecodeFrameCount = showTimecodeFrameCount;
		
	}
	
	public int getFramesPerSecond() {
		return framesPerSecond;
	}
	
	public void setFramesPerSecond(int framesPerSecond) {
		this.framesPerSecond = framesPerSecond;
		
	}
	
	public boolean getEnableKeyboard() {
		return enableKeyboard;
	}
	
	public void setEnableKeyboard(boolean enableKeyboard) {
		this.enableKeyboard = enableKeyboard;
		
	}
	
	public boolean getPauseOtherPlayers() {
		return pauseOtherPlayers;
	}
	
	public void setPauseOtherPlayers(boolean pauseOtherPlayers) {
		this.pauseOtherPlayers = pauseOtherPlayers;
		
	}
	
	public String[] getKeyActions() {
		return keyActions;
	}
	
	public void setKeyActions(String[] keyActions) {
		this.keyActions = keyActions;
		
	}
}
