import React, { useEffect } from 'react';
import ReactPlayer from 'react-player/lazy';

let player = null;

const Video = ({
  width,
  controls,
  light,
  seek,
  playIcon,
  height,
  src,
  onReady,
  onProgress,
  onPlay,
  onPause,
  onEnded,
  innerRef,
}) => {
  const [firstLoad, setFirstLoad] = React.useState(false);

  useEffect(() => {
    player && player.seekTo(seek ? seek : 0);
  }, [seek]);

  const handleOnReady = (player_) => {
    if (!firstLoad) {
      player = player_;
      player.seekTo(seek ? seek : 0);
      setFirstLoad(true);
    }
    onReady && onReady(player);
  };
  return (
    <ReactPlayer
      ref={innerRef}
      width={width}
      controls={controls}
      height={height}
      url={src}
      light={light}
      playIcon={playIcon}
      onReady={handleOnReady}
      onProgress={onProgress}
      onPlay={onPlay}
      onEnded={onEnded}
      onPause={onPause}
    />
  );
};

export default Video;

/*import React, { useState } from 'react';
import styled from 'styled-components';
import { Media, Player, controls, withMediaProps } from 'react-media-player';
import CustomPlayPause from './components/CustomPlayPause';
import CustomSeekBar from './components/CustomSeekBar';

const {
  PlayPause,
  CurrentTime,
  Progress,
  SeekBar,
  Duration,
  MuteUnmute,
  Volume,
  Fullscreen,
} = controls;


const Video = ({ media, thumbnailImage, src, onReady }) => {
  const [prueba, setPrueba] = useState(false);
  console.log("MEDIA",media)
  return (
    <Media>
      <div className="media">
        <div style={{ position: 'relative' }}>
          <Player
            onReady={onReady}
            onPlay={()=>{}}
            onTimeUpdate={e => {
              console.log('timeupdate', e.currentTime);
              setPrueba(!prueba)
            }}
            style={{ width: '100%' }}
            src={src}
          />
          <CustomPlayPause />
          <CustomSeekBar />
        </div>
      </div>
    </Media>
  );
};
export default withMediaProps(Video);*/
/*import React from 'react';
import PropTypes from 'prop-types';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';*/

/*const Video = ({ thumbnailImage, src, type, onReady }) => {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const videoOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    poster:thumbnailImage,
    fluid: true,
    disableVideoPlayPauseClick: true,
    userActions: {
      click: false,
    },
    controlBar: {
      fullscreenToggle: true
    },
    sources: [
      {
        src,
        type,
      },
    ],
  };

  React.useEffect(() => {
    // make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      const player = (playerRef.current = videojs(videoElement, videoOptions, () => {
        console.log('player is ready');
        playerRef.current = player;
        onReady && onReady(player);
      }));
    } else {
      // you can update player here [update player through props]
      const player = playerRef.current;
      // player.autoplay(options.autoplay);
      player.src(videoOptions.sources);
    }
  }, [videoOptions, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  React.useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
    </div>
  );
};

Video.propTypes = {
  thumbnailImage: PropTypes.string, 
  src: PropTypes.string, 
  type: PropTypes.oneOf(['video/mp4']),
  onReady: PropTypes.func,
};

Video.defaultProps = {
  type: 'video/mp4'
};

export default Video;*/
