import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMuscleGroups, setMuscles } from "../../redux/slices/selectSlice";
import { MUSCLES, MUSCLE_GROUPS } from "./constants";
import {TiTick} from "react-icons/ti"
import './utils.scss';

const SelectMultipleButton = ({type, option}) => {

    const dispatch = useDispatch();

    // React hook to track if button has been selected
    const [selected, setSelected] = useState(false);

    const {
        muscleGroups,
        muscles
    } = useSelector((state) => (state.select))

    const clickHandler = (type) => {
        switch(type) {
            case MUSCLE_GROUPS:
                dispatch(setMuscleGroups(option)); // store selected option in redux
                setSelected(!selected);
                break;
            case MUSCLES:
                dispatch(setMuscles(option)); // store selected option in redux
                setSelected(!selected);
            
                break;
            default: 
                break;
        }
    }

    useEffect(() => {
        switch(type) {
            case MUSCLE_GROUPS:
                if (muscleGroups.includes(option)) {
                    setSelected(!selected);
                }
                break;
    
            case MUSCLES:
                if (muscles.includes(option)) {
                    setSelected(!selected);
                }
                break;
            default:
                break;
        }
    },[])

    return (
        <button 
            className= {`select-button ${selected ? 'selected' : 'unselected'}`}
            onClick={() => clickHandler(type)}>
            <div className= "select-button__wrapper">
                <div className="select-button__wrapper-tick"/>
                <p>
                    {option}
                </p>
                <div className = "select-button__wrapper-tick">
                    {selected && <TiTick className = "tick-icon"/>}
                </div>
            </div>
        </button>
    )
}

export default SelectMultipleButton;