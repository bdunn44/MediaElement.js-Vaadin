package com.kbdunn.vaadin.addons.mediaelement.interfaces;

import com.kbdunn.vaadin.addons.mediaelement.MediaElementPlayer;

public interface PlaybackEndedListener {
	// Fires when the current playlist is ended
	void playbackEnded(MediaElementPlayer player); 
}
