import { PermissionModel } from "@ess/zod";
import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue, serverTimestamp } from "firebase/firestore";

export const PermissionConverter: FirestoreDataConverter<PermissionModel> = {
  toFirestore(payload: WithFieldValue<PermissionModel>): DocumentData {
    return payload;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): PermissionModel {
    const data = snapshot.data(options);

    return {
      uid: snapshot.id,
      // ref: snapshot.ref,
      value: data.value,
      description: data.description,
      createdBy: data.createdBy,
      createdOn: data.createdOn,
      modifiedBy: data.modifiedBy,
      modifiedOn: data.modifiedOn,
    };
  },
};
