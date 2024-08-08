import { z } from "zod";

export const SignInFormSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .strict();

export type SignInFormModel = z.infer<typeof SignInFormSchema>;
