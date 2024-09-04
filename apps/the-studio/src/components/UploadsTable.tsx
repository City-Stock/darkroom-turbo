"use client";

import { app } from "@/firebase/clientFirebaseInstance";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import UploadCard from "./UploadCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import QueryFilter from "./QueryFilter";

const useGetUploads = () => {
  const [uploads, setUploads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "uploads"), (snapshot) => {
      const uploads = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as any[];

      setUploads(uploads ?? []);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return { uploads, loading };
};

const UploadsTable = () => {
  const { uploads, loading } = useGetUploads();

  return (
    <div className="">
      <div className="mb-4 grid grid-cols-4 gap-6 rounded-md border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <QueryFilter label="City" queryName="city" />
        <QueryFilter label="State" queryName="state" />
        <QueryFilter label="Product Name" queryName="productName" />
        <QueryFilter label="Tags" queryName="tags" />

        {/* <QueryFilter
            label="Partner Org Name"
            queryName="partnerOrganizationName"
          /> */}
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
                <UploadCard
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

export default UploadsTable;
