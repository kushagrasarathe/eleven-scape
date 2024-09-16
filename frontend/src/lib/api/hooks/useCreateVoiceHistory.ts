import { CREATE_VOICE_HISTORY } from '@/lib/constants';
import { InsertVoiceHistory, SelectVoiceHistory } from '@/lib/db/schema';
import { useAppDispatch } from '@/redux/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

export const useCreateVoiceHistory = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  const addVoiceHistory = async (payload: InsertVoiceHistory) => {
    const { data } = await axios.post<SelectVoiceHistory>(
      '/api/voice-history',
      payload
    );
    return data;
  };

  function onSuccess(resp: any) {
    queryClient.invalidateQueries({ queryKey: [CREATE_VOICE_HISTORY] });
    console.log(resp);
  }

  function onError(error: AxiosError) {
    console.error('Error generating speech:', error);
  }

  return useMutation({
    mutationKey: [CREATE_VOICE_HISTORY],
    mutationFn: addVoiceHistory,
    onSuccess,
    onError,
    retry: 0,
  });
};
