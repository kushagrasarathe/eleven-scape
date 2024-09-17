import { Badge } from '@/components/ui/badge';
import { ButtonIcon } from '@/components/ui/button-icon';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TAnnotation } from '@/lib/db/schema';
import { cn, getRandomColor } from '@/lib/utils';
import { AudioAnnotation } from '@/types/redux/app-state';
import { Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';

interface AnnotationManagerProps {
  wavesurfer: WaveSurfer | null;
  regions: RegionsPlugin | null;
  audioAnnotations: Record<number, TAnnotation[]>;
  onAnnotationAdded: (annotation: AudioAnnotation) => void;
}

export function AnnotationManager({
  wavesurfer,
  regions,
  audioAnnotations,
  onAnnotationAdded,
}: AnnotationManagerProps) {
  const [newAnnotation, setNewAnnotation] = useState('');
  const [activeAnnotation, setActiveAnnotation] = useState<number | null>(null);

  const handleAddAnnotation = useCallback(() => {
    if (newAnnotation.trim() && wavesurfer) {
      const annotationTimeframe = wavesurfer.getCurrentTime();
      const id = Date.now().toString();
      const annotation: AudioAnnotation = {
        id,
        annotationTimeframe,
        text: newAnnotation.trim(),
      };
      onAnnotationAdded(annotation);
      setNewAnnotation('');
    }
  }, [newAnnotation, wavesurfer, onAnnotationAdded]);

  const renderAnnotations = useCallback(() => {
    if (!wavesurfer || !regions) return;

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
        tooltip.style.cursor = 'pointer';
        setActiveAnnotation(parseFloat(timeframe));
      });
      region.element.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
        setActiveAnnotation(null);
      });
      region.element.addEventListener('click', () => {
        setActiveAnnotation(parseFloat(timeframe));
      });
    });
  }, [audioAnnotations, regions, wavesurfer]);

  useEffect(() => {
    renderAnnotations();
  }, [audioAnnotations, renderAnnotations]);

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
            disabled={!wavesurfer}
          />
          <ButtonIcon
            icon={Plus}
            onClick={handleAddAnnotation}
            disabled={!wavesurfer || !newAnnotation.trim()}
            aria-label="Add annotation"
          />
        </div>
      </div>
      <div>
        {Object.keys(audioAnnotations).length > 0 ? (
          <div className="space-y-2">
            <div className="text-lg font-semibold">Annotations</div>
            <div className="grid grid-cols-4 gap-2 *:col-span-1">
              {Object.entries(audioAnnotations).map(
                ([timeframe, annotations]) => (
                  <Card
                    key={timeframe}
                    className={cn(
                      'flex min-w-64 transform flex-col items-start justify-between space-y-3 rounded px-2 py-3 transition-all ease-in-out',
                      activeAnnotation === parseFloat(timeframe)
                        ? 'scale-[1.01] border border-gray-800 bg-gray-100/90 shadow-lg'
                        : ''
                    )}
                  >
                    <div className="flex w-full flex-col items-start gap-3">
                      {annotations.map((annotation) => (
                        <div key={annotation.id} className="w-full">
                          <div className="line-clamp-2 text-sm text-gray-700 hover:line-clamp-none hover:cursor-pointer">
                            {annotation.text}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex w-full items-center justify-between gap-2">
                      <div>Timeframe:</div>
                      <Badge className="mt-auto px-4">
                        {parseFloat(timeframe).toFixed(2)}s
                      </Badge>
                    </div>
                  </Card>
                )
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-sm text-gray-500">
            No annotations yet
          </div>
        )}
      </div>
    </div>
  );
}
