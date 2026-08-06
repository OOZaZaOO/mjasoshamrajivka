import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100).refine((value) => !/[\r\n]/.test(value), "Please enter a valid name."),
  phone: z.string().trim().min(5, "Please enter a valid phone number.").max(40).refine((value) => !/[\r\n]/.test(value), "Please enter a valid phone number."),
  email: z.string().trim().email("Please enter a valid email address.").max(254),
  message: z.string().trim().min(10, "Please add a little more detail.").max(4000),
  website: z.string().max(200).optional(),
}).strict();

export type ContactPayload = z.infer<typeof contactSchema>;
