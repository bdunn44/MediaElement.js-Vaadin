package com.kbdunn.vaadin.addons.mediaelement;

import java.io.Serializable;
import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONException;

import com.vaadin.annotations.JavaScript;
import com.vaadin.annotations.StyleSheet;
import com.vaadin.server.Resource;
import com.vaadin.server.ResourceReference;
import com.vaadin.ui.AbstractJavaScriptComponent;
import com.vaadin.ui.JavaScriptFunction;
import com.vaadin.ui.UI;

@JavaScript({"vaadin://addons/js/media-element/jquery.js", "vaadin://addons/js/media-element/mediaelement-and-player.min.js", 
	"vaadin://addons/js/mejslibrary.js", "vaadin://addons/js/mediacomponent-connector.js"})
@StyleSheet("vaadin://addons/js/media-element/mediaelementplayer.min.css")
public class MediaComponent extends AbstractJavaScriptComponent implements Serializable {
	
	private static final long serialVersionUID = 434066435674155085L;
	public static final String AUDIO_PLAYER = "audio";
	public static final String VIDEO_PLAYER = "video";
	
	private ArrayList<PlaybackEndedListener> playbackEndedListeners = new ArrayList<PlaybackEndedListener>();
	private ArrayList<CanPlayListener> canPlayListeners = new ArrayList<CanPlayListener>();
	private ArrayList<LoadedMetadataListener> loadedMetadataListeners = new ArrayList<LoadedMetadataListener>();
	private ArrayList<PausedListener> pausedListeners = new ArrayList<PausedListener>();
	private ArrayList<PlayingListener> playingListeners = new ArrayList<PlayingListener>();
	private ArrayList<SeekedListener> seekedListeners = new ArrayList<SeekedListener>();
	private ArrayList<VolumeChangeListener> volumeChangeListeners = new ArrayList<VolumeChangeListener>();
	private ArrayList<LoadedDataListener> loadedDataListeners = new ArrayList<LoadedDataListener>();

	public MediaComponent(String playerType) {
		init(playerType, getDefaultOptions(), true, false);
	}
	
	public MediaComponent(String playerType, MediaComponentOptions options) {
		init(playerType, options, true, false);
	}
	
	private void init(String playerType, MediaComponentOptions options, boolean flashFallback, 
			boolean silverlightFallback) {
		
		if (playerType.equals(AUDIO_PLAYER) || playerType.equals(VIDEO_PLAYER))
			setPlayerType(playerType);
		
		addRpcFunctions();
		setOptions(options);
		getState().silverlightFallbackEnabled = silverlightFallback;
		getState().flashFallbackEnabled = flashFallback;
		callFunction("initPlayer", new Object[]{});
	}
	
	// NPE when setting source to a file resource - UI was not found correctly
	@Override
	public UI getUI() {
		return UI.getCurrent();
	}
	
	public Resource getSource() {
		return getResource("0");
	}
	
	public void setSource(Resource source) {
		if (!source.getMIMEType().startsWith("audio") && !source.getMIMEType().startsWith("video"))
			return;
		
		getState().sources = new ArrayList<MediaSource>();
		getState().sources.add(createMediaResource(source, "0"));
		//alignPlayerType(source);
		callFunction("updateSource", new Object[]{});	
	}
	
	public void addSource(Resource source) {
		if (getState().sources == null) setSource(source);
		String key = String.valueOf(getState().sources.size() - 1);
		getState().sources.add(createMediaResource(source, key));
		callFunction("updateSource", new Object[]{});	
	}
	/*
	private void alignPlayerType(Resource source) {
		if (!source.getMIMEType().startsWith(getState().playerType)) {
			if (getState().playerType.equals(AUDIO_PLAYER)) {
				getState().playerType = VIDEO_PLAYER;
			} else {
				getState().playerType = AUDIO_PLAYER;
			}
		}
	}
	*/
	private MediaSource createMediaResource(Resource source, String key) {
		setResource(key, source);
		return new MediaSource(
				new ResourceReference(source, this, key).getURL(), source.getMIMEType());
	}
	
