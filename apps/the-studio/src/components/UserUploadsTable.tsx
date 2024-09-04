"use client";

import { app, auth } from "@/firebase/clientFirebaseInstance";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import QueryFilter from "./QueryFilter";
import SelectQueryFilter from "./SelectQueryFilter";
import { stateOptions } from "./UploadsForm";
import UserUploadCard from "./UserUploadCard";

const useGetCurrentUserUploads = () => {
  const [uploads, setUploads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = auth; // Assuming useAuth provides the current user
  const searchParams = useSearchParams();

  const db = getFirestore(app);

  const cityParam = searchParams.get("city")?.toLowerCase();
  const stateParam = searchParams.get("state")?.toLowerCase();
  const productNameParam = searchParams.get("productName")?.toLowerCase();
  const tagsParam = searchParams.get("tags")?.toLowerCase();

  useEffect(() => {
    if (!currentUser || !currentUser.uid) {
      setLoading(false);
      return;
    }

    const baseUploadsQuery = query(
      collection(db, "uploads"),
      where("contributorUserId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(baseUploadsQuery, (snapshot) => {
      const allUploads = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as any[];

      const filteredUploads = allUploads.filter((upload) => {
        const matchesCity = cityParam
          ? upload.city?.toLowerCase().includes(cityParam.toLowerCase())
          : true;
        const matchesState = stateParam
          ? upload.state?.toLowerCase().includes(stateParam.toLowerCase())
          : true;
        const matchesProductName = productNameParam
          ? upload.productName
              ?.toLowerCase()
              .includes(productNameParam.toLowerCase())
          : true;
        const matchesTags = tagsParam
          ? upload.tags
              ?.map((tag: string) => tag.toLowerCase())
              .some((tag) => tag.includes(tagsParam.toLowerCase()))
          : true;

        return matchesCity && matchesState && matchesProductName && matchesTags;
      });

      setUploads(filteredUploads);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [
    currentUser?.uid,
    db,
    cityParam,
    stateParam,
    productNameParam,
    tagsParam,
  ]);

  return { uploads, loading };
};

const UserUploadsTable = () => {
  const { uploads, loading } = useGetCurrentUserUploads();

  return (
    <div className="">
      <div className="mb-4 grid grid-cols-4 gap-6 rounded-md border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <QueryFilter label="City" queryName="city" />
        <SelectQueryFilter
          label="State"
          options={stateOptions}
          queryName="state"
        />
        <QueryFilter label="Product Name" queryName="productName" />
        <SelectQueryFilter
          label="Tags"
          options={[
            { label: "Tag 1", value: "tag1" },
            { label: "Tag 2", value: "tag2" },
          ]}
          queryName="tags"
          isMulti
        />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {loading
          ? Array.from({ length: 12 }).map((_, index) => (
              <div key={index}>
                <Skeleton height={200} />
                <Skeleton width="80%" />
                <Skeleton width="60%" />
              </div>
            ))
          : uploads.map((upload) => (
              <div key={upload.id}>
                <UserUploadCard
                  cardContent="Uploads"
                  cardTitle={upload.productName}
                  name={upload.contributorName}
                  role="Contributor"
                  cardImageSrc={upload.sourceFileRef}
                  status={upload.approvalStatus}
                  docId={upload.id}
                  location={{
                    city: upload.city,
                    state: upload.state,
                  }}
                  fileType={upload.fileType}
                />
              </div>
            ))}
      </div>
      {/* <Pagination currentPage={1} totalPages={10} onPageChange={() => {}} /> */}
    </div>
  );
};

export default UserUploadsTable;
