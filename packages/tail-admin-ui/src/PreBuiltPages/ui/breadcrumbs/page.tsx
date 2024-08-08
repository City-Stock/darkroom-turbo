"use client";
import Breadcrumb from "@/TailAdminComponents/Breadcrumbs/Breadcrumb";
import BreadcrumbOne from "@/TailAdminComponents/Breadcrumbs/BreadcrumbOne";
import BreadcrumbTwo from "@/TailAdminComponents/Breadcrumbs/BreadcrumbTwo";
import BreadcrumbThree from "@/TailAdminComponents/Breadcrumbs/BreadcrumbThree";

const Breadcrumbs: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Breadcrumb" />

      <div className="flex flex-col gap-7.5">
        <BreadcrumbOne />
        <BreadcrumbTwo />
        <BreadcrumbThree />
      </div>
    </>
  );
};

export default Breadcrumbs;
