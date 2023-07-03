import { configureStore } from '@reduxjs/toolkit'
import { persistedPlaylistReducer} from './slices/playlistSlice'
import selectReducer from './slices/selectSlice'
import { persistStore, persistReducer } from 'redux-persist';
import {persistedSelectReducer} from './slices/selectSlice'
import thunk from 'redux-thunk'

// configure global store 
export const store = configureStore({
  reducer: {
    //select: selectReducer,
    select: persistedSelectReducer,
    playlist: persistedPlaylistReducer,
  },
  middleware: [thunk]
});

export const persistor = persistStore(store);