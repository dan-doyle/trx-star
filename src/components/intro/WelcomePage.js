import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DIFFICULTY } from "../utils/constants";
import './WelcomePage.scss';
import { useDispatch } from "react-redux";
import { setNavDirection } from "../../redux/slices/selectSlice";
import { store } from "../../redux/store"
import { initialiseAll } from "../../redux/slices/selectSlice";
import { initialisePlaylist } from "../../redux/slices/playlistSlice";
import LoadModal from "./LoadModal";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { RiInformationFill } from "react-icons/ri";
import data from '../../data/ExerciseDatabase5.json'

const Welcome = ({indexedDB}) => {

    // Only reset redux state when navigating to start page
    useEffect(() => {
        store.dispatch(initialiseAll());
        store.dispatch(initialisePlaylist([]));

        var jsonSchemaString = JSON.stringify(data);
        var schema = JSON.parse(jsonSchemaString);

        // create filtered database at start-up
        const filtered = indexedDB.open("FilteredDatabase", 1);

        // if filtered database already exists, clear object stores
        filtered.onsuccess = function(event) {
            const db = filtered.result;
            const objectStoreList = db.objectStoreNames;
            for (var i = 0; i < objectStoreList.length; i++) {
                db.transaction(objectStoreList[i], "readwrite").objectStore(objectStoreList[i]).clear();
            }
        };

        filtered.onerror = function (event) {
            console.error("An error occurred with IndexedDB");
            console.error(event.target.error);
        };

        filtered.onupgradeneeded = function(event) {
            const db = filtered.result;
            // FilteredDatabase always has version 1, only upgrade if did not have Database
            for (var i = 0; i < schema.tables.length; i++) {
                // Create the object store and add data
                var objectStore = db.createObjectStore(schema.tables[i].name, { keyPath: schema.tables[i].keyPath });
                // Define any indexes
                for (var j = 0; j < schema.tables[i].indexes.length; j++) {
                    objectStore.createIndex(schema.tables[i].indexes[j].name, schema.tables[i].indexes[j].keyPath, { unique: schema.tables[i].indexes[j].unique, multiEntry: schema.tables[i].indexes[j].multientry });
                }
            }        
        };

    })
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const clickHandler = () => {
        dispatch(setNavDirection("forwards"));
        navigate(`/select/${DIFFICULTY}`);
    }

    // Modal show unshow hooks
    const [ show, setShow ] = useState(false);
    const [ buttonDisabled, setButtonDisabled ] = useState(true);
    const handleClose = () => setShow(false);

    return (
        <div className="welcome__img-container">
            <ul
                className="welcome__img-ul">
                <img
                    className="welcome__img"
                    src={"/logo.png"}
                    alt={"logo"}
                />
                <button 
                    key={Welcome} 
                    onClick={()=>clickHandler()}
                    className="welcome__button">
                    Start Your Workout
                </button>
                <div className="welcome__load-button-div">
                    <div className = 'welcome__load-button-wrapper'></div>
                    <button
                        onClick={() => setShow(true)}
                        disabled={buttonDisabled}
                        className="welcome__loadbutton">
                        Load Playlist
                    </button>
                    <OverlayTrigger 
                        trigger={window.matchMedia('(hover: hover)').matches? 'hover': 'click'} 
                        placement="bottom" overlay={popover}>
                        <div className="welcome__load-button-wrapper">
                            <RiInformationFill className='welcome__info-icon'/>
                        </div>  
                    </OverlayTrigger>
                </div>
                
            </ul>
            <LoadModal
            show={show}
            unshow={handleClose}
            indexedDB={indexedDB}
            setButtonDisabled={setButtonDisabled}/>
        </div>
    )
}

export default Welcome;

const popover = (
    <Popover id="popover-basic" className="popover__display">
      <Popover.Body className='popover__text'>
        Load and navigate straight to a playlist you've saved. To save a playlist click the 'Save Workout' button after completing a workout.
      </Popover.Body>
    </Popover>
);
