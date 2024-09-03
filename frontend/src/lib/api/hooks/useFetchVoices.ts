import { VOICES } from '@/lib/constants';
import { useAppDispatch } from '@/redux/hooks';
import { appActions } from '@/redux/slices/app-slice';
import { TVoices } from '@/types/server';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { _1Min } from './time';

export const useFetchVoices = (
  page: number,
  size: number,
  dependsOn = true
) => {
  const dispatch = useAppDispatch();

  const fetchVoices = async () => {
    const { data } = await axios.get<TVoices>(`/api/voices`);

    return data;
  };

  function onSuccess(resp?: TVoices) {
    if (!!resp?.voices) {
      dispatch(appActions.setAllVoices(resp?.voices));
      // dispatch(
      //   appActions.setAllVoices({
      //     key: `${page}`,
      //     voices: resp?.voices,
      //   })
      // );
    }
  }

  // on Error
  function onError(error: AxiosError) {}

  return useQuery({
    queryKey: [VOICES, page, size],
    queryFn: fetchVoices,
    keepPreviousData: true,
    onSuccess,
    onError,
    retry: 0,
    staleTime: 15 * _1Min,
    cacheTime: 20 * _1Min,
    enabled: dependsOn,
  });
};
