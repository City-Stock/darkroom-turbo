"use client";
import Breadcrumb from "@/TailAdminComponents/Breadcrumbs/Breadcrumb";
import PopoversOne from "@/TailAdminComponents/Popovers/PopoversOne";
import PopoversTwo from "@/TailAdminComponents/Popovers/PopoversTwo";

const Popovers: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Popovers" />

      <div className="flex flex-col gap-7.5">
        <PopoversOne />
        <PopoversTwo />
      </div>
    </>
  );
};

export default Popovers;
