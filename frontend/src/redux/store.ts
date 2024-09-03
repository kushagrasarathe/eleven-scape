import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/app-slice';

const store = configureStore({
  reducer: {
    app: appReducer,
  },
});

export default store;
