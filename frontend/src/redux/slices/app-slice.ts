import { AudioAnnotation, TAppState } from '@/types/redux/app-state';
import { THistory, Voice } from '@/types/server';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { APP } from '../constants';

const initialState: TAppState = {
  userVoiceHistory: [],
  voices: [],
  generatedAudio: null,
  latestGeneratedAudioId: null,
  selectedVoice: null,
  currentlyPlayingId: null,
  audioAnnotations: {},
  historyItemAudios: {},
};

const appSlice = createSlice({
  name: APP,
  initialState,
  reducers: {
    setUserVoiceHistory: (state, action: PayloadAction<THistory[]>) => {
      return {
        ...state,
        userVoiceHistory: action.payload,
      };
    },

    setAllVoices: (state, action: PayloadAction<Voice[]>) => {
      return {
        ...state,
        voices: action.payload,
      };
    },

    setGeneratedAudio(state, action: PayloadAction<string>) {
      state.generatedAudio = action.payload;
    },

    setLatestGeneratedAudioId(state, action: PayloadAction<string>) {
      state.latestGeneratedAudioId = action.payload;
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

    setHistoryItemAudios: (
      state,
      action: PayloadAction<{ historyItemId: string; audio: string }>
    ) => {
      const { historyItemId, audio } = action.payload;
      state.historyItemAudios[historyItemId] = audio;
    },
  },
});

export const appActions = appSlice.actions;
export default appSlice.reducer;
