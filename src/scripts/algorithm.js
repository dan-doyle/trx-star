import { store } from "../redux/store";
import { inputToPlaylist } from "../redux/slices/playlistSlice";

/*
    Promised wrapped indexedDB operation, return all entries in tableName which
    has indexName value equal to the value parameter passed.
    indexName cannot be the key of tableName. Otherwise, use filerOnKey function.
*/
export function filterDatabase (tableName, indexName, value, indexedDB, database, versionNumber) {
    
    return new Promise(function(resolve, reject) {

        // open database
        const dbPromise = indexedDB.open(database, versionNumber);
        dbPromise.onsuccess = () => {
            const db = dbPromise.result;
            const request = db.transaction(tableName, "readonly")
                .objectStore(tableName)
                .index(indexName)
                .getAll(value);
            request.onsuccess = function(event) { resolve(event.target.result); }
            request.onerror = function(event) { reject(event); }
        } 
        dbPromise.onerror = (event) => { reject(event); }
    })

}

/*
    Promised wrapped indexedDB operation, return all entries in tableName which
    has key equal to the value parameter passed.
    If filtering on a value other than the key, use filterDatabase function.
*/
export function filterOnKey (tableName, value, indexedDB, database, versionNumber) {
    
    return new Promise(function(resolve, reject) {

        // open database
        const dbPromise = indexedDB.open(database, versionNumber);
        dbPromise.onsuccess = () => {
            const db = dbPromise.result;
            const request = db.transaction(tableName, "readonly")
                .objectStore(tableName)
                .getAll(value);
            request.onsuccess = function(event) { resolve(event.target.result); }
            request.onerror = function(event) { reject(event); }
        } 
        dbPromise.onerror = (event) => { reject(event); }

    })

}

// export function negFilterDatabase (tableName, value, indexedDB, database) { 
//     return new Promise(function(resolve, reject) {
//         // open database
//         const dbPromise = indexedDB.open(database, 1);
//         dbPromise.onsuccess = () => {
//             const db = dbPromise.result;
//             const request = db.transaction(tableName, "readwrite")
//                 .objectStore(tableName)
//                 .openCursor();

//             // retrieve table and index of attribute specified
//             request.onsuccess = function (event) { 
//                 var cursor = event.target.result; 
//                 if(cursor){
//                     var entry = cursor.value; 
//                     if(!(value.includes(entry.exercise_name))) {cursor.delete();}
//                     cursor.continue(); 
//                 }
//             }
//             request.onerror = function(event) {reject(event);}
//         }
//         dbPromise.onerror = function(event) {reject(event);}
//     })
// }

/*
    Promise wrapped indexedDB operation, adds objects into tableName of filtered
    database.
*/
export function addToFilteredDB(tableName, objects) {
    return new Promise(function(resolve, reject) {
        const dbPromise  = indexedDB.open("FilteredDatabase", 1);
        dbPromise.onsuccess = () => {
            const db = dbPromise.result;
            const transaction = db.transaction(tableName, "readwrite");
            const objectStore = transaction.objectStore(tableName);
            objects.forEach(row => { objectStore.put(row); })
            transaction.oncomplete = () => {
                db.close();
                resolve();
            }
            transaction.onerror = function(event) { reject(event); }
        }
        dbPromise.onerror = function(event) { reject(event); }
    })
}

export function reject(event) {
    console.error("DB filtering rejected.");
    console.error(event.target.error);
}

export function computeRollingAverageIntensity(structureCopy)
{

    // compute the local average intensity 
    var tot = 0; 
    var count = 0; 
    while(count < structureCopy.length -2 && structureCopy[2 + count].exercise_name != '')
    {
        tot += structureCopy[2+count].intensity
        count++; 
    }

    var avg = tot/count; 
    var goal = structureCopy[0].globalIntensity; 
    
    if (count == 0)
    {
        var exerciseIntensity =  Math.floor(structureCopy[0].globalIntensity);  
    }

    else {
        // make change
        var exerciseIntensity = ((goal > avg) ? Math.floor(avg) + 1 : Math.floor(avg) - 1);

        //make sure in range
        var exerciseIntensity = ((exerciseIntensity > 3) ? 3 : exerciseIntensity);

        //make sure in range
        var exerciseIntensity = ((exerciseIntensity < 1) ? 1 : exerciseIntensity);
    }

    return exerciseIntensity; 
}

export async function fillStructure(structure, indexedDB) {
    
    // fill each object in workout array
    var structureCopy = JSON.parse(JSON.stringify(structure));
    
    for (let i = 1; i < structureCopy.length; i++) {
        var intensity = computeRollingAverageIntensity(structureCopy)

        try {
            var intensity = computeRollingAverageIntensity(structureCopy)
        } catch (e) {
            var intensity = null;
        }

        if (structureCopy[i].type !== "rest") {

            var excluded_exercise = ((i > 1) ? structureCopy[i-1].exercise_name : null);

    
            await getClip(indexedDB, structureCopy[i].type, structureCopy[i].time, intensity, excluded_exercise)
            .then(async function(clip) {

                var video_of_clip = await filterOnKey("video", clip.video_ID, indexedDB, "ExerciseDatabase", 1);
                var exercise_of_clip = await filterOnKey("exercises", clip.exercise_name, indexedDB, "ExerciseDatabase", 1);

                if(structureCopy[i].type === "exercise"){
                    structureCopy[i].exercise_name = clip.exercise_name; 
                    structureCopy[i].muscles =exercise_of_clip[0].muscle_type; 
                    structureCopy[i].intensity = exercise_of_clip[0].intensity; 
                }
            
                structureCopy[i].start_time = clip.start_time; 
                structureCopy[i].end_time = clip.end_time; 
                structureCopy[i].URL = video_of_clip[0].URL; 
            })
        }
    }

    return structureCopy; 
}


