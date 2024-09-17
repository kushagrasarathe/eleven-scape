import { USER_GENERATED_VOICES } from '@/lib/constants';
import { elevenlabsRequestHeaders } from '@/lib/constants/api';
import { useAppDispatch } from '@/redux/hooks';
import { appActions } from '@/redux/slices/app-slice';
import { THistoryResponse } from '@/types/server';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { _1Min } from '../../../redux/constants/time';

export const useFetchUserGeneratedVoices = (dependsOn = true) => {
  const dispatch = useAppDispatch();

  const fetchUserGeneratedVoices = async () => {
    const { data } = await axios.get<THistoryResponse>(
      `https://api.elevenlabs.io/v1/history`,
      {
        headers: elevenlabsRequestHeaders,
      }
    );

    return data;
  };

  function onSuccess(resp?: THistoryResponse) {
    if (!!resp?.history.length) {
      dispatch(appActions.setUserVoiceHistory(resp?.history));
    }
  }

  // on Error
  function onError(error: AxiosError) {
    throw error;
  }

  return useQuery({
    queryKey: [USER_GENERATED_VOICES],
    queryFn: fetchUserGeneratedVoices,
    keepPreviousData: true,
    onSuccess,
    onError,
    retry: 0,
    staleTime: 15 * _1Min,
    cacheTime: 20 * _1Min,
    enabled: dependsOn,
  });
};
