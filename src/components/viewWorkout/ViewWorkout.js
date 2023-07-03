import { useState } from 'react';
import { useSelector } from 'react-redux';
import playlist_to_clipList from '../../scripts/playlistToClipList';
import RestPage from './RestPage';
import YouTubePage from './YouTubePage';
import { useNavigate } from 'react-router-dom';

const ViewWorkout = () => {
    const [count, setCount] = useState(0);
    const navigate = useNavigate();
    const playlist = useSelector((state) => (state.playlist));
    var clipList = playlist_to_clipList(playlist); 

    // if end of workout, navigate to FinishedPage        
    if (count === clipList.length) {
            navigate("/end");            

    } else if (clipList[count].type === 'clip') { // check if exercise 
        const videoId = extractVideoIdFromURL(clipList[count].URL)
        const startTime = parseTime(clipList[count].start_time)
        const endTime = parseTime(clipList[count].end_time)
        const counter = clipList[count].counter
        const setNumber = clipList[count].set_number
        const totalWorkoutLength = clipList.length
        const totalSets = clipList[count].totalSets
        const exerciseName = clipList[count].exercise_name
        const exerciseData = {
            videoId,
            startTime,
            endTime,
            exerciseName,
            counter,
            setNumber,
            totalWorkoutLength,
            totalSets
        }
        
        return (
            <YouTubePage nextVideo={() => setCount(count+1)} 
                        prevVideo={() => setCount(Math.max(0,count-1))}
                        exerciseData={exerciseData} />
        )
    } else { // if not we are resting
        // extract rest data
        return (
            <RestPage nextVideo={() => setCount(count+1)}
                    prevVideo={() => setCount(Math.max(0,count-1))}
                    restData={clipList[count]}
                    nextExerciseName = {clipList[count+1].exercise_name}
                    counter={clipList[count].counter}
                    totalWorkoutLength={clipList.length}/>
        )
    }
}


function extractVideoIdFromURL (URL) {
    const startIndex = URL.indexOf("v=")+2
    const endIndex = URL.indexOf("&");
    // "https://www.youtube.com/watch?v="
    return URL.slice(startIndex, endIndex)
}

function parseTime (time) {
    var a = time.split(':'); // split it at the colons

    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
    return seconds
}

export default ViewWorkout;