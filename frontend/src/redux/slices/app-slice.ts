import { TAppState } from '@/types/redux/app-state';
import { Voice } from '@/types/server';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { APP } from '../constants';

const initialState: TAppState = {
  voices: [],
};

const appSlice = createSlice({
  name: APP,
  initialState,
  reducers: {
    setAllVoices: (state, action: PayloadAction<Voice[]>) => {
      return {
        ...state,
        voices: action.payload,
      };
    },
    // setAllVoices: (
    //   state,
    //   action: PayloadAction<{ key: string; voices: Voice[] }>
    // ) => {
    //   const { key, voices } = action.payload;
    //   const updatedVoices = {
    //     ...state.allVoices,
    //     [key]: voices,
    //   };
    //   return {
    //     ...state,
    //     allVoices: updatedVoices,
    //   };
    // },
  },
});

export const appActions = appSlice.actions;
export default appSlice.reducer;
