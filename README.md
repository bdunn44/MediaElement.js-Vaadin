MediaElement.js Player for Vaadin
=================================

This Vaadin add-on provides a MediaElement.js media player component with hooks into client-side events and methods that allow you to play music/videos, control the player from the server side, and listen to player events such as Paused, Seeked, PlaybackEnded, etc.

MediaElement.js is a fully-featured HTML5 audo & video player with Flash and Silverlight fallback for older browsers. It supports a wide array of audio formats and YouTube/Vimeo sources. See the MediaElement.js website for more details.

This addon is currently packaged with MediaElement.js 2.20.0.

NOTE if using Vaadin 7.3.x or earlier you must use version 1.2.6 of this addon. Users of 7.4.0 and up should use 1.2.7+. This is due to a change in the `com.vaadin.ui.JavaScriptFunction` interface which causes classpath errors.

Vaadin Directory: http://vaadin.com/addon/mediaelementjs-player


Code Example
=============
```java
import com.kbdunn.vaadin.addons.mediaelement.MediaComponent;

// Audio player with PlaybackEndedListener
MediaElementPlayer audioPlayer = new MediaElementPlayer();
layout.addComponent(audioPlayer);
audioPlayer.setSource(new FileResource(new File("/path/to/song.mp3")));
audioPlayer.addPlaybackEndedListener(new PlaybackEndedListener() {

        @Override
        public void playbackEnded(MediaElementPlayer component) {
                component.setSource(new FileResource(new File("/path/to/next/song.m4a")));
                component.play();
        }
});
audioPlayer.play();

// Video player
MediaElementPlayer videoPlayer = new MediaElementPlayer(MediaElementPlayer.Type.VIDEO);
layout.addComponent(videoPlayer);
videoPlayer.setSource(new FileResource(new File("/path/to/video.mp4")));

// YouTube player
MediaElementPlayer videoPlayer = new MediaElementPlayer(MediaComponent.Type.VIDEO);
layout.addComponent(videoPlayer);
videoPlayer.setSource(new ExternalResource("https://youtu.be/kh29_SERH0Y"));
```

MIME Type Configuration
=======================
You must configure MIME type mappings for this addon to function properly. Vaadin resources derive MIME types using  `com.vaadin.util.FileTypeResolver`. The following MIME mappings are recommended to be added upon servlet initialization:

```java
FileTypeResolver.addExtension("ogg", "audio/ogg");
FileTypeResolver.addExtension("ogv", "video/ogg");
FileTypeResolver.addExtension("mp4", "video/mp4");
FileTypeResolver.addExtension("webm", "video/webm");
FileTypeResolver.addExtension("wmv", "video/x-ms-wmv");
FileTypeResolver.addExtension("wma", "audio/x-ms-wma");
FileTypeResolver.addExtension("flv", "video/x-flv");
FileTypeResolver.addExtension("avi", "video/x-msvideo");
```

MIME type mappings may also need to be configured for your servlet container. For example the following code will configure these mappings for embedded Jetty9:

```java
WebAppContext context = new WebAppContext();
MimeTypes mimeTypes = context.getMimeTypes();
mimeTypes.addMimeMapping("ogg", "audio/ogg");
mimeTypes.addMimeMapping("ogv", "video/ogg");
mimeTypes.addMimeMapping("mp4", "video/mp4");
mimeTypes.addMimeMapping("webm", "video/webm");
mimeTypes.addMimeMapping("wmv", "video/x-ms-wmv");
mimeTypes.addMimeMapping("wma", "audio/x-ms-wma");
mimeTypes.addMimeMapping("flv", "video/x-flv");
mimeTypes.addMimeMapping("avi", "video/x-msvideo");
context.setMimeTypes(mimeTypes);
...
```

Known Issues
=============

* The Vimeo player does not support RPC calls. 
* For best results use `FileResource` for media sources. Known issues with other types of resources include:
	* `ClassResource` - frequent `java.nio.channels.ClosedChannelException`.
	* `ThemeResource` - seeking doesn't work in Chrome.


