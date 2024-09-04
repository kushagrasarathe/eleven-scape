'use client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useGenerateTextToSpeechMutation } from '@/lib/api/hooks/useGenerateTextToSpeech';
import { useAppStore } from '@/redux/hooks';
import SelectVoice from './select-voice';

export default function TextToSpeech() {
  const { generatedAudio } = useAppStore();

  const {
    mutateAsync: generateSpeech,
    isLoading: isGeneratingSpeech,
    isSuccess: isAudioGenerated,
  } = useGenerateTextToSpeechMutation('21m00Tcm4TlvDq8ikWAM');

  return (
    <>
      <div className="relative z-10 mx-auto overflow-hidden rounded-xl border border-black/10 bg-white/85 pt-0 shadow backdrop-blur-lg transition-colors focus-within:!border-black md:max-w-3xl">
        <div className="stack gap-3 rounded-2xl p-3.5">
          <Textarea
            placeholder="Start typing here or paste any text you want to turn into lifelike speech."
            className="text-md placeholder:text-light flex-1 resize-none rounded-none border-none bg-transparent p-1 focus-visible:outline-none focus-visible:ring-0 lg:flex-none"
          />
        </div>
        <div className="relative flex items-center justify-between px-4 pb-4">
          <SelectVoice />

          <Button
            disabled={isGeneratingSpeech}
            // onClick={() =>
            //   generateSpeech({
            //     text: `I'm Kushagra`,
            //   })
            // }
          >
            Generate
          </Button>
        </div>
        {isAudioGenerated && !isGeneratingSpeech && generatedAudio && (
          <div className="bg-response-body flex h-full items-center rounded-b-xl p-12">
            <audio
              controls={true}
              className="w-full"
              src={generatedAudio}
            ></audio>
          </div>
        )}
      </div>
    </>
  );
}
