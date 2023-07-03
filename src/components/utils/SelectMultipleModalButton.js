import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMuscleGroups, setMuscles } from "../../redux/slices/selectSlice";
import { MUSCLES, MUSCLE_GROUPS } from "./constants";
import {TiTick} from "react-icons/ti"
import './utils.scss';

const SelectMultipleModalButton = ({type, option}) => {
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
                dispatch(setMuscleGroups(option));
                setSelected(!selected);
                break;
            case MUSCLES:
                dispatch(setMuscles(option));
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
            className={`muscle-modal-button ${selected ? 'selected' : 'unselected'}`}
            onClick={() => clickHandler(type)}>
                <div className = "muscle-modal-button__tick"></div>
                <p>
                    {option}
                </p>
                <TiTick size={20} className = "muscle-modal-button__tick" style = {{opacity: selected ?  '1': '0'}}/>
        </button>
    )
}

export default SelectMultipleModalButton;