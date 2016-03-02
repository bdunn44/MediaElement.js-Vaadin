package com.kbdunn.vaadin.addons.mediaelement.interfaces;

import com.kbdunn.vaadin.addons.mediaelement.MediaElementPlayer;

public interface CanPlayListener {
	// Fires when the browser can start playing the audio/video
	void canPlay(MediaElementPlayer player); 
}
