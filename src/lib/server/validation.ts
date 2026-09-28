import { z } from "zod";

const LINK = /https?:|www\./i;

/** Single-line free text: it reaches a mail subject, so control characters are rejected. */
export const plainText = (min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min)
    .max(max)
    .regex(/^[^\p{Cc}<>]*$/u)
    .refine((value) => !LINK.test(value), "links_not_allowed");

/** Message bodies keep their line breaks; every other control character is rejected. */
export const plainBlock = (min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min)
    .max(max)
    .regex(/^(?:[^\p{Cc}]|\r|\n)*$/u);

export const CvRequestSchema = z.object({
  name: plainText(2, 80),
  company: plainText(2, 100),
  role: plainText(0, 120).optional().default(""),
  email: z.string().trim().toLowerCase().pipe(z.email().max(120)),
  lang: z.enum(["es", "en"]),
  website: z.string().max(200).optional().default(""),
  turnstileToken: z.string().min(10).max(2048),
});

export const ContactSchema = z.object({
  name: plainText(2, 80),
  email: z.string().trim().pipe(z.email().max(120)),
  message: plainBlock(20, 2000),
  website: z.string().max(200).optional().default(""),
  turnstileToken: z.string().min(10).max(2048),
});

export type CvRequest = z.infer<typeof CvRequestSchema>;
