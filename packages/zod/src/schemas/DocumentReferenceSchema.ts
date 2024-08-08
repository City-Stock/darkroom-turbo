import { z } from "zod";

export const DocumentReferenceSchema = z.object({
  path: z.string(),
  id: z.string(),
  // ... any other properties or methods you want to check for
});
