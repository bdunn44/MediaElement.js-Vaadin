package com.kbdunn.vaadin.addons.mediaelement;

import java.io.Serializable;
import java.util.HashMap;

public class MediaElementPlayerOptions extends HashMap<String, Object> implements Serializable {

	private static final long serialVersionUID = 4890420937049396766L;
	
	public enum Feature {
		PLAYPAUSE("playpause"),
		PROGRESS("progress"),
		CURRENT("current"),
		DURATION("duration"),
		TRACKS("tracks"),
		VOLUME("volume"),
		FULLSCREEN("fullscreen");
		
		protected String value;
		Feature(String value) {
			this.value = value;
		}
	}
	
	public MediaElementPlayerOptions() { }
	
	public static MediaElementPlayerOptions getDefaultOptions() {
		MediaElementPlayerOptions opts = new MediaElementPlayerOptions();
		opts.setAlwaysShowControls(true);
		opts.setAlwaysShowHours(false);
		//opts.setAudioHeight(30);
		//opts.setAudioWidth(300);
		//opts.setVideoHeight(-1);
		//opts.setVideoWidth(-1);
		//opts.setEnableAutosize(true);
		//opts.setEnableKeyboard(false);
		opts.setFeatures(new Feature[] { 
				Feature.PLAYPAUSE, 
				Feature.PROGRESS, 
				Feature.CURRENT, 
				Feature.DURATION,
				Feature.VOLUME, 
				Feature.FULLSCREEN });
		opts.setiPadUseNativeControls(true);
		opts.setAndroidUseNativeControls(true);
		opts.setLoop(false);
		opts.setPauseOtherPlayers(true);
		opts.setStartVolume(10);
		return opts;
	}
	
	/*public Integer getDefaultVideoWidth() {
		return defaultVideoWidth;
	}
	
	public void setDefaultVideoWidth(int defaultVideoWidth) {
		this.defaultVideoWidth = defaultVideoWidth;
		
	}
	
	public Integer getDefaultVideoHeight() {
		return defaultVideoHeight;
	}
	
	public void setDefaultVideoHeight(int defaultVideoHeight) {
		this.defaultVideoHeight = defaultVideoHeight;
		
	}*/
	
	public Integer getVideoWidth() {
		if (get("videoWidth") == null) return null;
		return (Integer) get("videoWidth");
	}
	
	public void setVideoWidth(int videoWidth) {
		put("videoWidth", videoWidth);
	}
	
	public Integer getVideoHeight() {
		if (get("videoHeight") == null) return null;
		return (Integer) get("videoHeight");
	}
	
	public void setVideoHeight(int videoHeight) {
		put("videoHeight", videoHeight);
	}
	
	public Integer getAudioWidth() {
		if (get("audioWidth") == null) return null;
		return (Integer) get("audioWidth");
	}
	
	public void setAudioWidth(int audioWidth) {
		put("audioWidth", audioWidth);
	}
	
	public Integer getAudioHeight() {
		if (get("audioHeight") == null) return null;
		return (Integer) get("audioHeight");
	}
	
	public void setAudioHeight(int audioHeight) {
		put("audioHeight", audioHeight);
	}
	
	public Integer getStartVolume() {
		if (get("startVolume") == null) return null;
		return (Integer) get("startVolume");
	}
	
	public void setStartVolume(int startVolume) {
		put("startVolume", startVolume);
	}
	
	public Boolean getLoop() {
		if (get("loop") == null) return null;
		return (Boolean) get("loop");
	}
	
	public void setLoop(boolean loop) {
		put("loop", loop);
	}
	
	public Boolean getEnableAutosize() {
		if (get("enableAutosize") == null) return null;
		return (Boolean) get("enableAutosize");
	}
	
	public void setEnableAutosize(boolean enableAutosize) {
		put("enableAutosize", enableAutosize);
	}
	
	public Feature[] getFeatures() {
		if (get("features") == null) return null;
		
		String[] set = (String[]) get("features)");
		Feature[] features = new Feature[set.length];
		for (int i = 0; i < set.length; i++)
			features[i] = Feature.valueOf(set[i].toUpperCase());
		
		return features;
	}
	
	public void setFeatures(Feature[] features) {
		String[] f = new String[features.length];
		for (int i = 0; i < features.length; i++)
			f[i] = features[i].value;
		
		put("features", f);
	}
	
	public Boolean getAlwaysShowControls() {
		if (get("alwaysShowControls") == null) return null;
		return (Boolean) get("alwaysShowControls");
	}
	
	public void setAlwaysShowControls(boolean alwaysShowControls) {
		put("alwaysShowControls", alwaysShowControls);
	}
	
	public Boolean getiPadUseNativeControls() {
		if (get("iPadUseNativeControls") == null) return null;
		return (Boolean) get("iPadUseNativeControls");
	}
	
	public void setiPadUseNativeControls(boolean iPadUseNativeControls) {
		put("iPadUseNativeControls", iPadUseNativeControls);
	}
	
	public Boolean getAndroidUseNativeControls() {
		if (get("androidUseNativeControls") == null) return null;
		return (Boolean) get("androidUseNativeControls");
	}
	
	public void setAndroidUseNativeControls(boolean androidUseNativeControls) {
		put("androidUseNativeControls", androidUseNativeControls);
	}
	
	public Boolean getAlwaysShowHours() {
		if (get("alwaysShowHours") == null) return null;
		return (Boolean) get("alwaysShowHours");
	}
	
	public void setAlwaysShowHours(boolean alwaysShowHours) {
		put("alwaysShowHours", alwaysShowHours);
	}
	
	public Boolean getShowTimecodeFrameCount() {
		if (get("showTimecodeFrameCount") == null) return null;
		return (Boolean) get("showTimecodeFrameCount");
	}
	
	public void setShowTimecodeFrameCount(boolean showTimecodeFrameCount) {
		put("showTimecodeFrameCount", showTimecodeFrameCount);
	}
	
	public Integer getFramesPerSecond() {
		if (get("framesPerSecond") == null) return null;
		return (Integer) get("framesPerSecond");
	}
	
	public void setFramesPerSecond(int framesPerSecond) {
		put("framesPerSecond", framesPerSecond);
	}
	
	public Boolean getEnableKeyboard() {
		if (get("enableKeyboard") == null) return null;
		return (Boolean) get("enableKeyboard");
	}
	
	public void setEnableKeyboard(boolean enableKeyboard) {
		put("enableKeyboard", enableKeyboard);
	}
	
	public Boolean getPauseOtherPlayers() {
		if (get("pauseOtherPlayers") == null) return null;
		return (Boolean) get("pauseOtherPlayers");
	}
	
	public void setPauseOtherPlayers(boolean pauseOtherPlayers) {
		put("pauseOtherPlayers", pauseOtherPlayers);
	}
}
