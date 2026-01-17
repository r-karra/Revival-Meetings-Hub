import Image from 'next/image';
import type { MediaItem } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { MoreVertical, Edit, Trash2, Eye } from 'lucide-react';

type MediaCardProps = {
  item: MediaItem;
  onReadMore: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function MediaCard({ item, onReadMore, onEdit, onDelete }: MediaCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex-row items-start justify-between pb-2">
        <CardTitle className="font-headline text-lg leading-tight flex-1 pr-2">{item.title}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col pt-0">
        <div className="aspect-video w-full rounded-md overflow-hidden bg-muted mb-4 relative">
          {item.type === 'image' ? (
            <Image src={item.url} alt={item.title} layout="fill" objectFit="cover" data-ai-hint="worship event" />
          ) : (
            <video controls className="h-full w-full object-cover">
              <source src={item.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
        <p className="text-muted-foreground line-clamp-3 text-sm flex-grow">
          {item.description}
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={onReadMore} className="w-full" variant="outline">
          <Eye className="mr-2 h-4 w-4" />
          Read More
        </Button>
      </CardFooter>
    </Card>
  );
}
