'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { addMediaItem, updateMediaItem, deleteMediaItem } from '@/lib/data';

const mediaSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  url: z.string().url('Please enter a valid URL'),
  type: z.enum(['image', 'video']),
});

export async function createMediaAction(formData: FormData) {
  const validatedFields = mediaSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    url: formData.get('url'),
    type: formData.get('type'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await addMediaItem(validatedFields.data);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { errors: { _form: ['Something went wrong.'] } };
  }
}

export async function updateMediaAction(id: string, formData: FormData) {
  const validatedFields = mediaSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    url: formData.get('url'),
    type: formData.get('type'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await updateMediaItem(id, validatedFields.data);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { errors: { _form: ['Something went wrong.'] } };
  }
}

export async function deleteMediaAction(id: string) {
  try {
    await deleteMediaItem(id);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { errors: { _form: ['Something went wrong.'] } };
  }
}
