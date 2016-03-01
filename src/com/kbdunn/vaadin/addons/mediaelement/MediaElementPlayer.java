package com.kbdunn.vaadin.addons.mediaelement;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;

import com.vaadin.annotations.JavaScript;
import com.vaadin.annotations.StyleSheet;
import com.vaadin.server.ExternalResource;
import com.vaadin.server.FileResource;
import com.vaadin.server.Resource;
import com.vaadin.server.ResourceReference;
import com.vaadin.server.ThemeResource;
import com.vaadin.server.VaadinRequest;
import com.vaadin.server.VaadinResponse;
import com.vaadin.ui.AbstractJavaScriptComponent;
import com.vaadin.ui.JavaScriptFunction;

import elemental.json.JsonArray;
import elemental.json.JsonException;


@JavaScript({"vaadin://addons/mejs-player/mediaelement-2.20.0/jquery.js", "vaadin://addons/mejs-player/mediaelement-2.20.0/mediaelement-and-player.min.js", 
	"vaadin://addons/mejs-player/mejs-player.js", "vaadin://addons/mejs-player/mejs-player-connector.js"})
@StyleSheet("vaadin://addons/mejs-player/mediaelement-2.20.0/mediaelementplayer.min.css")
public class MediaElementPlayer extends AbstractJavaScriptComponent implements Serializable {
	
	private static final long serialVersionUID = 434066435674155085L;
	private static int globalUid = 0;
	
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
	
	/*
	 * 
	 * Constructors
	 * 
	 */
	
	public MediaElementPlayer() {
		init(Type.AUDIO, new MediaElementPlayerOptions(), true, true);
	}
	
	public MediaElementPlayer(MediaElementPlayerOptions options) {
		init(Type.AUDIO, options, true, true);
	}
	
	public MediaElementPlayer(MediaElementPlayer.Type playerType) {
		init(playerType, new MediaElementPlayerOptions(), true, true);
	}
	
	public MediaElementPlayer(MediaElementPlayer.Type playerType, MediaElementPlayerOptions options) {
		init(playerType, options, true, true);
	}
	
