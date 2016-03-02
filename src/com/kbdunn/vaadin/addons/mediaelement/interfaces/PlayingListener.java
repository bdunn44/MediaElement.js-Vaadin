package com.kbdunn.vaadin.addons.mediaelement.interfaces;

import com.kbdunn.vaadin.addons.mediaelement.MediaElementPlayer;

public interface PlayingListener {
	//Fires when the audio/video is ready to play after having been paused or stopped for buffering
	void playing(MediaElementPlayer player);
}
