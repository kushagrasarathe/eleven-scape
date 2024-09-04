import { TAppState } from '@/types/redux/app-state';
import { Voice } from '@/types/server';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { APP } from '../constants';

const initialState: TAppState = {
  voices: [],
  generatedAudio: null,
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

    setGeneratedAudio(state, action: PayloadAction<string>) {
      state.generatedAudio = action.payload;
    },
  },
});

export const appActions = appSlice.actions;
export default appSlice.reducer;
