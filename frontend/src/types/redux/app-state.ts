import { Voice } from '../server';

export type TAppState = {
  generatedAudio: string | null;
  voices: Voice[];
  selectedVoice: Voice | null;
  currentlyPlayingId: string | null;
};
