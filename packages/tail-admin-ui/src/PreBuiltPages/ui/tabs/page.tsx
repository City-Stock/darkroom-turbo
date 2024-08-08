"use client";
import Breadcrumb from "@/TailAdminComponents/Breadcrumbs/Breadcrumb";
import TabOne from "@/TailAdminComponents/Tabs/TabOne";
import TabTwo from "@/TailAdminComponents/Tabs/TabTwo";
import TabThree from "@/TailAdminComponents/Tabs/TabThree";

const Tabs: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Tabs" />

      <div className="flex flex-col gap-9">
        <TabOne />
        <TabTwo />
        <TabThree />
      </div>
    </>
  );
};

export default Tabs;
