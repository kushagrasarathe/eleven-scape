import { TAnnotation } from '@/lib/db/schema';
import { TAppState } from '@/types/redux/app-state';
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
  allAnnotations: {},
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

    setAllAnnotations: (
      state,
      action: PayloadAction<{ audioId: string; annotations: TAnnotation[] }>
    ) => {
      const { audioId, annotations } = action.payload;
      if (!state.allAnnotations[audioId]) {
        state.allAnnotations[audioId] = {};
      }
      const updatedAnnotations: Record<number, TAnnotation[]> = {};

      annotations.forEach((annotation) => {
        const timeframe = parseFloat(annotation.annotationTimeframe);
        if (!updatedAnnotations[timeframe]) {
          updatedAnnotations[timeframe] = [];
        }

        const existingIndex = updatedAnnotations[timeframe].findIndex(
          (a) => a.id === annotation.id
        );

        if (existingIndex === -1) {
          updatedAnnotations[timeframe].push(annotation);
        } else {
          updatedAnnotations[timeframe][existingIndex] = annotation;
        }
      });

      state.allAnnotations[audioId] = updatedAnnotations;
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
