import { useState } from "react";
import "./FinishedPage.scss"
import bicep from "../../assets/bicep.png";
import SaveModal from "./SaveModal";
import { useSelector } from "react-redux";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { RiInformationFill } from "react-icons/ri";

const FinishedWorkout = ({ indexedDB }) => {

    // React hooks to open and close modals
    const [ show, setShow ] = useState(false);
    const handleClose = () => setShow(false);

    // Boolean state to prevent saving the same playlist multiple times
    const savedState = useSelector((state) => (state.playlist.playlistSaved));

    return (
        <div className='finish-page'>
            <SaveModal
                show={show}
                unshow={handleClose}
                indexedDB={indexedDB}/>
            <ul className='finish-page__container'>
                <div className='finish-page__congrats-text'>
                    Good Job!
                </div>
               
                <img
                    className="finish-page__image"
                    src={bicep}
                    alt={"bicep"}
                />

                <div className="finish-page__enjoy-text">
                    Enjoyed your workout?
                </div>

                <div className="finish-page__load-button-div">
                    <div className = 'finish-page__load-button-wrapper'></div>
                    <button 
                        className='finish-page__button' 
                        onClick={() => setShow(true)}
                        disabled={savedState}>
                        <p className="finish-page__button-text">
                            {savedState ? "Saved!" : "Save Workout"}
                        </p>
                    </button>
                    <OverlayTrigger 
                        trigger={window.matchMedia('(hover: hover)').matches? 'hover': 'click'} 
                        placement="bottom" overlay={popover}>
                        <div className="finish-page__load-button-wrapper">
                            <RiInformationFill className='finish-page__info-icon'/>
                        </div>  
                    </OverlayTrigger>
                </div>
            </ul>
        </div>
    )
}

export default FinishedWorkout;

const popover = (
    <Popover id="popover-basic" className="popover__display">
      <Popover.Body className='popover__text'>
        Name your workout to save it. Once saved, it can be retrieved from the 'Load Playlist' button on the home page.
      </Popover.Body>
    </Popover>
);



