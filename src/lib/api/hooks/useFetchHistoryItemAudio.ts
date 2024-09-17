import { HISTORY_ITEM_AUDIO } from '@/lib/constants';
import { elevenlabsRequestHeaders } from '@/lib/constants/api';
import { useAppDispatch } from '@/redux/hooks';
import { appActions } from '@/redux/slices/app-slice';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { _1Min } from '../../../redux/constants/time';

export const useFetchHistoryItemAudio = (
  history_id: string,
  dependsOn = true
) => {
  const dispatch = useAppDispatch();

  const fetchHistoryItemAudio = async () => {
    const { data } = await axios.get<Blob>(
      `https://api.elevenlabs.io/v1/history/${history_id}/audio`,
      {
        headers: elevenlabsRequestHeaders,
        responseType: 'arraybuffer',
      }
    );

    return data;
  };

  function onSuccess(resp: ArrayBuffer) {
    const blob = new Blob([resp], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(blob);
    dispatch(
      appActions.setHistoryItemAudios({
        historyItemId: history_id,
        audio: audioUrl,
      })
    );
  }

  // on Error
  function onError(error: AxiosError) {
    throw error;
  }

  return useQuery({
    queryKey: [HISTORY_ITEM_AUDIO],
    queryFn: fetchHistoryItemAudio,
    keepPreviousData: true,
    onSuccess,
    onError,
    retry: 0,
    staleTime: 15 * _1Min,
    cacheTime: 20 * _1Min,
    enabled: dependsOn,
  });
};
