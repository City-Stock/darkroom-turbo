import React from "react";
import Breadcrumb from "@/TailAdminComponents/Breadcrumbs/Breadcrumb";
import TooltipsOne from "@/TailAdminComponents/ToolTips/TooltipsOne";
import TooltipsTwo from "@/TailAdminComponents/ToolTips/TooltipsTwo";

const Tooltips: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Tooltips" />

      <div className="flex flex-col gap-7.5">
        <TooltipsOne />
        <TooltipsTwo />
      </div>
    </>
  );
};

export default Tooltips;
