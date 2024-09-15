'use client';
import { useFetchHistoryItemAudio } from '@/lib/api/hooks/useFetchHistoryItemAudio';
import { usePathname } from 'next/navigation';

export default function ListAudionnotaions() {
  const path = usePathname();
  const audioId = path.split('/').pop() as string;
  const { data } = useFetchHistoryItemAudio(audioId);
  return <div>{audioId}</div>;
}
