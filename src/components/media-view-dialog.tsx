'use client';

import Image from 'next/image';
import type { MediaItem } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from './ui/scroll-area';

type MediaViewDialogProps = {
  item: MediaItem | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function MediaViewDialog({ item, isOpen, onOpenChange }: MediaViewDialogProps) {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">{item.title}</DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-6 overflow-hidden flex-1">
          <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted relative">
            {item.type === 'image' ? (
              <Image src={item.url} alt={item.title} layout="fill" objectFit="contain" data-ai-hint="worship event" />
            ) : (
              <video controls autoPlay className="h-full w-full object-contain">
                <source src={item.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
          <ScrollArea className="h-full pr-4">
             <div className="prose max-w-none text-foreground/90">
                <p>{item.description}</p>
             </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
