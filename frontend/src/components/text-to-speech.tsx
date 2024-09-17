'use client';
import { ButtonIcon } from '@/components/ui/button-icon';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useCreateVoiceHistory } from '@/lib/api/hooks/useCreateVoiceHistory';
import { useGenerateTextToSpeechMutation } from '@/lib/api/hooks/useGenerateTextToSpeech';
import {
  GenerateSpeechSchema,
  TGenerateSpeechSchema,
} from '@/lib/validations/generate-speech';
import { useAppStore } from '@/redux/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import ListUserGeneratedVoices from './list-user-generated-voices';
import SelectVoice from './select-voice';

export default function TextToSpeech() {
  const { generatedAudio, selectedVoice } = useAppStore();

  const {
    mutateAsync: generateSpeech,
    isLoading: isGeneratingSpeech,
    isSuccess: isAudioGenerated,
  } = useGenerateTextToSpeechMutation(selectedVoice?.voice_id as string);

  const {
    mutateAsync: createVoiceHistory,
    isLoading: isAddingVoiceHistory,
    error: voiceHistoryError,
  } = useCreateVoiceHistory();

  const form = useForm<TGenerateSpeechSchema>({
    resolver: zodResolver(GenerateSpeechSchema),
  });

  async function onSubmit(data: TGenerateSpeechSchema) {
    if (!selectedVoice) {
      toast.error('Please select a voice');
      return;
    }
    if (!data.text.length) {
      toast.error('Please enter some text');
      return;
    }

    try {
      const generateSpeechResult = await generateSpeech(data);

      const historyItemId = generateSpeechResult.headers['history-item-id'];

      const voiceHistoryData = {
        id: crypto.randomUUID(),
        voice_id: selectedVoice.voice_id,
        voice_name: selectedVoice.name,
        text: data.text,
        version: 1,
        is_latest: true,
        eleven_labs_history_item_id: historyItemId,
      };

      await createVoiceHistory(voiceHistoryData);
    } catch (error) {
      console.error('Error in text-to-speech process:', error);
      toast.error('An error occurred during the text-to-speech process');
    }
  }
  const isProcessingRequest = isGeneratingSpeech || isAddingVoiceHistory;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="text-xl font-semibold">Text-to-speech</div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="relative z-10 mx-auto overflow-hidden rounded-xl border border-black/10 bg-white/85 pt-0 shadow backdrop-blur-lg transition-colors focus-within:!border-black">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="gap-3 rounded-2xl p-3.5">
                        <Textarea
                          id="text"
                          {...field}
                          placeholder="Start typing here or paste any text you want to turn into lifelike speech."
                          className="text-md placeholder:text-light min-h-44 flex-1 resize-none rounded-none border-none bg-transparent p-1 focus-visible:outline-none focus-visible:ring-0 lg:flex-none"
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="relative flex items-center justify-between px-4 pb-4">
                <SelectVoice />

                <ButtonIcon
                  disabled={isProcessingRequest}
                  type="submit"
                  variant={'default'}
                  className="min-w-32 rounded-full"
                  state={isProcessingRequest ? 'loading' : 'default'}
                >
                  Generate
                </ButtonIcon>
              </div>
              {/* {isAudioGenerated && !isGeneratingSpeech && generatedAudio && (
                <div className="bg-response-body flex h-full items-center rounded-b-xl p-12">
                  <audio
                    controls={true}
                    className="w-full"
                    src={generatedAudio}
                  ></audio>
                </div>
              )} */}
            </div>
          </form>
        </Form>
      </div>

      <ListUserGeneratedVoices />
      {/* {generatedAudio && <WaveAudioPlayer audio={generatedAudio} />} */}
      {/* <WaveAudioPlayer audio="/alone.mp3" /> */}
    </div>
  );
}
