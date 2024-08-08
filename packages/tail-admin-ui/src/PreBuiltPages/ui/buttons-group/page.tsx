import React from "react";
import Breadcrumb from "@/TailAdminComponents/Breadcrumbs/Breadcrumb";
import ButtonsGroupOne from "@/TailAdminComponents/ButtonsGroups/ButtonsGroupOne";
import ButtonsGroupTwo from "@/TailAdminComponents/ButtonsGroups/ButtonsGroupTwo";

const ButtonsGroup: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Buttons Group" />

      <div className="flex flex-col gap-7.5">
        <ButtonsGroupOne />
        <ButtonsGroupTwo />
      </div>
    </>
  );
};

export default ButtonsGroup;
