import { cn } from '@/lib/utils';
import { Pause, Play } from 'lucide-react';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Button, ButtonProps } from './ui/button';

interface AudioPlayerProps {
  src: string;
  className?: ButtonProps['className'];
  isGloballyPlaying: boolean;
  onPlayingChange: (isPlaying: boolean) => void;
}

export interface AudioPlayerRef {
  reset: () => void;
}

const AudioPlayer = forwardRef<AudioPlayerRef, AudioPlayerProps>(
  ({ src, className, isGloballyPlaying, onPlayingChange }, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
        }
      },
    }));

    useEffect(() => {
      if (!isGloballyPlaying && isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      }
    }, [isGloballyPlaying, isPlaying]);

    const togglePlay = useCallback(
      (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        if (audioRef.current) {
          if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
            onPlayingChange(false);
          } else {
            audioRef.current.play();
            setIsPlaying(true);
            onPlayingChange(true);
          }
        }
      },
      [isPlaying, onPlayingChange]
    );

    return (
      <div
        className={cn('flex items-center justify-center', className)}
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant={'outline'}
          className="size-7 rounded-full p-0"
          onClick={togglePlay}
          onMouseDown={(e) => e.preventDefault()}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={12} /> : <Play size={12} />}
        </Button>
        <audio
          ref={audioRef}
          src={src}
          onEnded={() => {
            setIsPlaying(false);
            onPlayingChange(false);
          }}
          className="hidden"
        />
      </div>
    );
  }
);

AudioPlayer.displayName = 'AudioPlayer';

export default AudioPlayer;
