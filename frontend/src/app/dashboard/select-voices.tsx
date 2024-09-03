'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/redux/hooks';
import { Voice } from '@/types/server';

export default function SelectVoices() {
  const { voices } = useAppStore();
  // const { data, isFetching } = useFetchVoices(1, 50, !voices.length);

  console.log('allVoices', voices);

  return (
    <div className="relative p-4">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a voice" />
        </SelectTrigger>
        <SelectContent className="max-h-60 overflow-y-auto py-3">
          {/* {isFetching && <SelectItem value="loading">Loading...</SelectItem>} */}
          {voices.map((voice: Voice) => (
            <SelectItem key={voice.voice_id} value={voice.voice_id}>
              {voice.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
