import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import data from './data/ExerciseDatabase5.json'

// import components
import SelectMuscleGroups from "./components/selection/SelectMuscleGroups";
import SelectDifficulty from "./components/selection/SelectDifficulty";
import SelectDuration from "./components/selection/SelectDuration";
import SelectFocus from "./components/selection/SelectFocus";
import Welcome from "./components/intro/WelcomePage";
import NavBar from "./components/layout/NavBar";
import SelectPage from "./components/selection/SelectPage";
import { DIFFICULTY, DURATION, FOCUS, MUSCLE_GROUPS } from "./components/utils/constants";
import ViewWorkout from "./components/viewWorkout/ViewWorkout";
import FinishedWorkout from "./components/finishedPage/FinishedPage";
import PlaylistWindow from "./components/playlist/PlaylistWindow";
import About from "./components/infoPages/AboutPage"
import Development from "./components/infoPages/DevelopmentPage";

const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

const createCollectionsInIndexedDB = () => {

    if (!indexedDB) {
        console.log("IndexedDB could not be found in this browser.");
    }

    var versionChangeInProgress = false;
    var jsonSchemaString = JSON.stringify(data);
    var schema = JSON.parse(jsonSchemaString);

    // if a database doesn not already exist with name "ExerciseDatabase" one is created, second param a version number in case we make a change and the user already has a previous version stored in broowser
    const request = indexedDB.open(schema.name, schema.version);

    // error checks before we create schema on database
    request.onerror = function(event) {
        console.error("An error occurred with IndexedDB");
        console.error(event.target.error);
    };

    // create schema of database
    request.onupgradeneeded = function(event) {
        const db = request.result;
        if (event.oldVersion !== 0) {
            // user had an old version of ExerciseDatabase
            const objectStoreList = db.objectStoreNames;
            for (var i = 0; i < objectStoreList.length; i++) {
                // delete all object stores
                db.deleteObjectStore(objectStoreList[i]);
            }
        }
        for (i = 0; i < schema.tables.length; i++) {
            // Create the object store and add data
            var objectStore = db.createObjectStore(schema.tables[i].name, { keyPath: schema.tables[i].keyPath });
            // Define any indexes
            for (var j = 0; j < schema.tables[i].indexes.length; j++) {
                objectStore.createIndex(schema.tables[i].indexes[j].name, schema.tables[i].indexes[j].keyPath, { unique: schema.tables[i].indexes[j].unique, multiEntry: schema.tables[i].indexes[j].multientry });
            }
            // Add data to the object store
            // line below gave warnings
            // schema.tables[i].data.forEach(row => objectStore.add(row));
            for (var k = 0; k < schema.tables[i].data.length; k++) {
                objectStore.add(schema.tables[i].data[k]);
            }
            
        }
    };
    
    // handle version changes(adding to database)
    request.onversionchange = function(event) {
        versionChangeInProgress = true;
        event.target.close();
    };

}


const App = () => {
    useEffect(() => {
        createCollectionsInIndexedDB();
    }, []);
    return (
        <div 
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100vh"
            }}
        >
            <NavBar/>
            <Routes>
                <Route path="/playlist" element={ <PlaylistWindow indexedDB={indexedDB}/> } />
                <Route path="/" element={<Welcome indexedDB={indexedDB}/>} />
                <Route exact path={`/select/${MUSCLE_GROUPS}`} element={<SelectPage selectForm={<SelectMuscleGroups/>}/>}/>
                <Route exact path={`/select/${DIFFICULTY}`} element={<SelectPage selectForm={<SelectDifficulty/>}/>}/>
                <Route exact path={`/select/${DURATION}`} element={<SelectPage selectForm={<SelectDuration/>}/>}/>
                <Route exact path={`/select/${FOCUS}`} element={<SelectPage selectForm={<SelectFocus/>}/>}/>
                <Route path="/youtube"element={<ViewWorkout/>} />
                <Route path="/end"element={<FinishedWorkout indexedDB={indexedDB}/>} />
                <Route path="/about" element={<About/>}/>
                <Route path="/development" element={<Development/>}/>
            </Routes>
        </div>
    );
}

export default App;