	private void init(MediaElementPlayer.Type playerType, MediaElementPlayerOptions options, boolean flashFallback, boolean silverlightFallback) {
		if (playerType == null) throw new NullPointerException("Player Type cannot be null");
		if (options == null) throw new NullPointerException("Player Options cannot be null");
		
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
			public void call(JsonArray arguments) throws JsonException {
				try {
					getState().paused = arguments.getBoolean(0);
					getState().ended = arguments.getBoolean(1);
					getState().seeking = arguments.getBoolean(2);
					getState().duration = (int) arguments.getNumber(3);
					getState().muted = arguments.getBoolean(4);
					getState().volume = (float) arguments.getNumber(5);
					getState().currentTime = (int) arguments.getNumber(6);
					getState().playerType = arguments.getString(7);
				} catch (JsonException e) {
					// Ignore
				}
			}
		});
	}
	
	private static synchronized int getUid() {
		return ++globalUid;
	}
	
	/*
	 * 
	 * Overrides
	 * 
	 */
	
	// Initializes MediaElementPlayer object on client side
	// This is only required if the player hasn't been initialized yet or player options have changed
	// Call function only once per response, if required
	@Override
	public void beforeClientResponse(boolean initial) {
		if (initial || callInitRpc) {
			callFunction("initPlayer", new Object[]{});
			callInitRpc = false;
		}
		super.beforeClientResponse(initial);
	}
	
	// Add Accept-Ranges: bytes to all responses to support seeking in non-IE browsers
	// Catch IOException that is thrown when the player source has changed and the client aborts the previous connection
	@Override
	public boolean handleConnectorRequest(VaadinRequest request, VaadinResponse response, String path) {
		try {
			if (path.startsWith("0")) {
				response.setHeader("Accept-Ranges", "bytes"); 
			}
			return super.handleConnectorRequest(request, response, path);
		} catch (IOException e) {
			return true;
		}
	}
	
	/*
	 * 
	 * Get/Set Source
	 * 
	 */
	
	public Resource getSource() {
		return getResource("0");
	}
	
	public void setSource(Resource source) {
		if (source == null) throw new NullPointerException("Source cannot be null");
		
		// Check if source is a File, Theme or External resource
		if (!(source instanceof FileResource || source instanceof ThemeResource || source instanceof ExternalResource)) {
			throw new UnsupportedOperationException("Only FileResource and ThemeResource resources are supported.");
		}
		// Check that MIME type for File or Theme resource is audio or video
		if (!(source instanceof ExternalResource) 
				&& !(source.getMIMEType().startsWith("audio") || source.getMIMEType().startsWith("video"))) {
			throw new IllegalArgumentException("Invalid resource MIME type '" + source.getMIMEType() + "'. The resource MIME type must be audio or video");
		}
		// Check that the URL of an External resource points to YouTube
		if (source instanceof ExternalResource 
				&& !((ExternalResource) source).getURL().matches("(https?://)?(www\\.)?(youtube\\.com|youtu\\.be).*")) {
			throw new IllegalArgumentException("Only YouTube external resources are allowed");
		}
		
		getState().source = createMediaResource(source, "0");
		callFunction("updateSource", new Object[]{});
	}
	
	private MediaSource createMediaResource(Resource source, String key) {
		setResource(key, source);
		return new MediaSource(
				new ResourceReference(source, this, key).getURL(), source.getMIMEType());
	}
	
	/*
	 * 
	 * Getters/Setters for Player Options
	 * 
	 */
	
	/*
	 * @deprecated As of release 1.2.8. Use zero-argument constructor {@link #()} instead.
	 */
	@Deprecated
	public static MediaElementPlayerOptions getDefaultOptions() {
		return new MediaElementPlayerOptions();
	}
	
	public MediaElementPlayerOptions getOptions() {
		return (MediaElementPlayerOptions) getState().options;
	}
	
	public void setOptions(MediaElementPlayerOptions options) {
		getState().options = options;
		callInitRpc = true;
	}
	
	public void setPlayerType(MediaElementPlayer.Type playerType) {
		getState().playerType = playerType.value;
	}
	
	public void setFlashFallbackEnabled(boolean enabled) {
		getState().flashFallbackEnabled = enabled;
		callInitRpc = true;
	}
	
	public void setSilverlightFallbackEnabled(boolean enabled) {
		getState().silverlightFallbackEnabled = enabled;
		callInitRpc = true;
	}
	
	/*
	 * 
	 * Player controls - RPC calls
	 * 
	 */
	
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
	
	/*
	 * 
	 * Getters for player state attributes
	 * 
	 */
	
	public Type getPlayerType() {
		updateState();
		return Type.valueOf(getState().playerType);
	}
	
	public boolean flashFallbackEnabled() {
		return getState().flashFallbackEnabled;
	}
	
	public boolean silverlightFallbackEnabled() {
		return getState().silverlightFallbackEnabled;
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
	protected MediaElementPlayerState getState() {
		return (MediaElementPlayerState) super.getState();
	}
	
	private void updateState() {
		callFunction("updateState", new Object[]{});
	}
	
	/*
	 * 
	 * RPC Functions
	 * 
	 */
	
	private void addRpcFunctions() {
		addFunction("notifyPlaybackEnded", new JavaScriptFunction() {
			private static final long serialVersionUID = 5490315638431042879L;

			@Override
			public void call(JsonArray arguments) throws JsonException {
				for (PlaybackEndedListener listener : playbackEndedListeners)
					listener.playbackEnded(getMe());
			}
		});
		
		addFunction("notifyCanPlay", new JavaScriptFunction() {
			private static final long serialVersionUID = 5490315638431042879L;

			@Override
			public void call(JsonArray arguments) throws JsonException {
				for (CanPlayListener listener : canPlayListeners)
					listener.canPlay(getMe());
			}
		});
		
		addFunction("notifyLoadedMetadata", new JavaScriptFunction() {
			private static final long serialVersionUID = 5490315638431042879L;

			@Override
			public void call(JsonArray arguments) throws JsonException {
				for (LoadedMetadataListener listener : loadedMetadataListeners)
					listener.metadataLoaded(getMe());
			}
		});
		
		addFunction("notifyLoadedData", new JavaScriptFunction() {
			private static final long serialVersionUID = 5490315638431042879L;

			@Override
			public void call(JsonArray arguments) throws JsonException {
				for (LoadedDataListener listener : loadedDataListeners)
					listener.dataLoaded(getMe());
			}
		});
		
		addFunction("notifyPaused", new JavaScriptFunction() {
			private static final long serialVersionUID = 5490315638431042879L;

			@Override
			public void call(JsonArray arguments) throws JsonException {
				for (PausedListener listener : pauseListeners)
					listener.paused(getMe());
			}
		});
		
		addFunction("notifyPlaying", new JavaScriptFunction() {
			private static final long serialVersionUID = 5490315638431042879L;

			@Override
			public void call(JsonArray arguments) throws JsonException {
				for (PlayingListener listener : playingListeners)
					listener.playing(getMe());
			}
		});
		
		addFunction("notifyPlayed", new JavaScriptFunction() {
			private static final long serialVersionUID = 5490315638431042879L;
			
			@Override
			public void call(JsonArray arguments) throws JsonException {
				for (PlayedListener listener : playListeners)
					listener.played(getMe());
			}
		});
		
		addFunction("notifySeeked", new JavaScriptFunction() {
			private static final long serialVersionUID = 5490315638431042879L;

			@Override
			public void call(JsonArray arguments) throws JsonException {
				for (SeekedListener listener : seekedListeners)
					listener.seeked(getMe());
			}
		});
		
		addFunction("notifyVolumeChanged", new JavaScriptFunction() {
			private static final long serialVersionUID = 5490315638431042879L;

			@Override
			public void call(JsonArray arguments) throws JsonException {
				for (VolumeChangedListener listener : volumeChangeListeners)
					listener.volumeChanged(getMe());
			}
		});
	}
	
	private MediaElementPlayer getMe() {
		return this;
	}
	
	/*
	 * 
	 * Event Listeners
	 * 
	 */
	
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