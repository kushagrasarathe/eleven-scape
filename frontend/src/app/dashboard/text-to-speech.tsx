import { Textarea } from '@/components/ui/textarea';
import SelectVoices from './select-voices';

export default function TextToSpeech() {
  return (
    <>
      <div className="relative z-10 mx-auto overflow-hidden rounded-xl border border-black/10 bg-white/85 pt-0 shadow backdrop-blur-lg transition-colors focus-within:!border-black md:max-w-3xl">
        <div className="stack gap-3 rounded-2xl p-3.5">
          <Textarea
            // placeholder="Start typing here or paste any text you want to turn into lifelike speech."
            className="text-md placeholder:text-light flex-1 resize-none rounded-none border-none bg-transparent p-1 focus-visible:outline-none focus-visible:ring-0 lg:flex-none"
          />
        </div>
        <div>
          <SelectVoices />
        </div>
      </div>
    </>
  );
}
