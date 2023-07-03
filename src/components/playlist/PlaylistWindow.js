import React from 'react';
import './ExerciseCard';
import ExerciseCard from './ExerciseCard';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlay } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { TfiReload } from "react-icons/tfi"
import { increaseVersion, setNavDirection } from "../../redux/slices/selectSlice"
import { store } from "../../redux/store"
import Playlist from './Playlist';
import { ThreeDots } from 'react-loader-spinner'
import { MUSCLE_GROUPS } from '../utils/constants';
import { IoMdSettings } from 'react-icons/io';
import CogModal from './CogModal';
import './playlist.scss';
import { updateLoaded } from '../../redux/slices/playlistSlice';
import { calculatePlaylistTime } from '../../redux/slices/playlistSlice';

const fadeIn = `
    @keyframes fade-in {
        0%   { opacity: 0; }
        50%  { opacity: 0; }
        100% { opacity: 1; }
}`;

const PlaylistWindow = ({ indexedDB }) => {

    // Playlist versioning hook, used to regenerate new playlist
    const [key, setKey] = useState(0);

    // Display loading screen when regenrating
    const [isLoading, setIsLoading] = useState(false);

    // React hook to control all exercise cards
    const [closeAllCards, setCloseAll] = useState(false);

    // Set and display total playlist duration
    const [time, setTotalTime] = useState(0);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const playlist = useSelector((state) => (state.playlist.playlistData));
    const version = useSelector((state) => (state.select.version));
    const totalTime = useSelector((state) => state.playlist.totalTime);

    // React hooks to show and close modal
    const [ show, setShow ] = useState(false);
    const handleClose = () => setShow(false);

    function convertMuscleList(array) {
        //console.log("Array", array)
        var list = [] //array.muscles
        for (var i = 0; i < array.muscles.length; i++) {
            if (i + 1 === array.muscles.length)
                list += (array.muscles[i].charAt(0).toUpperCase() + array.muscles[i].slice(1))
            else {
                list += (array.muscles[i].charAt(0).toUpperCase() + array.muscles[i].slice(1))
                list += ", "
            }
        }
        return list;
    }

    // Re-render page and show new playlist when playlist or total time changes
    useEffect(() => {
        setIsLoading(false);
        store.dispatch(calculatePlaylistTime())
        setTotalTime(totalTime);
    }, [playlist, totalTime])

    const handleIncreaseVersion = () => {
        setIsLoading(true);
        // Overrides redux state to allow regenerating playlist after loading
        store.dispatch(updateLoaded(false));
        store.dispatch(increaseVersion());
        setKey(key + 1);
    };
    
    return (

        <>
            <Playlist indexedDB={indexedDB} key={key} />
            <CogModal
                show={show}
                unshow={handleClose}/>
            <div className='playlist-window'>
                <div className='playlist-window__heading'>
                    <div className='playlist-window__heading__settings'/>
                    <div 
                        className='playlist-window__heading__title'
                        style={{ visibility: time > 0 ? "" : "hidden" }}>
                        <p className='playlist-window__heading__title__text-l'> Workout {version} </p> 
                        <p className='playlist-window__heading__title__text-s'> {time} min </p>  
                    </div>
                    <div className='playlist-window__heading__settings'
                        style={{ visibility: time > 0 ? "" : "hidden" }}
                        onClick={() => setShow(true)}>
                        <IoMdSettings size={28} />
                    </div>
                </div>
                

                <div
                    className='playlist-window__container'>
                    {isLoading ? (
                        <div className='playlist-window__load'>
                            <ThreeDots
                                height="80"
                                width="80"
                                radius="9"
                                color="black"
                                ariaLabel="three-dots-loading"
                                visible={true}
                            />
                        </div>) :
                        <>
                            


                            <div className="playlist-window__parent">
                                {playlist.map((work, index) => {

                                    if (index === 0)
                                        return;

                                    if (playlist[index].type === "warmup") {
                                        return (
                                            <ExerciseCard exercise_name='Warmup'
                                                key={index}
                                                duration={playlist[index].time}
                                                sets='1' time='300' ind={index}
                                                closeAll={closeAllCards}
                                                setCloseAll={setCloseAll} />
                                        )
                                    }
                                    else if (playlist[index].type === "cooldown") {
                                        return (
                                            <ExerciseCard exercise_name='Cooldown'
                                                key={index}
                                                duration={playlist[index].time}
                                                sets='1' time='300' ind={index}
                                                closeAll={closeAllCards}
                                                setCloseAll={setCloseAll} />
                                        )
                                    }
                                    else if (index + 1 < playlist.length && playlist[index + 1].type === "rest") {
                                        return (
                                            <ExerciseCard exercise_name={playlist[index].exercise_name}
                                                key={index}
                                                duration={playlist[index].time}
                                                sets={playlist[index].sets}
                                                time={playlist[index].rest_set}
                                                ind={index}
                                                muscle_types={convertMuscleList(playlist[index])}
                                                size={playlist.length}
                                                no_warmup={playlist[1].type !== "warmup"}
                                                no_cooldown={playlist[playlist.length - 1].type !== "cooldown"}
                                                closeAll={closeAllCards}
                                                setCloseAll={setCloseAll} />
                                        )
                                    }

                                    else if (playlist[index].type === "exercise") {
                                        return (
                                            <ExerciseCard exercise_name={playlist[index].exercise_name}
                                                key={index}
                                                duration={playlist[index].time}
                                                sets={playlist[index].sets}
                                                time={playlist[index].rest_set}
                                                rest_time={playlist[index].rest_set}
                                                ind={index}
                                                muscle_types={convertMuscleList(playlist[index])}
                                                size={playlist.length}
                                                no_warmup={playlist[1].type !== "warmup"}
                                                no_cooldown={playlist[playlist.length - 1].type !== "cooldown"}
                                                closeAll={closeAllCards}
                                                setCloseAll={setCloseAll} />
                                        )
                                    }
                                    else {
                                        return (
                                            <ExerciseCard exercise_name={playlist[index].time + "s rest"}
                                                key={index}
                                                type={playlist[index].type}
                                                ind={index} size={playlist.length}
                                                closeAll={closeAllCards}
                                                setCloseAll={setCloseAll} />
                                        )
                                    }
                                })}
                            </div>
                        </>
                    }
                </div>
                <div
                    className='playlist-window__bar'>
                    <style children={fadeIn} />
                    <IoIosArrowBack
                        className="playlist-window__bar__button"
                        style={{ fontSize: "50px" }}
                        onClick={() => { dispatch(setNavDirection("backwards")) && navigate(`/select/${MUSCLE_GROUPS}`) }} />
                    <TfiReload
                        className="playlist-window__bar__button"
                        onClick={handleIncreaseVersion} />
                    <FaPlay
                        className="playlist-window__bar__button"
                        onClick={() => { navigate("/youtube") }}
                    />
                </div>
            </div>
        </>
    );
}
export default PlaylistWindow;