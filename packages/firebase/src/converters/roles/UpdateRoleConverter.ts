import { UpdateRoleModel } from "@ess/zod";
import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from "firebase/firestore";

export const UpdateRoleConverter: FirestoreDataConverter<UpdateRoleModel> = {
  toFirestore(payload: UpdateRoleModel): UpdateRoleModel {
    return { modifiedBy: payload.modifiedBy, modifiedOn: payload.modifiedOn, name: payload.name, permissions: payload.permissions };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): UpdateRoleModel {
    const data = snapshot.data(options);
    return {
      name: data.name,
      permissions: data.permissions,
      modifiedBy: data.modifiedBy,
      modifiedOn: data.modifiedOn,
    };
  },
};
