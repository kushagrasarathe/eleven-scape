import { CREATE_VOICE_HISTORY, USER_GENERATED_VOICES } from '@/lib/constants';
import { SelectVoiceHistory, TAudioVersions } from '@/lib/db/schema';
import { useAppDispatch } from '@/redux/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

export const useCreateVoiceHistory = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const addVoiceHistory = async (payload: TAudioVersions) => {
    const { data } = await axios.post<SelectVoiceHistory>(
      '/api/voice-history',
      payload
    );
    return data;
  };

  function onSuccess(resp: SelectVoiceHistory) {
    queryClient.invalidateQueries({
      queryKey: [CREATE_VOICE_HISTORY, USER_GENERATED_VOICES],
    });

    if (resp.eleven_labs_history_item_id) {
      router.push(`/history/${resp.eleven_labs_history_item_id}`);
    }
  }

  function onError(error: AxiosError) {
    console.error('Error creating voice history:', error);
  }

  return useMutation({
    mutationKey: [CREATE_VOICE_HISTORY],
    mutationFn: addVoiceHistory,
    onSuccess,
    onError,
    retry: 0,
  });
};
