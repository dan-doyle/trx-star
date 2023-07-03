import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setDifficulty, setDuration, setFocus, setNavDirection } from "../../redux/slices/selectSlice";
import { DIFFICULTY, DURATION, FOCUS } from "./constants";
import './utils.scss';
import { GiJumpingRope,GiWeightLiftingUp} from "react-icons/gi";
import {BiRun} from "react-icons/bi"
import {GrYoga} from "react-icons/gr"
import {WiTime12,WiTime6,WiTime3,WiTime9} from "react-icons/wi"
import {TbAntennaBars3,TbAntennaBars4,TbAntennaBars5} from "react-icons/tb"

const SelectButton = ({type, option, to, selected}) => {

    const optionIcons = {
        "15 min": WiTime3, 
        "30 min": WiTime6,
        "45 min": WiTime9,
        "60 min": WiTime12,
        "HIIT": GiJumpingRope, 
        "Strength": GiWeightLiftingUp, 
        "Endurance": BiRun, 
        "Recovery": GrYoga,
        "Easy": TbAntennaBars3, 
        "Medium": TbAntennaBars4, 
        "Hard": TbAntennaBars5,
        
    };


    const navigate = useNavigate();
    const dispatch = useDispatch();

    // save button option in redux after clicking and set the navigation direction to forward (used for transitions)
    const clickHandler = (type) => {
        switch(type) {
            case DIFFICULTY:
                dispatch(setDifficulty(option)); 
                break;
            case FOCUS:
                dispatch(setFocus(option));
                break;
            case DURATION:
                dispatch(setDuration(option));
                break;
            default: 
                break;
        }
        dispatch(setNavDirection("forwards"))
        navigate(to);
    }

    const Icon = optionIcons[option];

    return (
        <button 
            className={`select-button ${selected === option ? 'selected' : 'unselected'}`}
            onClick={()=>clickHandler(type)}>
            <p>
                {option}
            </p>
            <Icon className ="select-button__icon"/>
        </button>
    )
}

export default SelectButton;