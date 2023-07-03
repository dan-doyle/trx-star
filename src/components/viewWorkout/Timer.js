import { useEffect, useState } from "react";
import './viewWorkout.scss'
import countdownSound from '../../assets/countdown.wav';

export const Timer = ({ isPlaying, timeLeft, setTime, onTimeout, restData, fastForward, rewind }) => {
    
    const SECOND = 1000;
    const COUNTDOWN_SECONDS = restData.time;
    const [audio] = useState(new Audio(countdownSound));

    // Adds a sound effect when less than three seconds remaining
    useEffect(() => {
        if (timeLeft === 3 ||timeLeft === COUNTDOWN_SECONDS)
        {
            audio.play();
        }
        else if (timeLeft >3){
            audio.pause(); 
        }
    }, [timeLeft, audio]);


    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setTime(timeLeft - 1);
            }, SECOND);
        }
        return () => clearInterval(interval);
    }, [isPlaying, timeLeft]);

    
    useEffect(() => {
        if (timeLeft === 0) {
            onTimeout && onTimeout();
        }
    }, [timeLeft, onTimeout]);


    return (
        <div className="timer">
            {Object.entries({Seconds: (timeLeft)})
            .map(([label, value]) => (
                <div className="circle" key={label}>
                        {`${Math.floor(value)}`.padStart(2, "0")}
                </div>
            ))}
        </div>
    );
};


export default Timer;
