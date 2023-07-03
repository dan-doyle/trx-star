import { useDispatch, useSelector } from "react-redux";
import { DIFFICULTY, DURATION, FOCUS, MUSCLE_GROUPS } from "../utils/constants";
import './selection.scss';
import { useNavigate } from 'react-router-dom';
import { GiJumpingRope,GiWeightLiftingUp} from "react-icons/gi";
import {BiRun} from "react-icons/bi"
import {GrYoga} from "react-icons/gr"
import {WiTime12,WiTime6,WiTime3,WiTime9} from "react-icons/wi"
import {TbAntennaBars3,TbAntennaBars4,TbAntennaBars5} from "react-icons/tb"
import { setNavDirection } from "../../redux/slices/selectSlice";

const SelectProgress = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

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
        "Core": "C",
        "Lower Body":"L",
        "Upper Body":"U",
    };

    // retrieve the selections from redux and the current (active) tab
    const activeTab = useSelector((state) => (state.select.activeTab));
    const selectedDifficulty = useSelector((state) => (state.select.difficulty));
    const selectedFocus = useSelector((state) => (state.select.focus));
    const selectedDuration = useSelector((state) => (state.select.duration));
    const selectedMuscleGroup = useSelector((state) => (state.select.muscleGroups));

    // after clicking, set the navigation direction (used for transitions) and navigate
    const clickHandler = (to) => {
        if(activeTab===DIFFICULTY){
            dispatch(setNavDirection("forwards")); 
        }
        else if(activeTab===MUSCLE_GROUPS){
            dispatch(setNavDirection("backwards"));
        }
        else if(activeTab===DURATION){
            if(to===DIFFICULTY){
                dispatch(setNavDirection("backwards"));
            }
            else{
                dispatch(setNavDirection("forwards"));
            }
        }
        else if(activeTab===FOCUS){
            if(to===MUSCLE_GROUPS){
                dispatch(setNavDirection("forwards"));
            }
            else{
                dispatch(setNavDirection("backwards"));
            }
        }
        if(to !== activeTab){
            navigate(`/select/${to}`);
        }
    }

    return (
        <div className="progress-container">
            <div className="progress-container__text">
                {"Select your preferences"}
            </div>
            <div className="progress-container__tab">
                <div className={activeTab===DIFFICULTY?"progress-container__tab__active":"progress-container__tab__inactive"}
                    onClick ={() => {selectedDifficulty && clickHandler(DIFFICULTY)}}>
                    {selectedDifficulty && <Icon icon={optionIcons[selectedDifficulty]} />}
                </div>
                <div className={activeTab===DURATION?"progress-container__tab__active":"progress-container__tab__inactive"}
                    onClick ={() => {selectedDuration && clickHandler(DURATION)}}>
                    {selectedDuration && <Icon icon={optionIcons[selectedDuration]} />}
                </div>
                <div className={activeTab===FOCUS?"progress-container__tab__active":"progress-container__tab__inactive"}
                    onClick ={() => {selectedFocus && clickHandler(FOCUS)}}>
                    {selectedFocus && <Icon icon={optionIcons[selectedFocus]} />}
                </div>
                <div className={activeTab===MUSCLE_GROUPS?"progress-container__tab__active":"progress-container__tab__inactive"}
                    onClick ={() => {selectedMuscleGroup.length!==0 && clickHandler(MUSCLE_GROUPS)}}> 
                    <div className="progress-container__tab__bar">
                        {
                            selectedMuscleGroup?.map((muscleGroup) => {
                                return (
                                    <div 
                                        className = "progress-container__tab__bar__text"
                                        key={muscleGroup}>
                                        {optionIcons[muscleGroup]}
                                    </div>
                                )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SelectProgress;

const Icon = ({ icon }) => {
    const IconComponent = icon;
    return <IconComponent className ="icon"/>;
};