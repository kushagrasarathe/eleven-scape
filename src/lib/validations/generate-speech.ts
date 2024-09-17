import * as z from 'zod';

const text = z.string().min(1).max(1000);

export const GenerateSpeechSchema = z.object({
  text,
});

export type TGenerateSpeechSchema = z.infer<typeof GenerateSpeechSchema>;
