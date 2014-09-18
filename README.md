MEJS-Vaadin
===========

A server-side MediaElement.js player component for Vaadin


Code Example
=============
```java
import com.kbdunn.vaadin.addons.mediaelement.MediaComponent;

// Audio player with playbackEnded listener
MediaComponent audioPlayer = new MediaComponent(MediaComponent.AUDIO_PLAYER);
layout.addComponent(audioPlayer);
audioPlayer.setSource(new FileResource(new File("/path/to/song.mp3")));
audioPlayer.addPlaybackEndedListener(new PlaybackEndedListener() {

        @Override
        public void playbackEnded(MediaComponent component) {
                component.stop();
                component.setSource(new FileResource(new File("/path/to/next/song.m4a")));
                component.play();
        }
});
audioPlayer.play();

// Video player
MediaComponent videoPlayer = new MediaComponent(MediaComponent.AUDIO_PLAYER);
layout.addComponent(videoPlayer);
videoPlayer.setSource(new FileResource(new File("/path/to/video.mp4")));
```
