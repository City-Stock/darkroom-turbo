import React from "react";
import Breadcrumb from "@/TailAdminComponents/Breadcrumbs/Breadcrumb";
import PricingTableOne from "@/TailAdminComponents/PricingTables/PricingTableOne";
import PricingTableTwo from "@/TailAdminComponents/PricingTables/PricingTableTwo";

const PricingTables: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Pricing Table" />

      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        <PricingTableOne />
        <PricingTableTwo />
      </div>
    </>
  );
};

export default PricingTables;
