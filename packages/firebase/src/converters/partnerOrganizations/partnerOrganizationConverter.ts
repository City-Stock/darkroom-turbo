import { CreatePartnerOrganizationModel, PartnerOrganizationModel } from "@ess/zod";
import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from "firebase/firestore";

export const partnerOrganizationConverter: FirestoreDataConverter<PartnerOrganizationModel> = {
  toFirestore(payload: WithFieldValue<CreatePartnerOrganizationModel>): DocumentData {
    return {
      name: payload.name,
      correspondenceTemplates: payload.correspondenceTemplates,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): PartnerOrganizationModel {
    const data = snapshot.data(options);
    return {
      uid: snapshot.id,
      // ref: snapshot.ref,
      isActive: data.isActive,
      name: data.name,
      correspondenceTemplates: data.correspondenceTemplates,
      createdBy: data.createdBy,
      createdOn: data.createdOn,
      modifiedBy: data.modifiedBy,
      modifiedOn: data.modifiedOn,
    };
  },
};
