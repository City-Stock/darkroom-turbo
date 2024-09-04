import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { FaLocationDot } from "react-icons/fa6";
import Skeleton from "react-loading-skeleton";
import { doc, updateDoc, getFirestore } from "firebase/firestore"; // Import Firestore functions
import classNames from "classnames";
import { useRouter } from "next/navigation";

interface CardItemProps {
  imageSrc?: string;
  name: string;
  role: string;
  cardImageSrc?: string;
  cardTitle: string;
  cardContent: string;
  status?: string;
  docId?: string;
  location: {
    city: string;
    state: string;
  };
  fileType: string;
}

const UserUploadCard: React.FC<CardItemProps> = ({
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
}) => {
  const [cardImage, setCardImage] = useState<string | null>(null);
  const router = useRouter();

  const isVideo = fileType.split("/")[0] === "video";

  const handleCardClick = () => {
    router.push(`/uploads/${docId}`);
  };

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

  return (
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
  );
};

export default UserUploadCard;
