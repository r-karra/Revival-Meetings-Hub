'use client'

import { Flame, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UploadDialog } from './upload-dialog';

export function Header() {
  return (
    <header className="bg-card border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <Flame className="h-8 w-8 text-primary" />
          <span className="font-headline text-xl font-bold">
            Revival Meetings Hub
          </span>
        </div>
        <UploadDialog>
          <Button>
            <Upload className="mr-2" />
            Upload Media
          </Button>
        </UploadDialog>
      </div>
    </header>
  );
}
