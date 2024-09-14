import { cn, getRandomColor } from '@/lib/utils';
import { useAppStore } from '@/redux/hooks';
import { appActions } from '@/redux/slices/app-slice';
import {
  Loader2,
  PauseIcon,
  PlayIcon,
  Plus,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.js';
import { Badge } from './ui/badge';
import { ButtonIcon } from './ui/button-icon';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { Slider } from './ui/slider';

interface WaveAudioPlayerProps {
  audio: string | Blob;
}

export default function WaveAudioPlayer({ audio }: WaveAudioPlayerProps) {
  const dispatch = useDispatch();
  const { audioAnnotations } = useAppStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const regionsRef = useRef<RegionsPlugin | null>(null);
  const [playing, setPlaying] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [audioReady, setAudioReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [newAnnotation, setNewAnnotation] = useState('');
  const [activeAnnotation, setActiveAnnotation] = useState<string | null>(null);

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
        renderAnnotations();
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
  }, [audio]);

  useEffect(() => {
    initializeWaveSurfer();
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, [initializeWaveSurfer]);

  useEffect(() => {
    if (audioReady && wavesurferRef.current) {
      wavesurferRef.current.zoom(zoom);
    }
  }, [zoom, audioReady]);

  const renderAnnotations = useCallback(() => {
    if (!wavesurferRef.current || !regionsRef.current) return;

    regionsRef.current.clearRegions();

    Object.entries(audioAnnotations).forEach(([time, annotations]) => {
      const color = getRandomColor();
      const region = regionsRef.current!.addRegion({
        start: parseFloat(time),
        end: parseFloat(time) + 0.1,
        color: color,
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
      tooltip.innerHTML = annotations.map((a) => a.text).join('<br>');

      region.element.appendChild(tooltip);
      region.element.addEventListener('mouseenter', () => {
        tooltip.style.cursor = 'pointer';
        setActiveAnnotation(time);
      });
      region.element.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
        setActiveAnnotation(null);
      });
      region.element.addEventListener('click', () => {
        setActiveAnnotation(time);
      });
    });
  }, [audioAnnotations]);

  useEffect(() => {
    if (audioReady) {
      renderAnnotations();
    }
  }, [audioAnnotations, audioReady, renderAnnotations]);

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

  const handleAddAnnotation = useCallback(() => {
    if (newAnnotation.trim() && wavesurferRef.current) {
      const time = wavesurferRef.current.getCurrentTime();
      const id = Date.now().toString();
      dispatch(
        appActions.addAudioAnnotation({ id, time, text: newAnnotation.trim() })
      );
      setNewAnnotation('');
    }
  }, [dispatch, newAnnotation]);

  const annotationCards = useMemo(
    () =>
      Object.entries(audioAnnotations).map(([time, annotations]) => (
        <Card
          key={time}
          className={cn(
            'flex min-w-64 transform flex-col items-start justify-between space-y-3 rounded px-2 py-3 transition-all ease-in-out',
            activeAnnotation === time
              ? 'scale-[1.01] bg-gray-50/90 shadow-lg'
              : ''
          )}
        >
          <div className="flex flex-col items-start gap-3">
            {annotations.map((annotation, idx) => (
              <>
                <div
                  className="line-clamp-2 text-sm text-gray-700 hover:line-clamp-none hover:cursor-pointer"
                  key={annotation.id}
                >
                  {annotation.text}
                </div>
                {idx !== annotations.length - 1 && <Separator />}
              </>
            ))}
          </div>
          <div className="flex w-full items-center justify-between gap-2">
            <div>Timestamp:</div>
            <Badge className="mt-auto px-4">
              {parseFloat(time).toFixed(2)}s
            </Badge>
          </div>
        </Card>
      )),
    [audioAnnotations, activeAnnotation]
  );

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
      <div className="space-y-2">
        <div className="text-lg font-semibold">Add a note</div>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={newAnnotation}
            onChange={(e) => setNewAnnotation(e.target.value)}
            placeholder="Add a note..."
            disabled={!audioReady}
          />
          <ButtonIcon
            icon={Plus}
            onClick={handleAddAnnotation}
            disabled={!audioReady || !newAnnotation.trim()}
            aria-label="Add annotation"
          />
        </div>
      </div>
      <div>
        {!!Object.entries(audioAnnotations).length && (
          <div className="space-y-2">
            <div className="text-lg font-semibold">Annotations</div>
            <div className="grid grid-cols-4 gap-2 *:col-span-1">
              {annotationCards}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
