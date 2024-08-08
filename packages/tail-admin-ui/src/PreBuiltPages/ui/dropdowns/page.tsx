"use client";
import Breadcrumb from "@/TailAdminComponents/Breadcrumbs/Breadcrumb";
import DropdownsTwo from "@/TailAdminComponents/Dropdowns/DropdownsTwo";
import DropdownsOne from "@/TailAdminComponents/Dropdowns/DropdownsOne";
import DropdownsThree from "@/TailAdminComponents/Dropdowns/DropdownsThree";

const Dropdowns: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Dropdowns" />

      <div className="flex flex-col gap-7.5">
        <DropdownsOne />
        <DropdownsTwo />
        <DropdownsThree />
      </div>
    </>
  );
};

export default Dropdowns;
