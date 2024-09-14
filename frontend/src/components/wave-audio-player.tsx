'use client';
import {
  Loader2,
  PauseIcon,
  PlayIcon,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { ButtonIcon } from './ui/button-icon';
import { Slider } from './ui/slider';

interface WaveAudioPlayerProps {
  audio: string | Blob;
}

export default function WaveAudioPlayer({ audio }: WaveAudioPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [audioReady, setAudioReady] = useState(false);

  useEffect(() => {
    let wavesurfer: WaveSurfer | null = null;

    const initializeWaveSurfer = async () => {
      setLoading(true);
      setError(null);
      setAudioReady(false);

      if (containerRef.current) {
        try {
          wavesurfer = WaveSurfer.create({
            container: containerRef.current,
            url: audio instanceof Blob ? URL.createObjectURL(audio) : audio,
            minPxPerSec: zoom,
            height: 100,
            dragToSeek: true,
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

          await wavesurfer.load(
            audio instanceof Blob ? URL.createObjectURL(audio) : audio
          );
        } catch (err) {
          console.error('Error initializing WaveSurfer:', err);
          setError(`Error initializing audio player: ${err}`);
          setLoading(false);
        }
      }
    };

    initializeWaveSurfer();

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, [audio]);

  useEffect(() => {
    if (audioReady && wavesurferRef.current) {
      wavesurferRef.current?.zoom(zoom);
    }
  }, [zoom, audioReady]);

  const handlePlayPause = () => {
    if (audioReady && wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  const handleSkip = (seconds: number) => {
    if (audioReady && wavesurferRef.current) {
      wavesurferRef.current.skip(seconds);
    }
  };

  const handleZoomChange = (value: number[]) => {
    setZoom(value[0]);
  };

  return (
    <div className="space-y-5">
      {loading && (
        <div className="w-full">
          <Loader2 className="mx-auto size-4 animate-spin" />
        </div>
      )}
      <div ref={containerRef} className={'h-auto border-2'}></div>
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
        >
          {playing ? 'Pause' : 'Play'}
        </ButtonIcon>
        <ButtonIcon
          variant={'secondary'}
          icon={SkipForward}
          onClick={() => handleSkip(5)}
          disabled={!audioReady}
          aria-label="Forward 5s"
        />
      </div>
    </div>
  );
}
