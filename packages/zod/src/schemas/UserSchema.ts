import { z } from "zod";

export const UserSchema = z.object({
  uid: z.string(),
  displayName: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  phoneNumber: z.string(),
  disabled: z.boolean(),
  metadata: z.object({
    lastSignInTime: z.string().nullable(),
    creationTime: z.string().nullable(),
    lastRefreshTime: z.string().nullable(),
  }),
  customClaims: z.object({
    permissions: z.record(z.boolean()),
    userMetadata: z.object({
      partnerOrganizationId: z.string().optional(),
      partnerOrganizationName: z.string().optional(),
      roleId: z.string(),
      roleName: z.string(),
    }),
  }),
  tokensValidAfterTime: z.string(),
  providerData: z.array(
    z.object({
      uid: z.string(),
      providerId: z.enum(["phone", "password"]),
      email: z.string().email().optional(),
      displayName: z.string().optional(),
      phoneNumber: z.string().optional(),
    })
  ),
});

export type UserModel = z.infer<typeof UserSchema>;

export const CreateUserSchema = z
  .object({
    displayName: z.string().min(1),
    email: z.string().email().min(1),
    phoneNumber: z.string().min(1),
    roleId: z.string(),
    roleName: z.string(),
  })
  .strict();

export type CreateUserModel = z.infer<typeof CreateUserSchema>;

export const EditUserSchema = CreateUserSchema.strict();
export type EditUserModel = z.infer<typeof EditUserSchema>;