	public MediaComponentOptions getOptions() {
		return getState().options;
	}
	
	public void setOptions(MediaComponentOptions options) {
		getState().options = options;
	}
	
	public String getPlayerType() {
		return getState().playerType;
	}
	
	public void setPlayerType(String playerType) {
		getState().playerType = playerType;
	}
	
	public boolean flashFallbackEnabled() {
		return getState().flashFallbackEnabled;
	}
	
	public void setFlashFallbackEnabled(boolean enabled) {
		getState().flashFallbackEnabled = enabled;
		callFunction("initPlayer", new Object[]{});
	}
	
	public boolean silverlightFallbackEnabled() {
		return getState().silverlightFallbackEnabled;
	}
	
	public void setSilverlightFallbackEnabled(boolean enabled) {
		getState().silverlightFallbackEnabled = enabled;
		callFunction("initPlayer", new Object[]{});
	}
	
	public void play() {
		callFunction("play", new Object[]{});
	}
	
	public void pause() {
		callFunction("pause", new Object[]{});
	}
	
	public void stop() {
		getState().sources = null;
		callFunction("initPlayer", new Object[]{});
	}
	
	public void mute() {
		callFunction("mute", new Object[]{});
	}
	
	// must be from 1 to 10
	public void setVolume(int volume) {
		if (volume >= 0 && volume <= 10)
			callFunction("setVolume", new Object[]{ volume/10 });
	}
	
	public void setCurrentTime() {
		callFunction("setCurrentTime", new Object[]{});
	}
	
	public boolean isPaused() {
		updateState();
		return getState().paused;
	}
	
	public boolean isEnded() {
		updateState();
		return getState().ended;
	}
	
	public boolean isSeeking() {
		updateState();
		return getState().seeking;
	}
	
	public int getDuration() {
		updateState();
		return getState().duration;
	}
	
	public boolean isMuted() {
		updateState();
		return getState().muted;
	}
	
	public int getVolume() {
		updateState();
		return getState().volume * 10;
	}
	
	public int getCurrentTime() {
		updateState();
		return getState().currentTime;
	}
	
	@Override
	protected MediaComponentState getState() {
		return (MediaComponentState) super.getState();
	}

	private void updateState() {
		callFunction("updateState", new Object[]{});
	}
	
	private void addRpcFunctions() {
		addFunction("playbackEnded", new JavaScriptFunction() {
			private static final long serialVersionUID = 5490315638431042879L;

			@Override
			public void call(JSONArray arguments) throws JSONException {
				for (PlaybackEndedListener listener : playbackEndedListeners)
					listener.playbackEnded(getMe());
			}
		});
		
		addFunction("canPlay", new JavaScriptFunction() {
			private static final long serialVersionUID = 5490315638431042879L;

			@Override
			public void call(JSONArray arguments) throws JSONException {
				for (CanPlayListener listener : canPlayListeners)
					listener.canPlay(getMe());
			}
		});
		
		addFunction("loadedMetadata", new JavaScriptFunction() {
			private static final long serialVersionUID = 5490315638431042879L;

			@Override
			public void call(JSONArray arguments) throws JSONException {
				for (LoadedMetadataListener listener : loadedMetadataListeners)
					listener.loadedMetadata(getMe());
			}
		});
		
		addFunction("paused", new JavaScriptFunction() {
			private static final long serialVersionUID = 5490315638431042879L;

			@Override
			public void call(JSONArray arguments) throws JSONException {
				for (PausedListener listener : pausedListeners)
					listener.paused(getMe());
			}
		});
		
		addFunction("playing", new JavaScriptFunction() {
			private static final long serialVersionUID = 5490315638431042879L;

			@Override
			public void call(JSONArray arguments) throws JSONException {
				for (PlayingListener listener : playingListeners)
					listener.playing(getMe());
			}
		});
		
		addFunction("seeked", new JavaScriptFunction() {
			private static final long serialVersionUID = 5490315638431042879L;

			@Override
			public void call(JSONArray arguments) throws JSONException {
				for (SeekedListener listener : seekedListeners)
					listener.seeked(getMe());
			}
		});
		
		addFunction("volumeChanged", new JavaScriptFunction() {
			private static final long serialVersionUID = 5490315638431042879L;

			@Override
			public void call(JSONArray arguments) throws JSONException {
				for (VolumeChangeListener listener : volumeChangeListeners)
					listener.volumeChanged(getMe());
			}
		});
	}
	
