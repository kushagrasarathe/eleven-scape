'use client';
import AudioPlayer from '@/components/audio-player';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFetchVoices } from '@/lib/api/hooks/useFetchVoices';
import { cn, getRandomColor } from '@/lib/utils';
import { useAppStore } from '@/redux/hooks';
import { Voice } from '@/types/server';
import { useMemo, useState } from 'react';

interface VoiceSelectItemProps {
  voice: Voice;
  onSelect: () => void;
  currentlyPlayingId: string | null;
  setCurrentlyPlayingId: (id: string | null) => void;
}

export default function SelectVoice() {
  const { voices } = useAppStore();
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(
    null
  );

  const { data, isFetching } = useFetchVoices(1, 50, !voices.length);

  const filteredVoices = useMemo(() => {
    if (!searchValue) return voices;
    return voices.filter((voice) =>
      voice.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [voices, searchValue]);

  const handleVoiceSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleVoiceSelect = (voice: Voice) => {
    setSelectedVoice(voice);
  };

  return (
    <div className="relative w-8/12 max-w-[450px]">
      <Select
        value={selectedVoice?.voice_id}
        onValueChange={(val) => {
          const voice = voices.find((v) => v.voice_id === val);
          if (voice) setSelectedVoice(voice);
        }}
      >
        <SelectTrigger className="w-full max-w-[450px] rounded-3xl">
          <SelectValue placeholder="Select a voice" className="w-full">
            {selectedVoice ? selectedVoice.name : 'Select a voice'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="relative max-h-96 max-w-[450px] overflow-y-auto rounded-3xl">
          <Input
            value={searchValue}
            onChange={handleVoiceSearch}
            placeholder="Search voices"
            className="border-b-1 sticky -left-0.5 -top-1 mb-1 w-full rounded-none border-x-0 border-t-0 text-sm"
          />
          {isFetching && (
            <div className="flex items-center justify-center py-2 text-sm text-gray-700">
              <span>Loading...</span>
            </div>
          )}
          {filteredVoices.map((voice: Voice) => (
            <VoiceSelectItem
              key={voice.voice_id}
              voice={voice}
              onSelect={() => handleVoiceSelect(voice)}
              currentlyPlayingId={currentlyPlayingId}
              setCurrentlyPlayingId={setCurrentlyPlayingId}
            />
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

const VoiceSelectItem: React.FC<VoiceSelectItemProps> = ({
  voice,
  onSelect,
  currentlyPlayingId,
  setCurrentlyPlayingId,
}) => {
  const gradientStyle = useMemo(
    () => ({
      background: `linear-gradient(to right, ${getRandomColor()}, ${getRandomColor()})`,
    }),
    [voice.voice_id]
  );

  const handleItemClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('.audio-player')) {
      onSelect();
    }
  };

  const handleAudioToggle = (isPlaying: boolean) => {
    if (isPlaying) {
      setCurrentlyPlayingId(voice.voice_id);
    } else if (currentlyPlayingId === voice.voice_id) {
      setCurrentlyPlayingId(null);
    }
  };

  return (
    <div
      className="flex cursor-pointer items-center gap-2 px-2 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800"
      onClick={handleItemClick}
    >
      <div className="group">
        <div
          className={cn(
            currentlyPlayingId === voice.voice_id && 'hidden',
            'size-7 rounded-full border border-slate-200 group-hover:hidden'
          )}
          style={gradientStyle}
        />
        <div
          className={cn(
            currentlyPlayingId === voice.voice_id
              ? 'flex'
              : 'hidden group-hover:flex',
            'audio-player'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <AudioPlayer
            className="z-50"
            src={voice.preview_url as string}
            isGloballyPlaying={currentlyPlayingId === voice.voice_id}
            onPlayingChange={handleAudioToggle}
          />
        </div>
      </div>
      <div className="w-3/12 flex-grow truncate text-sm">{voice.name}</div>
      {voice?.use_case && (
        <Badge
          variant={'outline'}
          className="bg-gray-100 font-normal capitalize"
        >
          {voice.use_case.split('_').join(' ')}
        </Badge>
      )}
    </div>
  );
};
