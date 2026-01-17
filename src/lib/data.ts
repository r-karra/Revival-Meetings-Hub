import type { MediaItem } from './types';
import { PlaceHolderImages } from './placeholder-images';

// In-memory "database"
let mediaItems: MediaItem[] = PlaceHolderImages.map(img => ({
  id: img.id,
  title: `Testimony from Event #${img.id}`,
  description: img.description + ' ' + 'This event was a powerful display of faith and community. Many lives were touched and transformed. The spirit of revival was palpable in the air, as people from all walks of life came together to worship and seek a deeper connection. The messages shared were profound and inspiring, encouraging everyone to live a life of purpose and devotion. It was a truly unforgettable experience that left a lasting impact on all who attended.',
  url: img.imageUrl,
  type: 'image'
}));

// Add a sample video
mediaItems.push({
    id: '100',
    type: 'video',
    title: 'Sermon on Faith',
    description: 'A powerful sermon on the nature of faith and its importance in our daily lives. This message was delivered with great passion and conviction, leaving the audience inspired and uplifted. The speaker shared personal stories and biblical insights to illustrate the transformative power of faith.',
    // Using a placeholder video URL
    url: 'https://www.w3schools.com/html/mov_bbb.mp4'
});


// Simulate API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getMediaItems(): Promise<MediaItem[]> {
  await delay(50);
  return mediaItems;
}

export async function addMediaItem(item: Omit<MediaItem, 'id'>): Promise<MediaItem> {
  await delay(50);
  const newItem: MediaItem = {
    ...item,
    id: Date.now().toString(),
  };
  mediaItems = [newItem, ...mediaItems];
  return newItem;
}

export async function updateMediaItem(id: string, updates: Partial<Omit<MediaItem, 'id'>>): Promise<MediaItem | null> {
  await delay(50);
  let updatedItem: MediaItem | null = null;
  mediaItems = mediaItems.map(item => {
    if (item.id === id) {
      updatedItem = { ...item, ...updates };
      return updatedItem;
    }
    return item;
  });
  return updatedItem;
}

export async function deleteMediaItem(id: string): Promise<{ success: boolean }> {
  await delay(50);
  const initialLength = mediaItems.length;
  mediaItems = mediaItems.filter(item => item.id !== id);
  return { success: mediaItems.length < initialLength };
}
