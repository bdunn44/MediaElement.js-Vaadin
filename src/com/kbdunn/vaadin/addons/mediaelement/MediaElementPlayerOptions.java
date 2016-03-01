package com.kbdunn.vaadin.addons.mediaelement;

import java.io.Serializable;

/**
 * @author Bryson Dunn
 *
 */
public class MediaElementPlayerOptions implements Serializable {

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
		
		@Override
		public String toString() {
			return value;
		}
	}

	private String[] features;
	private Boolean alwaysShowControls = true;
	private Boolean alwaysShowHours = false;
	private Boolean showTimecodeFrameCount;
	private Boolean useNativeAndroidControls = true;
	private Boolean useNativeIpadControls = true;
	private Integer audioWidth;
	private Integer audioHeight;
	private Integer videoWidth;
	private Integer videoHeight;
	private Boolean enableAutosize = true;
	private Boolean enableKeyboard;
	private Integer framesPerSecond;
	private Boolean loop = false;
	private Boolean pauseOtherPlayers = true;
	private Integer getInitialVolume = 10;

	
	public MediaElementPlayerOptions() { 
		features = toStringArray(new Feature[] { 
					Feature.PLAYPAUSE, 
					Feature.PROGRESS, 
					Feature.CURRENT, 
					Feature.DURATION,
					Feature.VOLUME, 
					Feature.FULLSCREEN 
				});
	}
	
	/*
	 * @deprecated As of release 1.2.8. Use zero-argument constructor {@link #()} instead.
	 */
	@Deprecated
	public static MediaElementPlayerOptions getDefaultOptions() {
		return new MediaElementPlayerOptions();
	}
	
	public static String[] toStringArray(Feature[] features) {
		String[] f = new String[features.length];
		for (int i = 0; i < features.length; i++)
			f[i] = features[i].value;
		return f;
	}

	public static Feature[] toFeatureArray(String[] features) {
		Feature[] f = new Feature[features.length];
		for (int i = 0; i < features.length; i++)
			f[i] = Feature.valueOf(features[i].toUpperCase());
		return f;
	}
	
	public String[] getFeatures() {
		return features;
	}
	
	public void setFeatures(Feature[] features) {
		this.features = toStringArray(features);
	}
	
	public void setFeatures(String[] features) {
		for (String feature : features) {
			if (Feature.valueOf(feature) == null) {
				throw new IllegalArgumentException("Invalid feature '" + feature + "'");
			}
		}
		this.features = features;
	}

	public Boolean getAlwaysShowControls() {
		return alwaysShowControls;
	}

	public void setAlwaysShowControls(Boolean alwaysShowControls) {
		this.alwaysShowControls = alwaysShowControls;
	}

	public Boolean getAlwaysShowHours() {
		return alwaysShowHours;
	}

	public void setAlwaysShowHours(Boolean alwaysShowHours) {
		this.alwaysShowHours = alwaysShowHours;
	}

	public Boolean getShowTimecodeFrameCount() {
		return showTimecodeFrameCount;
	}

	public void setShowTimecodeFrameCount(Boolean showTimecodeFrameCount) {
		this.showTimecodeFrameCount = showTimecodeFrameCount;
	}

	public Boolean getUseNativeAndroidControls() {
		return useNativeAndroidControls;
	}

	public void setUseNativeAndroidControls(Boolean useNativeAndroidControls) {
		this.useNativeAndroidControls = useNativeAndroidControls;
	}

	public Boolean getUseNativeIpadControls() {
		return useNativeIpadControls;
	}

	public void setUseNativeIpadControls(Boolean useNativeIpadControls) {
		this.useNativeIpadControls = useNativeIpadControls;
	}

	public Integer getAudioWidth() {
		return audioWidth;
	}

	public void setAudioWidth(Integer audioWidth) {
		this.audioWidth = audioWidth;
	}

	public Integer getAudioHeight() {
		return audioHeight;
	}

	public void setAudioHeight(Integer audioHeight) {
		this.audioHeight = audioHeight;
	}

	public Integer getVideoWidth() {
		return videoWidth;
	}

	public void setVideoWidth(Integer videoWidth) {
		this.videoWidth = videoWidth;
	}

	public Integer getVideoHeight() {
		return videoHeight;
	}

	public void setVideoHeight(Integer videoHeight) {
		this.videoHeight = videoHeight;
	}

	public Boolean getEnableAutosize() {
		return enableAutosize;
	}

	public void setEnableAutosize(Boolean enableAutosize) {
		this.enableAutosize = enableAutosize;
	}

	public Boolean getEnableKeyboard() {
		return enableKeyboard;
	}

	public void setEnableKeyboard(Boolean enableKeyboard) {
		this.enableKeyboard = enableKeyboard;
	}

	public Integer getFramesPerSecond() {
		return framesPerSecond;
	}

	public void setFramesPerSecond(Integer framesPerSecond) {
		this.framesPerSecond = framesPerSecond;
	}

	public Boolean getLoop() {
		return loop;
	}

	public void setLoop(Boolean loop) {
		this.loop = loop;
	}

	public Boolean getPauseOtherPlayers() {
		return pauseOtherPlayers;
	}

	public void setPauseOtherPlayers(Boolean pauseOtherPlayers) {
		this.pauseOtherPlayers = pauseOtherPlayers;
	}

	public Integer getGetInitialVolume() {
		return getInitialVolume;
	}

	public void setGetInitialVolume(Integer getInitialVolume) {
		this.getInitialVolume = getInitialVolume;
	}
}
