'use client';

import { useState } from 'react';
import type { MediaItem } from '@/lib/types';
import { MediaCard } from './media-card';
import { MediaViewDialog } from './media-view-dialog';
import { EditMediaDialog } from './edit-media-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { deleteMediaAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

export function MediaClientLayout({ initialMedia }: { initialMedia: MediaItem[] }) {
  const [mediaToView, setMediaToView] = useState<MediaItem | null>(null);
  const [mediaToEdit, setMediaToEdit] = useState<MediaItem | null>(null);
  const [mediaToDelete, setMediaToDelete] = useState<MediaItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!mediaToDelete) return;

    setIsDeleting(true);
    const result = await deleteMediaAction(mediaToDelete.id);
    setIsDeleting(false);

    if (result?.success) {
      toast({
        title: 'Success',
        description: 'Media item deleted successfully.',
      });
      setMediaToDelete(null);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete media item.',
      });
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {initialMedia.map((item) => (
          <MediaCard
            key={item.id}
            item={item}
            onReadMore={() => setMediaToView(item)}
            onEdit={() => setMediaToEdit(item)}
            onDelete={() => setMediaToDelete(item)}
          />
        ))}
      </div>

      <MediaViewDialog
        item={mediaToView}
        isOpen={!!mediaToView}
        onOpenChange={(isOpen) => !isOpen && setMediaToView(null)}
      />

      <EditMediaDialog
        item={mediaToEdit}
        isOpen={!!mediaToEdit}
        onOpenChange={(isOpen) => !isOpen && setMediaToEdit(null)}
      />

      <AlertDialog open={!!mediaToDelete} onOpenChange={(isOpen) => !isOpen && setMediaToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the media item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Continue'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
