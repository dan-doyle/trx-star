import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "../../redux/slices/selectSlice";
import NavButtons from "../utils/NavButtons";
import { useEffect } from "react";
import { DURATION, FOCUS, DIFFICULTY} from "../utils/constants";
import SelectButton from "../utils/SelectButton";
import './selection.scss';
import { OverlayTrigger, Popover } from "react-bootstrap";
import { RiInformationFill } from "react-icons/ri";

const SelectDuration = () => {

    const durationOptions = [ // duration options to choose from
        "15 min", 
        "30 min",
        "45 min",
        "60 min"
    ];

    const dispatch = useDispatch();
    
    // retrive the duration (if already selected) and navigation direction from redux
    const completed = useSelector((state) => (state.select.duration));
    const direction = useSelector((state) => (state.select.navDirection));

    useEffect(() => {
        // set the redux state of active tab
        dispatch(setActiveTab(DURATION));
    }, []);

    
    return (
        <>
        <div className="title">
            <div className="title__wrapper"/>
            <div className="title__text" > Duration </div>
            <OverlayTrigger 
                trigger={window.matchMedia('(hover: hover)').matches? 'hover': 'click'} 
                placement="top" overlay={popover}>
                <div className="title__wrapper">
                    <RiInformationFill className='title__icon'/>
                </div>  
            </OverlayTrigger>
        </div>
        <div className="selection-container">
            <div className="selection-container__left">
                <NavButtons prev={`/select/${DIFFICULTY}`}/>
            </div>
            <div 
                className="selection-container__options"
                style={{
                    animation: (direction==="forwards")? "slide-in-right 0.5s forwards":"slide-in-left 0.5s forwards",   
                }}
            >
                {
                    durationOptions?.map((option) => { // create button for every duration option
                        return (
                            <SelectButton 
                                key={option} 
                                type={DURATION} 
                                option={option} 
                                to={`/select/${FOCUS}`}
                                selected = {completed}
                            />
                        )
                    })
                }
            </div>
            <div className="selection-container__right">
                {completed && <NavButtons next={`/select/${FOCUS}`}/>}
            </div>
        </div>
        </>
    )
}

export default SelectDuration;

// popover for the information button
const popover = (
    <Popover id="popover-basic" className="popover__display">
      {/* <Popover.Header as="h3">Popover right</Popover.Header> */}
      <Popover.Body className='popover__text'>
        The duration determines the maximum length of your workout.
      </Popover.Body>
    </Popover>
);