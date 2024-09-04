import { GENERATE_TEXT_TO_SPEECH } from '@/lib/constants';
import { elevenlabsRequestHeaders } from '@/lib/constants/api';
import { useAppDispatch } from '@/redux/hooks';
import { appActions } from '@/redux/slices/app-slice';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

export const useGenerateTextToSpeechMutation = (voice_id: string) => {
  const dispatch = useAppDispatch();

  const generateTextToSpeech = async (payload: { text: string }) => {
    const { data } = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`,
      JSON.stringify(payload),
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
    dispatch(appActions.setGeneratedAudio(audioUrl));
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
