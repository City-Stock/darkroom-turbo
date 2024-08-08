import { CreatePermissionModel } from "@ess/zod";
import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue, serverTimestamp } from "firebase/firestore";

export const CreatePermissionConverter: FirestoreDataConverter<CreatePermissionModel> = {
  toFirestore(payload: WithFieldValue<any>): DocumentData {
    return payload;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): CreatePermissionModel {
    const data = snapshot.data(options);

    return {
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
