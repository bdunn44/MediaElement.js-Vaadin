package com.kbdunn.vaadin.addons.mediaelement.interfaces;

import com.kbdunn.vaadin.addons.mediaelement.MediaElementPlayer;

public interface LoadedDataListener {
	// Fires when the browser has loaded the current frame of the audio/video
	void dataLoaded(MediaElementPlayer player);
}
