import React from "react";
import Breadcrumb from "@/TailAdminComponents/Breadcrumbs/Breadcrumb";
import PaginationOne from "@/TailAdminComponents/Paginations/PaginationOne";
import PaginationTwo from "@/TailAdminComponents/Paginations/PaginationTwo";
import PaginationThree from "@/TailAdminComponents/Paginations/PaginationThree";

const Pagination: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Pagination" />

      <div className="flex flex-col gap-7.5">
        <PaginationOne />
        <PaginationTwo />
        <PaginationThree />
      </div>
    </>
  );
};

export default Pagination;
