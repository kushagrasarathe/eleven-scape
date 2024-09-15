import { THistory, Voice } from '../server';

export interface AudioAnnotation {
  id: string;
  time: number;
  text: string;
}

export type TAppState = {
  userVoiceHistory: THistory[];
  generatedAudio: string | null;
  voices: Voice[];
  selectedVoice: Voice | null;
  currentlyPlayingId: string | null;
  audioAnnotations: {
    [time: number]: AudioAnnotation[];
  };
  historyItemAudios: Record<string, string>;
};
