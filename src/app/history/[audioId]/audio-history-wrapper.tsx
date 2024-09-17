'use client';

import { Loading } from '@/components/loading';
import { useFetchHistoryItemAudio } from '@/lib/api/hooks/useFetchHistoryItemAudio';
import { useAppDispatch, useAppStore } from '@/redux/hooks';
import { appActions } from '@/redux/slices/app-slice';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo } from 'react';

interface Props {
  children: React.ReactNode;
}

export default function AudioHistoryWrapper({ children }: Props) {
  const dispatch = useAppDispatch();
  const path = usePathname();
  const { historyItemAudios } = useAppStore();

  const audioId = useMemo(() => path.split('/').pop() as string, [usePathname]);
  const audio = historyItemAudios[audioId];

  const { refetch, isFetching, isRefetching } = useFetchHistoryItemAudio(
    audioId,
    !audio
  );

  useEffect(() => {
    dispatch(appActions.setAudioHref(audioId));
    if (!audio) {
      refetch();
    }
  }, [audioId, audio, dispatch, refetch]);

  if (isFetching || isRefetching) {
    return <Loading />;
  }

  return <div>{children}</div>;
}
