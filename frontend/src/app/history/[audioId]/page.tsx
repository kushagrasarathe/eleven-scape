'use client';
import { Loading } from '@/components/loading';
import WaveAudioPlayer from '@/components/wave-audio-player';
import { useFetchHistoryItemAudio } from '@/lib/api/hooks/useFetchHistoryItemAudio';
import { useAppStore } from '@/redux/hooks';
import { usePathname } from 'next/navigation';

export default function AudioHistoryPage() {
  const { historyItemAudios } = useAppStore();
  const path = usePathname();
  const audioId = path.split('/').pop() as string;
  const { data, isFetching } = useFetchHistoryItemAudio(audioId, !!audioId);

  const audio = historyItemAudios[audioId];

  if (isFetching) {
    return <Loading />;
  }

  return (
    <div>
      <WaveAudioPlayer audio={audio} audioVersionId={audioId} />
    </div>
  );
}
