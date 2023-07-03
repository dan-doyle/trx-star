import './viewWorkout.scss'

// This is the progress bar at the top of the youtube and rest pages

const WorkoutProgress = (props) => {
  const {completed} = props;

  const fillerStyles = {
    width: `${completed}%`, // Completed is the % complete and the width of the filler
  }

  return (
    <div className="progress-bar-container">
      <div className="filler" style={fillerStyles}>
        {`${completed}%`}
      </div>
    </div>
  );
};

export default WorkoutProgress;