/*
    Gets clip with specified options from filtered database
 */
export async function getClip(indexedDB, type, time, intensity, excluded_exercise = null) {

    switch (type) {
    
        case "rest":
            break;
            
        case "warmup":
            var warmup_clips = await filterDatabase("clip", "exercise_name", "warmup", indexedDB, "ExerciseDatabase", 1);
            return warmup_clips[RandInt(0, warmup_clips.length)]; 
            
        case "cooldown":
            var cooldown_clips = await filterDatabase("clip", "exercise_name", "cooldown", indexedDB, "ExerciseDatabase", 1);
            return cooldown_clips[RandInt(0, cooldown_clips.length)]

        case "exercise":
            var exercise_clips = []
            var depth = 0; 

            // While loop prevents duplicate exercises being chosen
            while (exercise_clips.length === 0) {

                var valid_exercises = await filterDatabase("exercises", "intensity", intensity, indexedDB, "FilteredDatabase", 1);
                var chosen_exercise = valid_exercises[RandInt(0, valid_exercises.length)]; 
                
                if (chosen_exercise === undefined) {
                    break;
                }

                while (chosen_exercise.exercise_name == excluded_exercise && depth<40) {
                    chosen_exercise = valid_exercises[RandInt(0, valid_exercises.length)];
                    depth++; 
                }
                
                exercise_clips = await filterDatabase("clip", "exercise_name", chosen_exercise.exercise_name, indexedDB, "FilteredDatabase", 1);
            }

            depth = 0;
            // If valid exercise not chosen after 20 loops, expand search to another intensity
            while (exercise_clips.length === 0) {
                var alt_intensity = (intensity === 1 || intensity === 3) ? 2 : 1;
                var valid_exercises = await filterDatabase("exercises", "intensity", alt_intensity, indexedDB, "FilteredDatabase", 1);
                var chosen_exercise = valid_exercises[RandInt(0, valid_exercises.length)]; 

                if (chosen_exercise === undefined) {
                    break;
                }

                while (chosen_exercise.exercise_name == excluded_exercise && depth<20) {
                    chosen_exercise = valid_exercises[RandInt(0, valid_exercises.length)];
                    depth++; 
                }

                exercise_clips = await filterDatabase("clip", "exercise_name", chosen_exercise.exercise_name, indexedDB, "FilteredDatabase", 1);
            }

            // If valid exercise not chosen after 20 loops, expand search to ExerciseDB
            if(exercise_clips.length === 0) {
                
                var valid_exercises = await filterDatabase("exercises", "intensity", intensity, indexedDB, "ExerciseDatabase", 1);
                var chosen_exercise = valid_exercises[RandInt(0, valid_exercises.length)]; 

                while (chosen_exercise != undefined && chosen_exercise.exercise_name == excluded_exercise) {
                    chosen_exercise = valid_exercises[RandInt(0, valid_exercises.length)];
                    depth++; 
                }

                exercise_clips = await filterDatabase("clip", "exercise_name", chosen_exercise.exercise_name, indexedDB, "ExerciseDatabase", 1);
            }
            
            return exercise_clips[RandInt(0, exercise_clips.length)];

        default:
            console.error("Invalid key");
            return;
    }
}

function RandInt(min, max) {
    return Math.floor(Math.random() * max) + min; 
}


export function getCardio(ind, previous_rest){
        filterDatabase ("exercises", "focus", 0, indexedDB, "ExerciseDatabase", 1) .then(
                async function (exercise) {
                    var index = [RandInt(0, exercise.length)]
                    filterDatabase("clip", "exercise_name", exercise[index].exercise_name, indexedDB, "ExerciseDatabase", 1).then(
                        async function (clip) {
                            filterOnKey("video", clip.video_ID, indexedDB, "ExerciseDatabase", 1).then(
                                async function (video) {
                            var clip_formatted = {
                                "type": "exercise",
                                "exercise_name": clip[0].exercise_name,
                                "time": 40,
                                "sets": 1,
                                "muscles": exercise[index].muscle_type,
                                "rest_set": 0,
                                "intensity": 1,
                                "URL": video[0].URL,
                                "start_time": clip[0].start_time,
                                "end_time": clip[0].end_time,
                                "is_cardio": 1,
                                "replaced_rest": previous_rest
                            }
                            store.dispatch(inputToPlaylist([clip_formatted, ind]))
                        }
                    )
                })
            })
        
    
}
