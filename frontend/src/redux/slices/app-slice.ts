import { TAppState } from '@/types/redux/app-state';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { APP } from '../constants';

const initialState: TAppState = {};

const appSlice = createSlice({
  name: APP,
  initialState,
  reducers: {},
});

export const appActions = appSlice.actions;
export default appSlice.reducer;
