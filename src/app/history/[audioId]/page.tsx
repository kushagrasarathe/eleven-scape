'use client';
import WaveAudioPlayer from '@/components/wave-audio-player';
import { useAppStore } from '@/redux/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AudioHistoryPage() {
  const { historyItemAudios, audioHref } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (!audioHref) {
      router.push('/');
    }
  }, [audioHref, router]);

  if (!audioHref) {
    return <div>Loading...</div>;
  }

  const audio = historyItemAudios[audioHref];

  return (
    <div>
      <WaveAudioPlayer audio={audio} audioVersionId={audioHref} />
    </div>
  );
}
