import { Loader2 } from 'lucide-react';

export function Loading() {
  return (
    <div className="fixed inset-0 grid place-items-center bg-black/60 backdrop-blur-sm">
      <Loader2 className="size-8 animate-spin" />
    </div>
  );
}
