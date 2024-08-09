import { z } from "zod";

type Payload = {
  displayName: string;
  phoneNumber: string;
  email: string;
  partnerOrganizationId: string;
  partnerOrganizationName: string;
  permissions: { [key: string]: boolean };
};

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
      partnerOrganizationId: z.string(),
      partnerOrganizationName: z.string(),
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
    partnerOrganizationId: z.string().min(1),
    roleId: z.string(),
  })
  .strict();

export type CreateUserModel = z.infer<typeof CreateUserSchema>;

export const EditUserSchema = CreateUserSchema.strict();
export type EditUserModel = z.infer<typeof EditUserSchema>;
