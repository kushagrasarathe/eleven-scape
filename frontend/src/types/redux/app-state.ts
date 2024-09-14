import { Voice } from '../server';

export interface AudioAnnotation {
  id: string;
  time: number;
  text: string;
}

export type TAppState = {
  generatedAudio: string | null;
  voices: Voice[];
  selectedVoice: Voice | null;
  currentlyPlayingId: string | null;
  audioAnnotations: {
    [time: number]: AudioAnnotation[];
  };
};
