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

@JavaScript({"vaadin://addons/mejs-player/mediaelement-2.16.4/jquery.js", "vaadin://addons/mejs-player/mediaelement-2.16.4/mediaelement-and-player.min.js", 
	"vaadin://addons/mejs-player/mejs-player.js", "vaadin://addons/mejs-player/mejs-player-connector.js"})
@StyleSheet("vaadin://addons/mejs-player/mediaelement-2.16.4/mediaelementplayer.min.css")
public class MediaComponent extends AbstractJavaScriptComponent implements Serializable {
	
	private static final long serialVersionUID = 434066435674155085L;
	private static int globalUidCounter = 0;
	
	public enum Type {
		AUDIO("audio"), VIDEO("video");
		
		protected String value;
		
		Type(String value) {
			this.value = value;
		}
	}
	
	private ArrayList<PlaybackEndedListener> playbackEndedListeners = new ArrayList<PlaybackEndedListener>();
	private ArrayList<CanPlayListener> canPlayListeners = new ArrayList<CanPlayListener>();
	private ArrayList<LoadedMetadataListener> loadedMetadataListeners = new ArrayList<LoadedMetadataListener>();
	private ArrayList<PausedListener> pauseListeners = new ArrayList<PausedListener>();
	private ArrayList<PlayingListener> playingListeners = new ArrayList<PlayingListener>();
	private ArrayList<PlayedListener> playListeners = new ArrayList<PlayedListener>();
	private ArrayList<SeekedListener> seekedListeners = new ArrayList<SeekedListener>();
	private ArrayList<VolumeChangedListener> volumeChangeListeners = new ArrayList<VolumeChangedListener>();
	private ArrayList<LoadedDataListener> loadedDataListeners = new ArrayList<LoadedDataListener>();
	
	private boolean callInitRpc;
	
	public MediaComponent(MediaComponent.Type playerType) {
		init(playerType, getDefaultOptions(), true, true);
	}
	
	public MediaComponent(MediaComponent.Type playerType, MediaComponentOptions options) {
		init(playerType, options, true, true);
	}
	
	private void init(MediaComponent.Type playerType, MediaComponentOptions options, boolean flashFallback, boolean silverlightFallback) {
		if (playerType == null) throw new IllegalArgumentException("Player Type cannot be null");
		if (options == null) throw new IllegalArgumentException("Player Options cannot be null");
		
		setPlayerType(playerType);
		addRpcFunctions();
		setOptions(options);
		getState().uid = "mejsplayer-" + getUid();
		getState().silverlightFallbackEnabled = silverlightFallback;
		getState().flashFallbackEnabled = flashFallback;
		
		// Connector function to updated shared state from the client side
		addFunction("updateSharedState", new JavaScriptFunction() {
			private static final long serialVersionUID = 5490315638431042879L;
			
			@Override
			public void call(JSONArray arguments) throws JSONException {
				try {
					getState().paused = arguments.getBoolean(0);
					getState().ended = arguments.getBoolean(1);
					getState().seeking = arguments.getBoolean(2);
					getState().duration = arguments.getInt(3);
					getState().muted = arguments.getBoolean(4);
					getState().volume = (float) arguments.getDouble(5);
					getState().currentTime = arguments.getInt(6);
				} catch (JSONException e) {
					// Ignore
				}
			}
		});
	}
	
	// Call the initPlayer function only once per response, if required
	@Override
	public void beforeClientResponse(boolean initial) {
		if (initial || callInitRpc) {
			callFunction("initPlayer", new Object[]{});
			callInitRpc = false;
		}
		super.beforeClientResponse(initial);
	}
	
	public static MediaComponentOptions getDefaultOptions() {
		return MediaComponentOptions.getDefaultOptions();
	}
	
	private static synchronized int getUid() {
		return ++globalUidCounter;
	}
	
	public Resource getSource() {
		return getResource("0");
	}
	
	public void setSource(Resource source) {
		if (!source.getMIMEType().startsWith("audio") && !source.getMIMEType().startsWith("video")) 
			throw new IllegalArgumentException("The resource MIME type must be audio or video");
		
		getState().source = createMediaResource(source, "0");
		//callInitRpc = true;
		callFunction("updateSource", new Object[]{});
	}
	
	private MediaSource createMediaResource(Resource source, String key) {
		setResource(key, source);
		return new MediaSource(
				new ResourceReference(source, this, key).getURL(), source.getMIMEType());
	}
	
	public MediaComponentOptions getOptions() {
		return (MediaComponentOptions) getState().options;
	}
	
	public void setOptions(MediaComponentOptions options) {
		getState().options = options;
		callInitRpc = true;
	}
	
	public String getPlayerType() {
		return getState().playerType;
	}
	
	public void setPlayerType(MediaComponent.Type playerType) {
		getState().playerType = playerType.value;
	}
	
	public boolean flashFallbackEnabled() {
		return getState().flashFallbackEnabled;
	}
	
	public void setFlashFallbackEnabled(boolean enabled) {
		getState().flashFallbackEnabled = enabled;
		callInitRpc = true;
	}
	
	public boolean silverlightFallbackEnabled() {
		return getState().silverlightFallbackEnabled;
	}
	
	public void setSilverlightFallbackEnabled(boolean enabled) {
		getState().silverlightFallbackEnabled = enabled;
		callInitRpc = true;
	}
	
