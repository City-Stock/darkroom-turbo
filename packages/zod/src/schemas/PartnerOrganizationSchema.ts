import { z } from "zod";

export const PartnerOrganizationSchema = z
  .object({
    uid: z.string(),
    name: z.string(),
    correspondenceTemplates: z.array(
      z.object({
        description: z.string(),
        isActive: z.boolean(),
        providerName: z.string(),
        providerTemplateId: z.string(),
        sequence: z.number(),
      })
    ),
    isActive: z.boolean(),
    createdBy: z.string(),
    createdOn: z.string(),
    modifiedBy: z.string(),
    modifiedOn: z.string(),
  })
  .strict();

export const CreatePartnerOrganizationSchema = PartnerOrganizationSchema.omit({ uid: true });

export type PartnerOrganizationModel = z.infer<typeof PartnerOrganizationSchema>;
export type CreatePartnerOrganizationModel = z.infer<typeof CreatePartnerOrganizationSchema>;
