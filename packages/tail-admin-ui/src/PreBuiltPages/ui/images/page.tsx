"use client";
import Breadcrumb from "@/TailAdminComponents/Breadcrumbs/Breadcrumb";
import ImagesTwo from "@/TailAdminComponents/Images/ImagesTwo";
import ImagesOne from "@/TailAdminComponents/Images/ImagesOne";

const Images: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Images" />

      <div className="flex flex-col gap-7.5">
        <ImagesOne />
        <ImagesTwo />
      </div>
    </>
  );
};

export default Images;
