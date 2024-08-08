"use client";
import Breadcrumb from "@/TailAdminComponents/Breadcrumbs/Breadcrumb";
import ProgressOne from "@/TailAdminComponents/Progress/ProgressOne";
import ProgressTwo from "@/TailAdminComponents/Progress/ProgressTwo";
import ProgressThree from "@/TailAdminComponents/Progress/ProgressThree";
import ProgressFour from "@/TailAdminComponents/Progress/ProgressFour";

const Progress: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Progress" />

      <div className="flex flex-col gap-7.5">
        <ProgressOne />
        <ProgressTwo />
        <ProgressThree />
        <ProgressFour />
      </div>
    </>
  );
};

export default Progress;
