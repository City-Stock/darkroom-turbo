import { z } from "zod";

export const PermissionSchema = z
  .object({
    uid: z.string(),
    value: z.string(),
    description: z.string(),
    createdBy: z.string(),
    createdOn: z.string(),
    modifiedBy: z.string(),
    modifiedOn: z.string(),
  })
  .strict();

export type PermissionModel = z.infer<typeof PermissionSchema>;

export const CreatePermissionSchema = PermissionSchema.omit({ uid: true });
export type CreatePermissionModel = z.infer<typeof CreatePermissionSchema>;
