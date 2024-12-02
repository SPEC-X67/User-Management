import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/userSlice';

const store = configureStore({
    reducer: {
        users: userReducer
    }
});

export default store;