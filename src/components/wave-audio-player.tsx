import AnnotationManager from '@/components/annotaion-manager';
import {
  useAddAnnotationMutation,
  useFetchAnnotations,
} from '@/lib/api/hooks/useAnnotations';
import { useAppStore } from '@/redux/hooks';
import { AudioAnnotation } from '@/types/redux/app-state';
import React, { useCallback, useMemo, useState } from 'react';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
import WaveFormPlayer from './wave-form-player';

interface WaveAudioPlayerProps {
  audio: string | Blob;
  audioVersionId: string;
}

function WaveAudioPlayer({ audio, audioVersionId }: WaveAudioPlayerProps) {
  const { allAnnotations } = useAppStore();
  const [currentTime, setCurrentTime] = useState(0);
  const [regions, setRegions] = useState<RegionsPlugin | null>(null);

  const { mutateAsync: addAnnotation, isLoading: isAddingAnnotation } =
    useAddAnnotationMutation(audioVersionId);

  const { data: fetchedAnnotations, isLoading: isFetchingAnnotations } =
    useFetchAnnotations(audioVersionId);

  const audioAnnotations = useMemo(
    () => allAnnotations[audioVersionId] || {},
    [allAnnotations, audioVersionId]
  );

  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  const handleAnnotationAdded = useCallback(
    (annotation: AudioAnnotation) => {
      addAnnotation(annotation);
    },
    [addAnnotation]
  );

  const handleRegionsUpdated = useCallback((updatedRegions: RegionsPlugin) => {
    setRegions(updatedRegions);
  }, []);

  return (
    <div className="space-y-5">
      <WaveFormPlayer
        audio={audio}
        onTimeUpdate={handleTimeUpdate}
        onRegionsUpdated={handleRegionsUpdated}
      />
      <AnnotationManager
        audioAnnotations={audioAnnotations}
        onAnnotationAdded={handleAnnotationAdded}
        currentTime={currentTime}
        regions={regions}
        isFetchingAnnotations={isFetchingAnnotations}
        isAddingAnnotation={isAddingAnnotation}
      />
    </div>
  );
}

export default React.memo(WaveAudioPlayer);
