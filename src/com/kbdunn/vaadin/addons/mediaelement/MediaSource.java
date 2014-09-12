package com.kbdunn.vaadin.addons.mediaelement;

import java.io.Serializable;

public class MediaSource implements Serializable {

	private static final long serialVersionUID = 1L;
	private String src;
	private String type;
	
	public MediaSource(String src, String type) {
		this.src = src;
		this.type = type;
	}
	
	public MediaSource() { }

	public String getSrc() {
		return src;
	}
	
	public void setSrc(String src) {
		this.src = src;
	}
	
	public String getType() {
		return type;
	}
	
	public void setType(String type) {
		this.type = type;
	}
}
