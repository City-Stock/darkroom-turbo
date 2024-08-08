import { CreateRoleModel, RoleModel } from "@ess/zod";
import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from "firebase/firestore";

export const CreateRoleConverter: FirestoreDataConverter<CreateRoleModel> = {
  toFirestore(payload: WithFieldValue<CreateRoleModel>): DocumentData {
    return payload;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): CreateRoleModel {
    const data = snapshot.data(options);
    return {
      // ref: snapshot.ref,
      name: data.name,
      permissions: data.permissions,
      createdBy: data.createdBy,
      createdOn: data.createdOn,
      modifiedBy: data.modifiedBy,
      modifiedOn: data.modifiedOn,
    };
  },
};
