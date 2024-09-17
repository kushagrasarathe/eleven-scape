import { TAnnotation } from '@/lib/db/schema';
import { THistory, Voice } from '../server';

export interface AudioAnnotation {
  id: string;
  text: string;
  annotationTimeframe: number;
}

export interface Annotation {
  [time: number]: TAnnotation[];
}

export type TAppState = {
  audioHref: string | null;
  userVoiceHistory: THistory[];
  latestGeneratedAudioId: string | null;
  generatedAudio: string | null;
  voices: Voice[];
  selectedVoice: Voice | null;
  currentlyPlayingId: string | null;
  allAnnotations: { [audioId: string]: Annotation };
  historyItemAudios: Record<string, string>;
};
