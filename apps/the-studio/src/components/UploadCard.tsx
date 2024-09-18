import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { FaLocationDot } from "react-icons/fa6";
import Skeleton from "react-loading-skeleton";
import { doc, updateDoc, getFirestore } from "firebase/firestore"; // Import Firestore functions
import classNames from "classnames";

interface CardItemProps {
  imageSrc?: string;
  name: string;
  role: string;
  cardImageSrc?: string;
  cardTitle: string;
  cardContent: string;
  status?: string;
  docId?: string;
  salesInfo: {
    qtySold: number;
    totalSales: number;
  };
  location: {
    city: string;
    state: string;
  };
  fileType: string;
}

const UploadCard: React.FC<CardItemProps> = ({
  imageSrc,
  name,
  role,
  cardImageSrc,
  cardTitle,
  cardContent,
  status,
  docId,
  location,
  fileType,
  salesInfo,
}) => {
  const [cardImage, setCardImage] = useState<string | null>(null);
  const [isActive, setIsActive] = useState<string | null>(null); // Track the active docId

  const trigger = useRef<any>(null);
  const modal = useRef<any>(null);

  const isVideo = fileType.split("/")[0] === "video";

  useEffect(() => {
    const storage = getStorage();
    const imageRef = ref(storage, `uploads/${cardImageSrc}` || "");

    getDownloadURL(imageRef)
      .then((url) => {
        setCardImage(url);
      })
      .catch((error) => {
        console.error("Error getting document:", error);
      });
  }, []);

  const handleCardClick = () => {
    setIsActive(docId || null); // Set the active docId
  };

  const handleCloseModal = () => {
    setIsActive(null); // Clear the active docId when closing the modal
  };

  const updateDocumentStatus = async (status: string) => {
    if (docId) {
      const db = getFirestore();
      const docRef = doc(db, "uploads", docId); // Update the path to your collection
      try {
        await updateDoc(docRef, {
          approvalStatus: status,
        });
        console.log(`Document ${status}:`, docId);
      } catch (error) {
        console.error("Error updating document:", error);
      }
    }
    handleCloseModal();
  };

  const handleApprove = () => {
    updateDocumentStatus("approved");
  };

  const handleReject = () => {
    updateDocumentStatus("rejected");
  };

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (keyCode === 27) {
        setIsActive(null);
      }
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, []);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!modal.current) return;
      if (
        !isActive ||
        modal.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setIsActive(null);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  return (
    <>
      <div className="cursor-pointer" onClick={handleCardClick}>
        <div className="block pt-4 rounded-md overflow-hidden relative">
          {cardImage ? (
            isVideo ? (
              <video
                className="rounded-md h-[274px] w-full object-cover"
                preload="metadata"
              >
                <source src={cardImage} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <Image
                className="rounded-md h-[274px] w-full object-cover"
                width={340}
                height={180}
                src={cardImage || ""}
                alt="Cards"
              />
            )
          ) : (
            <Skeleton
              className="rounded-md h-[274px] w-full object-cover"
              height={274}
            />
          )}
          <div
            className={classNames(
              "absolute capitalize top-8 right-4 text-white text-xs font-medium px-2 py-1 rounded-md",
              {
                "bg-[#ff2e2e]": status === "rejected",
                "bg-[#008d05]": status === "approved",
                "bg-primary": status === "pending",
              }
            )}
          >
            {status}
          </div>
          <div
            onClick={(e) => e.stopPropagation()}
            className={classNames(
              "absolute capitalize bottom-4 right-4 text-white text-xs font-medium px-2 py-1 rounded-md bg-primary"
            )}
          >
            Total Sales: {salesInfo?.qtySold ? salesInfo.qtySold : 0}
          </div>
          <div
            onClick={(e) => e.stopPropagation()}
            className={classNames(
              "absolute capitalize bottom-12 right-4 text-white text-xs font-medium px-2 py-1 rounded-md bg-primary"
            )}
          >
            Total Revenue: $
            {salesInfo?.totalSales ? salesInfo.totalSales.toFixed(2) : `0.00`}
          </div>
        </div>
        <div className="flex items-center gap-3 py-2">
          <div className="w-full">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-black dark:text-white">
                {cardTitle}
              </h4>
              <div className="flex items-center gap-1 pr-2">
                <FaLocationDot className="text-black/20" />
                <p className="text-sm text-black/50">
                  {location.city}, {location.state}
                </p>
              </div>
            </div>
            <p className="text-sm">Posted by {name}</p>
          </div>
        </div>
      </div>

      {isActive && (
        <div
          className={`fixed top-0 left-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 ${
            isActive ? "block" : "hidden"
          }`}
        >
          <div
            ref={modal}
            onFocus={() => setIsActive(docId || null)}
            onBlur={() => setIsActive(null)}
            className="w-full max-w-4xl rounded-lg bg-white py-12 px-8 text-center dark:bg-boxdark md:py-15 md:px-17.5"
          >
            <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
              Review Upload
            </h3>
            <span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>
            <div className="mb-10">
              {cardImage ? (
                isVideo ? (
                  <video
                    className="rounded-md h-auto w-full object-cover"
                    controls
                    onClick={(e) => e.stopPropagation()}
                  >
                    <source src={cardImage} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <Image
                    className="rounded-md h-auto w-full object-cover"
                    src={cardImage || ""}
                    alt="Full View"
                    width={800}
                    height={600}
                  />
                )
              ) : (
                <Skeleton
                  className="rounded-md h-[600px] w-full object-cover"
                  height={600}
                />
              )}
            </div>
            <div className="-mx-3 flex flex-wrap gap-y-4">
              <div className="w-full px-3 2xsm:w-1/2">
                <button
                  onClick={handleReject}
                  className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
                >
                  Reject
                </button>
              </div>
              <div className="w-full px-3 2xsm:w-1/2">
                <button
                  onClick={handleApprove}
                  className="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadCard;
