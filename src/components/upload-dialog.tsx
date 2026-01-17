'use client';

import { useState, type ReactNode, useRef } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { createMediaAction } from '@/app/actions';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, HardDriveUpload } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  url: z.string().min(1, { message: 'A media URL must be provided or a file uploaded.' }).url({ message: 'Please enter a valid URL or select a file.' }),
  type: z.enum(['image', 'video'], {
    required_error: 'You need to select a media type.',
  }),
});

export function UploadDialog({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      url: '',
      type: 'image',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please select a file smaller than 5MB.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setFilePreview(dataUrl);
        form.setValue('url', dataUrl, { shouldValidate: true });
        if (file.type.startsWith('image/')) {
          form.setValue('type', 'image');
        } else if (file.type.startsWith('video/')) {
          form.setValue('type', 'video');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    const result = await createMediaAction(formData);

    if (result?.success) {
      toast({
        title: 'Upload Successful',
        description: 'Your media has been added to the hub.',
      });
      setIsOpen(false);
      form.reset();
      setFilePreview(null);
    } else {
      const errorMessages = result.errors ? Object.values(result.errors).flat().join(' ') : 'Something went wrong.';
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: errorMessages || 'Please check your input and try again.',
      });
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      form.reset();
      setFilePreview(null);
    }
  };

  const handleTabChange = () => {
    form.setValue('url', '');
    form.clearErrors('url');
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline">Upload Media</DialogTitle>
          <DialogDescription>
            Share an image or video with the community. Fill out the details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
            <ScrollArea className="flex-grow pr-6 -mr-6">
              <div className="space-y-4 pr-6">
                <Tabs defaultValue="url" className="w-full" onValueChange={handleTabChange}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="url">
                      <Link className="mr-2 h-4 w-4" /> URL
                    </TabsTrigger>
                    <TabsTrigger value="local">
                      <HardDriveUpload className="mr-2 h-4 w-4" /> Local
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="url" className="py-4">
                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Media URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/image.jpg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  <TabsContent value="local" className="py-4 space-y-4">
                    <FormField
                      control={form.control}
                      name="url"
                      render={() => (
                        <FormItem>
                          <FormLabel>Upload File</FormLabel>
                          <FormControl>
                            <Input
                              id="local-file-input"
                              ref={fileInputRef}
                              type="file"
                              accept="image/*,video/mp4"
                              onChange={handleFileChange}
                              className="cursor-pointer file:font-semibold file:text-primary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {filePreview && (
                      <div className="relative aspect-video w-full rounded-md overflow-hidden bg-muted">
                        {form.getValues('type') === 'image' ? (
                          <Image src={filePreview} alt="File preview" layout="fill" objectFit="cover" />
                        ) : (
                          <video src={filePreview} controls className="h-full w-full object-cover" />
                        )}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., Sunday Service Highlights" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Media Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a media type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="image">Image</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about this moment..."
                          className="resize-y min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
            
            <DialogFooter className="pt-4 flex-shrink-0">
              <DialogClose asChild>
                <Button type="button" variant="secondary" disabled={form.formState.isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Uploading...' : 'Upload'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
