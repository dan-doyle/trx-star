import Modal from 'react-bootstrap/Modal'
import 'bootstrap/dist/css/bootstrap.min.css';
import './viewWorkout.scss'

const EndWorkoutModal = ({show, unshow, endWorkout}) => {

    return (
        <Modal
            show={show}
            onHide={unshow}
            keyboard={false}
            scrollable={true}
            centered>
            <Modal.Header className='confirm-modal__header'>
                <div
                    className='confirm-modal__text'>
                    Continue to End Workout
                </div>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex justify-content-center">
                    <button
                        onClick={unshow}
                        className="confirm-modal__button cancel">
                        Cancel
                    </button>
                    <button
                        onClick={endWorkout}
                        className="confirm-modal__button proceed">
                        Confirm
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default EndWorkoutModal