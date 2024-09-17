import { AnnotationManager } from '@/app/history/[audioId]/annotaion-manager';
import {
  useAddAnnotationMutation,
  useFetchAnnotations,
} from '@/lib/api/hooks/useAnnotations';
import { useAppStore } from '@/redux/hooks';
import { AudioAnnotation } from '@/types/redux/app-state';
import {
  Loader2,
  PauseIcon,
  PlayIcon,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.js';
import { ButtonIcon } from './ui/button-icon';
import { Card } from './ui/card';
import { Slider } from './ui/slider';

interface WaveAudioPlayerProps {
  audio: string | Blob;
  audioVersionId: string;
}

export default function WaveAudioPlayer({
  audio,
  audioVersionId,
}: WaveAudioPlayerProps) {
  const dispatch = useDispatch();
  const { allAnnotations } = useAppStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const regionsRef = useRef<RegionsPlugin | null>(null);
  const [playing, setPlaying] = useState(false);
  const [zoom, setZoom] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [audioReady, setAudioReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioAnnotations = allAnnotations[audioVersionId] || [];

  const { mutateAsync: addAnnotation, isLoading: isAddingAnnotation } =
    useAddAnnotationMutation(audioVersionId);
  const { data, isLoading: isFetchingAnnotations } =
    useFetchAnnotations(audioVersionId);

  const initializeWaveSurfer = useCallback(async () => {
    setLoading(true);
    setError(null);
    setAudioReady(false);

    if (!containerRef.current) return;

    try {
      const regions = RegionsPlugin.create();
      regionsRef.current = regions;

      const wavesurfer = WaveSurfer.create({
        container: containerRef.current,
        url: audio instanceof Blob ? URL.createObjectURL(audio) : audio,
        minPxPerSec: zoom,
        height: 100,
        plugins: [
          regions,
          TimelinePlugin.create({
            container: '#timeline',
          }),
        ],
      });

      wavesurferRef.current = wavesurfer;

      wavesurfer.on('ready', () => {
        setLoading(false);
        setAudioReady(true);
      });

      wavesurfer.on('error', (err) => {
        console.error('WaveSurfer error:', err);
        setError(`Error: ${err}`);
        setLoading(false);
      });

      wavesurfer.on('play', () => setPlaying(true));
      wavesurfer.on('pause', () => setPlaying(false));
      wavesurfer.on('finish', () => setPlaying(false));
      wavesurfer.on('timeupdate', (time) => setCurrentTime(time));

      await wavesurfer.load(
        audio instanceof Blob ? URL.createObjectURL(audio) : audio
      );
    } catch (err) {
      console.error('Error initializing WaveSurfer:', err);
      setError(`Error initializing audio player: ${err}`);
      setLoading(false);
    }
  }, [audio, zoom]);

  const handlePlayPause = useCallback(() => {
    if (audioReady && wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  }, [audioReady]);

  const handleSkip = useCallback(
    (seconds: number) => {
      if (audioReady && wavesurferRef.current) {
        wavesurferRef.current.skip(seconds);
      }
    },
    [audioReady]
  );

  const handleZoomChange = useCallback((value: number[]) => {
    setZoom(value[0]);
  }, []);

  const handleAnnotationAdded = useCallback(
    (annotation: AudioAnnotation) => {
      addAnnotation(annotation);
    },
    [dispatch]
  );

  useEffect(() => {
    initializeWaveSurfer();
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, [initializeWaveSurfer]);

  useEffect(() => {
    if (audioReady && wavesurferRef.current && !!wavesurferRef.current?.zoom) {
      wavesurferRef.current?.zoom(zoom!);
    }
  }, [zoom, audioReady]);

  useEffect(() => {
    if (audioReady && wavesurferRef.current && regionsRef.current) {
      regionsRef.current.clearRegions();

      Object.entries(audioAnnotations).forEach(([timeframe, annotations]) => {
        const region = regionsRef.current!.addRegion({
          start: parseFloat(timeframe),
          end: parseFloat(timeframe) + 0.1,
          color: 'rgba(0, 123, 255, 0.3)',
          drag: false,
          resize: false,
        });

        const tooltip = document.createElement('div');
        tooltip.className = 'annotation-tooltip';
        tooltip.style.cssText = `
          position: absolute;
          bottom: 100%;
          left: 0;
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 5px;
          border-radius: 3px;
          font-size: 12px;
          white-space: nowrap;
          display: none;
        `;
        tooltip.innerHTML = annotations.map((a: any) => a.text).join('<br>');

        region.element.appendChild(tooltip);
        region.element.addEventListener('mouseenter', () => {
          tooltip.style.display = 'block';
        });
        region.element.addEventListener('mouseleave', () => {
          tooltip.style.display = 'none';
        });
      });
    }
  }, [audioReady, audioAnnotations]);

  return (
    <div className="space-y-5">
      {loading && (
        <div className="w-full">
          <Loader2 className="mx-auto size-4 animate-spin" />
        </div>
      )}
      <div className="relative">
        <Card ref={containerRef} className="h-auto"></Card>
      </div>
      <div id="timeline"></div>
      <Slider
        className=""
        disabled={!audioReady}
        min={10}
        max={1000}
        value={[zoom]}
        onValueChange={handleZoomChange}
      />
      <div className="flex items-center justify-center gap-3">
        <ButtonIcon
          variant={'secondary'}
          icon={SkipBack}
          onClick={() => handleSkip(-5)}
          disabled={!audioReady}
          aria-label="Backward 5s"
        />
        <ButtonIcon
          icon={playing ? PauseIcon : PlayIcon}
          onClick={handlePlayPause}
          disabled={!audioReady}
          variant={'secondary'}
        />
        <ButtonIcon
          variant={'secondary'}
          icon={SkipForward}
          onClick={() => handleSkip(5)}
          disabled={!audioReady}
          aria-label="Forward 5s"
        />
      </div>
      <AnnotationManager
        wavesurfer={wavesurferRef.current}
        regions={regionsRef.current}
        audioAnnotations={audioAnnotations}
        onAnnotationAdded={handleAnnotationAdded}
      />
    </div>
  );
}
