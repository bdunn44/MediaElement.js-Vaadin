package com.kbdunn.vaadin.addons.mediaelement.interfaces;

import com.kbdunn.vaadin.addons.mediaelement.MediaElementPlayer;

public interface SeekedListener {
	// Fires when the user is finished moving/skipping to a new position in the audio/video
	void seeked(MediaElementPlayer player); 
}
