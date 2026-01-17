import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getMediaItems } from '@/lib/data';
import { MediaClientLayout } from '@/components/media-client-layout';

export default async function Home() {
  const initialMedia = await getMediaItems();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-center text-primary mb-2">
          Find a Revival Meeting
        </h1>
        <p className="text-center text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          Browse and share powerful moments from revival meetings around the world.
        </p>
        <MediaClientLayout initialMedia={initialMedia} />
      </main>
      <Footer />
    </div>
  );
}
