import React, { useEffect, useState } from 'react';
import { BsTrash } from 'react-icons/bs';
import { BsHourglassSplit } from 'react-icons/bs';
import {BsArrowCounterclockwise} from 'react-icons/bs';
import { BsArrowUp, BsArrowDown } from 'react-icons/bs'
import { useRef } from 'react';
import {BsFillCaretDownFill} from 'react-icons/bs';
import { getClip } from '../../scripts/algorithm';
import { inputToPlaylist, removeFromPlaylist, moveUpExercise, moveDownExercise } from "../../redux/slices/playlistSlice.js"
import { store } from "../../redux/store"
import { filterOnKey } from '../../scripts/algorithm';
import { OverlayTrigger, Popover } from "react-bootstrap";
import { BsThreeDotsVertical } from "react-icons/bs";
import './playlist.scss'

const CLOSED_HEIGHT = 50;
const OPENED_HEIGHT = 155;

const ExerciseCard = ({ exercise_name, duration, sets, time, rest_time, ind, muscle_types, size, no_cooldown, no_warmup, type, closeAll, setCloseAll}) => {
         
    var remaining_secs_duration = (sets * duration + (time * (sets))) % 60;

    // React hooks to control anumations
    const [isOpen, setOPen] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [isSlidingIn, setIsSlidingIn] = useState(false);
    const [isSlidingUp, setIsSlidingUp] = useState(false);
    const [isSlidingDown, setIsSlidingDown] = useState(false);
    const [rotate, setRotate] = useState(false);

    const outerHeight = useRef(CLOSED_HEIGHT);
    const containerRef = useRef(null);
    
    // Close all containers when exercise cards are modified
    useEffect(() => {
        if (closeAll) {
            setOPen(false);
        }
    }, [closeAll])

    const handleClick = () => {
        setRotate(!rotate);
    };

    const slideIn = () => {
        setIsSlidingIn(true);
    };

    const slideUp = () => {
        setIsSlidingUp(true);
    };

    const slideDown = () => {
        setIsSlidingDown(true);
    };

    const fadeOut = () => {
        setIsFadingOut(true);
    };
    
    // Handler to open and close exercise cards
    const toggle = () => {
        if (!isOpen) {
            outerHeight.current = OPENED_HEIGHT;
        }
        setOPen(!isOpen);
        
    };

    // Handlers for exercise card operations
    const handleRemoveDiv = (event) => {
        event.stopPropagation();
        setOPen(false);
        setCloseAll(true);
        fadeOut(); 
        setTimeout(() => {
            store.dispatch(removeFromPlaylist(ind));
            setIsFadingOut(false);
            setCloseAll(false);
        }, 500);
        document.body.click();
    };

    const handleMoveDown = (event) => {
        event.stopPropagation();
        setOPen(false);
        setCloseAll(true);
        slideDown(); 
        setTimeout(() => {
            store.dispatch(moveDownExercise(ind));
            setIsSlidingDown(false);
            setCloseAll(false);
        }, 1000);
        document.body.click();
    };

    const handleMoveUp = (event) => {
        event.stopPropagation();
        setOPen(false);
        setCloseAll(true);
        slideUp(); 
        setTimeout(() => {
            store.dispatch(moveUpExercise(ind)); 
            setIsSlidingUp(false);
            setCloseAll(false);
        }, 1000);
        document.body.click();
    };

    const handleReplace = (event) => {
        event.stopPropagation();
        setOPen(false);
        slideIn(); 
        getClip(indexedDB, "exercise", time, 1).then(
            async function (clip) {
                filterOnKey("exercises", clip.exercise_name, indexedDB, "ExerciseDatabase", 1).then(
                    async function (exercise) {
                        filterOnKey("video", clip.video_ID, indexedDB, "ExerciseDatabase", 1).then(
                            async function (video_of_clip) {
                                var clip_formatted = {
                                    "type": "exercise",
                                    "exercise_name": clip.exercise_name,
                                    "time": duration,
                                    "sets": sets,
                                    "muscles": exercise[0].muscle_type,
                                    "rest_set": time,
                                    "intensity": 1,
                                    "URL": video_of_clip[0].URL,
                                    "start_time": clip.start_time,
                                    "end_time": clip.end_time
                                }
                                store.dispatch(inputToPlaylist([clip_formatted, ind]))
                            }
                        )
                    }
                )
            }
        )
        setTimeout(() => {
            setIsSlidingIn(false);
            setCloseAll(false);
        }, 1000);
        document.body.click();
    };

    const handleClickAndToggle = (type, event) => {
        if (event.target.classList.contains('info-wrapper')) {
            event.stopPropagation(); 
        }
        else if(type !== "rest"){
            handleClick();
            toggle();
        }
    };

    const popover = (
        <Popover id="popover-basic" className="popover-display">
            <Popover.Body>
                {exercise_name !== "Warmup" && exercise_name !== "Cooldown" && (no_warmup && ind > 1 || ind > 2) &&
                    <BsArrowUp size={28} className='popover-display__button' onClick={handleMoveUp} />}
                {exercise_name !== "Warmup" && exercise_name !== "Cooldown" && (no_cooldown && ind < size - 1 || ind < size - 2) &&
                    <BsArrowDown size={28} className='popover-display__button' onClick={handleMoveDown} />}
                {exercise_name !== "Warmup" && exercise_name !== "Cooldown" && type !== "rest" &&
                    <BsArrowCounterclockwise size={28} className='popover-display__button' onClick={handleReplace} />}
                <BsTrash size={28} className='popover-display__button' onClick={handleRemoveDiv} />
            </Popover.Body>
        </Popover>
    );

    return (
        
        <div 
            className={isFadingOut ? 'item-fadeout': 
                (isSlidingIn ? 'slide-in': 
                (isSlidingUp ? 'flipup': 
                (isSlidingDown ? 'flipdown': '')))}>
            <div 
                className={`custom-container ${ isOpen ? 'open' : 'closed'}`}
                style={{ minHeight: isOpen ? outerHeight.current : CLOSED_HEIGHT }}
                ref={containerRef}>
                <div
                    className={'exercise-card'}
                    style={{backgroundColor : type !== "rest" ? "" :'whitesmoke'}}>
                    <div 
                        className='exercise-card__left-container'
                        onClick={(event)=>handleClickAndToggle(type, event)}>
                        {type === "rest" ? <BsHourglassSplit size={20} color={isSlidingUp || isSlidingDown ? 'transparent' : 'gray'}/> : <BsFillCaretDownFill size={20}/>}
                        <div className='exercise-card__exercise-name'>
                            {exercise_name}
                        </div>
                    </div>
                    <div 
                        className='exercise-card__right-container' >
                        <OverlayTrigger trigger={'click'} rootClose placement= "bottom" overlay={popover} innerRef={popover}>
                            <div className='extra-wrapper'>
                                <BsThreeDotsVertical className='extra-wrapper__icon'/>
                            </div>
                        </OverlayTrigger>
                    </div> 
                </div>
                <div 
                    className='additional-info'>

                    {(exercise_name === "Warmup" || exercise_name === "Cooldown") && 
                    <div className='additional-info__warmup-cooldown'> Total Duration: {Math.floor((sets*duration+(time*(sets-1)))/60)}:{remaining_secs_duration<10?'0':''}{remaining_secs_duration} </div>}

                    {exercise_name !== "Warmup" && exercise_name !== "Cooldown" && 
                    <div className='additional-info__exercise' style = {{color: type === 'rest' ? 'transparent' : ''}}> 
                        <div> Work/Rest: </div>
                        <div>{Math.floor((duration/60))}:{duration%60<10?'0':''}{duration%60}/{Math.floor((time/60))}:{time%60<10?'0':''}{time%60}</div>
                        <div> Sets: {sets} </div>
                    </div>}
                    
                    {exercise_name !== "Warmup" && exercise_name !== "Cooldown" &&
                    <div className='additional-info__exercise'> 
                    <div>Total Duration: </div>
                    <div>{Math.floor((sets*duration+(time*(sets)))/60)}:{remaining_secs_duration<10?'0':''}{remaining_secs_duration} </div>
                    </div>}

                    {exercise_name !== "Warmup" && exercise_name !== "Cooldown" && 
                    <div className='additional-info__exercise'> 
                    <div>Muscles: </div>
                        <div> {muscle_types}  </div>
                        </div>}   
                </div>
            </div>
        </div>

    );
}

export default ExerciseCard;