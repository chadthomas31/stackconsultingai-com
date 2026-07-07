import { z } from "zod";

export const ReceptionistConfigSchema = z.object({
  summary: z.string().describe("One-line summary of the business."),
  services: z.array(z.string()).min(1).max(8).describe("3-7 concrete services offered."),
  greeting: z.string().describe("Suggested opening line; names the business."),
  intakeFocus: z.array(z.string()).min(1).max(5).describe("2-4 things the receptionist should prioritize asking."),
  tone: z.string().describe("Short tone descriptor, e.g. 'warm, efficient, local'."),
  faqs: z.array(z.object({ q: z.string(), a: z.string() })).max(3).describe("0-2 likely FAQs."),
});

export type ReceptionistConfig = z.infer<typeof ReceptionistConfigSchema>;
