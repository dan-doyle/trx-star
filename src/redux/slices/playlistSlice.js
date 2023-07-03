import { createSlice } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import {persistStore, persistReducer} from 'redux-persist'
import { getCardio } from '../../scripts/algorithm'

const playlistSlice = createSlice({
  name: 'playlist',
  initialState: {
    playlistData: [],
    playlistSaved: false,
    playlistLoaded: false,
    totalTime: 1,
  },
  reducers: {
    calculatePlaylistTime: (state, action) => {

      var totalTime = 0;
      const playlistData = [state.playlistData];
      var playlistLength = playlistData[0].length;

      for(var i = 0; i < playlistLength; i++){

        if(playlistData[0][i].type == "exercise")
        {
          totalTime += (playlistData[0][i].time + playlistData[0][i].rest_set) * playlistData[0][i].sets;
        }

        else if(playlistData[0][i].type == "rest" || playlistData[0][i].type == "warmup" || playlistData[0][i].type == "cooldown")
        {
          totalTime += playlistData[0][i].time;
        }
      }

      state.totalTime = Math.floor(totalTime/60);
    },

    addPlaylist: (state, action) => {
      state.playlistData = action.payload;
    }, 
    inputToPlaylist: (state, action) => {
      const arr = action.payload;
      const value = arr[0]; 
      const index = arr[1];
      const updatedPlaylistData = [state.playlistData];
      updatedPlaylistData[0][index] = value;
      state.playlistData = []
      state.playlistData = updatedPlaylistData[0];
    },
    removeFromPlaylist:(state, action) => {
      const updatedPlaylistData = [state.playlistData];
      updatedPlaylistData[0].splice(action.payload, 1);
      state.playlistData = []
      state.playlistData = updatedPlaylistData[0];
    },
    initialisePlaylist: (state, action) => {
      state.playlistData = action.payload;
      state.playlistSaved = false;
      state.playlistLoaded = false;
    },
    updateSaved: (state, action) => {
      state.playlistSaved = action.payload;
    },
    updateLoaded: (state, action) => {
      state.playlistLoaded = action.payload;
    },
    moveDownExercise:(state, action) => {
      const updatedPlaylistData = [state.playlistData];
      var tempExercise =  updatedPlaylistData[0][action.payload +1];
      updatedPlaylistData[0][action.payload+1] = updatedPlaylistData[0][action.payload];
      updatedPlaylistData[0][action.payload] = tempExercise; 
      state.playlistData = []
      state.playlistData = updatedPlaylistData[0];
    },
    moveUpExercise:(state, action) => {
      const updatedPlaylistData = [state.playlistData];
      var tempExercise =  updatedPlaylistData[0][action.payload-1];
      updatedPlaylistData[0][action.payload-1] = updatedPlaylistData[0][action.payload];
      updatedPlaylistData[0][action.payload] = tempExercise; 
      state.playlistData = []
      state.playlistData = updatedPlaylistData[0];
    },
    updateRest:(state, action) => {
      var newTime = action.payload[0]; // removed [0] as test
      var changeForCardio = action.payload[1];
      var newRestSetTime = action.payload[2]; 

      const updatedPlaylistData = [state.playlistData]; // fetches the most recent data
      var playlistLength = updatedPlaylistData[0].length;


      for(var i = 0; i < playlistLength; i++){

        if(updatedPlaylistData[0][i].type == "exercise" && newRestSetTime>-1)
        {
          updatedPlaylistData[0][i].rest_set = newRestSetTime;
        }

        if((updatedPlaylistData[0][i].type == "rest" || updatedPlaylistData[0][i].is_cardio) && !changeForCardio  && newTime>-1)
        {
          var rest = {
            type: "rest",
            intensity: 0,
            time: updatedPlaylistData[0][i].previous_rest
          }
          updatedPlaylistData[0][i] = rest;
          updatedPlaylistData[0][i].time = newTime;

        }

        if (updatedPlaylistData[0][i].is_cardio && !changeForCardio && newTime == -1) {
            var rest = {
              type: "rest",
              intensity: 0,
              time: updatedPlaylistData[0][i].replaced_rest
            }
            updatedPlaylistData[0][i] = rest;
          
        }

        //if user wants to replace rest for cardio
        else if(updatedPlaylistData[0][i].type == "rest" && changeForCardio)
        {
          // This does all filtering and updating code is in algorithm.js
          var previous_rest = updatedPlaylistData[0][i].time; 
          getCardio(i, previous_rest); 
        }

      }
      state.playlistData = [] // empties the playlist
      state.playlistData = updatedPlaylistData[0]; // saves updated playlist into original playlist attribute
    }
  }
});

//const { actions, reducer } = playlistSlice;
export const { addPlaylist, initialisePlaylist, inputToPlaylist, removeFromPlaylist, updateSaved, updateLoaded, moveDownExercise, moveUpExercise, updateRest, calculatePlaylistTime } = playlistSlice.actions;

const playlistPersistConfig = {
  key: 'playlist',
  storage: storage,
  whitelist: ['playlistData', 'playlistSaved']
};

export const persistedPlaylistReducer = persistReducer(playlistPersistConfig, playlistSlice.reducer);


//export default reducer;
//export { addPlaylist, initialisePlaylist, inputToPlaylist, removeFromPlaylist, updateSaved};
