import { createSlice } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web


// Javascript object to link body part selection with muscles
const musclesOptions = {
  "Core": ["obliques", "abdomen"],
  "Lower Body": ["glutes", "quads", "hamstrings", "calves"],
  "Upper Body": ["lats", "back", "shoulders", "chest", "biceps", "triceps"]

};

// Stores "select" state globally so that it can be accessed from anywhere in the application 
export const selectSlice = createSlice({
  name: 'select',
  initialState: {
    version : 1,
    activeTab: "",
    navDirection: "forwards",
    difficulty: "",
    duration: "",
    focus: "",
    muscleGroups: [],
    muscles: []

  },
  reducers: {
    increaseVersion: (state, action) =>{
      state.version += 1;
    },
    initialiseAll: (state, action) => {
      state.version = 1;
      state.activeTab= "";
      state.navDirection= "forwards";
      state.difficulty= "";
      state.focus= "";
      state.duration= "";
      state.muscleGroups= [];
      state.muscles= [];
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },    
    setNavDirection: (state, action) => {
      state.navDirection = action.payload;
      state.version = 1;
    },
    setDifficulty: (state, action) => {
      state.difficulty = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    setFocus: (state, action) => {
      state.focus = action.payload;
    },
    setMuscleGroups: (state, action) => {
      if (state.muscleGroups.includes(action.payload)) { // if bodyPart already selected
        state.muscleGroups = state.muscleGroups.filter((muscleGroup) => (muscleGroup!=action.payload)); // remove bodyPart
        const muscleGroupMuscles = musclesOptions[action.payload];
        state.muscles = state.muscles.filter((muscle) => (!muscleGroupMuscles.includes(muscle)));
      } else { // if bodyPart not already selected
        state.muscleGroups = [...state.muscleGroups, action.payload]; // add bodyPart
        const muscleGroupMuscles = musclesOptions[action.payload];
        state.muscles = [...state.muscles, ...muscleGroupMuscles];
      }
    },
    setMuscles: (state, action) => {
      state.version = 1;
      if (state.muscles.includes(action.payload)) {
        state.muscles = state.muscles.filter((muscle) => (muscle!=action.payload));
      } else {
        state.muscles = [...state.muscles, action.payload];
      }
    },
    setMuscleGroupsOnLoad: (state, action) => {
      state.muscleGroups = [...state.muscleGroups, action.payload]; // add bodyPart
    }
  },
});

// The "Actions" will be used to change the state from anywhere in application - e.g.: dispatch(action(param))
 export const { 
  increaseVersion,
  initialiseAll,
  setActiveTab,
  setNavDirection,
  setDifficulty, 
  setDuration, 
  setFocus, 
  setMuscleGroups, 
  setMuscles,
  setMuscleGroupsOnLoad
 } = selectSlice.actions;

const selectPersistConfig = {
  key: 'select',
  storage: storage,
  whitelist: ['version', 'activeTab', 'difficulty', 'focus', 'duration', 'muscleGroups', 'muscles']
};

export const persistedSelectReducer = persistReducer(selectPersistConfig, selectSlice.reducer);

//export { selectSlice, persistedSelectReducer };

//export default selectSlice.reducer