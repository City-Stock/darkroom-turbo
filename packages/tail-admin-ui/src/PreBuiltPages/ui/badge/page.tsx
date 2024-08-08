import React from "react";
import Breadcrumb from "@/TailAdminComponents/Breadcrumbs/Breadcrumb";
import BadgeOne from "@/TailAdminComponents/Badges/BadgeOne";
import BadgeTwo from "@/TailAdminComponents/Badges/BadgeTwo";
import BadgeThree from "@/TailAdminComponents/Badges/BadgeThree";
import BadgeFour from "@/TailAdminComponents/Badges/BadgeFour";

const Badge: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Badge" />

      <div className="flex flex-col gap-7.5">
        <BadgeOne />
        <BadgeTwo />
        <BadgeThree />
        <BadgeFour />
      </div>
    </>
  );
};

export default Badge;
