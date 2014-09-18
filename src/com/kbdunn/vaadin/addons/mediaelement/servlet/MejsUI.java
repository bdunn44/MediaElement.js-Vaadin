package com.kbdunn.vaadin.addons.mediaelement.servlet;

import java.io.File;

import com.kbdunn.vaadin.addons.mediaelement.MediaComponent;
import com.vaadin.server.FileResource;
import com.vaadin.server.VaadinRequest;
import com.vaadin.shared.ui.label.ContentMode;
import com.vaadin.ui.Label;
import com.vaadin.ui.UI;
import com.vaadin.ui.VerticalLayout;

public class MejsUI extends UI {
	private static final long serialVersionUID = 1L;
	
	public MejsUI() { }
	
	@Override
	protected void init(VaadinRequest request) {
		MediaComponent player = new MediaComponent(MediaComponent.AUDIO_PLAYER);
		VerticalLayout content = new VerticalLayout();
		content.setMargin(true);
		content.addComponent(new Label("<h1>MediaElement.js Player</h1>", ContentMode.HTML));
		content.addComponent(player);
		
		File song = new File("/Users/kdunn/Music/Bonobo - Noctuary.mp3");
		if (song.exists()) {
			content.addComponent(new Label("Now Playing: " + song.getName()));
			player.setSource(new FileResource(song));
		} else {
			content.addComponent(new Label("Could not load file '" + song.getName() + "'"));
		}

		setContent(content);
	}
}
