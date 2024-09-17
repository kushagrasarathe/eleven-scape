import { GENERATE_TEXT_TO_SPEECH } from '@/lib/constants';
import { elevenlabsRequestHeaders } from '@/lib/constants/api';
import { TGenerateSpeechSchema } from '@/lib/validations/generate-speech';
import { useAppDispatch } from '@/redux/hooks';
import { appActions } from '@/redux/slices/app-slice';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';

export const useGenerateTextToSpeechMutation = (voice_id: string) => {
  const dispatch = useAppDispatch();

  const generateTextToSpeech = async (payload: TGenerateSpeechSchema) => {
    const response: AxiosResponse<ArrayBuffer> = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`,
      JSON.stringify(payload),
      {
        headers: elevenlabsRequestHeaders,
        responseType: 'arraybuffer',
      }
    );

    return {
      data: response.data,
      headers: response.headers,
    };
  };

  function onSuccess(resp: { data: ArrayBuffer; headers: any }) {
    const blob = new Blob([resp.data], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(blob);
    dispatch(appActions.setGeneratedAudio(audioUrl));

    const historyItemId = resp.headers['history-item-id'];
    if (historyItemId) {
      dispatch(appActions.setLatestGeneratedAudioId(historyItemId));
    }
  }

  function onError(error: AxiosError) {
    console.error('Error generating speech:', error);
  }

  return useMutation({
    mutationKey: [GENERATE_TEXT_TO_SPEECH],
    mutationFn: generateTextToSpeech,
    onSuccess,
    onError,
    retry: 0,
  });
};
