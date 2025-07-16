import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import { thunk } from 'redux-thunk';
import storage from 'redux-persist/lib/storage';
import userReducer from "../redux/userSlice";

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    blacklist: ['navigation']
}

const reducer = combineReducers({
    user: userReducer,
    
});

const persistedReducer = persistReducer(persistConfig, reducer)

export const store = configureStore({
    reducer: persistedReducer,
    devTools: true,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
})

export const persistor = persistStore(store)