	private MediaComponent getMe() {
		return this;
	}
	
	public void addPlaybackEndedListener(PlaybackEndedListener listener) {
		playbackEndedListeners.add(listener);
		if (!getState().playbackEndedRpc) {
			getState().playbackEndedRpc = true;
			callFunction("initPlayer", new Object[]{});
		}
	}
	
	public void addCanPlayListener(CanPlayListener listener) {
		canPlayListeners.add(listener);
		if (!getState().canPlayRpc) { 
			getState().canPlayRpc = true;
			callFunction("initPlayer", new Object[]{});
		}
	}
	
	public void addLoadedMetadataListener(LoadedMetadataListener listener) {
		loadedMetadataListeners.add(listener);
		if (!getState().loadedMetadataRpc) {
			getState().loadedMetadataRpc = true;
			callFunction("initPlayer", new Object[]{});
		}
	}
	
	public void addPausedListener(PausedListener listener) {
		pausedListeners.add(listener);
		if (!getState().pausedRpc) {
			getState().pausedRpc = true;
			callFunction("initPlayer", new Object[]{});
		}
	}
	
	public void addPlayingListener(PlayingListener listener) {
		playingListeners.add(listener);
		if (!getState().playingRpc) {
			getState().playingRpc = true;
			callFunction("initPlayer", new Object[]{});
		}
	}
	
	public void addSeekedListener(SeekedListener listener) {
		seekedListeners.add(listener);
		if (!getState().seekedRpc) {
			getState().seekedRpc = true;
			callFunction("initPlayer", new Object[]{});
		}
	}
	
	public void addVolumeChangeListener(VolumeChangeListener listener) {
		volumeChangeListeners.add(listener);
		if (!getState().volumeChangeRpc) {
			getState().volumeChangeRpc = true;
			callFunction("initPlayer", new Object[]{});
		}
	}
	
	public void addLoadedDataListener(LoadedDataListener listener) {
		loadedDataListeners.add(listener);
		if (!getState().loadedDataRpc) {
			getState().loadedDataRpc = true;
			callFunction("initPlayer", new Object[]{});
		}
	}
	
	public MediaComponentOptions getDefaultOptions() {
		MediaComponentOptions opts = new MediaComponentOptions();
		opts.setAlwaysShowControls(true);
		opts.setAlwaysShowHours(false);
		opts.setAndroidUseNativeControls(false);
		//opts.setAudioHeight(30);
		//opts.setAudioWidth(300);
		//opts.setVideoHeight(-1);
		//opts.setVideoWidth(-1);
		opts.setEnableAutosize(true);
		opts.setEnableKeyboard(false);
		opts.setFeatures(new String[] { 
				MediaComponentOptions.PLAY_PAUSE_FEATURE, 
				MediaComponentOptions.PROGRESS_FEATURE, 
				MediaComponentOptions.CURRENT_FEATURE, 
				MediaComponentOptions.DURATION_FEATURE,
				MediaComponentOptions.VOLUME_FEATURE, 
				MediaComponentOptions.FULLSCREEN_FEATURE });
		opts.setiPadUseNativeControls(false);
		opts.setLoop(false);
		opts.setPauseOtherPlayers(true);
		opts.setStartVolume(8);
		return opts;
	}
}