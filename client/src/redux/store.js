import { configureStore } from '@reduxjs/toolkit';
import adminSlice from './reducers/admin/adminSlice'
import userSlice from './reducers/user/userSlice'

const store = configureStore({
    reducer: {
        admin: adminSlice,
        user: userSlice,
    }
});

export default store;