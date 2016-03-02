package com.kbdunn.vaadin.addons.mediaelement.interfaces;

import com.kbdunn.vaadin.addons.mediaelement.MediaElementPlayer;

public interface LoadedMetadataListener {
	// Fires when the browser has loaded metadata for the audio/video
	void metadataLoaded(MediaElementPlayer player);
}
