import { useEffect } from 'react';
import { filterDatabase, addToFilteredDB, fillStructure} from '../../scripts/algorithm.js';
import { createStructure } from '../../scripts/createStructure.js';
import { useSelector } from 'react-redux';
import { addPlaylist } from "../../redux/slices/playlistSlice.js"
import { store } from "../../redux/store"

// filter using async await
async function filterAll(indexedDB, userOptions) {

    const complexity = diff_to_comp(userOptions["difficulty"]);
    const muscles = userOptions["muscles"];
    
    try {

        // filter videos based on difficulty
        let filteredVideos = await filterDatabase("video", "complexity", complexity, indexedDB, "ExerciseDatabase", 1);
        
        // adds videos of selected difficulty into filteredDB
        await addToFilteredDB("video", filteredVideos);

        // store valid video IDs in array
        const video_IDs = [];
        for (var i = 0; i < filteredVideos.length; i++) {
            video_IDs[i] = filteredVideos[i].video_ID;
        }

        var fullExercises = [];
        // filter exercises based on muscle_type
        for (i = 0; i < muscles.length; i++) {
            let filteredExercises = await filterDatabase("exercises", "muscle_type", muscles[i], indexedDB, "ExerciseDatabase", 1);
            await addToFilteredDB("exercises", filteredExercises);
            filteredExercises.forEach(exercise => {
                if (!fullExercises.includes(exercise.exercise_name)) {
                    fullExercises.push(exercise.exercise_name);
                }
            })
        }
        
        // clips based on valid videos
        for (i = 0; i < video_IDs.length; i++) {
            let filteredClips = await filterDatabase("clip", "video_ID", video_IDs[i], indexedDB, "ExerciseDatabase", 1);
            let validClips = []
            filteredClips.forEach(clip => {
                if (fullExercises.includes(clip.exercise_name)) {
                    validClips.push(clip);
                }
            })
            await addToFilteredDB("clip", validClips);
        }

    } catch (error) {

        console.error("Database filtering rejected", error);

    }
}

function diff_to_comp(difficulty) {
    if (difficulty === "easy") 
        return 0;
    if (difficulty === "medium")
        return 1;
    if (difficulty === "hard")
        return 2;
}

// React component which calls the algorithm and generates playlist.
const Playlist = ({ indexedDB }) => {

    const { 
        difficulty,
        focus,
        duration,
        muscleGroups,
        muscles
    } = useSelector((state) => (state.select));

    const selectedOptions = {
        difficulty,
        focus,
        duration,
        muscleGroups,
        muscles
    }

    const loaded = useSelector((state) => (state.playlist.playlistLoaded));

    useEffect(() => { // make sure not re-rendering all the time

        // if load from saved don't call algorithm
        if (!loaded) {
            filterAll(indexedDB, selectedOptions)
            .then(function() {
                createStructure(selectedOptions)
                .then(function (empty) {
                    fillStructure(empty, indexedDB)
                    .then(function(filled) {
                        store.dispatch(addPlaylist(filled));
                    })
                    .catch(function(e) {
                        console.error(e);
                    })
                })
                .catch(function(e) {
                    console.error(e);
                })
            })
            .catch(function(e) {
                console.error(e);
            })
        }
    }, []);

}   

export default Playlist;