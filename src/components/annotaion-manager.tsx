import { Badge } from '@/components/ui/badge';
import { ButtonIcon } from '@/components/ui/button-icon';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useDeleteAnnotationMutation } from '@/lib/api/hooks/useAnnotations';
import { TAnnotation } from '@/lib/db/schema';
import { cn, getRandomColor } from '@/lib/utils';
import { useAppStore } from '@/redux/hooks';
import { AudioAnnotation } from '@/types/redux/app-state';
import { Plus, Trash2 } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
import { Skeleton } from './ui/skeleton';

interface AnnotationManagerProps {
  audioAnnotations: Record<number, TAnnotation[]>;
  onAnnotationAdded: (annotation: AudioAnnotation) => void;
  currentTime: number;
  regions: RegionsPlugin | null;
  isFetchingAnnotations: boolean;
  isAddingAnnotation: boolean;
}

function AnnotationManager({
  audioAnnotations,
  onAnnotationAdded,
  currentTime,
  regions,
  isFetchingAnnotations,
  isAddingAnnotation,
}: AnnotationManagerProps) {
  const { audioHref: audioVersionId } = useAppStore();
  const [newAnnotation, setNewAnnotation] = useState('');
  const [hoveredAnnotation, setHoveredAnnotation] = useState<number | null>(
    null
  );
  const [activeAnnotation, setActiveAnnotation] = useState<number | null>(null);

  const { mutateAsync: deleteAnnotation } = useDeleteAnnotationMutation(
    audioVersionId as string
  );

  const handleDeleteAnnotation = (annotationId: string) => {
    deleteAnnotation(annotationId);
  };

  const handleAddAnnotation = useCallback(() => {
    if (newAnnotation.trim()) {
      const annotation: AudioAnnotation = {
        id: Date.now().toString(),
        annotationTimeframe: currentTime,
        text: newAnnotation.trim(),
      };
      onAnnotationAdded(annotation);
      setNewAnnotation('');
    }
  }, [newAnnotation, currentTime, onAnnotationAdded]);

  const renderRegions = useCallback(() => {
    if (!regions) return;

    regions.clearRegions();

    Object.entries(audioAnnotations).forEach(([timeframe, annotations]) => {
      const color = getRandomColor();
      const region = regions.addRegion({
        start: parseFloat(timeframe),
        end: parseFloat(timeframe) + 0.1,
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
        tooltip.style.display = 'block';
        tooltip.style.cursor = 'pointer';
        setHoveredAnnotation(parseFloat(timeframe));
      });
      region.element.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
        setHoveredAnnotation(null);
      });
    });
  }, [audioAnnotations, regions]);

  useEffect(() => {
    if (!isFetchingAnnotations && regions) {
      renderRegions();
    }
  }, [renderRegions, isFetchingAnnotations, regions, audioAnnotations]);

  useEffect(() => {
    const activeTime = Object.keys(audioAnnotations).find(
      (t) => Math.abs(parseFloat(t) - currentTime) < 0.1
    );
    setActiveAnnotation(activeTime ? parseFloat(activeTime) : null);
  }, [currentTime, audioAnnotations]);

  const sortedAnnotations = useMemo(() => {
    return Object.entries(audioAnnotations).sort(
      (a, b) => parseFloat(a[0]) - parseFloat(b[0])
    );
  }, [audioAnnotations]);

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="text-lg font-semibold">Add a note</div>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={newAnnotation}
            onChange={(e) => setNewAnnotation(e.target.value)}
            placeholder="Add a note..."
          />
          <ButtonIcon
            icon={Plus}
            onClick={handleAddAnnotation}
            disabled={!newAnnotation.trim()}
            aria-label="Add annotation"
            state={isAddingAnnotation ? 'loading' : 'default'}
          />
        </div>
      </div>
      <div>
        {sortedAnnotations.length > 0 ? (
          <div className="space-y-2">
            <div className="text-lg font-semibold">Annotations</div>
            <div className="col-span-full grid w-full grid-cols-4 gap-4 *:col-span-full md:*:col-span-1">
              {sortedAnnotations.map(([timeframe, annotations]) => (
                <Card
                  key={timeframe}
                  className={cn(
                    'group flex min-h-24 w-full min-w-64 transform flex-col items-start justify-between space-y-3 rounded px-2 py-3 transition-all ease-in-out',
                    hoveredAnnotation === parseFloat(timeframe) ||
                      (!hoveredAnnotation &&
                        activeAnnotation === parseFloat(timeframe))
                      ? 'scale-[1.01] border border-gray-800 bg-gray-100/90 shadow-lg'
                      : ''
                  )}
                  onMouseEnter={() =>
                    setHoveredAnnotation(parseFloat(timeframe))
                  }
                  onMouseLeave={() => setHoveredAnnotation(null)}
                >
                  <div className="flex w-full flex-col items-start gap-3">
                    {Array.from(new Set(annotations.map((a) => a.id))).map(
                      (id) => {
                        const annotation = annotations.find((a) => a.id === id);
                        if (!annotation) return null;
                        return (
                          <div
                            key={annotation.id}
                            className="flex w-full items-start justify-between gap-2"
                          >
                            <div className="line-clamp-2 text-sm text-gray-700 hover:line-clamp-none hover:cursor-pointer">
                              {annotation.text}
                            </div>
                            <ButtonIcon
                              variant={'outline'}
                              size={'sm'}
                              icon={Trash2}
                              className="hidden size-8 p-1 group-hover:flex"
                              onClick={() =>
                                handleDeleteAnnotation(annotation.id)
                              }
                            />
                          </div>
                        );
                      }
                    )}
                  </div>

                  <div className="flex w-full items-center justify-between gap-2">
                    <div>Timeframe:</div>
                    <Badge className="mt-auto px-4">
                      {parseFloat(timeframe).toFixed(2)}s
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-sm text-gray-500">
            No annotations yet
          </div>
        )}
      </div>
      <div className="col-span-full grid w-full grid-cols-4 gap-4 *:col-span-full md:*:col-span-1">
        {isFetchingAnnotations &&
          Array.from({ length: 8 }).map((_, i) => (
            <div>
              <Skeleton className="h-32 w-full" />
            </div>
          ))}
      </div>
    </div>
  );
}

export default React.memo(AnnotationManager);
