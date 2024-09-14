import { AudioAnnotation, TAppState } from '@/types/redux/app-state';
import { Voice } from '@/types/server';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { APP } from '../constants';

const initialState: TAppState = {
  voices: [],
  generatedAudio: null,
  selectedVoice: null,
  currentlyPlayingId: null,
  audioAnnotations: {},
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

    setSelectedVoice: (state, action: PayloadAction<Voice | null>) => {
      state.selectedVoice = action.payload;
    },

    setCurrentlyPlayingId: (state, action: PayloadAction<string | null>) => {
      state.currentlyPlayingId = action.payload;
    },

    addAudioAnnotation: (state, action: PayloadAction<AudioAnnotation>) => {
      const { id, time, text } = action.payload;
      if (!state.audioAnnotations[time]) {
        state.audioAnnotations[time] = [];
      }
      state.audioAnnotations[time].push({ id, text, time });
    },

    removeAudioAnnotation: (
      state,
      action: PayloadAction<{ time: number; id: string }>
    ) => {
      const { time, id } = action.payload;
      if (state.audioAnnotations[time]) {
        state.audioAnnotations[time] = state.audioAnnotations[time].filter(
          (annotation) => annotation.id !== id
        );
        if (state.audioAnnotations[time].length === 0) {
          delete state.audioAnnotations[time];
        }
      }
    },
  },
});

export const appActions = appSlice.actions;
export default appSlice.reducer;