	public void play() {
		callFunction("play", new Object[]{});
	}
	
	public void pause() {
		callFunction("pause", new Object[]{});
	}
	
	public void mute() {
		callFunction("mute", new Object[]{});
	}
	
	public void unmute() {
		callFunction("unmute", new Object[]{});
	}
	
	// must be from 1 to 10
	public void setVolume(int volume) {
		if (volume < 0 || volume > 10) throw new IllegalArgumentException("Volume must be between 1 and 10");
		callFunction("setVolume", new Object[]{ (float) volume / 10 });
	}
	
	public void setCurrentTime(int time) {
		callFunction("setCurrentTime", new Object[]{ time });
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
		return (int) (getState().volume * 10);
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
		addFunction("notifyPlaybackEnded", new JavaScriptFunction() {
			private static final long serialVersionUID = 5490315638431042879L;

			@Override
			public void call(JSONArray arguments) throws JSONException {
				for (PlaybackEndedListener listener : playbackEndedListeners)
					listener.playbackEnded(getMe());
			}
		});
		
		addFunction("notifyCanPlay", new JavaScriptFunction() {
			private static final long serialVersionUID = 5490315638431042879L;

			@Override
			public void call(JSONArray arguments) throws JSONException {
				for (CanPlayListener listener : canPlayListeners)
					listener.canPlay(getMe());
			}
		});
		
		addFunction("notifyLoadedMetadata", new JavaScriptFunction() {
			private static final long serialVersionUID = 5490315638431042879L;

			@Override
			public void call(JSONArray arguments) throws JSONException {
				for (LoadedMetadataListener listener : loadedMetadataListeners)
					listener.metadataLoaded(getMe());
			}
		});
		
		addFunction("notifyLoadedData", new JavaScriptFunction() {
			private static final long serialVersionUID = 5490315638431042879L;

			@Override
			public void call(JSONArray arguments) throws JSONException {
				for (LoadedDataListener listener : loadedDataListeners)
					listener.dataLoaded(getMe());
			}
		});
		
		addFunction("notifyPaused", new JavaScriptFunction() {
			private static final long serialVersionUID = 5490315638431042879L;

			@Override
			public void call(JSONArray arguments) throws JSONException {
				for (PausedListener listener : pauseListeners)
					listener.paused(getMe());
			}
		});
		
		addFunction("notifyPlaying", new JavaScriptFunction() {
			private static final long serialVersionUID = 5490315638431042879L;

			@Override
			public void call(JSONArray arguments) throws JSONException {
				for (PlayingListener listener : playingListeners)
					listener.playing(getMe());
			}
		});
		
		addFunction("notifyPlayed", new JavaScriptFunction() {
			private static final long serialVersionUID = 5490315638431042879L;
			
			@Override
			public void call(JSONArray arguments) throws JSONException {
				for (PlayedListener listener : playListeners)
					listener.played(getMe());
			}
		});
		
		addFunction("notifySeeked", new JavaScriptFunction() {
			private static final long serialVersionUID = 5490315638431042879L;

			@Override
			public void call(JSONArray arguments) throws JSONException {
				for (SeekedListener listener : seekedListeners)
					listener.seeked(getMe());
			}
		});
		
		addFunction("notifyVolumeChanged", new JavaScriptFunction() {
			private static final long serialVersionUID = 5490315638431042879L;

			@Override
			public void call(JSONArray arguments) throws JSONException {
				for (VolumeChangedListener listener : volumeChangeListeners)
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
			callInitRpc = true;
		}
	}
	
	public void addCanPlayListener(CanPlayListener listener) {
		canPlayListeners.add(listener);
		if (!getState().canPlayRpc) { 
			getState().canPlayRpc = true;
			callInitRpc = true;
		}
	}
	
	public void addLoadedMetadataListener(LoadedMetadataListener listener) {
		loadedMetadataListeners.add(listener);
		if (!getState().loadedMetadataRpc) {
			getState().loadedMetadataRpc = true;
			callInitRpc = true;
		}
	}
	
	public void addPauseListener(PausedListener listener) {
		pauseListeners.add(listener);
		if (!getState().pauseRpc) {
			getState().pauseRpc = true;
			callInitRpc = true;
		}
	}
	
	public void addPlayingListener(PlayingListener listener) {
		playingListeners.add(listener);
		if (!getState().playingRpc) {
			getState().playingRpc = true;
			callInitRpc = true;
		}
	}

	public void addPlayListener(PlayedListener listener) {
		playListeners.add(listener);
		if (!getState().playRpc) {
			getState().playRpc = true;
			callInitRpc = true;
		}
	}
	
	public void addSeekedListener(SeekedListener listener) {
		seekedListeners.add(listener);
		if (!getState().seekedRpc) {
			getState().seekedRpc = true;
			callInitRpc = true;
		}
	}
	
	public void addVolumeChangeListener(VolumeChangedListener listener) {
		volumeChangeListeners.add(listener);
		if (!getState().volumeChangeRpc) {
			getState().volumeChangeRpc = true;
			callInitRpc = true;
		}
	}
	
	public void addLoadedDataListener(LoadedDataListener listener) {
		loadedDataListeners.add(listener);
		if (!getState().loadedDataRpc) {
			getState().loadedDataRpc = true;
			callInitRpc = true;
		}
	}
}