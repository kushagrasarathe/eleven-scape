import { Voice } from '../server';

export type TAppState = {
  generatedAudio: string | null;
  voices: Voice[];
};
