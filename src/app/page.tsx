import ListUserGeneratedVoices from '@/components/list-user-generated-voices';
import TextToSpeechForm from '@/components/text-to-speech-form';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <TextToSpeechForm />
      <ListUserGeneratedVoices />
    </div>
  );
}
