import { z } from "zod";
import { DocumentReferenceSchema } from "./DocumentReferenceSchema";

export const RoleSchema = z
  .object({
    uid: z.string(),
    name: z.string(),
    permissions: z.array(
      z.object({
        value: z.string(),
        description: z.string(),
        permissionId: DocumentReferenceSchema,
      })
    ),
    createdBy: z.string(),
    createdOn: z.string(),
    modifiedBy: z.string(),
    modifiedOn: z.string(),
  })
  .strict();

export type RoleModel = z.infer<typeof RoleSchema>;

export const CreateRoleSchema = RoleSchema.omit({ uid: true });
export type CreateRoleModel = z.infer<typeof CreateRoleSchema>;

export const UpdateRoleSchema = RoleSchema.omit({ uid: true, createdBy: true, createdOn: true });
export type UpdateRoleModel = z.infer<typeof UpdateRoleSchema>;
