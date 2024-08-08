import { CreateRoleModel, RoleModel } from "@ess/zod";
import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from "firebase/firestore";

export const RoleConverter: FirestoreDataConverter<RoleModel> = {
  toFirestore(payload: WithFieldValue<RoleModel>): DocumentData {
    return payload;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): RoleModel {
    const data = snapshot.data(options);
    return {
      uid: snapshot.id,
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
