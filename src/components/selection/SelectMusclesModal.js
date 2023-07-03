import Modal from 'react-bootstrap/Modal'
import 'bootstrap/dist/css/bootstrap.min.css';
import SelectMultipleModalButton from "../utils/SelectMultipleModalButton";
import './selection.scss';
import { useSelector } from "react-redux";
import { MUSCLES } from "../utils/constants";
import { useEffect, useState } from 'react';

const MusclesModal = ({show, unshow}) => {

    const musclesOptions = { // muscle options to choose from
        "Core": ["obliques", "abdomen"],
        "Lower Body": ["glutes", "quads", "hamstrings", "calves"],
        "Upper Body": ["lats", "back", "shoulders", "chest", "biceps", "triceps"]
    };

    // retrieve chosen muscle groups from redux
    const muscleGroups = useSelector((state) => (state.select.muscleGroups));
    
    const [selected, setSelected] = useState(false);
    const muscles = useSelector((state) => (state.select.muscles));

    useEffect(() => {
        if (muscles.length !== 0) {
            setSelected(true);
        }
        else {
            setSelected(false);
        }
    }, [muscles])

    const clickHandler = () => {
        if (selected) {
            unshow();
        }
    }

    return (
        <Modal
            show={show}
            onHide={unshow}
            backdrop="static"
            keyboard={false}
            scrollable={true}
            centered>
            <Modal.Header>
                <Modal.Title
                    className='muscle-modal__text'>
                    Deselect Muscles
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="muscle-modal__muscles">
                    {
                        muscleGroups.map((muscleGroup) => { // create button for each muscle from selected muscle groups
                            return ( musclesOptions[muscleGroup]?.map((option) => { 
                                return (
                                    <SelectMultipleModalButton 
                                        key={option} 
                                        type={MUSCLES} 
                                        option={option}
                                    />
                                )
                            })
                        )})
                    }
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button
                    onClick={() => clickHandler()}
                    style = {{color: !selected? "darkgray":"", borderColor: selected? "black":"darkgray"}}
                    className="muscle-modal__button">
                    Save
                </button>
            </Modal.Footer>
        </Modal>
    )
}

export default MusclesModal