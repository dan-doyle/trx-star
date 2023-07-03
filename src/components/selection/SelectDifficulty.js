import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "../../redux/slices/selectSlice";
import { useEffect } from "react";
import { DIFFICULTY, DURATION } from "../utils/constants";
import SelectButton from "../utils/SelectButton";
import NavButtons from "../utils/NavButtons";
import './selection.scss';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { Popover } from "react-bootstrap";
import { RiInformationFill } from "react-icons/ri";

const SelectDifficulty = () => {

    const difficultyOptions = ["Easy", "Medium", "Hard"]; // difficulty options to choose from
    
    const dispatch = useDispatch()
    
    // retrive the difficulty (if already selected) and navigation direction from redux
    const completed = useSelector((state) => (state.select.difficulty))
    const direction = useSelector((state) => (state.select.navDirection))

    useEffect(() => {
        // set the redux state of active tab
        dispatch(setActiveTab(DIFFICULTY));
    }, []);

    return (
        <>
        <div className="title">
            <div className="title__wrapper"/>
            <div className="title__text" > Difficulty </div>
            <OverlayTrigger 
                trigger={window.matchMedia('(hover: hover)').matches? 'hover': 'click'} 
                placement="top" overlay={popover}>
                <div className="title__wrapper">
                    <RiInformationFill className='title__icon'/>
                </div>  
            </OverlayTrigger>
        </div>
        <div className="selection-container">
            <div className="selection-container__left"></div>
            <div className="selection-container__options"
                style={{
                    animation: (direction==="forwards")? "slide-in-right 0.5s forwards":"slide-in-left 0.5s forwards",   
                }}>
                {difficultyOptions?.map((option) => { // create button for every difficulty option
                    return (

                        <SelectButton
                            key={option}
                            type={DIFFICULTY}
                            option={option}
                            to={`/select/${DURATION}`}
                            selected = {completed} />

                    );
                })}
            </div>
            <div className="selection-container__right">
                {completed && <NavButtons 
                    next={`/select/${DURATION}`}/>}
            </div>
        </div>
        </>
    )
}

export default SelectDifficulty;

// popover for the information button
const popover = (
    <Popover id="popover-basic" className="popover__display">
      <Popover.Body className='popover__text'>
        The difficulty determines the average difficulty of your workout, including the length of rest periods. 
      </Popover.Body>
    </Popover>
);
