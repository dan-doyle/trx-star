import { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import './viewWorkout.scss'
import { useNavigate } from "react-router-dom";
import '../intro/WelcomePage.scss'
import { FaFastForward, FaFastBackward, FaPause, FaPlay, FaStepForward, FaStepBackward } from "react-icons/fa";
import { MdForward10, MdOutlineReplay10 } from "react-icons/md";
import WorkoutProgress from "./WorkoutProgress";
import EndWorkoutModal from './EndWorkoutModal';
import BackToPlaylistModal from './BackToPlaylistModal';

// This concerns the Youtube Pages (where youtube players are embedded)
// This includes the format of the page, the iframe (Youtube Player)
// And the Youtube Control buttons


const YouTubePage = ({nextVideo, prevVideo, exerciseData}) => {

  const navigate = useNavigate();
  const [width, setWidth] = useState(window.innerWidth);
  const [isPlaying, setIsPlaying] = useState(false);
  const [key, setKey] = useState(0);
  const [showEndOfWorkoutModal, setShowEndOfWorkoutModal] = useState(false);
  const [showBackToPlaylistModal, setShowBackToPlaylistModal] = useState(false);

  const playerRef = useRef(null); // create a ref for the YouTube component


  // Tracking the resizing of pages
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // THE FOLLOWING SECTION IS YOUTUBE CONTROL BUTTONS
  const handleNextVideo = () => {
    setKey(key+1);
    nextVideo();
    setIsPlaying(false);
  }

  const handlePrevVideo = () => {
    setKey(key-1);
    prevVideo();
    setIsPlaying(false);
  }

  const handleStateChange = async () => {
    const currentTime = await playerRef.current.internalPlayer.getCurrentTime(); 
    if(currentTime >= exerciseData.endTime) {
      nextVideo();
    }
  }

  const handleFastForward = async () => {
    const currentTime = await playerRef.current.internalPlayer.getCurrentTime(); 
    // ADD logic such that we cannot go beyond the bounds of our current video
    playerRef.current.internalPlayer.seekTo(Math.min(exerciseData.endTime, currentTime + 10), true); 
  };

  const playVideo = async () => {
    playerRef.current.internalPlayer.playVideo(); 
  }

  const pauseVideo = async () => {
    playerRef.current.internalPlayer.pauseVideo(); 
  }

  const handleRewind = async () => {
    const currentTime = await playerRef.current.internalPlayer.getCurrentTime(); 
    // ADD logic such that we cannot go beyond the bounds of our current video
    playerRef.current.internalPlayer.seekTo(Math.max(0, currentTime - 10), true); 
  };

  const endWorkout = () => {
    navigate(`/end`);
  }

  const backToPlaylist = () => {
    navigate(`/playlist`);
  }

let updating_width = 0; 


// THIS IS TO UPDATE THE WIDTH OF THE IFRAME ACCORDING TO PAGE SIZE
function check_width() {
    let w = document.documentElement.clientWidth;
    if(w > 1000) { updating_width = 0.55 * w}
    else if(w > 500) { updating_width = 0.8 * w}
    else {updating_width = 0.98 * w}
}
window.onresize = check_width();

// THOSE ARE IFRAME CHARACTERISTICS
const opts = {
    width: '100%', // so that it takes the whole size of the container
    height: updating_width * 9 / 16 , // keeping the ratio
    playerVars: {
      autoplay: 1,
      controls: 1,
      disablekb: 0,
      start: exerciseData.startTime, 
      end: exerciseData.endTime,
    },
  };


      return (
        <>
        <EndWorkoutModal show={showEndOfWorkoutModal}
                         unshow={() => {
                          if(!isPlaying) {
                            playVideo();
                            setIsPlaying(true);
                          }
                          setShowEndOfWorkoutModal(false)
                          }} endWorkout={endWorkout} />
        <BackToPlaylistModal show={showBackToPlaylistModal}
                         unshow={() => {
                          if(!isPlaying) {
                            playVideo();
                            setIsPlaying(true);
                          }
                          setShowBackToPlaylistModal(false)
                          }} backToPlaylist={backToPlaylist} />
        <div className='progress-bar'> 
            <WorkoutProgress completed={(Math.floor((exerciseData.counter /exerciseData.totalWorkoutLength)*100))} />
        </div>
        
        <div className='container-settings' id="divId">
            
          <div className="container-settings__message1">
            {exerciseData.exerciseName}
            <div className="container-settings__message1__sets">
                Set {exerciseData.setNumber+1} of {exerciseData.totalSets}
            </div>
          </div>
                  
            <div
              className="container-settings__wrap">
              <YouTube className="container-settings__iFrameYoutube"
                        key={key}
                        videoId={exerciseData.videoId} 
                        opts={opts} 
                        onEnd={nextVideo} 
                        ref={playerRef}
                        onReady={playVideo}
                        onPlay={() => setIsPlaying(true)}
                        onStateChange={handleStateChange}
                        onPause={() => setIsPlaying(false)}>
              </YouTube>
            </div>  

            <div className="container-settings__youtube-controls">
              <FaFastBackward onClick={() => {
                if(isPlaying) {
                  pauseVideo();
                  setIsPlaying(false);
                }
                setShowBackToPlaylistModal(true)
                }} className="container-settings__youtube-controls__icon"/>
              <FaStepBackward onClick={handlePrevVideo} className="container-settings__youtube-controls__icon"/>
              <MdOutlineReplay10 onClick={() => handleRewind()} className="container-settings__youtube-controls__icon container-youtube__youtube-controls__icon__ten-seconds"/>
              {
                isPlaying ?
                <FaPause onClick={() => pauseVideo()} className="container-settings__youtube-controls__icon"/>
                :
                <FaPlay onClick={() => playVideo()} className="container-settings__youtube-controls__icon"/>
              }
              <MdForward10 onClick={() => handleFastForward()} className="container-settings__youtube-controls__icon container-youtube__youtube-controls__icon__ten-seconds"/>
              <FaStepForward onClick={handleNextVideo} className="container-settings__youtube-controls__icon"/>
              <FaFastForward onClick={() => {
                if(isPlaying) {
                  pauseVideo();
                  setIsPlaying(false);
                }
                setShowEndOfWorkoutModal(true)
                }} className="container-settings__youtube-controls__icon"/>
            </div>

          </div>
      </>
        
      );
      
}

export default YouTubePage;
